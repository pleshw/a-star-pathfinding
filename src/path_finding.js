// This file provides the A* algorithm for my game purposes.



function byFScore(a, b){
	if (a.f < b.f)  return -1;
	if (a.f == b.f) return  0;
	if (a.f > b.f)  return  1;
}

// An A* node struct
class A_StarNode {
	constructor( x, y, index, g = 0, h = 0 ){
		this.x = x;
		this.y = y;
		this.index = index;
		this.g = g; // distance from this node to initial point
		this.h = h; // heuristic from this node to goal
		this.f = this.g + this.h;
	}
}

class A_StarGrid extends Grid{
	constructor(grid, start, end){
		super(grid.rows, grid.cols, grid.cellWidth, grid.cellHeight);

		// the set of cells used by the algorithm
		this.open_list = new Map();
		this.closed_list = new Map();

		// make this cells a copy of grid cells
		this.copy(grid);

		// the cell cost evaluating variables
		this.node = new Array(this.rows);
		for( let i = 0; i < this.rows; i++ ) this.node[i] = new Array(this.cols);

		// store all the nodes with its heuristic values
		for( let i = 0; i < this.rows; i++ )
			for( let j = 0; j < this.cols; j++ )
				
				this.node[i][j] = new A_StarNode( j, i, 
												  this.mapIndex(j, i), 
												  0, heuristicEvaluate(j, i, end));
		// get the goal node
		this.goal = this.node[end.y][end.x];

		// the open list recieve the initial position node.
		this.openList.set(this.node[start.y][start.x], this.node[start.y][start.x]);
	}

	get openList(){
		return this.open_list;
	}

	get closedList(){
		return this.closed_list;
	}

	get canContinue(){
		return this.open_list.size >= 0;
	}

	// return all adjacents nodes in a position
	neighbors( position ){
		const adjacents = this.positionOfAdjacents(position.x, position.y);
		let neighbors = [];
		adjacents.forEach((element)=>{
			neighbors.push(this.node[element.y][element.x]);
		});
		return neighbors;
	}

	// return all adjacents nodes in a position
	neighbors( position, diagonals = true ){
		const adjacents = diagonals ? this.positionOfAdjacents(position.x, position.y)
									: this.positionOfAdjacentsWithNoDiagonals(position.x, position.y);
		let neighbors = [];
		adjacents.forEach((element)=>{
			neighbors.push(this.node[element.y][element.x]);
		});
		return neighbors;
	}

	// Get all neighbor nodes from an element sorted by fscore
	neighborsSorted( position ){
		return this.neighbors(position).sort(byFScore);
	}

	// Get the neighbor node with lower fscore given a position
	lowestFScoreNeighbor( position ){
		return this.neighborsSorted(position)[0];
	}

	// Get the element from openList with the lowest fscore
	lowestFScoreInOpenList(){
		return Array
				.from(this.openList.values())
				.sort(byFScore)[0];
	}

	// return an index given a position
	mapIndex( x, y ){
		return this.index(x, y);
	}

}

function A_Star(initialPosition, finalPosition, grid) {
	if (initialPosition.x == finalPosition.x && initialPosition.y == finalPosition.y) return -1;

	const pathGrid = new A_StarGrid( grid, initialPosition, finalPosition );

	let path = new Map();

	let current = pathGrid.lowestFScoreInOpenList(initialPosition);

	while(pathGrid.canContinue){
		// current cell recieve the lowest fscore neighbor in openset
		current = pathGrid.lowestFScoreInOpenList();

		// cases where the current is a blocked cell
		if (current == undefined) return -1;

		// if the current and the goal are the same
		if (current === pathGrid.goal)
			return backtrack(path, current);

		// Check if the neighbors are blocked
		// to certify that the element will not pass through a diagonal set of blocks.
		let checkDiagonals = true;
		pathGrid.neighbors(current, true).forEach(element=>{
			if (!pathGrid.isFree(element.x, element.y)) checkDiagonals = false;
		});

		// remove the current place from the open list and add to the closed list
			// it means that the current place is marked as checked.
		pathGrid.openList.delete(current);
		pathGrid.closedList.set(current, current);

		// search for the best move
		pathGrid.neighbors(current, checkDiagonals).forEach( neighbor =>{
			if (pathGrid.closedList.has(neighbor) || pathGrid.isBlocked(neighbor.x, neighbor.y))
				return;

			const tmp_GScore = current.g + 1; // current gscore + the distance from current to neighbor.

			/*
				// if openlist have not this neighbor then you know that this is a new node unchecked.
				// put it on openList 
				// if the gscore is greater then just ignore.
			 */
			if(!pathGrid.openList.get(neighbor))
				pathGrid.openList.set(neighbor, neighbor);
			else if(tmp_GScore >= neighbor.g)
				return;
			// console.log(pathGrid.lowestFScoreInOpenList(pathGrid.openList));
			// console.log(pathGrid.closedList);

			// after that you have the possible best next move to go
				// put the neighbor to go in path
			current.g = tmp_GScore;
			path.set( neighbor, current );
		}); // for each
	} // while can continue
	return -1;
}

// backtrack the path with the best set of moves
function backtrack( path, current ){
	let final = new Array();
	final.push( current );
	while (path.has(current)){
		current = path.get(current);
		final.push(current);
	}

	return final;
}
