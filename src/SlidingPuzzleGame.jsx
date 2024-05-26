import React, { useState, useEffect, useRef } from 'react';
import './SlidingPuzzleGame.css';

const imageFiles = [
  'image.png',
  
  // Add more images as needed
];

const pointsMap = {
  3: 500,
  4: 800,
  5: 1200,
};

const getRandomImage = () => {
  const randomIndex = Math.floor(Math.random() * imageFiles.length);
  return imageFiles[randomIndex];
};

const SlidingPuzzleGame = ({ updatePoints }) => {
  const [gridSize, setGridSize] = useState(4); // Default grid size
  const [tiles, setTiles] = useState([]); // State for the tiles
  const [selectedTileIndex, setSelectedTileIndex] = useState(null); // State for the selected tile index
  const [points, setPoints] = useState(0); // State for the points
  const [imageSrc, setImageSrc] = useState(getRandomImage()); // State for the image source
  const [showFullImage, setShowFullImage] = useState(false); // State for showing the full image
  const [showPopup, setShowPopup] = useState(false); // State for showing the popup

  useEffect(() => {
    initializeBoard();
  }, [gridSize, imageSrc]);

  const initializeBoard = () => {
    const newTiles = [];
    const tileCount = gridSize * gridSize;
    const tileSize = getTileSize();
    for (let i = 0; i < tileCount; i++) {
      newTiles.push({
        index: i,
        style: {
          backgroundImage: `url(${imageSrc})`,
          backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
          backgroundPosition: `${(i % gridSize) * (100 / (gridSize - 1))}% ${(Math.floor(i / gridSize) * (100 / (gridSize - 1)))}%`,
          width: `${tileSize}px`,
          height: `${tileSize}px`,
        },
      });
    }
    shuffleBoard(newTiles); // Shuffle the tiles after initialization
  };

  const getTileSize = () => {
    const isMobile = window.innerWidth <= 600;
    const boardSize = isMobile ? window.innerWidth * 0.7 : 400;
    return (boardSize / gridSize);
  };

  const shuffleBoard = (newTiles) => {
    let shuffledTiles;
    do {
      shuffledTiles = [...newTiles];
      for (let i = shuffledTiles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledTiles[i], shuffledTiles[j]] = [shuffledTiles[j], shuffledTiles[i]];
      }
    } while (isSolved(shuffledTiles)); // Ensure the puzzle is not already solved

    setTiles(shuffledTiles);
  };

  const onTileClick = (index) => {
    if (selectedTileIndex === null) {
      setSelectedTileIndex(index);
    } else {
      const newTiles = [...tiles];
      [newTiles[selectedTileIndex], newTiles[index]] = [newTiles[index], newTiles[selectedTileIndex]];
      setTiles(newTiles);
      setSelectedTileIndex(null);

      if (isSolved(newTiles)) {
        const earnedPoints = pointsMap[gridSize];
        setPoints(points + earnedPoints);
        updatePoints(earnedPoints); // Update points in the parent component
        setShowPopup(true); // Show the popup when puzzle is solved
      }
    }
  };

  const isSolved = (tiles) => {
    return tiles.every((tile, i) => tile.index === i);
  };

  const showFullImageTemporarily = () => {
    setShowFullImage(true);
    document.getElementById('gameBoard').style.width = '85%';
     setTimeout(() => {
       setShowFullImage(false);
       document.getElementById('gameBoard').style.width = 'max-content';
     }, 3000); // Show full image for 3 seconds
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="container">
      <h1>Sliding Puzzle Game</h1>
      <div className="game-box">
        <div
          id="gameBoard"
          className="game-board"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            width:'max-content',
            // maxWidth: '406px',
            height: 'auto',
            aspectRatio: '1',
          }}
        >
          {showFullImage ? (
            <div className="full-image-wrapper">
              <div className="full-image" style={{ backgroundImage: `url(${imageSrc})` }}></div>
            </div>
          ) : (
            tiles.map((tile, index) => (
              <div
                key={index}
                className={`tile ${index === selectedTileIndex ? 'selected' : ''}`}
                style={tile.style}
                onClick={() => onTileClick(index)}
              ></div>
            ))
           
          )}
        </div>
      </div>
      <div className="controls">
        <label htmlFor="grid-size-selector">Select Grid Size:</label>
        <select
          id="grid-size-selector"
          value={gridSize}
          onChange={(e) => {
            setGridSize(parseInt(e.target.value));
            setImageSrc(getRandomImage());
          }}
        >
          <option value={4}>4x4</option>
          <option value={5}>5x5</option>
          <option value={6}>6x6</option>
        </select>
        <button id="shuffleButton" onClick={initializeBoard}>Shuffle</button>
        <button id="showImageButton" onClick={showFullImageTemporarily}>Show Image</button>
      </div>
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>Congratulations!</h2>
            <p>You have solved the puzzle. Your current points are {points}!</p>
            <button onClick={closePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SlidingPuzzleGame;