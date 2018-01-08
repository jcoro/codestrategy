import {fromJS} from 'immutable'

import challengeData from '../data/challenge-data'
import {NEW_CHALLENGE, CHANGE_CHALLENGE_COLOR, CHALLENGE_SCORE_GUESS} from '../actions'
import {
    STATES,
    wasLastGuess,
    allCorrect,
    calculateScore,
} from '../challenge'

const initialState = fromJS({
    challengeData,
});

export default function (state = initialState, action) {
    switch (action.type) {
        case NEW_CHALLENGE:
            state = initialState;
            return state.setIn(['challengeData', action.gameId, 'states', 0, 'state', 'state'], 'IN_PROGRESS');

        case CHANGE_CHALLENGE_COLOR:
            const {rowIndex, index, newColor, challengeNum} = action;
            if (newColor === 6) {
                return state.setIn(['challengeData', challengeNum, 'states', 0, 'state','rows', rowIndex, 'pegs', index - 1], null)
            }
            if (index < 4) {
                const states = state.get('challengeData').get(challengeNum).get('states').get(0).get('state');
            } else
                return state;
            state = state.setIn(['challengeData', challengeNum, 'states', 0, 'state', 'rows', rowIndex, 'pegs', index], newColor);

            return state;

        case CHALLENGE_SCORE_GUESS:
            const {challengeNumber} = action;
            const secretCode = state.getIn(['challengeData', challengeNumber, 'states', 0, 'state','secretCode']);
            const guess = state.getIn(['challengeData', challengeNumber, 'states', 0, 'state', 'rows', action.rowIndex, "pegs"]);
            const score = calculateScore(secretCode, guess);

            let newState = state.updateIn(['challengeData', challengeNumber, 'states', 0, 'state', 'rows', action.rowIndex], row =>
                row.set('score', fromJS(score)));

            const game = newState.getIn(['challengeData', challengeNumber, 'states', 0, 'state']);

            if (allCorrect(score)) {
                newState = newState.setIn(['challengeData', challengeNumber, 'states', 0, 'state', 'state'], STATES.WON)
            } else if (wasLastGuess(game)) {
                newState = newState.setIn(['challengeData', challengeNumber, 'states', 0,'state', 'state'], STATES.LOST)
            }
            return newState

    }
    return state
}

