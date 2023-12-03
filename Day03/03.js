console.log('03.12.2023');

const data = parseFile('Day03/03input.txt');
//const data = parseFile('Day03/03input_test.txt');
//const data = parseFile('Day03/03input_sample.txt');
console.log('Part 1: ' + evalPart1(data.numberDataByLines, data.symbolIndexesByLine));
console.log('Part 2: ' + evalPart2(data.numberDataByLines, data.symbolIndexesByLine));


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
                    endIndex: match.index + match.length
                };
                return numberData;
            })
        );

    return {
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
    const symbolCharIdxEnd = numberData.endIndex+1;
    const symbolLineIdxStart = Math.max(numberData.lineIndex-1, 0);
    const symbolLineIdxEnd = Math.min(numberData.lineIndex+1, symbolIndexesByLine.length-1);

    const lineIndexes = [...Array(symbolLineIdxEnd-symbolLineIdxStart+1).keys()].map(i => i + symbolLineIdxStart);
    return lineIndexes.some(lineIndex => 
        symbolIndexesByLine[lineIndex].some(symbolIndex => 
            symbolCharIdxStart <= symbolIndex && symbolIndex <= symbolCharIdxEnd));
}


function evalPart2(data) {
    return -1;
}


