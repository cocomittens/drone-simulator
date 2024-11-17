import "./styles.css";
import { DIRECTIONS } from "./constants.ts";

import { useState, useEffect } from "react";
import { Options } from "./components/Options.tsx";
import { DroneGrid } from "./components/DroneGrid.tsx";
import {
  generateControlString,
  calculateMovement,
  sleep,
  calculateBattery,
  calculateShortestPath,
  isValid,
  blowWind,
  generateGrid,
  displayGrid,
  displayPreview,
  calculateDeliveryCost,
  canDeliver,
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

  function renderGrid() {
    if (droneGrid) {
      return displayGrid(
        droneGrid,
        destination,
        dronePosition,
        droneDirection,
        originalPosition
      );
    } else {
      return displayPreview(gridDimensions, dronePosition, droneDirection);
    }
  }

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
    let [currRow, currCol] = startPosition;
    let currDirection = controlString[0];
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
        [currRow, currCol] = newLocation;
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

    const { grid, squares } = generateGrid(
      origin,
      gridDimensions,
      treeProbability
    );
    setDroneGrid(grid);

    const randomIndex = Math.floor(Math.random() * squares.length);
    const dest = squares[randomIndex];
    setDestination(dest);

    const currCharge = await deliver(origin, dest, grid, battery);
    await deliver(dest, origin, grid, currCharge);
  }

  // Wind
  // Currently broken due to new features
  // Todo: fix

  useEffect(() => {
    let windId;
    if (droneGrid && !windDisabled && isMoving) {
      const startWind = () => {
        const windInterval = Math.floor(Math.random() * 10);
        windId = setTimeout(
          () => blowWind(dronePosition, droneDirection, moveDrone),
          windInterval * 1000
        );
      };

      startWind();
    } else {
      clearTimeout(windId);
    }
  }, [isMoving, droneGrid, windDisabled]);

  return (
    <div className="App">
      <h1>Drone Simulator</h1>

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

      <DroneGrid
        renderGrid={renderGrid}
        battery={battery}
        gridDimensions={gridDimensions}
      />
    </div>
  );
}
