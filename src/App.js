import React, { useState } from 'react';
import './App.css';
import SlidingPuzzleGame from './SlidingPuzzleGame';
import QuizGame from './QuizGame';
import ErrorBoundary from './ErrorBoundary';

function App() {
  const [points, setPoints] = useState(0);
  const [selectedGame, setSelectedGame] = useState('puzzle');

  const updatePoints = (earnedPoints) => {
    setPoints((prevPoints) => prevPoints + earnedPoints);
  };

  const renderGame = () => {
    switch (selectedGame) {
      case 'puzzle':
        return <SlidingPuzzleGame key="puzzle" updatePoints={updatePoints} />;
      case 'quiz':
        return <QuizGame key="quiz" updatePoints={updatePoints} />;
      default:
        return null;
    }
  };

  return (
    <ErrorBoundary>
      <div className="App">
        <div className="game-container">
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
          <div className="points-display">Current Points: {points}</div>
          {renderGame()}
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;
