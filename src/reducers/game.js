import {fromJS, Map} from 'immutable'
import {times, range, uniq, sample, identity, random} from 'lodash'

import {NEW_GAME, CHANGE_COLOR, SCORE_GUESS, NEW_CHART} from '../actions'
import {
    STATES,
    ROWS_IN_GAME,
    wasLastGuess,
    allCorrect,
    calculateScore,
    updatePossibleSolutions,
    isGuessPossible
} from '../game'

import {originalSolutions} from '../data/data'

export default function reducer(state = Map(), action) {
    switch (action.type) {

        case NEW_GAME:
            return state.merge({
                state: STATES.IN_PROGRESS,
                rows: times(ROWS_IN_GAME, n => makeEmptyRow()),
                secretCode: action.secretCode,
                possibleSolutions: originalSolutions,
                guessPossible: true,
            });

        case CHANGE_COLOR:
            const {rowIndex, index, newColor} = action;
            if (newColor === 6){
                state =  state.setIn(['rows', rowIndex, 'pegs', index - 1], null);
                state = state.set('guessPossible', true);
                return state;
            }
            if (index < 3) {
                return state.setIn(['rows', rowIndex, 'pegs', index], newColor);
            } else if (index === 3) {
                state = state.setIn(['rows', rowIndex, 'pegs', index], newColor);
                const guess = state.getIn(['rows', rowIndex, "pegs"]);
                const ps = state.get('possibleSolutions');
                state = state.set('guessPossible', isGuessPossible(guess, ps));
                return state;
            } else {
                return state;
            }

        case SCORE_GUESS:
            const secretCode = state.get('secretCode');
            const guess = state.getIn(['rows', action.rowIndex, "pegs"]);
            const score = calculateScore(secretCode, guess);
            const ops = state.get('possibleSolutions');
            const possibleSolutions = updatePossibleSolutions(ops, secretCode, guess, score);
            let newState = state.updateIn(['rows', action.rowIndex], row =>
                row.set('score', fromJS(score)));

            newState = newState.set('possibleSolutions', fromJS(possibleSolutions));
            newState = newState.set('guessPossible', true);

            if (allCorrect(score)) {
                newState = newState.set('state', STATES.WON)
            } else if (wasLastGuess(newState)) {
                newState = newState.set('state', STATES.LOST)
            }
            return newState;
    }
    return state
}

function makeEmptyRow() {
    return {
        pegs: [null, null, null, null],
    }
}

