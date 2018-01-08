import React from 'react'
import {connect} from 'react-redux'

const ChallengesRow = React.createClass({
    render: function () {
        const {challenge} = this.props;
        const name = challenge.get('name');

        return (<tr>
            <td>
                <div>{name}</div>
            </td>
            <td>
                <button style={{padding: 8}} onClick={this.props.replayGame}>Play</button>
            </td>
        </tr>)
    }
})

const ChallengesPage = React.createClass({
    contextTypes: {
        history: React.PropTypes.object
    },

    chooseChallenge: function (id) {
        const history = this.context.history;
        history.pushState(null, `/challenges/${id}`)
    },

    render: function () {
        const {dispatch, challenges} = this.props;

        return (<div className="challengesPanel">
            <table>
                <thead>
                <tr>
                    <th colSpan="2">Challenges</th>
                </tr>
                </thead>
                <tbody>
                {challenges.map((challenge, id) =>
                    <ChallengesRow key={id} challenge={challenge}
                                   replayGame={(evt) => this.chooseChallenge(id)}/>).valueSeq()}
                </tbody>
            </table>
        </div>)
    }
})

function mapStateToProps(state) {
    return {
        challenges: state.getIn(['challenges', 'challengeData'])
    }
}

const ChallengesPageContainer = connect(mapStateToProps)(ChallengesPage)

export default ChallengesPageContainer
