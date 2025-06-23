# Drone Simulator
Simulates drone delivery across a user-defined grid, modeling navigation and drop-off logic. Utilizes a customized Dijkstra's algorithm to find the optimal path to and from the delivery destination while avoiding collisions with obstacles.
Try it [here](https://drone-simulator-sepia.vercel.app/)

## Running the Code Locally
* Navigate to root directory of the project
* Type `npm i`
* Type `npm start`

## Settings
<img width="1323" alt="Screen Shot 2024-11-19 at 12 20 07 AM" src="https://github.com/user-attachments/assets/f41042c7-15fa-4fbd-bc58-cc2a26c70da8">

### Modes
- `Manual`: Moves the drone from its starting position to the location specified by a string of control codes (as specified in the Control Codes section).There is an option to enable wind (more details in the Wind section).
- `Delivery`: Generates random delivery destination, executes delivery there and back. Wind is not available in this mode.

#### Control Codes
* To change the direction the drone is currently facing, use any of the. Changing the direction does not move the drone, 
  * `w` - West
  * `e` - East
  * `n` - North
  * `s` - South
* To move the drone forward 1 unit in the direction it is currently facing, add `f` to the string. To move the drone more than 1 unit, add more `f`s to the string. For instance, `ffff` will move the drone forward 4 units.
* **Ex:** `wffnf` - turns the drone to the west, moves 2 units west, turns the drone to the north, moves 1 unit north

#### Wind
If wind is enabled, the drone will continually move 1 unit in a random direction every few seconds until delivery is complete. Disable wind to ensure that the drone only visits the specified.

#### Trees
Trees are obstacles that the drone is unable to fly through, which means it will have to find a path around any trees in order to complete its delivery. They are randomly generated, and the amount of trees on the grid can be controlled with the `Tree Probability` option in the `Dimensions` settings.

### Dimensions

- `Rows`: Number of rows in the grid.
- `Cols`: Number of cols in the grid.
- `Tree Probability`: Number between 0 and 1 representing the probability of each square being a tree. **Ex:** a probability of 0.2 means that the grid will consist of approximately 20% trees.

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
