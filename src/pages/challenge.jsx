import React from 'react'
import {connect} from 'react-redux'
import {merge} from 'lodash'
import {fromJS} from 'immutable'

import MiniBoard from '../components/miniBoard'
import ChallengeOverDialog from '../components/challenge-over-dialog'
import {isGameOver} from '../game'

import {newChallenge} from '../actions'

const ChallengePage = React.createClass({

  componentDidMount: function() {
    this.props.dispatch(newChallenge(this.props.params.gameId));
  },

  render: function() {
    const {dispatch, challenges} = this.props;

    const challengeNum = this.props.params.gameId.toString();
    const currentChallenge = challenges.get("challengeData").get(challengeNum);
    if (!currentChallenge) {
      return (<div style={{textAlign: 'center'}} className="challengesBoardPanel">
          <span>No such game</span>
      </div>)
    }
    const name = currentChallenge.get('name');
    const challenge = currentChallenge.get('states').get(0).get('state');
    const gameState = challenge.get('state');

    return (<div>
      <div className="challengeHeader">
        <strong>{name}</strong>
      </div>

      <MiniBoard challenge={challenge} dispatch={dispatch} chart={fromJS([6,6,6,6,6,6,6,6,6,6])}  />
      {isGameOver(gameState) ?
          <ChallengeOverDialog
              buttonText="OK"
              gameState={gameState}
              newChallenge={() => dispatch(newChallenge(challengeNum))}/>
          : null}
    </div>)
  }
})

function mapStateToProps(state) {
  return {
    challenges: state.get('challenges')
  }
}

const ReplayGamesPageContainer = connect(mapStateToProps)(ChallengePage)

export default ReplayGamesPageContainer

