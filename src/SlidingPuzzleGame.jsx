import React, { useState, useEffect } from 'react';
import './SlidingPuzzleGame.css';

// Array to store the file paths of the images used in the puzzle
const imageFiles = [
  'image.png',
  'image2.jpg'
  // Add more images as needed
];

// Map to store the points corresponding to different grid sizes
const pointsMap = {
  4: 500,
  5: 800,
  6: 1200,
};

// Function to randomly select an image from the imageFiles array
const getRandomImage = () => imageFiles[Math.floor(Math.random() * imageFiles.length)];

const SlidingPuzzleGame = ({ updatePoints }) => {
  // State to store the current grid size
  const [gridSize, setGridSize] = useState(4);
  // State to store the tiles of the puzzle
  const [tiles, setTiles] = useState([]);
  // State to store the index of the currently selected tile
  const [selectedTileIndex, setSelectedTileIndex] = useState(null);
  // State to store the total points accumulated by the user
  const [points, setPoints] = useState(0);
  // State to store the source of the current image used in the puzzle
  const [imageSrc, setImageSrc] = useState(getRandomImage());
  // State to control the visibility of the full image preview
  const [showFullImage, setShowFullImage] = useState(false);
  // State to control the visibility of the popup when the puzzle is solved
  const [showPopup, setShowPopup] = useState(false);

  // Effect to initialize the board when the grid size or image source changes
  useEffect(() => {
    initializeBoard();
  }, [gridSize, imageSrc]);

  // Function to initialize the puzzle board
  const initializeBoard = () => {
    // Create an array of tiles based on the grid size
    const newTiles = Array.from({ length: gridSize * gridSize }, (_, i) => ({
      index: i,
      style: {
        backgroundImage: `url(${imageSrc})`,
        backgroundSize: `${gridSize * 100}%`,
        backgroundPosition: `${(i % gridSize) * (100 / (gridSize - 1))}% ${(Math.floor(i / gridSize) * (100 / (gridSize - 1)))}%`,
        width: `${getTileSize()}px`,
        height: `${getTileSize()}px`,
      },
    }));
    // Shuffle the tiles
    shuffleBoard(newTiles);
  };

  // Function to get the size of each tile based on the window width and grid size
  const getTileSize = () => (window.innerWidth <= 600 ? window.innerWidth * 0.9 : 400) / gridSize;

  // Function to shuffle the tiles on the board
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
  };

  // Function to handle the tile click event
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
      }
    }
  };

  // Function to check if the puzzle is solved
  const isSolved = (tiles) => tiles.every((tile, i) => tile.index === i);

  // Function to show the full image for a short duration
  const showFullImageTemporarily = () => {
    setShowFullImage(true);
    setTimeout(() => setShowFullImage(false), 3000);
  };

  // Function to close the popup and reshuffle the puzzle with a new random image
  const closePopupAndReshuffle = () => {
    setShowPopup(false);
    setImageSrc(getRandomImage());
  };
  // for the love of all holy dont touch this ever.
  const mediaquery = window.matchMedia ('(min-width: 600px)');
  const maxWidth = (mediaquery.matches) ? '406px': '350px';
  // console.log (mediaquery.matches);
  return (
    <div className="container">
      <h1>Picture Swap Puzzle</h1>
      <div className="game-box">
        <div
          id="gameBoard"
          className="game-board"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            maxWidth: maxWidth,
            height:'auto',
            
          }}
        >
          {showFullImage ? (
            <img src={imageSrc} alt="Full Image" className="full-image" />
          ) : (
            tiles.map((tile, index) => (
              <div
                key={index}
                className={`tile ${index === selectedTileIndex ? 'selected' : ''}`}
                style={tile.style}
                onClick={() => onTileClick(index)}
              />
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
            <button onClick={closePopupAndReshuffle}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SlidingPuzzleGame;
