const warriorsObj = {
    0: {
        name: 'Eirik',
        type: 'Warrior',
        imgFolder: 'erik',
        description: 'Husband, Father, Bastard',
        hp: 10,
        ap: 6,
        skills: ['hit', 'hitRow', 'shieldSelf'],
        strength: 90,
        defense: 0,
        aim: 70,
        initiative: 1,
    },
    1: {
        name: 'Blodeuwedd',
        type: 'Protector',
        imgFolder: 'mama',
        description: 'Wife, Benevolent, Protective',
        hp: 12,
        ap: 6,
        skills: ['hit', 'shield', 'shieldRow'],
        strength: 30,
        defense: 0,
        aim: 70,
        initiative: 4,
    },
    2: {
        name: 'Kari',
        type: 'Ranged Warrior',
        imgFolder: 'kari',
        description: 'Daughter, Moody, Fierce',
        hp: 8,
        ap: 6,
        skills: ['shoot', 'shootRow', 'shieldSelf'],
        strength: 60,
        defense: 0,
        aim: 90,
        initiative: 2,
    },
    3: {
        name: 'Moira',
        type: 'Mage',
        imgFolder: 'moira',
        description: 'Aunt, Eccentric, Blunt',
        hp: 12,
        ap: 8,
        skills: ['hit', 'buff', 'debuffRow'],
        strength: 30,
        defense: 10,
        aim: 70,
        initiative: 3,
    },
    4: {
        name: 'Angelico',
        type: 'Mage',
        imgFolder: 'varum',
        description: 'Calm, Generous, Frail',
        hp: 4,
        ap: 6,
        skills: ['hit', 'buffRow', 'debuff'],
        strength: 60,
        defense: 0,
        aim: 80,
        initiative: 3,
    },
    5: {
        name: 'Cissé',
        type: 'Mage',
        imgFolder: 'cisse',
        description: 'Oddball, Storyteller, Pacifist',
        hp: 4,
        ap: 6,
        skills: ['hit', 'buffRow', 'debuffRow'],
        strength: 60,
        defense: 0,
        aim: 80,
        initiative: 3,
    },
    6: {
        name: 'Eustache',
        type: 'Protector',
        imgFolder: 'eustache',
        description: 'Seductive, Vengeful, Pirate',
        hp: 4,
        ap: 6,
        skills: ['hit', 'shield', 'shieldRow'],
        strength: 60,
        defense: 0,
        aim: 70,
        initiative: 4,
    },
    7: {
        name: 'Gudrun',
        type: 'Granny',
        imgFolder: 'gudron',
        description: 'Crazy, Grumpy, Granny',
        hp: 4,
        ap: 6,
        skills: ['grannyHit', 'grannyBuff', 'grannyDebuff'],
        strength: 60,
        defense: 0,
        aim: 90,
        initiative: 3,
    },
    8: {
        name: 'Knut',
        type: 'Warrior',
        imgFolder: 'knut',
        description: 'Short Tempered, Bitter, Blacksmith',
        hp: 4,
        ap: 6,
        skills: ['hit', 'hitRow', 'shieldSelf'],
        strength: 100,
        defense: 0,
        aim: 70,
        initiative: 1,
    },
    9: {
        name: 'Lady Tomoe',
        type: 'Warrior',
        imgFolder: 'tomoe',
        description: 'Stern, Noble, Warrior',
        hp: 4,
        ap: 6,
        skills: ['hit', 'hitRow', 'shieldSelf'],
        strength: 90,
        defense: 0,
        aim: 80,
        initiative: 1,
    },
    10: {
        name: 'Parvaneh',
        type: 'Mage',
        imgFolder: 'parvaneh',
        description: 'Elegant, Capricious, Dancer',
        hp: 4,
        ap: 6,
        skills: ['hit', 'buffRow', 'debuff'],
        strength: 60,
        defense: 0,
        aim: 80,
        initiative: 3,
    },
    11: {
        name: 'Shanaw',
        type: 'Ranged Warrior',
        imgFolder: 'shana',
        description: 'Wild Girl, Skraeling, Hates Men',
        hp: 4,
        ap: 6,
        skills: ['shoot', 'shootRow', 'shieldSelf'],
        strength: 60,
        defense: 0,
        aim: 70,
        initiative: 2,
    },
    12: {
        name: 'Solveig',
        type: 'Protector',
        imgFolder: 'solveig',
        description: 'Thoughtful, Kind, Housewife',
        hp: 4,
        ap: 6,
        skills: ['hit', 'shield', 'shieldRow'],
        strength: 60,
        defense: 0,
        aim: 80,
        initiative: 4,
    },
    13: {
        name: 'Yaghoub',
        type: 'Protector',
        imgFolder: 'yagub',
        description: 'Traveler, Charismatic, Storyteller',
        hp: 4,
        ap: 6,
        skills: ['hit', 'shield', 'shieldRow'],
        strength: 60,
        defense: 0,
        aim: 80,
        initiative: 4,
    },
};

