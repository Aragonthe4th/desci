import React, { useState } from 'react';
import './App.css';
import SlidingPuzzleGame from './SlidingPuzzleGame';
import QuizGame from './QuizGame'; // Assume you have a QuizGame component

function App() {
  const [points, setPoints] = useState(0);
  const [selectedGame, setSelectedGame] = useState('puzzle'); // Default to 'puzzle'

  const updatePoints = (earnedPoints) => {
    setPoints(points + earnedPoints);
  };

  const renderGame = () => {
    if (selectedGame === 'puzzle') {
      return <SlidingPuzzleGame updatePoints={updatePoints} />;
    } else if (selectedGame === 'quiz') {
      return <QuizGame updatePoints={updatePoints} />;
    }
  };

  return (
    <div className="App">
      <h1>Hello</h1>
      <div className="game-container">
        <div className="game-selection">
          <span 
            onClick={() => setSelectedGame('puzzle')} 
            className={selectedGame === 'puzzle' ? 'active' : ''}
          >
            Sliding Puzzle Game
          </span>
          <span 
            onClick={() => setSelectedGame('quiz')} 
            className={selectedGame === 'quiz' ? 'active' : ''}
          >
            Quiz Game
          </span>
        </div>
        {renderGame()}
      </div>
      <div>Current Points: {points}</div>
    </div>
  );
}

export default App;
