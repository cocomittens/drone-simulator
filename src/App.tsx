import "./index.css";
import { DIRECTIONS } from "./constants.ts";
import { useState, useEffect, useRef } from "react";
import { Options } from "./components/Options.tsx";
import { DroneGrid } from "./components/DroneGrid.tsx";
import { DroneProvider, useDrone } from "./context/drone.jsx";
import {
  generateControlString,
  calculateMovement,
  sleep,
  calculateBattery,
  calculateEfficientPath,
  generateGrid,
  displayGrid,
  displayPreview,
} from "./util/util";

function AppContent() {
  const {
    dronePosition,
    setDronePosition,
    droneDirection,
    setDroneDirection,
    destination,
    setDestination,
    originalPosition,
    setOriginalPosition,
    battery,
    setBattery,
    isMoving,
    setIsMoving,
    moveDrone,
  } = useDrone();

  const [gridDimensions, setGridDimensions] = useState([8, 8]);
  const [controlCodes, setControlCodes] = useState("");
  const [windDisabled, setWindDisabled] = useState(true);
  const [treeProbability, setTreeProbability] = useState(0.1);
  const [droneGrid, setDroneGrid] = useState(null);
  //@ts-ignore
  const [capacity, setCapacity] = useState(100);
  const [mode, setMode] = useState("d");

  const positionRef = useRef(dronePosition);
  const directionRef = useRef(droneDirection);

  useEffect(() => {
    positionRef.current = dronePosition;
  }, [dronePosition]);

  useEffect(() => {
    directionRef.current = droneDirection;
  }, [droneDirection]);

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
  async function deliver(start, end, currDirection, grid, charge) {
    const path = calculateEfficientPath(start, end, currDirection, grid);
    const pathString = generateControlString(path);
    setControlCodes(pathString);

    return await executeControlCodes(start, pathString, grid, charge);
  }

  // Generate random destination within the grid and execute delivery
  async function executeDelivery() {
    const origin = positionRef.current;
    let currentDirection = directionRef.current;
    const { grid, squares } = generateGrid(
      origin,
      gridDimensions,
      treeProbability
    );
    setDroneGrid(grid);

    const randomIndex = Math.floor(Math.random() * squares.length);
    const dest = squares[randomIndex];
    setDestination(dest);

    const currCharge = await deliver(
      origin,
      dest,
      currentDirection,
      grid,
      battery
    );
    currentDirection = directionRef.current;
    await deliver(dest, origin, currentDirection, grid, currCharge);
  }

  async function blowWind() {
    const currentPosition = positionRef.current;
    const randomIndex = Math.floor(Math.random() * DIRECTIONS.length);
    const randomDirection = DIRECTIONS[randomIndex];
    const newPosition = [
      currentPosition[0],
      currentPosition[1],
      randomDirection,
    ];
    const newLocation = calculateMovement(newPosition);
    await moveDrone(newLocation, droneGrid, true);
  }

  useEffect(() => {
    let windId = null;

    async function scheduleWind() {
      if (droneGrid && !windDisabled && isMoving) {
        const windInterval = Math.floor(Math.random() * 10) * 1000;
        windId = setTimeout(async () => {
          await blowWind();
          scheduleWind();
        }, windInterval);
      }
    }

    if (droneGrid && !windDisabled && isMoving) {
      scheduleWind();
    }

    return () => {
      if (windId) {
        clearTimeout(windId);
      }
    };
  }, [isMoving, droneGrid, windDisabled]);

  return (
    <div className="App">
      <h1 className="text-2xl my-2 font-semibold">Drone Simulator</h1>
      <Options
        gridDimensions={gridDimensions}
        treeProbability={treeProbability}
        isMoving={isMoving}
        mode={mode}
        controlCodes={controlCodes}
        windDisabled={windDisabled}
        directions={DIRECTIONS}
        setWindDisabled={setWindDisabled}
        setControlCodes={setControlCodes}
        setMode={setMode}
        setGridDimensions={setGridDimensions}
        setTreeProbability={setTreeProbability}
        setOriginalPosition={setOriginalPosition}
        executeDelivery={executeDelivery}
        dronePosition={dronePosition}
        setDroneDirection={setDroneDirection}
        setDronePosition={setDronePosition}
        originalPosition={originalPosition}
        droneDirection={droneDirection}
        executeControlCodes={executeControlCodes}
        setDroneGrid={setDroneGrid}
      />
      <DroneGrid
        renderGrid={renderGrid}
        battery={battery}
        gridDimensions={gridDimensions}
      />
    </div>
  );
}

export default function App() {
  return (
    <DroneProvider>
      <AppContent />
    </DroneProvider>
  );
}
