import {times, range, uniq, sample, identity, random} from 'lodash'

export const ROWS_IN_GAME = 10;

// Game states
export const STATES = {
  IN_PROGRESS: 'IN_PROGRESS',
  WON: 'WON',
  LOST: 'LOST',
}

export function isGameOver(state) {
  return state === STATES.WON || state === STATES.LOST
}

export function wasLastGuess(game) {
    //console.log(game.toString());
  return game.get('rows').findIndex(row => !row.has('score')) === -1
}

export function allCorrect(score) {
  return score.correct === 4
}

export function generateSecretCode() {
  return times(4, () => random(5))
    //return [5,3,4,3];
}

export function calculateScore(secretCode, guess) {
  let perfectMatches = guess.filter((col, idx) => col == secretCode.get(idx));
  let correct = perfectMatches.count();

  let secretCodeCountByColors = secretCode.countBy(identity);
  let totalColorMatches = guess.countBy(identity).reduce(
      (sum, count, color) =>
          sum += Math.min(secretCodeCountByColors.get(color, 0), count)
      , 0);
  let correctColor = totalColorMatches - correct;

  return {correct: correct, correctColor: correctColor}
}

export function isGuessPossible(guess, ps){
    return ps.includes(guess);
}

function checkCorrect(psi, guess, num){
    guess = guess.toArray();
    psi = psi.toArray();
    let counter = 0;
    for (let i = 0; i < guess.length; i++) {
        if(guess[i] === psi[i]){
            counter++;
        }
    }
    return counter === num;
}

function checkCorrectColor(psi, guess, num) {
    guess = guess.toArray();
    psi = psi.toArray();
    let counter = 0;
    for (let i = 0; i < psi.length; i++) {
        if(psi[i] !== guess[i] && guess.includes(psi[i])){
            counter++;
        }
    }
    return counter === num;
}

export function updatePossibleSolutions(ps, secretCode, guess, score){

    // {correct: 2, correctColor: 0}
    // correct = color and position are correct
    // correctColor = color is correct, position is NOT correct
    // console.log("Secret Code: " + secretCode.toArray());
    // console.log(ps.toArray());


    // {correct: 0, correctColor: 0}
    if(score.correct === 0 && score.correctColor == 0){
      guess.map((item, idx) =>
        ps = ps.filter( psi => !psi.includes(item) )
      )
    } else if (score.correct < 4 && score.correctColor == 0) {
        ps = ps.filter( psi => checkCorrect(psi, guess, score.correct))
    } else if (score.correct === 0 && score.correctColor < 4) {
        ps = ps.filter( psi => checkCorrectColor(psi, guess, score.correctColor))
    } else {
        ps = ps.filter(psi => checkCorrect(psi, guess, score.correct) && checkCorrectColor(psi, guess, score.correctColor))
    }

    secretCode = secretCode.toArray();
    guess = guess.toArray();

    //ps.map((item) => console.log(item.toString()));

    return ps;
}

