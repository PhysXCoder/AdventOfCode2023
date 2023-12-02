console.log('02.12.2023');


const red = 'red';
const green = 'green';
const blue = 'blue';

//const games = parseFile('Day02/02input_sample.txt');
const games = parseFile('Day02/02input.txt');
const maxColors = {
    red: 12,
    green: 13,
    blue: 14
};
evalGamesPart1(games, maxColors);
evalGamesPart2(games);

function parseFile(filename) {
    const games = [];

    const fs = require('node:fs');
    const data = fs.readFileSync(filename, 'utf-8');
    const lines = data.split('\n');
    const regexGameId = /Game\s*(\d+)/i;
    for (const line of lines) {

        if (!line || line.trim() == '') continue;
        const gameStrAndRest = line.split(':');
        if (gameStrAndRest.length != 2) {
            console.log('Error in line: ' + line);
            continue;
        }

        const gameStr = gameStrAndRest[0].trim();
        const gameMatch = gameStr.match(regexGameId);
        if (!gameMatch) continue;
        const gameId = Number(gameMatch[1].trim());

        const setsStrs = gameStrAndRest[1].split(';');
        const sets = [];
        for (const setStr of setsStrs) {
            const colors = {
                red: 0,
                green: 0,
                blue: 0
            };
            const colorsStrs = setStr.split(',');
            for (const colorStr of colorsStrs) {
                const strs = colorStr.trim().split(' ');
                if (strs.length != 2) {
                    console.log('Error in line: ' + line);
                    continue;
                }
                const number = Number(strs[0].trim());
                const color = strs[1].trim();
                if (color == red) {
                    colors.red += number;
                } else if (color == green) {
                    colors.green += number;
                } else if (color == blue) {
                    colors.blue += number;
                } else {
                    console.log('Error in line: ' + line);
                    continue;
                }
            }
            sets.push(colors);
        }

        const game = {
            id: gameId,
            sets: sets
        };
        games.push(game);
        if (game.id < 0) {
            console.log('Warning: Invalid id ' + game.id);
        }
        if (game.sets.length < 1) {
            console.log('Warning: Empty set for id ' + game.id);
        }        
    }

    return games;
}

function evalGamesPart1(games, maxColors) {
    let sumOfIds = 0;
    for (const game of games) {        
        let possible = true;
        for (const set of game.sets) {
            if (set.red > maxColors.red || set.green > maxColors.green || set.blue > maxColors.blue) {
                possible = false; 
                break;
            }                        
        }
        if (possible) {
            sumOfIds += game.id;
        }
    }
    console.log('Part 1: Sum of possible Ids: ' + sumOfIds);
}

function evalGamesPart2(games) {
    let sumOfPowers = 0;
    for (const game of games) {
        sumOfPowers += getPowerOfCubes(game);
    }
    console.log('Part 2: Sum of powers: ' + sumOfPowers);
}

function getPowerOfCubes(game) {
    let requiredCubes = {
        red: 0,
        green: 0,
        blue: 0
    };
    for (const set of game.sets) {
        requiredCubes.red = Math.max(requiredCubes.red, set.red);
        requiredCubes.green = Math.max(requiredCubes.green, set.green);
        requiredCubes.blue = Math.max(requiredCubes.blue, set.blue);
    }
    const powerOfCubes = requiredCubes.red * requiredCubes.green * requiredCubes.blue;
    return powerOfCubes;
}