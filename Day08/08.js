console.log('08.12.2023');


//const data = parseFile('Day08/input_sample.txt');
//console.log('Part 1: ' + evalPart1(data));

//const data = parseFile('Day08/input_sample2.txt');
//console.log('Part 2: ' + evalPart2(data));

//const data = parseFile('Day08/input.txt');
//console.log('Part 1: ' + evalPart1(data));
//console.log('Part 2: ' + evalPart2(data));

const data = parseFile('Day08/input_test.txt');
console.log('Part 2: ' + evalPart2(data));
console.log('Part 2 alternative: ' + evalPart2Alt(data));


function parseFile(fileName) {
    const fs = require('node:fs');
    const data = fs.readFileSync(fileName, 'utf-8');
    const lines = data.split('\n').filter(s => s && s.trim().length > 0);

    const instructions = lines[0];

    const nodes = new Map();
    const nodeRegex = /(?<key>[^\s]*)\s*=\s*\((?<left>[^\s]*)\s*\,\s*(?<right>[^\s]*)\)/;
    for (let iLine=1; iLine<lines.length; iLine++) {
        const line = lines[iLine];
        const matches = line.match(nodeRegex);
        const node = {
            key: matches[1],
            leftKey: matches[2],
            rightKey: matches[3],
        };
        nodes.set(node.key, node);
    }

    return {
        instructions: instructions,
        nodes: nodes,
        steps: 0,        
    };
}

function evalPart1(data) {
    data.curNode = data.nodes.get('AAA')
    while (data.curNode.key !== 'ZZZ') {
        followInstructions(data);        
    }
    return data.steps;
}

function followInstructions(data) {
    for (const char of data.instructions) {
        data.curNode = (char === 'L')
            ? data.nodes.get(data.curNode.leftKey)
            : data.nodes.get(data.curNode.rightKey);
        data.steps++;
        if (data.curNode.key === 'ZZZ') return;
    }    
}

// Idea: Follow instructions until every starting node has reached a Z node once.
// Store the steps necessary for each starting node. Then build the least common multiple of them.
// Note: This isn't true for every input data. But luckily for the given input data the node transitions 
// happen in cycles, and the node cycles seem to get in sync with the instruction cycle.
function evalPart2(data) {
    data.startingNodeArray = [...[...data.nodes.values()].filter(n => n.key.endsWith('A'))];
    data.startingNodeArray.map(node => findAndSetStepsToZ(data, node));
    return lcm(data.startingNodeArray.map(node => node.stepsToZ));
}

function findAndSetStepsToZ(data, node) {
    let stepsToZ = 0;    
    let curNode = node;
    while (!curNode.key.endsWith('Z')) {
        curNode = (data.instructions[stepsToZ%data.instructions.length] === 'L')
            ? data.nodes.get(curNode.leftKey)
            : data.nodes.get(curNode.rightKey);
        stepsToZ++;
    }
    node.stepsToZ = stepsToZ;
}

function lcm(numbers) {
    while (numbers.length > 1) {    
        const a = numbers.pop();
        const b = numbers.pop();
        const lcm = lcm2(a, b);
        numbers.push(lcm);
    }
    return numbers[0];
}

function lcm2(number1, number2) {
    return Math.abs(number1*number2)/gcd(number1, number2);
}

function gcd(number1, number2){
    if (number1 === 0 || number2 === 0) return number1 + number2;
    if (number1 < number2) return gcd(number2, number1);

    let result;
    do {
        result = number1 % number2;
        number1 = number2;
        number2 = result;
    } while (result !== 0);

    return Math.abs(number1);
}