import React, { useState, useEffect, useRef } from 'react';
import './SlidingPuzzleGame.css';

// Array of image files used for the puzzle
const imageFiles = [
  'image.png'
  // Add more images as needed
];

// Points map based on grid size
const pointsMap = {
  3: 500,
  4: 800,
  5: 1200,
};

// Function to get a random image from the array
const getRandomImage = () => {
  const randomIndex = Math.floor(Math.random() * imageFiles.length);
  return imageFiles[randomIndex];
};

const SlidingPuzzleGame = ({ updatePoints }) => {
  const [gridSize, setGridSize] = useState(3);
  const [tiles, setTiles] = useState([]);
  const [selectedTileIndex, setSelectedTileIndex] = useState(null);
  const [emptyTileIndex, setEmptyTileIndex] = useState(null);
  const [points, setPoints] = useState(0);
  const [imageSrc, setImageSrc] = useState(getRandomImage());
  const [showFullImage, setShowFullImage] = useState(false);
  const savedTiles = useRef([]);

  // Reinitialize board whenever gridSize or imageSrc changes
  useEffect(() => {
    initializeBoard();
  }, [gridSize, imageSrc]);

  // Initialize the board with tiles and one empty space
  const initializeBoard = () => {
    const newTiles = [];
    const tileCount = gridSize * gridSize - 1;
    const tileSize = 400 / gridSize;
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
    newTiles.push({
      index: tileCount,
      empty: true,
      style: {
        width: `${tileSize}px`,
        height: `${tileSize}px`,
        backgroundColor: 'white',
      },
    });

    shuffleBoard(newTiles); // Shuffle the tiles after initialization
  };

  // Shuffle the tiles to create the puzzle
  const shuffleBoard = (newTiles) => {
    let shuffledTiles;
    do {
      shuffledTiles = [...newTiles];
      for (let i = shuffledTiles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledTiles[i], shuffledTiles[j]] = [shuffledTiles[j], shuffledTiles[i]];
      }
    } while (!isSolvable(shuffledTiles) || isSolved(shuffledTiles)); // Ensure the puzzle is solvable and not already solved

    setTiles(shuffledTiles);
    const emptyTile = shuffledTiles.find(tile => tile.empty);
    setEmptyTileIndex(emptyTile.index);
  };

  // Check if the puzzle is solvable
  const isSolvable = (tiles) => {
    const inversionCount = tiles.reduce((count, tile, i) => {
      if (tile.empty) return count;
      return count + tiles.slice(i + 1).reduce((innerCount, innerTile) => {
        if (!innerTile.empty && innerTile.index < tile.index) {
          return innerCount + 1;
        }
        return innerCount;
      }, 0);
    }, 0);
    return inversionCount % 2 === 0;
  };

  // Handle tile click events
  const onTileClick = (index) => {
    if (tiles[index].empty) {
      // If the selected tile is empty and a tile is already selected, move the selected tile to the empty spot
      if (selectedTileIndex !== null) {
        const selectedRow = Math.floor(selectedTileIndex / gridSize);
        const selectedCol = selectedTileIndex % gridSize;
        const emptyRow = Math.floor(index / gridSize);
        const emptyCol = index % gridSize;

        if ((selectedRow === emptyRow && Math.abs(selectedCol - emptyCol) === 1) ||
            (selectedCol === emptyCol && Math.abs(selectedRow - emptyRow) === 1)) {
          const newTiles = [...tiles];
          [newTiles[selectedTileIndex], newTiles[index]] = [newTiles[index], newTiles[selectedTileIndex]];
          setTiles(newTiles);
          setEmptyTileIndex(selectedTileIndex);
          setSelectedTileIndex(null);

          if (isSolved(newTiles)) {
            const earnedPoints = pointsMap[gridSize];
            setPoints(points + earnedPoints);
            updatePoints(earnedPoints); // Update points in the parent component
            alert(`Puzzle Solved! You earned ${earnedPoints} points!`);
          }
        } else {
          setSelectedTileIndex(null); // If the move is invalid, deselect the tile
        }
      }
    } else {
      // If the selected tile is not empty, select it
      setSelectedTileIndex(index);
    }
  };

  // Check if the puzzle is solved
  const isSolved = (tiles) => {
    return tiles.slice(0, tiles.length - 1).every((tile, i) => tile.index === i);
  };

  // Show full image temporarily
  const showFullImageTemporarily = () => {
    savedTiles.current = tiles;
    setShowFullImage(true);
    setTimeout(() => {
      setShowFullImage(false);
      setTiles(savedTiles.current);
    }, 3000); // Show full image for 3 seconds
  };

  // Render tiles or full image
  const renderTiles = () => {
    if (showFullImage) {
      return (
        <div className="full-image-wrapper">
          <div className="full-image" style={{ backgroundImage: `url(${imageSrc})` }}></div>
        </div>
      );
    } else {
      return tiles.map((tile, index) => (
        <div
          key={index}
          className={`tile ${tile.empty ? 'empty' : ''} ${index === selectedTileIndex ? 'selected' : ''}`}
          style={tile.style}
          onClick={() => onTileClick(index)}
        ></div>
      ));
    }
  };

  return (
    <div className="container">
      <h1>Sliding Puzzle Game</h1>
      <div id="gameBoard" className="game-board" style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}>
        {renderTiles()}
      </div>
      <div id="pointsDisplay">Points: {points}</div>
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
          <option value={3}>3x3</option>
          <option value={4}>4x4</option>
          <option value={5}>5x5</option>
        </select>
        <button id="shuffleButton" onClick={() => shuffleBoard(tiles)}>Shuffle</button>
        <button id="showImageButton" onClick={showFullImageTemporarily}>Show Image</button>
      </div>
    </div>
  );
};

export default SlidingPuzzleGame;
