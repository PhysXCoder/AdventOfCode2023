console.log('07.12.2023');

//const data = parseFile('Day07/input_sample.txt');
const data = parseFile('Day07/input.txt');

console.log('Part 1: ' + evalPart1(data));
console.log('Part 2: ' + evalPart2(data));

function parseFile(fileName) {
    const fs = require('node:fs');
    const data = fs.readFileSync(fileName, 'utf-8');
    const lines = data.split('\n').filter(s => s && s.trim().length > 0);

    const hands = [];
    for (const line of lines) {
        const parts = line.split(' ');
        const hand = {
            cards: parts[0],
            bid: Number(parts[1]),
        };
        hands.push(hand);
    }

    return hands;
}

function evalPart1(hands) {
    hands.sort(compareHands1);    
    const totalWinnings = hands.reduce((acc, curHand, i) => acc + (hands.length-i)*curHand.bid, 0);
    return totalWinnings;
}

// Returns negative number if handA has a lesser rank than handB
function compareHands1(handA, handB) { 
    return compareHands(handA, handB, getHandType1, getCardValue1);
}

// Returns negative number if handA has a lesser rank than handB
function compareHands(handA, handB, getHandTypeFunc, getCardValueFunc) {
    if (handA.cards === handB.cards) return 0;

    const typeA = getHandTypeFunc(handA);
    const typeB = getHandTypeFunc(handB);
    if (typeA !== typeB) return typeB-typeA;

    for (let i=0; i<5; i++) {        
        const valA = getCardValueFunc(handA.cards[i]);
        const valB = getCardValueFunc(handB.cards[i]);
        if (valA !== valB) return valB-valA;
    }

    return 0;
}

function getHandType1(hand) {
    if (hand.type !== undefined) return hand.type;
    
    const cardCounts = getHandCardCounts(hand);
    hand.type = getHandTypeFromCardCounts1(cardCounts);
    return hand.type;
}

// Types:
// 0 = high card
// 1 = one pair
// 2 = two pairs
// 3 = three of a kind
// 4 = full house
// 5 = four of a kind
// 6 = five of a kind
function getHandTypeFromCardCounts1(cardCounts) {
    if (cardCounts.some(kvp => kvp[1] === 5)) return 6;
    if (cardCounts.some(kvp => kvp[1] === 4)) return 5;
    if (cardCounts.some(kvp => kvp[1] === 3) && cardCounts.some(kvp => kvp[1] === 2)) return 4;
    if (cardCounts.some(kvp => kvp[1] === 3)) return 3;
    if (cardCounts.filter(kvp => kvp[1] === 2).length == 2) return 2;
    if (cardCounts.some(kvp => kvp[1] === 2)) return 1;
    return 0;
}

function getHandCardCounts(hand) {
    if (hand.cardCounts !== undefined) return hand.cardCounts;

    hand.cardCounts = new Map([
        ['2', 0],
        ['3', 0],
        ['4', 0],
        ['5', 0],
        ['6', 0],
        ['7', 0],
        ['8', 0],
        ['9', 0],
        ['T', 0],
        ['J', 0],
        ['Q', 0],
        ['K', 0],
        ['A', 0],
    ]);
    for (const char of hand.cards) {
        hand.cardCounts.set(char, hand.cardCounts.get(char) + 1);
    }
    hand.cardCounts = [...hand.cardCounts.entries()];
    return hand.cardCounts;
}

function getCardValue1(card) {
    switch (card) {
        case '2': return 2;
        case '3': return 3;
        case '4': return 4;
        case '5': return 5;
        case '6': return 6;
        case '7': return 7;
        case '8': return 8;
        case '9': return 9;
        case 'T': return 10;
        case 'J': return 11;
        case 'Q': return 12;
        case 'K': return 13;
        case 'A': return 14;
        default: 
            console.log('Error: Unknown card ' + card);
            return -1;
    }
}



function evalPart2(hands) {
    for (const hand of hands) {
        hand.type = undefined;
    }
    hands.sort(compareHands2);
    const totalWinnings = hands.reduce((acc, curHand, i) => acc + (hands.length-i)*curHand.bid, 0);
    return totalWinnings;
}

// Returns negative number if handA has a lesser rank than handB
function compareHands2(handA, handB) {
    return compareHands(handA, handB, getHandType2, getCardValue2);
}

function getHandType2(hand) {
    if (hand.type !== undefined) return hand.type;
    
    const cardCounts = getHandCardCounts(hand);
    hand.type = getHandTypeFromCardCounts2(cardCounts);
    return hand.type;
}

function getHandTypeFromCardCounts2(cardCounts) {
    const jokers = cardCounts[9][1];
    const withoutJ = cardCounts.filter(kvp => kvp[0] != 'J');
    
    // Five of a kind?
    if (jokers === 5) return 6;    
    if (withoutJ.some(kvp => kvp[1]+jokers === 5)) return 6;
    
    // Four of a kind?
    if (jokers === 4) return 5;
    if (withoutJ.some(kvp => kvp[1]+jokers === 4)) return 5;
    
    // Full house?
    switch (jokers) {
        case 0: 
            if (withoutJ.some(kvp => kvp[1] === 3) && withoutJ.some(kvp => kvp[1] === 2)) return 4;
            break;        
        case 1: 
            if (withoutJ.filter(kvp => kvp[1] === 2).length === 2) return 4;    // Full house because 11J22 counts as 11122
            break;        
        case 2:             
            if (withoutJ.some(kvp => kvp[1] === 2)) return 4; // Full house with two jokers and a pair: 11J2J counting as 11122
            break;
        case 3: 
            return 4;   // Always full house with three jokers: 1JJ2J counting as 11122
    }    

    // Three of a kind?    
    if (withoutJ.some(kvp => kvp[1]+jokers === 3)) return 3;
    
    // Two pairs?
    switch (jokers) {
        case 0:
            if (withoutJ.filter(kvp => kvp[1] === 2).length == 2) return 2;
            break;
        case 1:
            if (withoutJ.some(kvp => kvp[1] === 2)) return 2; // 11J2 counts as 1122
            break;
        case 2:
            return 2;   // Always 2 pairs with two jokers: 1J2J counts as 1122            
    }

    // One pair?
    switch (jokers) {
        case 0:
            if (withoutJ.some(kvp => kvp[1] === 2)) return 1;
            break;
        case 1:
            return 1;   // Always 1 pair with one joker: 1J counts as 11
    }

    // Only high card
    return 0;
}

function getCardValue2(card) {
    switch (card) {
        case 'J': return 1;
        case '2': return 2;
        case '3': return 3;
        case '4': return 4;
        case '5': return 5;
        case '6': return 6;
        case '7': return 7;
        case '8': return 8;
        case '9': return 9;
        case 'T': return 10;        
        case 'Q': return 11;
        case 'K': return 12;
        case 'A': return 13;
        default: 
            console.log('Error: Unknown card ' + card);
            return -1;
    }
}


