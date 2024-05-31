import React, { useState, useEffect, useRef } from 'react';
import './SlidingPuzzleGame.css';

const imageFiles = [
  'image.png',
  // Add more images as needed
];

const pointsMap = {
  6: 600,
  7: 900,
  8: 1200,
};

const getRandomImage = () => {
  const randomIndex = Math.floor(Math.random() * imageFiles.length);
  return imageFiles[randomIndex];
};

const SlidingPuzzleGame = ({ updatePoints }) => {
  const [gridSize, setGridSize] = useState(6);
  const [tiles, setTiles] = useState([]);
  const [selectedTileIndex, setSelectedTileIndex] = useState(null);
  const [points, setPoints] = useState(0);
  const [imageSrc, setImageSrc] = useState(getRandomImage());
  const [showFullImage, setShowFullImage] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [highlightedTiles, setHighlightedTiles] = useState([]); // State to track highlighted tiles
  const gameBoardRef = useRef(null);

  useEffect(() => {
    initializeBoard();

    return () => {
      setTiles([]);
      setSelectedTileIndex(null);
      setShowPopup(false);
    };
  }, [gridSize, imageSrc]);

  const initializeBoard = () => {
    const newTiles = [];
    const tileCount = gridSize * gridSize;
    const tileSize = getTileSize();
    const imageWidth = tileSize * gridSize;
    const imageHeight = tileSize * gridSize;

    for (let i = 0; i < tileCount; i++) {
      const x = (i % gridSize) * tileSize;
      const y = Math.floor(i / gridSize) * tileSize;
      newTiles.push({
        index: i,
        style: {
          backgroundImage: `url(${imageSrc})`,
          backgroundSize: `${imageWidth}px ${imageHeight}px`,
          backgroundPosition: `-${x}px -${y}px`,
          width: `${tileSize}px`,
          height: `${tileSize}px`,
        },
      });
    }
    shuffleBoard(newTiles);
  };

  const getTileSize = () => {
    const isMobile = window.innerWidth <= 600;
    const boardSize = isMobile ? window.innerWidth * 0.9 : 400;
    return Math.floor(boardSize / gridSize);
  };

  const shuffleBoard = (newTiles) => {
    let shuffledTiles;
    do {
      shuffledTiles = [...newTiles];
      for (let i = shuffledTiles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledTiles[i], shuffledTiles[j]] = [shuffledTiles[j], shuffledTiles[i]];
      }
    } while (isSolved(shuffledTiles));

    setTiles(shuffledTiles);
    setHighlightedTiles([]); // Clear highlighted tiles
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
        updatePoints(earnedPoints);
        setShowPopup(true);
        setImageSrc(getRandomImage());
        initializeBoard();
      } else {
        highlightCorrectTiles(newTiles);
      }
    }
  };

  const isSolved = (tiles) => {
    return tiles.every((tile, i) => tile.index === i);
  };

  const highlightCorrectTiles = (tiles) => {
    const newHighlightedTiles = tiles.map((tile, index) => tile.index === index);
    setHighlightedTiles(newHighlightedTiles);

    setTimeout(() => {
      setHighlightedTiles([]);
    }, 5000);
  };

  const showFullImageTemporarily = () => {
    setShowFullImage(true);
    if (gameBoardRef.current) {
      gameBoardRef.current.style.width = '90%';
    }
    setTimeout(() => {
      setShowFullImage(false);
      if (gameBoardRef.current) {
        gameBoardRef.current.style.width = 'max-content';
      }
    }, 3000);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="container">
      <h1>Sliding Puzzle Game</h1>
      <div className="game-box">
        <div
          ref={gameBoardRef}
          className="game-board"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            width: 'max-content',
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
                className={`tile ${index === selectedTileIndex ? 'selected' : ''} ${highlightedTiles[index] ? 'correct' : ''}`}
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
          <option value={6}>6x6</option>
          <option value={7}>7x7</option>
          <option value={8}>8x8</option>
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
