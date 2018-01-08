import React from 'react'

import {STATES} from '../game'

const ChallengeOverDialog = React.createClass({
    render: function() {
        const {gameState, newChallenge} = this.props
        let buttonText = this.props.hasOwnProperty('buttonText') ? this.props.buttonText : 'Play another game'

        const styles = {
            msg: {
                fontSize: 24,
                marginBottom: 20
            },
            button: {
                fontSize: 18,
                padding: 12
            }
        }

        return (<div id="dialog">
            <div>
                <div style={styles.msg}>{gameState === STATES.WON ? 'You won!' : 'You lost!'}</div>
                <button style={styles.button} onClick={newChallenge}>{buttonText}</button>
            </div>
        </div>)
    }
})

export default ChallengeOverDialog
