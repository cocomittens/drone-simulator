import "./styles.css";
import { DIRECTIONS } from "./constants.ts";

import { useState, useEffect } from "react";
import { Options } from "./components/Options.tsx";
import {
  generateControlString,
  calculateMovement,
  sleep,
  calculateDeliveryCost,
  calculateBattery,
  canDeliver,
  calculateShortestPath,
  isValid,
} from "./util/util.js";

// todo: clean up later
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

  // Reset to original position
  function resetGrid() {
    setIsMoving(false);
    setDronePosition(originalPosition);
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
      currCharge = calculateBattery(currCharge, code, capacity);
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

  // Wind
  // Currently broken due to new features
  // Todo: fix
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
        <Options
          gridDimensions={gridDimensions}
          treeProbability={treeProbability}
          dronePosition={dronePosition}
          droneDirection={droneDirection}
          isMoving={isMoving}
          mode={mode}
          controlCodes={controlCodes}
          windDisabled={windDisabled}
          directions={DIRECTIONS}
          setWindDisabled={setWindDisabled}
          setControlCodes={setControlCodes}
          setMode={setMode}
          setIsMoving={setIsMoving}
          setGridDimensions={setGridDimensions}
          setTreeProbability={setTreeProbability}
          setDronePosition={setDronePosition}
          setDroneDireciton={setDroneDirection}
          setOriginalPosition={setOriginalPosition}
          executeDelivery={executeDelivery}
        />
      </div>

      <div id="battery">
        <span>{battery}%</span>
      </div>

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
