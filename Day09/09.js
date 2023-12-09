console.log('09.12.2023');

//const data = parseFile('Day09/input_sample.txt');
const data = parseFile('Day09/input.txt');

console.log('Part 1: ' + evalPart1(data));
console.log('Part 2: ' + evalPart2(data));

function parseFile(fileName) {
    const fs = require('node:fs');
    const data = fs.readFileSync(fileName, 'utf-8');
    const lines = data.split('\n').map(s => s.trim()).filter(s => s && s.length > 0);
    return [...lines.map(line => line.split(' ').filter(s => s && s.length > 0).map(s => Number(s)))];
}

function evalPart1(data) {
    let sumOfAllPredictions = 0;
    for (const history of data) {
        let curSequence = history;
        const allSequences = [];
        do {
            allSequences.push(structuredClone(curSequence));
            let newSequence = [];
            for (let i=1; i<curSequence.length; i++) {
                newSequence.push(curSequence[i] - curSequence[i-1]);
            }
            curSequence = newSequence;            
        } while (!curSequence.every(n => n === 0) && curSequence.length > 0)
        let prediction = 0;
        for (let i=allSequences.length-1; i>=0; i--) {
            prediction += allSequences[i][allSequences[i].length-1];
        }
        sumOfAllPredictions += prediction;
    }
    return sumOfAllPredictions;
}

function evalPart2(data) {
    let sumOfAllPredictions = 0;
    for (const history of data) {
        let curSequence = history;
        const allSequences = [];
        do {
            allSequences.push(structuredClone(curSequence));
            let newSequence = [];
            for (let i=1; i<curSequence.length; i++) {
                newSequence.push(curSequence[i] - curSequence[i-1]);
            }
            curSequence = newSequence;            
        } while (!curSequence.every(n => n === 0) && curSequence.length > 0)
        let backwardPrediction = 0;
        for (let i=allSequences.length-1; i>=0; i--) {
            backwardPrediction = allSequences[i][0] - backwardPrediction;
        }
        sumOfAllPredictions += backwardPrediction;
    }
    return sumOfAllPredictions;
}


// Skipped Idea: The prediction value can be calculated by just the history sequence.
// Lets say the history sequence is a b c d e f g.
// If zeroes appear in the first calculated line (sort of a numeric derivative) then it's just the last number of the history squence: g.
// If zeroes appear in the second calculated line, the it's the difference g -f.
// If zeroes appear in the third calculated line, it's g -2f +e
// If ...                  4th                         1g -3f +3e -1d
// If                      5th                         1g -4f +6e -4d +1c
// If                      6th                         1g -5f +10e -10d +5c -b
// If                      7th                         1g -6f +15e -20d +15c -6b +a
// The coefficients can be derived from Pascal's triangle, with the polarity alternating from + to -
// Because of the text, we know one of the derivates of each history will be all zeroes. 
// This leads to the upper derivate having all the same (nonzero) number. 
// Sadly, this DOESN'T lead to g-f, g-2f+e etc beeing nonzero. 
// And to check if all numbers in a derivative are zero, all numbers need to be calculated...
// So no computation time can be saved by using Pascal's triangle.

