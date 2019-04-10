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
	constructor( pos, g = 0, h = 0 ){
		this.x = pos.x;
		this.y = pos.y;
		this.g = Math.floor(g); // distance from this node to initial point
		this.h = Math.floor(h); // heuristic from this node to goal
		this.f = this.g + this.h;
	}
}

class A_StarGrid extends Grid{
	constructor(grid, start, end){
		super(grid.rows, grid.cols, grid.cellWidth, grid.cellHeight);

		// the set of cells used by the algorithm
		this.open_list = new Map();
		this.closed_list = new Map();

		// the cell cost evaluating variables
		this.node = new Array(this.rows);
		for( let i = 0; i < this.node.length; i++ )
			this.node[i] = new Array(this.cols);

		for( let i = 0; i < this.rows; i++ )
			for( let j = 0; j < this.cols; j++ ){
				let tmp_pos = {x: j, y: i};
				// store all the nodes with its heuristic values
				this.node[i][j] = new A_StarNode( tmp_pos, 0, heuristicEvaluate(tmp_pos, end) );
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
		return this.open_list.length > 0;
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

	neighborsSorted( position ){
		return this.neighbors(position).sort(byFScore);
	}

	lowestFScoreNeighbor( position ){
		return this.neighborsSorted(position)[0];
	}

	lowestFScoreInOpenList(){
		let tmp = Array.from(this.openList.values());
		return tmp.sort(byFScore)[0];
	}

	mapIndex( position ){
		return this.index(position.x, position.y);
	}

}

function A_Star(initialPosition, finalPosition, grid) {
	if (initialPosition.x == finalPosition.x && initialPosition.y == finalPosition.y) return;

	let pathGrid = new A_StarGrid( grid, initialPosition, finalPosition );

	let path = new Map();

	let current = pathGrid.lowestFScoreNeighbor(initialPosition);


	for(let i = 0; i < 355; i++){
		// current cell recieve the lowest fscore neighbor in openset
		current = pathGrid.lowestFScoreInOpenList();

		if (current.x == pathGrid.goal.x && current.y == pathGrid.goal.y){
			path.set( pathGrid.mapIndex(current), current);
			return path;
		}

		// else then remove the current place to the open list and add to the closed
		pathGrid.openList.delete(pathGrid.mapIndex(current));
		pathGrid.closedList.set(pathGrid.mapIndex(current), current);


		pathGrid.neighbors({x: current.x, y: current.y}).forEach( neighbor =>{
			if (pathGrid.closedList.has(pathGrid.mapIndex(neighbor)))
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
			path.set( pathGrid.mapIndex(current), current);
		}); // for each

	}
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