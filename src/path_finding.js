// This file provides pathfinding algorithms for my game purposes.
// This A* algorithm was made based on a code train algorithm


function removeFromArray( arr, elmnt ){
	for (var i = arr.length - 1; i >= 0; i--) {
		if (arr[i] == elmnt) 
			arr.splice(i, 1);
	}
}


class A_StarNode {
	constructor( x, y ){
		this.x = x;
		this.y = y;
		this.g = 0; // distance from the goal
		this.h = 0; //distance from the origin
		this.f = 0;
	}
	
}

class A_StarGrid extends Grid{
	constructor(grid, start){
		super(grid.rows, grid.cols, grid.cellWidth, grid.cellHeight);

		// the set of cells used by the algorithm
		this.open_list = [ new A_StarNode(start.x, start.y) ];
		this.closed_list = [];

		// the cell cost evaluating variables
		this.node = [];

		for( let y = 0; y < this.rows; y++ )
			for( let x = 0; x < this.cols; x++ )
				this.node.push( new A_StarNode(x, y) );
		
	}

	get openList(){
		return this.open_list;
	}

	set openList( position ){
		this.open_list.push( new A_StarNode(position.x, position.y) );
	}

	removeFromOpenList( element ){
		removeFromArray( this.openList, element );
	}

	get closedList(){
		return this.closed_list;
	}

	set closedList( position ){
		this.closed_list.push( new A_StarNode(position.x, position.y) );
	}

	fCost(i){
		return this.node[i].f;
	}

	hCost(i){
		return this.node[i].h;
	}

	gCost(i){
		return this.node[i].g;
	}

	// return all adjacents nodes in a position
	neighbors( position ){
		let adjacents = this.positionOfAdjacents(position.x, position.y);
		let neighbors = [];
		adjacents.forEach((element)=>{
			neighbors.push(this.node[this.index(element.x, element.y)]);
		});
		return neighbors;
	}

	haveSolution(){
		return this.open_list.length > 0;
	}

}

function A_Star(initialPosition, finalPosition, grid) {
	let pathGrid = new A_StarGrid( grid, finalPosition );

	let bestStep = 0;
	for(let i = 0; i < pathGrid.openList.length; i++)
		if ( pathGrid.openList[i].f < bestStep )
			bestStep = i;

	let current = pathGrid.openList[bestStep];
	console.log(current);


	if (current === pathGrid.index(finalPosition) )
		console.log(" SUCESS! ");

	pathGrid.removeFromOpenList( current );
	pathGrid.closedList = current;

	let neighbors = pathGrid.neighbors(current);
	for (var i = 0; i < neighbors.length; i++) {
		let actualNeighbor = neighbors[i];
		

		if (!pathGrid.closedList.includes(actualNeighbor)){
			var tmpGScore = current.g + 1;

			if (pathGrid.openList.includes(actualNeighbor)){
				if (tmpGScore < actualNeighbor.g)
					actualNeighbor.g = tmpGScore;
			}else{
				actualNeighbor.g = tmpGScore;
				pathGrid.openList = actualNeighbor;
			}
		} 
	}

	console.log(pathGrid.openList);
}