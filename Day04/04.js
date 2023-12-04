console.log('04.12.2023');

//let cards = parseFile('Day04/04input_sample.txt');
let cards = parseFile('Day04/04input.txt');
cards = cards.map(curCard => setNumberOfWins(curCard));

console.log('Part 1: ' + evalPart1(cards));
console.log('Part 2: ' + evalPart2(cards));

function parseFile(fileName) {
    const fs = require('node:fs');
    const data = fs.readFileSync(fileName, 'utf-8');
    const lines = data.split('\n');
    const cards = [];
    for (const line of lines) {
        if (!line || line.trim().length<1) continue;
        const parts = line.split(/[:\|]+/);
        const cardNumber = Number(parts[0].match(/Card\s+(\d+)/i)[1]);        
        const winningNumbers = parts[1].split(' ').map(s => s.trim()).filter(s => s.length > 0).map(s => Number(s));
        const ownNumbers = parts[2].split(' ').map(s => s.trim()).filter(s => s.length > 0).map(s => Number(s));
        cards.push({
            cardNumber: cardNumber,
            instances: 1,
            winningNumbers: winningNumbers,
            ownNumbers: ownNumbers,
        });
    }
    return cards;
}

function setNumberOfWins(curCard) {
    curCard.numberOfWins = curCard.ownNumbers
        .filter(ownNr => curCard.winningNumbers.some(nr => nr === ownNr))
        .length;
    return curCard;
}

function evalPart1(cards) {
    return cards.reduce((acc, curCard) => {
        const value = curCard.numberOfWins > 0? Math.pow(2, curCard.numberOfWins-1) : 0; 
        return acc + value;
    }, 0);
}

function evalPart2(cards) {
    let numberOfCards = 0;
    for (let iCard=0; iCard<cards.length; iCard++) {        
        const card = cards[iCard];
        numberOfCards += card.instances;
        for (let iSuccessorCard=iCard+1; iSuccessorCard<iCard+1+card.numberOfWins && iSuccessorCard<cards.length; iSuccessorCard++) {
            cards[iSuccessorCard].instances += card.instances;
        }
    }
    return numberOfCards;
}