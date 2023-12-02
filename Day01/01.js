console.log('01.12.2023');

const firstDigitRegexPart1 = /\d/i;
const lastDigitRegexPart1 = /.*(\d)/i;

const digitNamesPart2 = {
    one: '1',
    two: '2', 
    three: '3',
    four: '4',
    five: '5',
    six: '6',
    seven: '7',
    eight: '8',
    nine: '9'
}
const getCharPart2 = (str) => digitNamesPart2[str] ?? str;
const namesPart2 = Object.keys(digitNamesPart2).join('|');
const firstDigitRegexPart2 = new RegExp('\\d|'+namesPart2, 'i');
const lastDigitRegexPart2 = new RegExp('.*(\\d|'+namesPart2+')', 'i');

const fs = require('node:fs');
const data = fs.readFileSync('Day01/01input.txt', 'utf-8');
const lines = data.split('\n');
const numbersPart1 = [], numbersPart2 = [];
let sumPart1 = 0, sumPart2 = 0;
for (const line of lines) {
    if (line && line.trim()) {
        const firstCharPart1 = line.match(firstDigitRegexPart1)[0];
        const lastCharPart1 = line.match(lastDigitRegexPart1)[1];
        const numberPart1 = Number(firstCharPart1 + lastCharPart1);  
        if (numberPart1 != undefined) {
            numbersPart1.push(numberPart1);
            sumPart1 += numberPart1;
        } else {
            console.log('error');
        }

        const firstCharPart2 = getCharPart2(line.match(firstDigitRegexPart2)[0]) ;
        const lastCharPart2 = getCharPart2(line.match(lastDigitRegexPart2)[1]);
        const numberPart2 = Number(firstCharPart2 + lastCharPart2);  
        if (numberPart2 != undefined) {
            numbersPart2.push(numberPart2);
            sumPart2 += numberPart2;
        } else {
            console.log('error');
        }
    } 
}

console.log('Part 1: Sum', sumPart1);
console.log('Part 2: Sum', sumPart2);