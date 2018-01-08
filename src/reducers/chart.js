import {fromJS} from 'immutable'
import {NEW_CHART, DROP_COLOR, DELETE_CHART_COLOR} from '../actions'

const initialState = fromJS([6,6,6,6,6,6,6,6,6,6]);
export default function reducer(state = initialState, action) {
    switch (action.type) {

        case NEW_CHART:
            return initialState;

        case DROP_COLOR:
            state = state.setIn([action.cellIndex], action.color );
            return state;

        case DELETE_CHART_COLOR:
            state = state.setIn([action.cellIndex], 6);
    }
    return state
}