const enemiesObj = {
    0: {
        name: 'Archer',
        imgFolder: 'archer',
        description: '',
        hp: 10,
        ap: 11,
        skills: ['shoot', 'shootRow', 'shieldSelf'],
        strength: 70,
        defense: 0,
        aim: 90,
        initiative: 2,
        level: 1,
    },
    1: {
        name: 'Berserker',
        imgFolder: 'berserk',
        description: '',
        hp: 12,
        ap: 8,
        skills: ['hit', 'hitRow', 'shieldSelf'],
        strength: 90,
        defense: 0,
        aim: 65,
        initiative: 1,
        level: 1,
    },
    2: {
        name: 'Shieldmaiden',
        imgFolder: 'maiden',
        description: '',
        hp: 16,
        ap: 8,
        skills: ['hit', 'shield', 'shieldRow'],
        strength: 40,
        defense: 0,
        aim: 70,
        initiative: 4,
        level: 1,
    },
    3: {
        name: 'Plunderer',
        imgFolder: 'axeman',
        description: '',
        hp: 13,
        ap: 8,
        skills: ['hit', 'hitRow', 'shieldSelf'],
        strength: 40,
        defense: 0,
        aim: 70,
        initiative: 1,
        level: 1,
    },
    4: {
        name: 'Knives Guy',
        imgFolder: 'knivesguy',
        description: '',
        hp: 15,
        ap: 8,
        skills: ['hit', 'hitRow', 'shieldSelf'],
        strength: 40,
        defense: 0,
        aim: 75,
        initiative: 1,
        level: 1,
    },
    5: {
        name: 'Drunkard',
        imgFolder: 'drunkard',
        description: '',
        hp: 15,
        ap: 8,
        skills: ['hit', 'buff', 'debuff'],
        strength: 40,
        defense: 0,
        aim: 70,
        initiative: 3,
        level: 1,
    },
    6: {
        name: 'Slaver',
        imgFolder: 'terenty',
        description: '',
        hp: 10,
        ap: 10,
        skills: ['whip', 'whipRow', 'shieldSelf'],
        strength: 70,
        defense: 0,
        aim: 95,
        initiative: 1,
        level: 1,
    },
    7: {
        name: 'Egill',
        imgFolder: 'egill',
        description: '',
        hp: 16,
        ap: 8,
        skills: ['hit', 'hitRow', 'shieldSelf'],
        strength: 110,
        defense: 0,
        aim: 70,
        initiative: 1,
        level: 2,
    },
    8: {
        name: 'Gwendolen',
        imgFolder: 'gwen',
        description: '',
        hp: 16,
        ap: 8,
        skills: ['hit', 'hitRow', 'shieldSelf'],
        strength: 100,
        defense: 20,
        aim: 75,
        initiative: 2,
        level: 2,
    },
    9: {
        name: 'Grim',
        imgFolder: 'grim',
        description: '',
        hp: 13,
        ap: 8,
        skills: ['shoot', 'shootRow', 'shieldSelf'],
        strength: 100,
        defense: 10,
        aim: 95,
        initiative: 1,
        level: 2,
    },
    10: {
        name: 'Njall',
        imgFolder: 'nail',
        description: '',
        hp: 15,
        ap: 10,
        skills: ['hit', 'hitRow', 'shieldSelf'],
        strength: 100,
        defense: 5,
        aim: 75,
        initiative: 1,
        level: 2,
    },
    11: {
        name: 'Bjorn',
        imgFolder: 'bjorn',
        description: '',
        hp: 20,
        ap: 10,
        skills: ['hit', 'hitRow', 'shieldSelf'],
        strength: 130,
        defense: 40,
        aim: 90,
        initiative: 2,
        level: 3,
    },
};
