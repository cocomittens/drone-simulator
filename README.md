# Drone Simulator

Simulates drones.

Try it [here](https://drone-simulator-sepia.vercel.app/)

## Instructions

1. `npm i`
2. `npm start`

## Settings
<img width="1330" alt="Screen Shot 2024-11-19 at 12 14 58 AM" src="https://github.com/user-attachments/assets/cdcf6ebc-f278-485b-a414-aff47da00a39">

### Dimensions

- `Rows`: Number of rows in the grid.
- `Cols`: Number of cols in the grid.
- `Tree Probability`: Number between 0 and 1 representing the probability of each square being a tree.

### Location

- `Row`: Starting row of drone.
- `Cols`: Starting col of drone.
- `Direction`: Starting direction of drone.

### Control Codes

#### Modes

- `Manual`: Executes control code string manually specified. Wind optional.
- `Delivery`: Generates random delivery destination, executes delivery there and back. Wind disabled.

## Grid

<img width="1388" alt="Screen Shot 2024-11-17 at 5 04 45 PM" src="https://github.com/user-attachments/assets/e984d580-c50f-4abd-ac26-fd1682081263">

### Letters

- `[w, s, e, n]`: Direction of drone at current position
- `d`: Delivery destination
- `o`: Original drone position
- `t`: Tree
- `x`: Empty space
