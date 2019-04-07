// This file provides pathfinding algorithms for my game purposes.

function A_Star(initialPosition, finalPosition, grid) {
	let actualPosition = initialPosition;

	let CostFromInitToActual = 0; // the distance from the actual point to the initial point
	let CostFromActualToEnd = 0; // the distance from the actual point to the end point
	// The path score is the sum of both above.
	let PathScore = CostFromInitToActual + CostFromActualToEnd;

	// List with possible paths to go.
	let OpenList = [];
	// List of ways that are not being considered.
	let ClosedList = [];

	// ADD ANY SQUARE ADJACENT TO ACTUAL SQUARE TO THE OPEN LIST
	OpenList = grid.positionOfAdjacents( actualPosition.x, actualPosition.y );

	console.log(OpenList);

}