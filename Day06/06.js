console.log('06.12.2023');

//const [duration, records] = parseFile('Day06/input_sample.txt');
const [duration, records] = parseFile('Day06/input.txt');

console.log('Part 1: ' + evalPart1(duration, records));
console.log('Part 2: ' + evalPart2(duration, records));

function parseFile(fileName) {
    const fs = require('node:fs');
    const data = fs.readFileSync(fileName, 'utf-8');
    const lines = data.split('\n');

    const durations = lines[0].split(':')[1].split(' ').filter(s => s.length > 0).map(s => Number(s));
    const records = lines[1].split(':')[1].split(' ').filter(s => s.length > 0).map(s => Number(s));

    return [durations, records];
}

function evalPart1(durations, records) {
    const winningCounts = [];    
    for (let iRace=0; iRace<durations.length; iRace++) {
        const duration = durations[iRace];
        const record = records[iRace];        
        winningCounts.push(getNumberOfWinningDurations(duration, record));
    }
    return winningCounts.reduce((acc, cur) => acc*cur, 1);
}

function getNumberOfWinningDurations(totalDuration, record)
{
    // Looking for durations that satisfy: dur*(totalDur-dur) > record
    // Or: dur^2 - dur*totalDur + record < 0
    // 
    // Use pq formula for normalized quadratic equations:
    // x^2 + p*x + q = 0 is solved by: x_1/2 = p/2 +- sqrt((p/2)^2 - q)
    // So dur_1/2 = totalDur/2 +- sqrt((totalDur/2) - record) 

    const halfTotalDuration = totalDuration/2.0;
    const lowerWinningDuration = halfTotalDuration - Math.sqrt(halfTotalDuration*halfTotalDuration-record);
    const upperWinningDuration = halfTotalDuration + Math.sqrt(halfTotalDuration*halfTotalDuration-record);

    const epsilon = 1e-6;   // If there is quality, DON'T count it as a winning duration. Therfore adapt the lower and upper durations just a little bit.
    const numberOfWinningDurations = Math.floor(upperWinningDuration-epsilon) - Math.ceil(lowerWinningDuration+epsilon) + 1;

    return numberOfWinningDurations;
}

function evalPart2(durations, records) {
    const duration = Number(durations.map(n => String(n)).join(''));
    const record = Number(records.map(n => String(n)).join(''));
    return getNumberOfWinningDurations(duration, record);
}


