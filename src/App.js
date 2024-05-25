import React, { useState } from 'react';
import './App.css';
import SlidingPuzzleGame from './SlidingPuzzleGame';
import QuizGame from './QuizGame';

function App() {
  const [points, setPoints] = useState(0);
  const [selectedGame, setSelectedGame] = useState('puzzle'); // Default to 'puzzle'

  // Function to update points
  const updatePoints = (earnedPoints) => {
    setPoints((prevPoints) => prevPoints + earnedPoints);
  };

  // Function to render the selected game component
  const renderGame = () => {
    switch (selectedGame) {
      case 'puzzle':
        return <SlidingPuzzleGame updatePoints={updatePoints} />;
      case 'quiz':
        return <QuizGame updatePoints={updatePoints} />;
      default:
        return null;
    }
  };

  return (
    <div className="App">
      <div className="game-container">
        {/* Game selection buttons */}
        <div className="game-selection">
          {['puzzle', 'quiz'].map((game) => (
            <span
              key={game}
              onClick={() => setSelectedGame(game)}
              className={selectedGame === game ? 'active' : ''}
            >
              {game === 'puzzle' ? 'Sliding Puzzle Game' : 'Quiz Game'}
            </span>
          ))}
        </div>
        {/* Display current points */}
        <div className="points-display">Current Points: {points}</div>
        {/* Render the selected game */}
        {renderGame()}
      </div>
    </div>
  );
}

export default App;
