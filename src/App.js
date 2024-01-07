import {useState} from "react";


export default function Game() {
    const [usePrimarySymbol, setUsePrimarySymbol] = useState(true)
    const [history, setHistory] = useState([Array(9).fill(null)])
    const [currentMove, setCurrentMove] = useState(0)
    const currentSquares = history[currentMove]

    function handlePlay(nextSquares) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
        setHistory(nextHistory)
        setCurrentMove(nextHistory.length - 1)
        setUsePrimarySymbol(!usePrimarySymbol)
    }

    function handleGameReset() {
        setHistory([Array(9).fill(null)])
        setCurrentMove(0)
        setUsePrimarySymbol(true)
    }

    function jumpTo(targetSquaresIndex) {
        setCurrentMove(targetSquaresIndex)
        setUsePrimarySymbol(targetSquaresIndex % 2 === 0)
    }

    const moves = history.map((squares, index) => {
        const description = index > 0 ? `Go to move # ${index}` : `Go to game start`
        return (
            <li key={index}>
                <button onClick={() => jumpTo(index)}>{description}</button>
            </li>
        )
    })

    return (
        <div className="game">
            <div className="game-board">
                <Board
                    squares={currentSquares}
                    usePrimarySymbol={usePrimarySymbol}
                    onPlay={handlePlay}
                    onGameReset={handleGameReset}
                />
            </div>
            <div className="game-info">
                <ol>
                    {moves}
                </ol>
            </div>
        </div>
    )
}

function Board({squares, usePrimarySymbol, onPlay, onGameReset}) {
    const [symbols, setSymbols] = useState({primarySymbol: "🍿", secondarySymbol: "🍩"})
//    const [usePrimarySymbol, setUsePrimarySymbol] = useState(true)
//    const [squares, setSquares] = useState(Array(9).fill(null))

    const winner = calculateWinner(squares)
    const statusText = winner ? `Winner:` : `Next player:`
    const statusSymbol = winner || getActiveSymbol()


    function handleClick(squareIndex) {
        if (squares[squareIndex] || winner) return

        const nextSquares = squares.slice()
        nextSquares[squareIndex] = usePrimarySymbol ? symbols.primarySymbol : symbols.secondarySymbol
        onPlay(nextSquares)
    }

    function getActiveSymbol() {
        return usePrimarySymbol ? symbols.primarySymbol : symbols.secondarySymbol
    }


    return <>
        <div className="status">
            <span className="status-text">{statusText}</span><span class="status-symbol">{statusSymbol}</span>
        </div>
        <div className="board-row">
            <Square value={squares[0]} onSquareClick={() => handleClick(0)}/>
            <Square value={squares[1]} onSquareClick={() => handleClick(1)}/>
            <Square value={squares[2]} onSquareClick={() => handleClick(2)}/>
        </div>
        <div className="board-row">
            <Square value={squares[3]} onSquareClick={() => handleClick(3)}/>
            <Square value={squares[4]} onSquareClick={() => handleClick(4)}/>
            <Square value={squares[5]} onSquareClick={() => handleClick(5)}/>
        </div>
        <div className="board-row">
            <Square value={squares[6]} onSquareClick={() => handleClick(6)}/>
            <Square value={squares[7]} onSquareClick={() => handleClick(7)}/>
            <Square value={squares[8]} onSquareClick={() => handleClick(8)}/>
        </div>
        <div className="actions">
            <button onClick={onGameReset}>Reset Game</button>
        </div>
    </>
}

function Square({value, onSquareClick}) {
    return <button className="square" onClick={onSquareClick}> {value} </button>
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}