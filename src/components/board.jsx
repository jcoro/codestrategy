import React from 'react'
import {take, times, constant} from 'lodash'

import {changeColor, scoreGuess, newChart} from '../actions'
import {isGameOver} from '../game'
import Chart from './chart'
const colorScheme = {
    0: 'red',
    1: '#ef6c00',
    2: 'yellow',
    3: 'blue',
    4: 'green',
    5: 'white',
    'correct': 'black',
    'correctColor': 'white'
};

class Peg extends React.Component {
    render() {
        const {color, isEditable} = this.props;
        let type = "hole";
        let style = {};

        if (color !== null) {
            style = {
                backgroundColor: colorScheme[color],
                borderColor: colorScheme[color],
                boxShadow: "3px 3px 3px #000000"
            };
            type = "peg"
        }
        if (isEditable) {
            style.cursor = 'pointer'
        }

        return (<div className={type} style={style}>
        </div>)
    }
}

class ScorePeg extends React.Component {
    getType(score) {
        let type;
        let style = null;
        if (score === 'correct') {
            type = 'small peg';
            style = {backgroundColor: colorScheme['correct'], boxShadow: "3px 3px 3px #000000"}
        } else if (score === 'correctColor') {
            type = 'small peg';
            style = {backgroundColor: colorScheme['correctColor'], boxShadow: "3px 3px 3px #000000"}
        } else {
            type = 'small hole'
        }
        return [type, style]
    }

    render() {
        let [type, style] = this.getType(this.props.value);
        return (<div className={type} style={style}>
        </div>)
    }
}

class Scores extends React.Component {
    convertScore(scoresObj) {
        if (!scoresObj) {
            return [null, null, null, null]
        }
        const correct = scoresObj.get('correct', 0);
        const correctColor = scoresObj.get('correctColor', 0);
        return ensureLength(
            times(correct, constant('correct')).concat(times(correctColor, constant('correctColor'))),
            4)
    }

    render() {
        const [score1, score2, score3, score4] = this.convertScore(this.props.score);

        return (<div className="score">
            <div>
                <ScorePeg value={score1}/>
                <ScorePeg value={score2}/>
            </div>
            <div>
                <ScorePeg value={score3}/>
                <ScorePeg value={score4}/>
            </div>
        </div>)
    }
}

class Row extends React.Component {
    constructor(props) {
        super(props);
        const {index, color, isEditable, changeColor, activePeg} = this.props;
        this.allPegsSet = this.allPegsSet.bind(this);
        this.scoresOrEvaluateButton = this.scoresOrEvaluateButton.bind(this);
    }

    allPegsSet(row) {
        return row.get('pegs').every(peg => peg !== null)
    }

    scoresOrEvaluateButton(row, isGameOver, isEditable, isCurrentRow) {
        if (!isGameOver && isCurrentRow) {
            return (<div className='score'>
                <button className="checkButton"
                        disabled={!(isEditable && this.allPegsSet(row))}
                        onClick={this.props.score}>Check
                </button>
            </div>)
        }
        return <Scores score={row.get('score')}/>
    }

    render() {
        const {row, isGameOver, isEditable, isCurrentRow}  = this.props;
        return (<div className="row">
            <div className="holes">
                {row.get('pegs').map((color, idx) =>
                    <Peg key={idx} index={idx} isEditable={isEditable} color={color}/>)
                }
            </div>
            {this.scoresOrEvaluateButton(row, isGameOver, isEditable, isCurrentRow)}
        </div>)
    }
}

class ColorChooser extends React.Component {
    constructor(props) {
        super(props);
        const {changeColor, rowIdx, possibleSolutions, type, guessPossible} = this.props;
        this.state = {
            style: {
                top: 20,
                left: 0
            },
        };
        this.colorClick = this.colorClick.bind(this);
    }

    colorClick(colIndex) {
        this.props.changeColor(colIndex)
    }

    render() {
        const colorBlock = colIndex => {
            return (<div className="color"
                         onClick={() => this.colorClick(colIndex)}
                         style={{backgroundColor: colorScheme[colIndex]}}>
                <span>{colIndex === 6 ? "Delete" : null}</span>
            </div>)
        };

        const feedback = (size) => {
            return (
                <div className="gameData">
                    Possible Solutions: {size} <br/>
                    <span
                        className="gameAlert">{this.props.guessPossible ? '' : "This is not a possible solution"}</span>
                </div>
            )
        };

        return (<div id="colorChooser" style={{top: 20 + (this.props.rowIdx * 80)}}>
            <div>
                {colorBlock(0)}
                {colorBlock(1)}
                {colorBlock(2)}
                {colorBlock(3)}
                {colorBlock(4)}
                {colorBlock(5)}
                {colorBlock(6)}
            </div>
            <div>{feedback(this.props.possibleSolutions.size)}</div>


        </div>)
    }
}


class Board extends React.Component {
    constructor(props) {
        super(props);
        const {game, dispatch} = this.props;
    }

    render() {
        const game = this.props.game;
        const guessPossible = game.get('guessPossible');
        const boardEditable = this.props.hasOwnProperty('editable') ? this.props.editable : true;
        const rows = game.get('rows');
        const gameState = game.get('state');
        let possibleSolutions = game.get('possibleSolutions');
        let type = game.get('type');
        if (!rows) {
            return <div id="board"></div>
        }
        const currentRowIdx = rows.findIndex(row => !row.get('score'));
        let activePeg = rows.get(currentRowIdx).get('pegs').findIndex(peg => peg === null);
        if (activePeg === -1) {
            activePeg = 4;
        }
        const noop = () => {
        };

        return (
            <div className="outerPanel">

                <div className="mainPanel">

                    {rows.map((row, idx) =>
                        <Row key={idx}
                             isGameOver={isGameOver(gameState)}
                             isEditable={boardEditable && !isGameOver(gameState) && currentRowIdx === idx}
                             isCurrentRow={currentRowIdx === idx}
                             activePeg={activePeg}
                             row={row}
                             score={() => boardEditable ? this.props.dispatch(scoreGuess(idx)) : noop}/>)}

                </div>

                <div className="chooserPanel">
                    <ColorChooser ref='colorChooser'
                                  changeColor={(newColor) => this.props.dispatch(changeColor(currentRowIdx, activePeg, newColor))}
                                  rowIdx={currentRowIdx}
                                  possibleSolutions={possibleSolutions}
                                  type={type != null ? type : noop}
                                  guessPossible={guessPossible}
                    />
                </div>
                <Chart dispatch={this.props.dispatch}/>
            </div>)
    }

}

function ensureLength(xs, requiredLength, fillValue = null) {
    return xs.concat(times(constant(fillValue), requiredLength - xs.length))
}

export default Board;