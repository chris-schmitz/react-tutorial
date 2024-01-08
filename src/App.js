import {useState} from "react";


export default function Game() {
    const historyInitialState = [{squares: Array(9).fill(null), newMoveGridIndex: null}]
    const [usePrimarySymbol, setUsePrimarySymbol] = useState(true)
    const [history, setHistory] = useState(historyInitialState)
    const [currentMove, setCurrentMove] = useState(0)
    const currentSquares = history[currentMove].squares

    function handlePlay(nextSquares, playIndex) {
        const nextHistory = [...history.slice(0, currentMove + 1), {squares: nextSquares, newMoveGridIndex: playIndex}]
        setHistory(nextHistory)
        setCurrentMove(nextHistory.length - 1)
        setUsePrimarySymbol(!usePrimarySymbol)
    }

    function handleGameReset() {
        setHistory(historyInitialState)
        setCurrentMove(0)
        setUsePrimarySymbol(true)
    }

    function jumpTo(targetSquaresIndex) {
        setCurrentMove(targetSquaresIndex)
        setUsePrimarySymbol(targetSquaresIndex % 2 === 0)
    }

    function getGridCoordinates(newMoveGridIndex) {
        return {
            row: Math.floor(newMoveGridIndex / 3),
            column: newMoveGridIndex % 3
        }
    }

    const moves = history.map((moment, index) => {
        let description = ""
        const coordinates = getGridCoordinates(moment.newMoveGridIndex)
        const coordinatesFormatted = `Row: ${coordinates.row + 1}, Column: ${coordinates.column + 1}`
        if (index === 0) {
            description = `Go to game start`
        } else if (index === currentMove) {
            description = `You are at move # ${index}. ${coordinatesFormatted}`
        } else {
            description = `Go to move # ${index}. ${coordinatesFormatted}`
        }
        return (
            <li key={index}>
                <button
                    className={index === currentMove ? "active-move move" : "move"}
                    onClick={() => jumpTo(index)}>
                    {description}
                </button>
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

    const result = calculatePlayResult(squares)
    let statusText = ""
    switch (result?.state) {
        case "winner":
            statusText = "Winner:`"
            break
        case "draw":
            statusText = "Draw:"
            break
        default:
            statusText = "Next player:"
    }
    const statusSymbol = result?.symbol || getActiveSymbol()


    // ? Should this be extracted to become more of a pure function????
    // * my impulse was to say "yeah, we've got stuff like `squares` that is dependent on an outside context and we
    // * should pass it in as an argument vs letting that context bleed in here", but at the same time the kotlin eng
    // * in me looks at `squares` in this function, sees that there's no instance name prefixing it, and assumes it's
    // * a property of the overall class that this method belongs to. In this case that's not what's happening, this
    // * is a function, not a method of a class ... but it kind of is. It's a function defined within the scope of
    // * another function which is effectively like a class method in js and the property _is_ a property local to
    // * the actual public function, so it is like referring to a class property so the "bleed" isn't necessarily bad.
    // * I think the part of me that is still kind of against the outer context bleeding in is the part that knows that
    // * referring to squares here doesn't guarantee that the property is part of the parent function (and is isolated
    // * to the scope of the parent function), it could still be coming from some other more global scope. Ultimately
    // * I'm not too concerned b/c this is a freaking tic tac toe demo, but it will be interesting to figure out future
    // * me's opinion if he ever comes back and looks over this code ;P
    function handleClick(squareIndex) {
        if (squares[squareIndex] || result) return

        const nextSquares = squares.slice()
        nextSquares[squareIndex] = usePrimarySymbol ? symbols.primarySymbol : symbols.secondarySymbol
        onPlay(nextSquares, squareIndex)
    }

    function getActiveSymbol() {
        return usePrimarySymbol ? symbols.primarySymbol : symbols.secondarySymbol
    }

    // ! This function is internationally unused
    // ? At the end of the tutorial there's some extra credit. One of those extra credit tasks is:
    // | Rewrite Board to use two loops to make the squares instead of hardcoding them.
    // ? this is that function using two loops to make the grid and it works just fine. That said, I'm not using it
    // ? because in this particular case I think writing the grid markup in this loop leads to less readability for no
    // ? real gain. A tic tac to grid is never going to be anything more than a 3 x 3 grid. Writing this function doesn't
    // ? add any flexibility or performance into the code and it means that the next engineer coming to read through
    // ? this code is going to have a higher cognitive load when trying to reason about the function vs just reading
    // ? the repetitive but simpler markup. And really, with the loop the way it is, it's 11 lines of code vs 17, so
    // ? what are you really saving? It's just a backflip for backflip's sake.
    function renderGrid() {
        const columns = []
        for (let row = 0; row < 3; row++) {
            let rows = []
            for (let column = 0; column < 3; column++) {
                const cellIndex = column + (row * 3)
                rows.push(<Square value={squares[cellIndex]} onSquareClick={() => handleClick(cellIndex)}/>)
            }
            columns.push(<div className="board-row">{rows}</div>)
        }
        return columns
    }

    function renderRows(indexStart, indexEnd, currentSquareState) {
        let cells = []
        for (let i = indexStart; i <= indexEnd; i++) {
            cells.push(
                <Square
                    key={i}
                    value={currentSquareState[i]}
                    isAWinningCell={isAWinningCell(i)}
                    onSquareClick={() => handleClick(i)}
                />
            )
        }
        return cells
    }

    function isAWinningCell(cellIndex) {
        if (result === null) return false
        if (result.winningLine.includes(cellIndex)) return true
        return false
    }

    function updateSymbols(primarySymbol, secondarySymbol) {

    }

    return <>
        <div className="status">
            <span className="status-text">{statusText}</span><span className="status-symbol">{statusSymbol}</span>
        </div>

        {/* ! this is intentionally left disabled */}
        {/*{renderGrid()}*/}

        <div className="board-row">
            {renderRows(0, 2, squares)}
        </div>
        <div className="board-row">
            {renderRows(3, 5, squares)}
        </div>
        <div className="board-row">
            {renderRows(6, 8, squares)}
        </div>
        <div className="actions">
            <button onClick={onGameReset}>Reset Game</button>
        </div>
        <div className="symbols">
            <label htmlFor="primarySymbol">Player 1 symbol:
                <input
                    name="primarySymbol"
                    value={symbols.primarySymbol} maxLength="1"
                    onChange={e => setSymbols({
                        primarySymbol: e.target.value,
                        secondarySymbol: symbols.secondarySymbol
                    })}
                />
            </label>
            <label htmlFor="secondarySymbol">Player 2 symbol:
                <input
                    name="secondarySymbol"
                    value={symbols.secondarySymbol} maxLength="1"
                    onChange={e => setSymbols({secondarySymbol: e.target.value, primarySymbol: symbols.primarySymbol})}
                />
            </label>
        </div>
    </>
}

function Square({value, isAWinningCell, onSquareClick}) {
    return <button className={"square" + (isAWinningCell ? " winning-cell" : "")}
                   onClick={onSquareClick}> {value} </button>
}

function calculatePlayResult(squares) {
    if (!squares?.includes(null)) return {state: "draw", symbol: "🤷🏾‍", winningLine: []}
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
            return {state: "winner", winningSymbol: squares[a], winningLine: lines[i]}
        }
    }
    return null;
}