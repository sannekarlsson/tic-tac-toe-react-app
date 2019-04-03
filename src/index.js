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

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
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
            }],
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

    render() {
        // Every time state is updated, this will be called
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        // map((object w/ squares array, index)) 
        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            return (
                // Move index can be used as key, since the list items wont be re-ordered, deleted or inserted in the middle
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>
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
                    <ol>{moves}</ol>
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

// ==============================================
//   https://reactjs.org/tutorial/tutorial.html 
// ==============================================