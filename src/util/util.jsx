import { Heap } from "heap-js";
import { DIRECTIONS, DIRECTION_COSTS } from "../constants.ts";

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Generate control string from list of coordinates
export function generateControlString(directions) {
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

// Calculate new coordinates of drone after potential movement in specified direction
export const calculateMovement = (prevPosition) => {
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

// Calculate total cost of delivery
export function calculateDeliveryCost(codes) {
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

// Returns if drone has enough battery to deliver to destination
export function canDeliver(codes) {
  const deliveryCost = calculateDeliveryCost(codes);
  return battery - deliveryCost >= 0;
}

// Calculate new charge after next move
export function calculateBattery(charge, code, capacity) {
  if (code === "f") {
    charge = charge - 1;
  } else {
    charge = charge - 0.5;
  }

  const result = (charge / capacity) * 100;
  return result;
}

// Use bfs to find the shortest path from current position to destiniation
// Returns list of directions
export function calculateShortestPath(curr, dest, grid) {
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

    for (const direction of DIRECTIONS) {
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

// Use djikstras to find the most battery efficient path from current position to destiniation
// Returns list of directions
export function calculateEfficientPath(curr, dest, initialDirection, grid) {
  const costComparator = (a, b) => a.cost - b.cost;
  const heap = new Heap(costComparator);
  const parent = new Map();
  const distances = new Map();

  heap.push({ value: `${curr[0]}-${curr[1]}-${initialDirection}`, cost: 0 });
  distances.set(`${curr[0]}-${curr[1]}-${initialDirection}`, 0);

  while (heap.size()) {
    const { value, cost } = heap.pop();
    const [stringRow, stringCol, currDirection] = value.split("-");
    const row = parseInt(stringRow);
    const col = parseInt(stringCol);

    if (row === dest[0] && col === dest[1]) {
      const result = [];
      let key = value;

      while (parent.has(key)) {
        const [newRow, newCol, prevDirection, direction] = parent.get(key);
        result.unshift(direction);
        key = `${newRow}-${newCol}-${prevDirection}`;
      }

      return result;
    }

    if (cost > distances.get(value)) {
      continue;
    }

    for (const direction of DIRECTIONS) {
      const turnCost = currDirection !== direction ? 0.5 : 0;
      const [newRow, newCol] = calculateMovement([row, col, direction]);

      if (isValid([newRow, newCol], grid)) {
        const movementCost = Math.abs(newRow - row + (newCol - col));
        const newCost = cost + movementCost + turnCost;
        const newKey = `${newRow}-${newCol}-${direction}`;

        if (!distances.has(newKey) || newCost < distances.get(newKey)) {
          distances.set(newKey, newCost);
          heap.push({ value: newKey, cost: newCost });
          parent.set(newKey, [row, col, currDirection, direction]);
        }
      }
    }
  }
  return null;
}

// Return if valid position on grid
export function isValid(position, grid) {
  const [row, col] = position;
  const rows = grid.length;
  const cols = grid[0].length;

  return (
    row >= 0 && row < rows && col >= 0 && col < cols && grid[row][col] === null
  );
}

export function generateGrid(dronePosition, gridDimensions, treeProbability) {
  const grid = [];
  const squares = [];
  for (let i = 0; i < gridDimensions[0]; i++) {
    grid.push([]);
    for (let j = 0; j < gridDimensions[1]; j++) {
      const isDronePosition = dronePosition[0] === i && dronePosition[1] === j;
      if (!isDronePosition && Math.random() <= treeProbability) {
        grid[i].push("t");
      } else {
        grid[i].push(null);
        squares.push([i, j]);
      }
    }
  }
  return { grid, squares };
}

export function displayGrid(
  grid,
  destination,
  dronePosition,
  droneDirection,
  originalPosition
) {
  return grid.map((row, rowIndex) => {
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
      } else if (grid[rowIndex][colIndex] === "t") {
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
}

export function displayPreview(gridDimensions, dronePosition, droneDirection) {
  const [rows, cols] = gridDimensions;

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
