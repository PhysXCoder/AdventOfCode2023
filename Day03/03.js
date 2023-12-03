console.log('03.12.2023');

const data = parseFile('Day03/03input.txt');
//const data = parseFile('Day03/03input_sample.txt');
console.log('Part 1: ' + evalPart1(data.numberDataByLines, data.symbolIndexesByLine));
console.log('Part 2: ' + evalPart2(data.lines, data.numberDataByLines, data.symbolIndexesByLine));


function parseFile(fileName) {    
    const fs = require('node:fs');
    const data = fs.readFileSync(fileName, 'utf-8');    
    const lines = data.split('\n');

    const symbolsRegex = /[^\d\.]/gi;
    const symbolIndexesByLine = lines
        .map((line) => [...line.matchAll(symbolsRegex)]
            .map(match => match.index));
    
    const numbersRegex = /(\d+)/gi;
    const numberDataByLines = lines
        .map((line, lineIndex) => [...line.matchAll(numbersRegex)]
            .map(match => {
                const numberData = {
                    lineIndex: lineIndex,
                    number: Number(match[0]),
                    startIndex: match.index,
                    length: match[0].length
                };
                return numberData;
            })
        );

    return {
        lines: lines,
        numberDataByLines: numberDataByLines,
        symbolIndexesByLine: symbolIndexesByLine
    };
}

function evalPart1(numberDataByLines, symbolIndexesByLine) {
    return numberDataByLines
        .map((numberDataOfOneLine) => numberDataOfOneLine
            .filter(numberData => hasAdjacentSymbol(numberData, symbolIndexesByLine))
            .map(numberData => numberData.number)
            .reduce((acc, cur) => acc + cur, 0))
        .reduce((acc, cur) => acc + cur, 0); 
}

function hasAdjacentSymbol(numberData, symbolIndexesByLine)
{    
    const symbolCharIdxStart = numberData.startIndex-1;
    const symbolCharIdxEnd = numberData.startIndex+numberData.length;
    const symbolLineIdxStart = Math.max(numberData.lineIndex-1, 0);
    const symbolLineIdxEnd = Math.min(numberData.lineIndex+1, symbolIndexesByLine.length-1);

    const lineIndexes = [...Array(symbolLineIdxEnd-symbolLineIdxStart+1).keys()].map(i => i + symbolLineIdxStart);
    return lineIndexes.some(lineIndex => 
        symbolIndexesByLine[lineIndex].some(symbolIndex => 
            symbolCharIdxStart <= symbolIndex && symbolIndex <= symbolCharIdxEnd));
}

function evalPart2(lines, numberDataByLines, symbolIndexesByLine) {
    const stars = symbolIndexesByLine
        .map((symbolIndexesOfOneLine, lineIndex) => 
            symbolIndexesOfOneLine
                .filter(symbolIndex => lines[lineIndex][symbolIndex] === '*')
                .map(symbolIndex => { return {
                    lineIndex: lineIndex,
                    charIndex: symbolIndex
                };}));
    const sumOfGearValues = stars
        .filter(star => star && star.length > 0)
        .flatMap(star => star)
        .map((star) => getAdjacentNumbers(star.lineIndex, star.charIndex, numberDataByLines))
        .filter(gear => gear != undefined && gear.number1 != undefined && gear.number2 != undefined)
        .map(gear => gear.number1 * gear.number2)
        .reduce((acc, cur) => acc + cur, 0);    
    return sumOfGearValues;
}

function getAdjacentNumbers(lineIndex, starCharIndex, numberDataByLines) {    
    const lineIdxStart = Math.max(lineIndex-1, 0);
    const lineIdxEnd = Math.min(lineIndex+1, numberDataByLines.length-1);
    const lineIndexes = [...Array(lineIdxEnd-lineIdxStart+1).keys()].map(i => i + lineIdxStart);

    const numbers = lineIndexes
        .flatMap(lineIndex => numberDataByLines[lineIndex]
            .flatMap(numberDataOfSingleLine => numberDataOfSingleLine))
        .filter(numberData => starCharIndex >= numberData.startIndex-1 
            && starCharIndex <= numberData.startIndex+numberData.length);
    if (numbers.length === 2) {
        return {
            number1: numbers[0].number,
            number2: numbers[1].number
        };
    } else {
        return undefined;
    }
}