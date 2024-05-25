import React, { useState, useEffect, useRef } from 'react';
import './SlidingPuzzleGame.css';

const imageFiles = [
  'image.png',
  'image1.jpg',
  'image2.jpg'
  // Add more images as needed
  //https://www.adobe.com/express/feature/image/resize to resize, square 1:1 for best result.
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
  const [gridSize, setGridSize] = useState(3); // Default grid size
  const [tiles, setTiles] = useState([]); // State for the tiles
  const [selectedTileIndex, setSelectedTileIndex] = useState(null); // State for the selected tile index
  const [emptyTileIndex, setEmptyTileIndex] = useState(null); // State for the empty tile index
  const [points, setPoints] = useState(0); // State for the points
  const [imageSrc, setImageSrc] = useState(getRandomImage()); // State for the image source
  const [showFullImage, setShowFullImage] = useState(false); // State for showing the full image
  const [showPopup, setShowPopup] = useState(false); // State for showing the popup
  const savedTiles = useRef([]); // Ref to save the tiles

  useEffect(() => {
    initializeBoard();
  }, [gridSize, imageSrc]);

  const initializeBoard = () => {
    const newTiles = [];
    const tileCount = gridSize * gridSize - 1;
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

  const getTileSize = () => {
    const isMobile = window.innerWidth <= 600;
    const boardSize = isMobile ? window.innerWidth * 0.9 : 400;
    return boardSize / gridSize;
  };

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
    const emptyTile = shuffledTiles.find((tile) => tile.empty);
    setEmptyTileIndex(emptyTile.index);
  };

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

  const onTileClick = (index) => {
    if (tiles[index].empty) {
      if (selectedTileIndex !== null) {
        const selectedRow = Math.floor(selectedTileIndex / gridSize);
        const selectedCol = selectedTileIndex % gridSize;
        const emptyRow = Math.floor(index / gridSize);
        const emptyCol = index % gridSize;

        if (
          (selectedRow === emptyRow && Math.abs(selectedCol - emptyCol) === 1) ||
          (selectedCol === emptyCol && Math.abs(selectedRow - emptyRow) === 1)
        ) {
          const newTiles = [...tiles];
          [newTiles[selectedTileIndex], newTiles[index]] = [
            newTiles[index],
            newTiles[selectedTileIndex],
          ];
          setTiles(newTiles);
          setEmptyTileIndex(selectedTileIndex);
          setSelectedTileIndex(null);

          if (isSolved(newTiles)) {
            const earnedPoints = pointsMap[gridSize];
            setPoints(points + earnedPoints);
            updatePoints(earnedPoints); // Update points in the parent component
            setShowPopup(true); // Show the popup when puzzle is solved
          }
        } else {
          setSelectedTileIndex(null); // If the move is invalid, deselect the tile
        }
      }
    } else {
      setSelectedTileIndex(index);
    }
  };

  const isSolved = (tiles) => {
    return tiles.slice(0, tiles.length - 1).every((tile, i) => tile.index === i);
  };

  const showFullImageTemporarily = () => {
    setShowFullImage(true);
    setTimeout(() => {
      setShowFullImage(false);
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
            width: '100%',
            maxWidth: '400px',
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
                className={`tile ${tile.empty ? 'empty' : ''} ${index === selectedTileIndex ? 'selected' : ''}`}
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
          <option value={3}>3x3</option>
          <option value={4}>4x4</option>
          <option value={5}>5x5</option>
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
