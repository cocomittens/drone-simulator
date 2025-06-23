# Drone Simulator
Simulates drone delivery across a user-defined grid, modeling navigation and drop-off logic. Utilizes a customized Dijkstra's algorithm to find the optimal path to and from the delivery destination and avoid .
Try it [here](https://drone-simulator-sepia.vercel.app/)

## Running the Code Locally
* Navigate to root directory of the project
* Type `npm i`
* Type `npm start`

## Settings
<img width="1323" alt="Screen Shot 2024-11-19 at 12 20 07 AM" src="https://github.com/user-attachments/assets/f41042c7-15fa-4fbd-bc58-cc2a26c70da8">

#### Modes
- `Manual`: Moves the drone from its starting position to the location specified by a string of control codes (as specified in the Control Codes section).There is an option to enable wind (more details in the Wind section).
- `Delivery`: Generates random delivery destination, executes delivery there and back. Wind is not available in this mode.

### Control Codes
* To change the direction the drone is currently facing, use any of the. Changing the direction does not move the drone, 
  * `w` - West
  * `e` - East
  * `n` - North
  * `s` - South
* To move the drone
* Ex: `wffnf` - turns the drone to the west, moves 2 units west, turns the drone to the north, moves 1 unit north

### Wind
If wind is enabled, the drone will continually move 1 unit in a random direction every few seconds until delivery is complete.

### Trees
Trees are obstacles that the drone is unable to fly through. 

### Dimensions

- `Rows`: Number of rows in the grid.
- `Cols`: Number of cols in the grid.
- `Tree Probability`: Number between 0 and 1 representing the probability of each square being a tree.

### Location

- `Row`: Starting row of drone.
- `Cols`: Starting col of drone.
- `Direction`: Starting direction of drone.

## Grid

<img width="1388" alt="Screen Shot 2024-11-17 at 5 04 45 PM" src="https://github.com/user-attachments/assets/e984d580-c50f-4abd-ac26-fd1682081263">

### Legend

- `[w, s, e, n]`: Direction of drone at current position
- `d`: Delivery destination
- `o`: Original drone position
- `t`: Tree
- `x`: Empty space

### Battery
Remaining battery percentage in upper right hand corner (each turn costs 0.5 battery units, each forward movement 1 unit). The drone cannot complete its delivery if its battery level reaches . 
