// This file provides pathfinding algorithms for my game purposes.


function removeFromArray( arr, elmnt ){
	for (var i = arr.length - 1; i >= 0; i--) {
		if (arr[i] == elmnt) 
			arr.splice(i, 1);
	}
}

function heuristicEvaluate( a, b ){
	let distance = distance2d( a.x, a.y, b.x, b.y );
	return distance;
}

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
		let adjacents = this.positionOfAdjacents(position.x, position.y);
		let neighbors = [];
		adjacents.forEach((element)=>{
			neighbors.push(this.node[element.y][element.x]);
		});
		return neighbors;
	}

	// return all adjacents nodes in a position
	neighbors( position, diagonals = true ){
		let adjacents = 
			diagonals ? this.positionOfAdjacents(position.x, position.y)
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

	let pathGrid = new A_StarGrid( grid, initialPosition, finalPosition );

	let path = new Map();

	let current = pathGrid.lowestFScoreNeighbor(initialPosition);

	let checkDiagonals = true;
	pathGrid.neighbors(current, true).forEach(element=>{
		if (!pathGrid.isFree(element.x, element.y)) checkDiagonals = false;
	});

	while(pathGrid.canContinue){
		// current cell recieve the lowest fscore neighbor in openset
		current = pathGrid.lowestFScoreInOpenList();

		if (current == undefined) return -1;

		if (current.x == pathGrid.goal.x && current.y == pathGrid.goal.y){
			// gameContext.fillStyle = "rgba(195, 195, 195, .3)";
			// pathGrid.openList.forEach( element =>{				
			// 	gameContext.fillRect(
			// 		cellWidth*element.x, cellHeight*element.y,
			// 		cellWidth, cellHeight);
			// });

			return backtrack(path, current);
		}

		// else then remove the current place from open list and add to the closed
		pathGrid.openList.delete(pathGrid.mapIndex(current));
		pathGrid.closedList.set(pathGrid.mapIndex(current), current);

		// search for the best move
		pathGrid.neighbors(current, checkDiagonals).forEach( neighbor =>{
			if (pathGrid.closedList.has(pathGrid.mapIndex(neighbor)) || pathGrid.isBlocked(neighbor.x, neighbor.y))
				return;

			let tmp_GScore = current.g + 1; // current gscore + the distance from current to neighbor.
			// console.log(tmp_GScore);

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

			// after that you have the best path to go
			current.g = tmp_GScore;
			path.set( neighbor, current);
		}); // for each
	}
	return -1;
}

function backtrack( path, current ){
	// console.log(Array.from(path));
	let final = new Array();
	final.push( current );
	while (path.has(current)){
		current = path.get(current);
		final.push(current);
	}

	return final;
}

// gameContext.fillStyle = "red";
// gameContext.fillRect(
// 	cellWidth*current.x, cellHeight*current.y,
// 	cellWidth, cellHeight);


// pathGrid.openList.forEach( element =>{
// 	gameContext.fillStyle = currec;
// 	gameContext.fillRect(
// 		cellWidth*element.x, cellHeight*element.y,
// 		cellWidth, cellHeight);
// });