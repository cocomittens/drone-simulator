import "./styles.css";

import { useState, useEffect } from "react";

// todo: clean up later
// fix rendering issue
export default function App() {
  const [dronePosition, setDronePosition] = useState([1, 1]);
  const [droneDirection, setDroneDirection] = useState("n");
  const [destination, setDestination] = useState(null);
  const [gridDimensions, setGridDimensions] = useState([8, 8]);
  const [controlCodes, setControlCodes] = useState("");
  const [originalPosition, setOriginalPosition] = useState(null);
  const [isMoving, setIsMoving] = useState(false);
  const [windDisabled, setWindDisabled] = useState(true);
  const [treeProbability, setTreeProbability] = useState(0.1);
  const [droneGrid, setDroneGrid] = useState(null);
  const [battery, setBattery] = useState(100);
  const [capacity, setCapacity] = useState(100);
  const [mode, setMode] = useState("d");

  const directions = ["w", "n", "e", "s"];

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  function generateGrid() {
    const result = [];
    const squares = [];
    for (let i = 0; i < gridDimensions[0]; i++) {
      result.push([]);
      for (let j = 0; j < gridDimensions[1]; j++) {
        const isDronePosition =
          dronePosition[0] === i && dronePosition[1] === j;
        if (!isDronePosition && Math.random() <= treeProbability) {
          result[i].push("t");
        } else {
          result[i].push(null);
          squares.push([i, j]);
        }
      }
    }
    setDroneGrid(result);
    return { grid: result, squares };
  }

  const renderGrid = () => {
    const [rows, cols] = gridDimensions;

    if (droneGrid) {
      return droneGrid.map((row, rowIndex) => {
        return row.map((col, colIndex) => {
          if (dronePosition[0] === rowIndex && dronePosition[1] === colIndex) {
            return (
              <div key={`${rowIndex}-${colIndex}`}>
                <span id="drone"> {droneDirection}</span>
              </div>
            );
          } else if (
            destination &&
            destination[0] === rowIndex &&
            destination[1] === colIndex
          ) {
            return (
              <div key={`${rowIndex}-${colIndex}`} style={{ color: "red" }}>
                d
              </div>
            );
          } else if (
            originalPosition &&
            originalPosition[0] === rowIndex &&
            originalPosition[1] === colIndex
          ) {
            return (
              <div key={`${rowIndex}-${colIndex}`} style={{ color: "orange" }}>
                o
              </div>
            );
          } else if (droneGrid[rowIndex][colIndex] === "t") {
            return (
              <div key={`${rowIndex}-${colIndex}`} style={{ color: "green" }}>
                t
              </div>
            );
          } else {
            return <div key={`${rowIndex}-${colIndex}`}>x</div>;
          }
        });
      });
    } else {
      return Array.from({ length: rows }, (row, rowIndex) => {
        return Array.from({ length: cols }, (col, colIndex) => {
          if (dronePosition[0] === rowIndex && dronePosition[1] === colIndex) {
            return (
              <div key={`${rowIndex}-${colIndex}`}>
                <span id="drone"> {droneDirection}</span>
              </div>
            );
          } else {
            return <div key={`${rowIndex}-${colIndex}`}>x</div>;
          }
        });
      });
    }
  };

  // Return if valid position on grid
  function isValid(position, grid) {
    const [row, col] = position;
    const [rows, cols] = gridDimensions;

    return (
      row >= 0 &&
      row < rows &&
      col >= 0 &&
      col < cols &&
      grid[row][col] === null
    );
  }

  // Reset to original position
  function resetGrid() {
    setDronePosition(originalPosition);
  }

  // Calculate new coordinates of drone after potential movement in specified direction
  const calculateMovement = (prevPosition) => {
    const change = {
      n: [-1, 0],
      s: [1, 0],
      e: [0, 1],
      w: [0, -1],
    };

    const [prevRow, prevCol, newDirection] = prevPosition;

    const rowOffset = change[newDirection][0];
    const colOffset = change[newDirection][1];
    const newRow = prevRow + rowOffset;
    const newCol = prevCol + colOffset;

    const newPosition = [newRow, newCol, newDirection];

    return newPosition;
  };

  // Use bfs to find the shortest path from current position to destiniation
  // Returns list of coordinates
  function calculateShortestPath(curr, dest, grid) {
    const queue = [curr];
    const visited = new Set();
    const parent = new Map();
    const result = [];
    while (queue.length) {
      const [row, col] = queue.shift();
      if (row === dest[0] && col === dest[1]) {
        let key = `${row}-${col}`;
        while (parent.has(key)) {
          const [newRow, newCol, direction] = parent.get(key);
          result.unshift(direction);
          key = `${newRow}-${newCol}`;
        }

        return result;
      }

      if (visited.has(`${row}-${col}`)) {
        continue;
      }

      visited.add(`${row}-${col}`);

      for (const direction of directions) {
        const [newRow, newCol] = calculateMovement([row, col, direction]);
        if (
          isValid([newRow, newCol], grid) &&
          !visited.has(`${newRow}-${newCol}`)
        ) {
          parent.set(`${newRow}-${newCol}`, [row, col, direction]);
          queue.push([newRow, newCol]);
        }
      }
    }
    return null;
  }

  // Generate control string from list of coordinates
  function generateControlString(directions) {
    let result = directions[0];
    let last = directions[0];
    for (const direction of directions) {
      if (direction !== last) {
        result += direction;
        last = direction;
      }
      result += "f";
    }
    return result;
  }

  // Move drone one unit in the current direction
  function moveDrone(newPosition, grid) {
    const [row, col] = newPosition;
    if (isValid([row, col], grid)) {
      setDronePosition(newPosition);
    } else {
      if (!windDisabled) {
        alert("OH NO!");
        resetGrid();
      } else {
        alert("Cannot move forward");
      }
    }
  }

  // Move drone through specified list of control codes
  async function executeControlCodes(
    startPosition,
    controlString,
    grid,
    initialCharge
  ) {
    setIsMoving(true);
    const codes = controlString.split("");
    let currDirection = controlString[0];
    let currRow = startPosition[0];
    let currCol = startPosition[1];
    let currCharge = initialCharge;
    for (const code of codes) {
      currCharge = calculateBattery(currCharge, code);
      setBattery(currCharge);
      if (code === "f") {
        const newLocation = calculateMovement([
          currRow,
          currCol,
          currDirection,
        ]);
        currRow = newLocation[0];
        currCol = newLocation[1];
        moveDrone(newLocation, grid);
      } else {
        currDirection = code;
        setDroneDirection(code);
      }
      await sleep(1000);
    }
    setIsMoving(false);
    return currCharge;
  }

  // Deliver drone from start to end point
  async function deliver(start, end, grid, charge) {
    const path = calculateShortestPath(start, end, grid);
    const pathString = generateControlString(path);
    setControlCodes(pathString);
    return await executeControlCodes(start, pathString, grid, charge);
  }

  // Generate random destination within the grid and execute delivery
  async function executeDelivery() {
    const origin = dronePosition;
    const { grid, squares } = generateGrid();
    const randomIndex = Math.floor(Math.random() * squares.length);
    const dest = squares[randomIndex];
    setDestination(dest);

    const currCharge = await deliver(origin, dest, grid, battery);
    await deliver(dest, origin, grid, currCharge);
  }

  // Calculate total cost of delivery
  function calculateDeliveryCost(codes) {
    let sum = 0;
    for (const code of codes) {
      if (code === "f") {
        sum += 1;
      } else {
        sum += 0.5;
      }
    }
    return sum;
  }

  function canDeliver(codes) {
    const deliveryCost = calculateDeliveryCost(codes);
    return battery - deliveryCost >= 0;
  }

  // Calculate new charge after next move
  function calculateBattery(charge, code) {
    if (code === "f") {
      charge = charge - 1;
    } else {
      charge = charge - 0.5;
    }

    const result = (charge / capacity) * 100;
    return result;
  }

  // Wind
  function blowWind(startPosition, direction) {
    // calculate random direction
    const randomIndex = Math.floor(Math.random() * directions.length);
    const randomDirection = directions[randomIndex];
    const newPosition = [startPosition[0], startPosition[1], direction];
    const newLocation = calculateMovement(newPosition);
    moveDrone(newLocation, randomDirection);
  }

  useEffect(() => {
    let windId;
    if (droneGrid && !windDisabled && isMoving) {
      const startWind = () => {
        const windInterval = Math.floor(Math.random() * 10);
        windId = setTimeout(blowWind, windInterval * 1000);
      };

      startWind(dronePosition, droneDirection);
    } else {
      clearTimeout(windId);
    }
  }, [isMoving, droneGrid, windDisabled]);

  return (
    <div className="App">
      <h1>Drone Simulator</h1>
      <div id="options-container">
        <h2>Grid Options</h2>

        <div id="options">
          <div class="directionLocation">
            <div class="inputForm">
              <h3>Dimensions</h3>
              <div class="parameters">
                <div class="directionLocation">
                  <label>
                    <p>Rows: </p>
                    <input
                      disabled={isMoving}
                      type="number"
                      value={gridDimensions[0]}
                      onChange={(e) => {
                        if (e.target.value > 0) {
                          setGridDimensions([
                            e.target.value,
                            gridDimensions[1],
                          ]);
                        }
                      }}
                    />
                  </label>
                  <label>
                    <p>Cols: </p>
                    <input
                      disabled={isMoving}
                      type="number"
                      value={gridDimensions[1]}
                      onChange={(e) => {
                        if (e.target.value > 0) {
                          setGridDimensions([
                            gridDimensions[0],
                            e.target.value,
                          ]);
                        }
                      }}
                    />
                  </label>
                </div>
                <label>
                  <p>Tree Probability: </p>
                  <input
                    disabled={isMoving}
                    type="number"
                    value={treeProbability}
                    onChange={(e) => {
                      if (e.target.value > 0 && e.target.value <= 1) {
                        setTreeProbability(e.target.value);
                      }
                    }}
                  />
                </label>
              </div>
            </div>
            <div class="inputForm">
              <h3>Initial Location</h3>
              <div class="parameters">
                <div class="directionLocation">
                  <label>
                    <p>Row: </p>
                    <input
                      disabled={isMoving}
                      type="number"
                      value={String(dronePosition[0])}
                      onChange={(e) => {
                        if (
                          e.target.value >= 0 &&
                          e.target.value < gridDimensions[0]
                        ) {
                          setDronePosition([
                            Number(e.target.value),
                            dronePosition[1],
                          ]);
                        }
                      }}
                    />
                  </label>
                  <label>
                    <p>Col: </p>
                    <input
                      disabled={isMoving}
                      type="number"
                      value={String(dronePosition[1])}
                      onChange={(e) => {
                        if (
                          e.target.value >= 0 &&
                          e.target.value < gridDimensions[1]
                        ) {
                          setDronePosition([
                            dronePosition[0],
                            Number(e.target.value),
                          ]);
                        }
                      }}
                    />
                  </label>
                </div>
                <label>
                  <p>Direction: </p>
                  {directions.map((direction) => {
                    return (
                      <input
                        disabled={isMoving}
                        type="button"
                        key={direction}
                        className={`directionButton ${
                          (!originalPosition && droneDirection === direction) ||
                          (originalPosition &&
                            originalPosition[2] === direction)
                            ? "active"
                            : "inactive"
                        }`}
                        onClick={() => {
                          setDroneDirection(direction);
                        }}
                        value={direction}
                      ></input>
                    );
                  })}
                </label>
              </div>
            </div>
            <div class="inputForm">
              <h3>Control Codes</h3>
              <div class="parameters" id="controls">
                <button
                  onClick={() => {
                    setMode("m");
                  }}
                  disabled={isMoving}
                >
                  <span>Manual</span>
                </button>
                <button
                  onClick={() => {
                    setMode("d");
                  }}
                  disabled={isMoving}
                >
                  <span>Delivery</span>
                </button>
                <label>
                  <p>Control codes: </p>
                  <input
                    disabled={isMoving || mode === "d"}
                    type="text"
                    value={controlCodes}
                    onChange={(e) => {
                      setControlCodes(e.target.value);
                    }}
                  />
                </label>
                <label>
                  <p>Disable wind? </p>
                  <input
                    disabled={isMoving || mode === "d"}
                    type="checkbox"
                    checked={windDisabled}
                    onClick={() => setWindDisabled(!windDisabled)}
                  />
                </label>
              </div>
            </div>
          </div>

          <button
            onClick={async () => {
              setOriginalPosition(dronePosition);
              await executeDelivery();
            }}
            disabled={isMoving}
          >
            <span>{mode === "d" ? "Delivery" : "Execute"}</span>
          </button>
        </div>
      </div>
      <div id="battery">{battery}%</div>
      <div id="grid-container">
        <div
          id="grid"
          style={{
            gridTemplateColumns: `repeat(${gridDimensions[1]}, 1fr)`,
            gridTemplateRows: `repeat(${gridDimensions[0]}, 1fr)`,
          }}
        >
          {renderGrid()}
        </div>
      </div>
    </div>
  );
}
