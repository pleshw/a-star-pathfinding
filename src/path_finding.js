// This file provides pathfinding algorithms for my game purposes.



function byFScore(a, b){
	if (a.f < b.f)  return -1;
	if (a.f == b.f) return  0;
	if (a.f > b.f)  return  1;
}

class A_StarNode {
	constructor( pos, index, g = 0, h = 0 ){
		this.x = pos.x;
		this.y = pos.y;
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

		this.copy(grid);

		// the cell cost evaluating variables
		this.node = new Array(this.rows);
		for( let i = 0; i < this.node.length; i++ )
			this.node[i] = new Array(this.cols);

		for( let i = 0; i < this.rows; i++ )
			for( let j = 0; j < this.cols; j++ ){
				let tmp_pos = {x: j, y: i};
				// store all the nodes with its heuristic values
				this.node[i][j] = new A_StarNode( tmp_pos, 
												  this.mapIndex(tmp_pos), 
												  0, heuristicEvaluate(tmp_pos, end) );
				// get the goal node
				if (tmp_pos.x == end.x && tmp_pos.y == end.y) this.goal = this.node[i][j];
			}

		// the open list recieve the initial position node.
		this.openList.set(this.mapIndex(start), this.node[start.y][start.x]);
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
		let tmp = Array.from(this.openList.values());
		return tmp.sort(byFScore)[0];
	}

	// return an index given a position
	mapIndex( position ){
		return this.index(position.x, position.y);
	}

}

function A_Star(initialPosition, finalPosition, grid) {
	if (initialPosition.x == finalPosition.x && initialPosition.y == finalPosition.y) return -1;

	const pathGrid = new A_StarGrid( grid, initialPosition, finalPosition );

	let path = new Map();

	let current = pathGrid.lowestFScoreNeighbor(initialPosition);

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
		pathGrid.openList.delete(pathGrid.mapIndex(current));
		pathGrid.closedList.set(pathGrid.mapIndex(current), current);

		// search for the best move
		pathGrid.neighbors(current, checkDiagonals).forEach( neighbor =>{
			if (pathGrid.closedList.has(pathGrid.mapIndex(neighbor)) || pathGrid.isBlocked(neighbor.x, neighbor.y))
				return;

			const tmp_GScore = current.g + 1; // current gscore + the distance from current to neighbor.

			/*
				// if openlist have not this neighbor then you know that this is a new node unchecked.
				// put it on openList 
				// if the gscore is greater then just ignore.
			 */
			if(!pathGrid.openList.get(pathGrid.mapIndex(neighbor)))
				pathGrid.openList.set(pathGrid.mapIndex(neighbor), neighbor);
			else if(tmp_GScore >= neighbor.g)
				return;
			// console.log(pathGrid.lowestFScoreInOpenList(pathGrid.openList));
			// console.log(pathGrid.closedList);

			// after that you have the possible best next move to go
				// put the neighbor to go in path
			current.g = tmp_GScore;
			path.set( neighbor, current );
		}); // for each
	}
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
