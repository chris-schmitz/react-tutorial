import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

function Square(props) {
    return (
        <button className='square' onClick={props.onClick}>
            {props.value}
        </button>
    )
}


class Board extends React.Component {

    renderSquare(cellNumber) {
        return <Square
            value={this.props.squares[cellNumber]}
            onClick={() => this.props.onClick(cellNumber)}
        />
    }


    render() {
        // const winner = calculateWinner(this.state.squares)
        // const statusText = winner === null ? "Next player: " : "The winner is: "
        // const statusSymbol = winner === null ? this.determineNextSymbol() : winner

        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        )
    }
}

class Game extends React.Component {
    primarySymbol = "👻"
    alternateSymbol = "🪗"

    constructor(props) {
        super(props)
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            usePrimarySymbol: true,
            stepNumber: 0
        }
    }

    jumpTo(step) {
        this.setState({
            stepNumber: (step),
            usePrimarySymbol: (step % 2) === 0
        })
    }

    handleClick(cellNumber) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1)
        const current = history[history.length - 1]
        if (calculateWinner(current.squares) !== null) return

        const squares = current.squares.slice()
        squares[cellNumber] = this.state.usePrimarySymbol ? this.primarySymbol : this.alternateSymbol
        this.setState({
            history: history.concat([{squares}]),
            usePrimarySymbol: !this.state.usePrimarySymbol,
            stepNumber: history.length
        })
    }

    determineNextSymbol() {
        return this.state.usePrimarySymbol ? this.primarySymbol : this.alternateSymbol
    }

    render() {
        const history = this.state.history
        const current = history[this.state.stepNumber]
        const winner = calculateWinner(current.squares)

        const moves = history.map((squares, move) => {
            const description = move ? `go to move # ${move}` : "Go to game start"
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{description}</button>
                </li>
            )
        })

        const statusText = winner === null ? "Next player: " : "The winner is: "
        const statusSymbol = winner === null ? this.determineNextSymbol() : winner

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div className="status">{statusText}<span class="status-symbol">{statusSymbol}</span></div>
                    <ol>{moves}</ol>
                </div>
            </div>
        )
    }
}


const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(<Game/>)

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ]
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i]
        if (
            squares[a]
            &&
            squares[a] === squares[b]
            &&
            squares[a] === squares[c]
        ) {
            return squares[a]
        }
    }
    return null
}