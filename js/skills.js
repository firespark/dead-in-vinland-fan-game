const skillsObj = {
    hit: {
        type: 0,
        name: 'Hit',
        img: '',
        description: 'Bonk',
        attack: 3,
        defenseBuff: 0,
        apCost: 3,
        chance: 100,
        onEnemy: true,
        self: false,
        rowType: 'melee',
        use: function (target, origin = activeUnit) {
            resetHighlight();
            if (allUnits[target].alive && allUnits[origin].ap >= this.apCost) {
                if (isHit(allUnits[origin])) {
                    const damageAmount = calculateDamage(allUnits[origin], allUnits[target], this.attack, this.rowType);
                    logString(`${allUnits[origin].name} hits ${allUnits[target].name} for ${damageAmount} damage`);
                    hitCam(allUnits[origin], [allUnits[target]], [damageAmount], 'attack');
                    allUnits[target].damageUnit(damageAmount);
                    allUnits[target].resetBuffs();
                }
                else {
                    logString(`${allUnits[origin].name} misses their attack on ${allUnits[target].name}`);
                    hitCam(allUnits[origin], [allUnits[target]], ['Miss'], 'attack');
                }
                allUnits[origin].changeAP(this.apCost);
            }
        },
    },

    hitRow: {
        type: 1,
        name: 'Hit Row',
        img: '',
        description: 'Many Bonk',
        attack: 2,
        defenseBuff: 0,
        apCost: 4,
        chance: 60,
        onEnemy: true,
        self: false,
        affectsRow: true,
        rowType: 'melee',
        use: function (target, origin = activeUnit) {
            resetHighlight();
            if (allUnits[origin].ap >= this.apCost) {
                logString(`${allUnits[origin].name} hits the row of their enemies`);
                const targetArray = [];
                const damageArray = [];
                const currentRowUnits = document.getElementById(`section${allUnits[target].pos}`).parentNode.querySelectorAll('.unit');
                currentRowUnits.forEach((unit) => {
                    const unitID = unit.dataset.id;
                    if (allUnits[unitID].alive) {
                        if (isHit(allUnits[origin])) {
                            const damageAmount = calculateDamage(allUnits[origin], allUnits[unitID], this.attack, this.rowType);
                            allUnits[unitID].damageUnit(damageAmount);
                            allUnits[unitID].resetBuffs();
                            damageArray.push(damageAmount)
                        }
                        else {

                            damageArray.push('Miss')
                        }
                        targetArray.push(allUnits[unitID]);
                    }
                });

                hitCam(allUnits[origin], targetArray, damageArray, 'attack');
                allUnits[origin].changeAP(this.apCost);
            }
        },
    },

    shieldSelf: {
        type: 2,
        name: 'Shield Self',
        img: '',
        description: 'Protecc self',
        attack: 0,
        defenseBuff: 20,
        apCost: 2,
        chance: 100,
        onEnemy: false,
        self: true,
        rowType: 'any',
        use: function (target, origin = activeUnit) {
            resetHighlight();
            if (allUnits[target].alive && allUnits[origin].ap >= this.apCost) {
                logString(`${allUnits[origin].name} protects themselves against ${this.defenseBuff}% of damage`)
                hitCam(allUnits[origin], [], [], 'shield');
                allUnits[target].buffArray.push('shield');
                allUnits[target].defense += this.defenseBuff;
                drawStatusEffects(target);
                allUnits[origin].changeAP(this.apCost);
            }
        },
    },

    shield: {
        type: 3,
        name: 'Shield',
        img: '',
        description: 'Protecc one',
        attack: 0,
        defenseBuff: 50,
        apCost: 4,
        chance: 100,
        onEnemy: false,
        self: false,
        rowType: 'melee',
        use: function (target, origin = activeUnit) {
            resetHighlight();
            if (allUnits[target].alive && allUnits[origin].ap >= this.apCost) {
                logString(`${allUnits[origin].name} protects ${allUnits[target].name} against ${this.defenseBuff}% of damage`)
                hitCam(allUnits[origin], [allUnits[target]], [], 'shield');

                let defenseBuffAmount = this.defenseBuff;
                if (getRowType(allUnits[origin]) != this.rowType) {
                    defenseBuffAmount = Math.round(percentageSubstract(defenseBuffAmount, wrongLaneShieldPenalty));
                }

                allUnits[target].buffArray.push('shield');
                allUnits[target].defense += defenseBuffAmount;
                drawStatusEffects(target);
                allUnits[origin].changeAP(this.apCost);
            }
        },
    },

    shieldRow: {
        type: 4,
        name: 'Shield Row',
        img: '',
        description: 'Protecc row',
        attack: 0,
        defenseBuff: 20,
        apCost: 4,
        chance: 100,
        onEnemy: false,
        self: false,
        affectsRow: true,
        rowType: 'melee',
        use: function (target, origin = activeUnit) {
            resetHighlight();
            if (allUnits[origin].ap >= this.apCost) {
                const targetArray = [];

                const currentRowUnits = document.getElementById(`section${allUnits[target].pos}`).parentNode.querySelectorAll('.unit');
                let defenseBuffAmount = this.defenseBuff;
                if (getRowType(allUnits[origin]) != this.rowType) {
                    defenseBuffAmount = Math.round(percentageSubstract(defenseBuffAmount, wrongLaneShieldPenalty));
                }
                logString(`${allUnits[origin].name} protects their allies against ${defenseBuffAmount}% of damage`)

                currentRowUnits.forEach((unit) => {
                    const unitID = unit.dataset.id;
                    if (allUnits[unitID].alive) {
                        allUnits[unitID].buffArray.push('shield');
                        allUnits[unitID].defense += defenseBuffAmount;
                        drawStatusEffects(unitID);
                        targetArray.push(allUnits[unitID]);
                    }

                });
                hitCam(allUnits[origin], targetArray, [], 'shield');
                allUnits[origin].changeAP(this.apCost);
            }
        },
    },

    buff: {
        type: 5,
        name: 'Buff',
        img: '',
        description: 'Protecc n Stronk',
        attack: 0,
        defenseBuff: 20,
        strengthBuff: 30,
        aimBuff: 30,
        apCost: 2,
        chance: 100,
        onEnemy: false,
        self: false,
        rowType: 'any',
        use: function (target, origin = activeUnit) {
            resetHighlight();
            if (allUnits[target].alive && allUnits[origin].ap >= this.apCost) {
                logString(`${allUnits[origin].name} buffs ${allUnits[target].name}'s strength, aim and defense`)

                hitCam(allUnits[origin], [allUnits[target]], [], 'buff');
                allUnits[target].buffArray.push('buff');

                allUnits[target].strength += this.strengthBuff;
                allUnits[target].defense += this.defenseBuff;
                allUnits[target].aim += this.aimBuff;

                drawStatusEffects(target);
                allUnits[origin].changeAP(this.apCost);
            }
        },
    },
    debuff: {
        type: 6,
        name: 'Debuff',
        img: '',
        description: 'Weak and stupid',
        attack: 0,
        defenseBuff: 20,
        strengthBuff: 30,
        aimBuff: 30,
        apCost: 2,
        chance: 100,
        onEnemy: true,
        self: false,
        rowType: 'any',
        use: function (target, origin = activeUnit) {
            resetHighlight();
            if (allUnits[target].alive && allUnits[origin].ap >= this.apCost) {
                logString(`${allUnits[origin].name} weakens ${allUnits[target].name}'s strength, aim and defense`)

                hitCam(allUnits[origin], [allUnits[target]], [], 'debuff');
                allUnits[target].buffArray.push('debuff');

                allUnits[target].strength -= this.strengthBuff;
                allUnits[target].defense -= this.defenseBuff;
                allUnits[target].aim -= this.aimBuff;

                drawStatusEffects(target);
                allUnits[origin].changeAP(this.apCost);
            }
        },
    },

    buffRow: {
        type: 7,
        name: 'Buff Row',
        img: '',
        description: 'Buff row',
        attack: 0,
        defenseBuff: 10,
        strengthBuff: 15,
        aimBuff: 15,
        apCost: 4,
        chance: 100,
        onEnemy: false,
        self: false,
        affectsRow: true,
        rowType: 'any',
        use: function (target, origin = activeUnit) {
            resetHighlight();
            if (allUnits[origin].ap >= this.apCost) {
                logString(`${allUnits[origin].name} buffs their allies' strength, aim and defense`)
                const targetArray = [];

                const currentRowUnits = document.getElementById(`section${allUnits[target].pos}`).parentNode.querySelectorAll('.unit');
                currentRowUnits.forEach((unit) => {
                    const unitID = unit.dataset.id;
                    if (allUnits[unitID].alive) {
                        allUnits[unitID].buffArray.push('buff');

                        allUnits[unitID].strength += this.strengthBuff;
                        allUnits[unitID].defense += this.defenseBuff;
                        allUnits[unitID].aim += this.aimBuff;

                        drawStatusEffects(unitID);
                        targetArray.push(allUnits[unitID]);

                    }
                });

                hitCam(allUnits[origin], targetArray, [], 'buff');
                allUnits[origin].changeAP(this.apCost);
            }
        },
    },
    debuffRow: {
        type: 7,
        name: 'Debuff Row',
        img: '',
        description: 'Debuff row',
        attack: 0,
        defenseBuff: 10,
        strengthBuff: 15,
        aimBuff: 15,
        apCost: 4,
        chance: 100,
        onEnemy: true,
        self: false,
        affectsRow: true,
        rowType: 'any',
        use: function (target, origin = activeUnit) {
            resetHighlight();
            if (allUnits[origin].ap >= this.apCost) {
                logString(`${allUnits[origin].name} weakens enemies' strength, aim and defense`)
                const targetArray = [];

                const currentRowUnits = document.getElementById(`section${allUnits[target].pos}`).parentNode.querySelectorAll('.unit');
                currentRowUnits.forEach((unit) => {
                    const unitID = unit.dataset.id;
                    if (allUnits[unitID].alive) {
                        allUnits[unitID].buffArray.push('debuff');

                        allUnits[unitID].strength -= this.strengthBuff;
                        allUnits[unitID].defense -= this.defenseBuff;
                        allUnits[unitID].aim -= this.aimBuff;
                        drawStatusEffects(unitID);
                        targetArray.push(allUnits[unitID]);
                    }
                });

                hitCam(allUnits[origin], targetArray, [], 'debuff');
                allUnits[origin].changeAP(this.apCost);
            }
        },
    },
    shoot: {
        type: 8,
        name: 'Attack',
        img: '',
        description: 'Pew',
        attack: 3,
        defenseBuff: 0,
        apCost: 3,
        chance: 100,
        onEnemy: true,
        self: false,
        rowType: 'ranged',
        use: function (target, origin = activeUnit) {
            resetHighlight();
            if (allUnits[target].alive && allUnits[origin].ap >= this.apCost) {
                if (isHit(allUnits[origin])) {
                    const damageAmount = calculateDamage(allUnits[origin], allUnits[target], this.attack, this.rowType);
                    logString(`${allUnits[origin].name} attacks ${allUnits[target].name} for ${damageAmount} damage`);
                    hitCam(allUnits[origin], [allUnits[target]], [damageAmount], 'attack');
                    allUnits[target].damageUnit(damageAmount);
                    allUnits[target].resetBuffs();
                }
                else {
                    logString(`${allUnits[origin].name} misses their attack on ${allUnits[target].name}`);
                    hitCam(allUnits[origin], [allUnits[target]], ['Miss'], 'attack');
                }
                allUnits[origin].changeAP(this.apCost);
            }
        },
    },

    shootRow: {
        type: 9,
        name: 'Attack Row',
        img: '',
        description: 'Many Pew',
        attack: 2,
        defenseBuff: 0,
        apCost: 4,
        chance: 60,
        onEnemy: true,
        self: false,
        affectsRow: true,
        rowType: 'ranged',
        use: function (target, origin = activeUnit) {
            resetHighlight();
            if (allUnits[origin].ap >= this.apCost) {
                logString(`${allUnits[origin].name} attacks the row of their enemies`);
                const targetArray = [];
                const damageArray = [];
                const currentRowUnits = document.getElementById(`section${allUnits[target].pos}`).parentNode.querySelectorAll('.unit');
                currentRowUnits.forEach((unit) => {
                    const unitID = unit.dataset.id;
                    if (allUnits[unitID].alive) {
                        if (isHit(allUnits[origin])) {
                            const damageAmount = calculateDamage(allUnits[origin], allUnits[unitID], this.attack, this.rowType);
                            allUnits[unitID].damageUnit(damageAmount);
                            allUnits[unitID].resetBuffs();
                            damageArray.push(damageAmount)
                        }
                        else {
                            damageArray.push('Miss')
                        }
                        targetArray.push(allUnits[unitID]);

                    }
                });

                hitCam(allUnits[origin], targetArray, damageArray, 'attack');
                allUnits[origin].changeAP(this.apCost);
            }
        },
    },
    whip: {
        type: 8,
        name: 'Whip',
        img: '',
        description: 'Crack',
        attack: 3,
        defenseBuff: 0,
        apCost: 3,
        chance: 100,
        onEnemy: true,
        self: false,
        rowType: 'ranged',
        use: function (target, origin = activeUnit) {
            resetHighlight();
            if (allUnits[target].alive && allUnits[origin].ap >= this.apCost) {
                if (isHit(allUnits[origin])) {
                    const damageAmount = calculateDamage(allUnits[origin], allUnits[target], this.attack, this.rowType);
                    logString(`${allUnits[origin].name} attacks ${allUnits[target].name} for ${damageAmount} damage`);
                    hitCam(allUnits[origin], [allUnits[target]], [damageAmount], 'attack');
                    allUnits[target].damageUnit(damageAmount);
                    allUnits[target].resetBuffs();
                }
                else {
                    logString(`${allUnits[origin].name} misses their attack on ${allUnits[target].name}`);
                    hitCam(allUnits[origin], [allUnits[target]], ['Miss'], 'attack');
                }
                allUnits[origin].changeAP(this.apCost);
            }
        },
    },

    whipRow: {
        type: 9,
        name: 'Whip Row',
        img: '',
        description: 'Many Crack',
        attack: 2,
        defenseBuff: 0,
        apCost: 4,
        chance: 60,
        onEnemy: true,
        self: false,
        affectsRow: true,
        rowType: 'ranged',
        use: function (target, origin = activeUnit) {
            resetHighlight();
            if (allUnits[origin].ap >= this.apCost) {
                logString(`${allUnits[origin].name} attacks the row of their enemies`);
                const targetArray = [];
                const damageArray = [];
                const currentRowUnits = document.getElementById(`section${allUnits[target].pos}`).parentNode.querySelectorAll('.unit');
                currentRowUnits.forEach((unit) => {
                    const unitID = unit.dataset.id;
                    if (allUnits[unitID].alive) {
                        if (isHit(allUnits[origin])) {
                            const damageAmount = calculateDamage(allUnits[origin], allUnits[unitID], this.attack, this.rowType);
                            allUnits[unitID].damageUnit(damageAmount);
                            allUnits[unitID].resetBuffs();
                            damageArray.push(damageAmount)
                        }
                        else {
                            damageArray.push('Miss')
                        }
                        targetArray.push(allUnits[unitID]);

                    }
                });

                hitCam(allUnits[origin], targetArray, damageArray, 'attack');
                allUnits[origin].changeAP(this.apCost);
            }
        },
    },

    move: {
        type: 100,
        apCost: 1,
        name: 'Move',
        self: true,
        onEnemy: false,
        use: function (target, origin = activeUnit) {
            moveUnit(target);
        },
    },

};
