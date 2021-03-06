const playerHpElement = document.getElementById('player-health');
const playerTotalHp = 274;
let playerHp = 274;
const playerType = document.getElementById('player').className;


const opponentHpElement = document.getElementById('opponent-health');
const opponentTotalHp = 292;
let opponentHp = 292;
const opponentType = document.getElementById('opponent').className;


const turnText = document.getElementById('text');
let isTurnHappening = false;

const playerAttacks = {
  thunderShock: {
    power: 40,
    accuracy: 100,
    name: 'Thunder Shock',
    type: 'electric',
  },
  quickAttack: {
    power: 40,
    accuracy: 100,
    name: 'Quick Attack',
    type: 'normal',
  },
  thunder: {
    power: 110,
    accuracy: 70,
    name: 'Thunder',
    type: 'electric',
  },
  submission: {
    power: 80,
    accuracy: 80,
    name: 'Submission',
    type: 'fighting',
  }
  ,
  electroBall: {
    power: 90,
    accuracy: 60,
    name: 'Electro Ball',
    type: 'electric'
  }, 
  thunderBolt: {
    power: 80,
    accuracy: 65,
    name: 'thunder bolt',
    type: 'electric'
  }
}

const opponentAttacks = {
  tackle: {
    power: 40,
    accuracy: 100,
    name: 'Tackle',
    type: 'normal',
  },
  bubble: {
    power: 40,
    accuracy: 100,
    name: 'Bubble',
    type: 'water',
  },
  waterGun: {
    power: 40,
    accuracy: 100,
    name: 'Water Gun',
    type: 'water',
  },
  hydroPump: {
    power: 110,
    accuracy: 80,
    name: 'Hydro Pump',
    type: 'water',
  }
  ,
  waterPulse: {
    power: 85,
    accuracy: 65,
    name: 'Water Pulse',
    type: 'water'
  }
}

function gameOver (winner) {
  // Wait 1000 (Health loss animation)
  setTimeout(() => {
    // Update HTML text with the winner
    turnText.innerText = winner + ' is the winner!';
    // Open alert with the winner
    alert(winner + ' is the winner! Close this alert to play again');
    // Reload the game
    window.location.reload();
  }, 1000);
}

// Check if attacks misses
function willAttackMiss (accuracy) {
  return Math.floor(Math.random() * 100) > accuracy;
}

function updatePlayerHp(newHP) {
  // Prevents the HP to go lower than 0
  playerHp = Math.max(newHP, 0);

  // If player health is equal 0 opponent wins
  if (playerHp === 0) {
    gameOver('Opponent');
  }

  // Update the player hp bar
  const barWidth = (playerHp / playerTotalHp) * 100;
  playerHpElement.style.width = barWidth + '%';
}

function updateOpponentHp(newHP) {
  // Prevents the HP to go lower than 0
  opponentHp = Math.max(newHP, 0);

  // If oppont health is equal 0 player wins
  if (opponentHp === 0) {
    gameOver('Player');
  }

  // Update the opponents hp bar
  const barWidth = (opponentHp / opponentTotalHp) * 100;
  opponentHpElement.style.width = barWidth + '%';
}

// *************************************************************************************
// Here you need to implement the player attack function that receives the used attack
// return false if attack misses
// otherwise update opponents health and return true
// *************************************************************************************
function playerAttack(attack) {
  // 0: return false if attack misses
  // 1: otherwise update opponents health and return true
  
  const didAttackMissed = willAttackMiss(attack.accuracy);
  // console.log(willAttackMiss(attack.accuracy));
  
  if (didAttackMissed === true) {
    // the attack did missed
    return false;
  } else {
    // the attack didn't missed, so we must update the opponents health
    let newOpponentHp;
    
    
    if (attack.type === 'electric' && opponentType === 'water'){// electric attacks cause greater damage to water pokemons 
      newOpponentHp = opponentHp - 1.1*(attack.power); // 10% greater damage
    } else {
      newOpponentHp = opponentHp - attack.power;
    }
    
    updateOpponentHp(newOpponentHp);
    return true;
  }
}


// *************************************************************************************
// Here you need to implement the opponent attack function that receives the used attack
// return false if attack misses
// otherwise update player health and return true
// *************************************************************************************

// opponent attack function that receives the used attack
function opponentAttack(attack) {
  // 0: return false if attack misses
  // 1: otherwise update player health and return true
  const didAttackMissed = willAttackMiss(attack.accuracy);
  if (didAttackMissed === true) {
    // situation 0
    return false;
  } else {
    // situation 1 
    const newPlayerHP = playerHp - attack.power;
    updatePlayerHp(newPlayerHP);
    return true;
  }
}

function chooseOpponentAttack () {
  // Put all opponents attacks in a array
  const possibleAttacks = Object.values(opponentAttacks);

  // Randomly chooses one attack from the array
  return possibleAttacks[Math.floor(Math.random() * possibleAttacks.length)];
}

function turn(playerChosenAttack) {
  // Don't start another turn till the current one is not finished
  if (isTurnHappening) {
    return;
  }
  isTurnHappening = true;

  // variable that will tell us whether the opponent is paralyzed or not
  // let standstill = 0; // 1 means false and 0 true 
  // let count_turn = 0 ; // will count the number of turns that the opponent must be paralysed 

  const didPlayerHit = playerAttack(playerChosenAttack);

  // Update HTML text with the used attack
  turnText.innerText = 'Player used ' + playerChosenAttack.name;
  
  // Update HTML text in case the attack misses
  if (!didPlayerHit) {
    turnText.innerText += ', but missed!';
  }

  // Wait 2000ms to execute opponent attack (Player attack animation time)
  setTimeout(() => {
    if (playerChosenAttack.name === "Thunder Shock") {
      turnText.innerText = 'Opponent is paralysed';    
    }else {
      // Randomly chooses opponents attack
      const opponentChosenAttack = chooseOpponentAttack();

      const didOpponentHit = opponentAttack(opponentChosenAttack);

      // Update HTML text with the used attack
      turnText.innerText = 'Opponent used ' + opponentChosenAttack.name;

      // Update HTML text in case the attack misses
      if (!didOpponentHit) {
        turnText.innerText += ', but missed!';
      }
    }

    // Wait 2000ms to end the turn (Opponent attack animation time)
    setTimeout(() => {
      // Update HTML text for the next turn
      turnText.innerText = 'Please choose one attack';
      isTurnHappening = false;
    }, 2000);
  }, 2000);
}

// Set buttons click interaction
document.getElementById('thunder-shock-button').addEventListener('click', function() {
  turn(playerAttacks.thunderShock);
});
document.getElementById('quick-attack-button').addEventListener('click', function() {
  turn(playerAttacks.quickAttack);
});
document.getElementById('thunder-button').addEventListener('click', function() {
  turn(playerAttacks.thunder);
});
document.getElementById('submission-button').addEventListener('click', function() {
  turn(playerAttacks.submission);
});
document.getElementById('electro-ball-button').addEventListener('click', function() {
  turn(playerAttacks.electroBall);
});
document.getElementById('thunder-bolt-button').addEventListener('click', function() {
  turn(playerAttacks.thunderBolt);
});
