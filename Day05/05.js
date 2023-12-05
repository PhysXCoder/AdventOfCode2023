console.log('05.12.2023');

//const [seeds, maps] = parseFile('Day05/input_sample.txt');
const [seeds, maps] = parseFile('Day05/input.txt');

console.log('Part 1: ' + evalPart1(seeds, maps));
console.log('Part 2: ' + evalPart2(seeds, maps));


function parseFile(fileName) {    
    const fs = require('node:fs');
    const data = fs.readFileSync(fileName, 'utf-8');
    const lines = data.split('\n');

    const seeds = parseSeeds(lines[0]);
    let curMap = undefined;
    let maps = [];
    for (let iLine=1; iLine<lines.length; iLine++) {
        const line = lines[iLine];        
        if (!line || line.trim().length < 0) continue;                
        let iSep = line.indexOf(':');
        if (iSep >= 0) {
            if (curMap != undefined) maps.push(curMap);            
            curMap = {
                name: line.slice(0, iSep),
                ranges: []
            };
        } else {
            const parts = stringToNumberArray(line);
            const curRange = {
                len: parts[2],
                dstStart: parts[0],
                dstEnd: parts[0]+parts[2]-1,
                srcStart: parts[1],
                srcEnd: parts[1]+parts[2]-1,                
            };
            curMap.ranges.push(curRange);
        }
    }

    if (curMap && curMap.ranges.length > 0) maps.push(curMap);

    return [seeds, maps];
}

function stringToNumberArray(str) {
    return str.split(' ')
        .map(str => str.trim())
        .filter(str => str && str.length > 0)
        .map(str => Number(str))
        .filter(n => n !== undefined);
}

function parseSeeds(seedLine) {
    const seedNumbers = stringToNumberArray(seedLine.split(':')[1]);
    return new Set(seedNumbers);
}

function evalPart1(seeds, maps) {
    for (const map of maps) {
        seeds = applyMapToSeeds(seeds, map);
    }
    return Math.min(...seeds.values());
}

function applyMapToSeeds(seeds, map) {
    const newSeeds = new Set();
    for (let nr of seeds.values()) {
        for (const range of map.ranges) {            
            if (range.srcStart<=nr && nr<=range.srcEnd) {
                nr = nr-range.srcStart+range.dstStart;
                break;
            }
        }
        newSeeds.add(nr);
    }
    
    return newSeeds;
}

function evalPart2(seeds, maps) {
    const seedsAsArray = [...seeds.values()];
    let seedRanges = [];
    for (let iSeed=0; iSeed<seedsAsArray.length; iSeed+=2) {
        const seedRange = {
            start: seedsAsArray[iSeed],
            len: seedsAsArray[iSeed+1],
            end: seedsAsArray[iSeed]+seedsAsArray[iSeed+1]-1,
        };
        seedRanges.push(seedRange);
    }

    for (const map of maps) {
        seedRanges = applyMapToSeedRanges(seedRanges, map);
    }

    const startNumbers = seedRanges
        .filter(seedRange => seedRange.len > 0)
        .map(seedRange => seedRange.start);
    const lowestNumber = Math.min(...startNumbers);
    return lowestNumber;
}

function applyMapToSeedRanges(seedRanges, map) {
    const unmappedSeedRanges = seedRanges;
    const mappedSeedRanges = [];
    
    while (unmappedSeedRanges.length > 0) {
        let seedRange = unmappedSeedRanges.pop();
        for (const range of map.ranges) {
            if (seedRange.start > range.srcEnd || seedRange.end < range.srcStart) {
                // No overlap. Check if another map range is possible.
                continue;
            } else if (range.srcStart<=seedRange.start && seedRange.end<=range.srcEnd) {
                // 100 % overlap (seed range might be equal or smaller than map range)
                // Map complete seed range. Don't inspect other map ranges.
                seedRange = mapSeedRange(seedRange, range);                
                break;
            } else {
                // Partial overlap. 3 cases: 
                // A) lower part of seed range overlaps with (upper part of?) map range
                // B) upper part of seed range overlaps with (lower part of?) map range                
                // C) seed range exceeds map range                
                const isC = seedRange.start<range.srcStart && range.srcEnd<seedRange.end;                
                const isB = !isC && seedRange.start<range.srcStart && range.srcStart<=seedRange.end;
                const isA = !isC && range.srcStart<=seedRange.start && seedRange.start<range.srcEnd;                
                // In all cases the seed range is split and the overlapping part is mapped (and finished), 
                // and the non-overlapping part is checked if other map ranges might apply.
                if (isA) {
                    // Lower part of seed range overlaps. Map lower part (it's finished), and continue with upper part (if len > 0)
                    const lastSeedOverlapping = range.srcEnd;
                    let lowerSeedRange = undefined, upperSeedRange = undefined;
                    [lowerSeedRange, upperSeedRange] = splitSeedRange(seedRange, lastSeedOverlapping);
                    lowerSeedRange = mapSeedRange(lowerSeedRange, range);
                    if (lowerSeedRange.len > 0) mappedSeedRanges.push(lowerSeedRange);
                    seedRange = upperSeedRange;
                    if (seedRange.len < 1) {
                        seedRange = undefined;
                        break;
                    }
                } else if (isB) {
                    // Upper part of seed range overlaps. Map upper part (it's finished), and continue wirh lower part (if len > 0)
                    const firstSeedOverlapping = range.srcStart;
                    let lowerSeedRange = undefined, upperSeedRange = undefined;
                    [lowerSeedRange, upperSeedRange] = splitSeedRange(seedRange, firstSeedOverlapping-1);
                    upperSeedRange = mapSeedRange(upperSeedRange, range);
                    if (upperSeedRange.len > 0) mappedSeedRanges.push(upperSeedRange);
                    seedRange = lowerSeedRange;
                    if (seedRange.len < 1) {
                        seedRange = undefined;
                        break;                        
                    }
                } else /*isC*/ {                    
                    // Middle part of seed range overlaps. Map it, continue with lower part, and push upper part to continue it later. 
                    const firstSeedOverlapping = range.srcStart;
                    const lastSeedOverlapping = range.srcEnd;
                    let lowerSeedRange = undefined, middleSeedRange = undefined, upperSeedRange = undefined, middleAndupperSeedRange = undefined;
                    [lowerSeedRange, middleAndupperSeedRange] = splitSeedRange(seedRange, firstSeedOverlapping-1);
                    [middleSeedRange, upperSeedRange] = splitSeedRange(middleAndupperSeedRange, lastSeedOverlapping);
                    middleSeedRange = mapSeedRange(middleSeedRange, range);
                    if (middleSeedRange.len > 0) mappedSeedRanges.push(middleSeedRange);                    
                    if (upperSeedRange.len > 0) unmappedSeedRanges.push(upperSeedRange);
                    seedRange = lowerSeedRange;
                    if (seedRange.len < 1) {
                        seedRange = undefined;
                        break;
                    }
                }
            }
        }
        if (seedRange != undefined) mappedSeedRanges.push(seedRange);
    }
    
    return mappedSeedRanges;
}

function mapSeedRange(seedRange, range) {
    const delta = range.dstStart-range.srcStart;
    seedRange.start += delta;
    seedRange.end += delta;
    return seedRange;
}

function splitSeedRange(seedRange, lastLower) {
    const lowerSeedRange = {
        start: seedRange.start,
        end: lastLower,
        len: lastLower-seedRange.start+1,
    }
    const upperSeedRange = {
        start: lastLower+1,
        end: seedRange.end,
        len: seedRange.end-lastLower,
    }
    return [lowerSeedRange, upperSeedRange];
}