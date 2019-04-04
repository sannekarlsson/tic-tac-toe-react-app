import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// Controlled component. Their state is kept in a parent.
// Turned into a functional component, since only a render method and no own state.
function Square(props) {
    return (
        <button
            className="square"
            onClick={props.onClick}
        >
            {props.value}
        </button>
    );
}

// 4. Order moves as well as the list number
function MovesHistory(props) {
    return (
        props.isAscending ?
            <ol>{props.moves}</ol> :
            <ol reversed>{props.moves.reverse()}</ol>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
                key={i}
            />
        );
    }

    render() {
        // Extra idea 3. 
        // Rewrite Board to use two loops to make the squares instead of hardcoding them.
        const dimension = 3;
        const rows = [];
        for (let row = 0; row < dimension; row++) {
            const cols = [];
            for (let col = 0; col < dimension; col++) {
                cols.push(this.renderSquare(dimension * row + col));
            }
            rows.push(<div className="board-row" key={row}>{cols}</div>);
        }

        return (
            <div>
                {rows}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // Save all move states in history
            history: [{
                // Squares states 
                squares: Array(9).fill(null),
                // 1. Square number clicked for (col, row)
                location: null,
            }],
            // 4. Toggle moves order
            isAscending: true,
            stepNumber: 0,
            // Alternate between players X & O
            xIsNext: true,
        }
    }

    // Square clicks
    // Adds player X or 0 and updates history 
    handleClick(i) {
        // If went back in time, this is where the board state will be altered 
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        // Copy the squares for immutability 
        const squares = current.squares.slice();
        // Return early if already clicked or someone won
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        // Mark the clicked square
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        // Update state 
        this.setState({
            // Concat arrays instead of push for immutability
            history: history.concat([{
                squares: squares,
                location: i,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    // History list clicks to go back in time
    jumpTo(step) {
        this.setState({
            stepNumber: step,
            // X is next after all even moves
            xIsNext: (step % 2) === 0,
        });
    }

    // 4. Toggle moves order
    toggleMoves() {
        this.setState({
            isAscending: !this.state.isAscending,
        })
    }

    render() {
        // Every time state is updated, this will be called
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        // map((object w/ squares & location, index)) 
        const moves = history.map((step, move) => {
            // Extra idea 1:
            // Display the location for each move in the format (col, row) in the move history list.
            const location = step.location;
            const col = location % 3;
            const row = Math.floor(location / 3);
            const desc = move ?
                `Go to move #${move} (${col}, ${row})` :
                'Go to game start';
            return (
                // Move index can be used as key, since the list items wont be re-ordered, deleted or inserted in the middle
                <li key={move}>
                    <button
                        // Extra idea 2:
                        // Bold the currently selected item in the move list. 
                        className={(move === this.state.stepNumber) ? "current" : ""}
                        onClick={() => this.jumpTo(move)}
                    >
                        {desc}
                    </button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    {/* Extra idea 4:
                        Add a toggle button that lets you sort the moves in either ascending or descending order. */}
                    <button onClick={() => this.toggleMoves()}>
                        Sort {this.state.isAscending ? 'descending' : 'ascending'}
                    </button>
                    <MovesHistory
                        isAscending={this.state.isAscending}
                        moves={moves}
                    />
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

// ========================================

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
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}


// ========================================

/* 
    Extra idea 1: 
    Display the location for each move in the format (col, row) in the move history list.
    -- Added location (square number) to history state
    -- Calculating (col, row) in Game render method

    Extra idea 2:
    Bold the currently selected item in the move list. 
    -- Added class current in css with font-weight bold
    -- Added className current to the list item with the same index as stepNumber

    Extra idea 3:
    Rewrite Board to use two loops to make the squares instead of hardcoding them.
    -- Rendering squares with two loops in Board render method 
    -- Added key property to Square 

    Extra idea 4:
    Add a toggle button that lets you sort the moves in either ascending or descending order.
    -- Added toggle button in Game render method
    -- Implemented function to toggle the added state isAscending 
    -- Created a MovesHistory functional component to toggle moves order 
*/

// ==============================================
//   https://reactjs.org/tutorial/tutorial.html 
// ==============================================