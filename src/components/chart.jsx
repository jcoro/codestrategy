import React from 'react'
import {connect} from 'react-redux'
import {dropColor, deleteChartColor, newChart} from '../actions'


class ColorPalette extends React.Component {
    constructor(props) {
        super(props);
        const {dragStart, colorIndex} = this.props;
        this.drag = this.drag.bind(this);
    }

    drag(event) {
        //this.props.dragStart(this.props.colorIndex);
        const color = this.props.colorIndex;
        event.dataTransfer.setData('text', color);
    }

    render() {
        const colors = ['red', 'orange', 'yellow', 'blue', 'green', 'white', 'none'];
        const index = this.props.colorIndex;
        return (
            <div
                className={colors[index]}
                draggable="true"
                onDragStart={this.drag}></div>
        )
    }
}

class ColorReceiver extends React.Component {
    constructor(props) {
        super(props);
        const {colorIndex, cellIndex, chart, dispatch} = this.props;
        this.drop = this.drop.bind(this);
        this.dragOver = this.dragOver.bind(this);
        this.changeChartColor = this.changeChartColor.bind(this);
        this.clickToDelete = this.clickToDelete.bind(this);
    }

    clickToDelete(e) {
        const colorIndex = this.props.colorIndex;
        const cellIndex = this.props.cellIndex;
        if (colorIndex != 6) {
            this.props.dispatch(deleteChartColor(colorIndex, cellIndex));
        }
    }

    changeChartColor(colorIndex, cellIndex) {
        this.props.dispatch(dropColor(colorIndex, cellIndex));
    }

    drop(event) {
        event.preventDefault();
        let color = "";
        try {
            color = JSON.parse(event.dataTransfer.getData('text'));
        } catch (e) {
            // If the text data isn't parsable we'll just ignore it.
            return;
        }
        this.changeChartColor(color, this.props.cellIndex);
    }

    dragOver(event) {
        event.preventDefault();
    }

    render() {
        const colors = ['red', 'orange', 'yellow', 'blue', 'green', 'white', 'none'];
        const index = colors[this.props.chart.get(this.props.cellIndex)];
        return (
            <div className="colorReceiver"
                 onClick={this.clickToDelete}
                 onDrop={this.drop}
                 onDragOver={this.dragOver}>
                <div className={index}></div>
            </div>
        )
    }
}

class Chart extends React.Component {
    constructor(props) {
        super(props);
        const {chart, dispatch} = this.props;
        this.createNewChart = this.createNewChart.bind(this);
    };

    createNewChart() {
        this.props.dispatch(newChart());
    }

    render() {
        const chart = this.props.chart;
        return (
            <div className="chartContainer">
                <div className="innerChartContainer">
                    <div className="chartColumn">
                        <div className="spacer"></div>
                        <ColorPalette colorIndex={0}/>
                        <ColorPalette colorIndex={1}/>
                        <ColorPalette colorIndex={2}/>
                        <ColorPalette colorIndex={3}/>
                        <ColorPalette colorIndex={4}/>
                        <ColorPalette colorIndex={5}/>

                    </div>
                    <div className="chartColumn">
                        <div className="chartHeader">Contains</div>
                        <ColorReceiver
                            chart={chart}
                            dispatch={this.props.dispatch}
                            colorIndex={chart.get(0)}
                            cellIndex={0}
                        />
                        <ColorReceiver
                            chart={chart}
                            dispatch={this.props.dispatch}
                            colorIndex={chart.get(1)}
                            cellIndex={1}
                        />
                        <ColorReceiver
                            chart={chart}
                            dispatch={this.props.dispatch}
                            colorIndex={chart.get(2)}
                            cellIndex={2}
                        />
                        <ColorReceiver
                            chart={chart}
                            dispatch={this.props.dispatch}
                            colorIndex={chart.get(3)}
                            cellIndex={3}
                        />
                        <ColorReceiver
                            chart={chart}
                            dispatch={this.props.dispatch}
                            colorIndex={chart.get(4)}
                            cellIndex={4}
                        />
                    </div>
                    <div className="chartColumn">
                        <div className="chartHeader">Does Not<br/>Contain</div>
                        <ColorReceiver
                            chart={chart}
                            dispatch={this.props.dispatch}
                            colorIndex={chart.get(5)}
                            cellIndex={5}
                        />
                        <ColorReceiver
                            chart={chart}
                            dispatch={this.props.dispatch}
                            colorIndex={chart.get(6)}
                            cellIndex={6}
                        />
                        <ColorReceiver
                            chart={chart}
                            dispatch={this.props.dispatch}
                            colorIndex={chart.get(7)}
                            cellIndex={7}
                        />
                        <ColorReceiver
                            chart={chart}
                            dispatch={this.props.dispatch}
                            colorIndex={chart.get(8)}
                            cellIndex={8}
                        />
                        <ColorReceiver
                            chart={chart}
                            dispatch={this.props.dispatch}
                            colorIndex={chart.get(9)}
                            cellIndex={9}
                        />
                    </div>
                </div>
                <div className="chartRules">Keep track of what you know here by dragging a color into the appropriate
                    column. <br/><br/>(Click a color to delete)
                </div>
                <div className="chartButtonContainer">
                    <button className="chartButton" onClick={() => this.createNewChart()}>Clear</button>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        chart: state.get('chart')
    }
}

export default connect(mapStateToProps)(Chart)