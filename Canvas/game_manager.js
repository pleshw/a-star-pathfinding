let canvas;
let context;

let player;

let grid;
let cellWidth, cellHeigth;

window.addEventListener("load", function(){

	canvas = document.getElementById("canvas");
	context = canvas.getContext('2d');

	Setup();
	Draw();
});




// Control the game settings.
	// Instantiate the main game variables and the player.
function Setup(){
	canvas.width  = 800;
	canvas.height = 600;

	// draw the background
	canvas.fillStyle = "black";
	context.fillRect(0, 0, canvas.width, canvas.height);

	// setup the grid´[our map]´.
	grid = new Grid( 12, 12 );
	cellWidth = canvas.width/grid.cols;
	cellHeigth = canvas.height/grid.rows;

	// drawing the grid lines
		// the first and the last line are not required.
	context.strokeStyle = "white";
	for( let x = 1; x < grid.cols; x++ ){
		context.moveTo(x * cellWidth, 0);
		context.lineTo(x * cellWidth, grid.rows*cellHeigth );
	}
	context.stroke();
	for( let y = 1; y < grid.rows; y++ ){
		context.moveTo(0, y * cellHeigth);
		context.lineTo(grid.cols*cellWidth, y * cellHeigth );
	}
	context.stroke();

	// Instantiating a new player
	const maxHp = 20; 
	const maxSp = 5;
	const width = 22
	const height =  22; 
	// make a player at the bottom left of the grid.
	player = new Player( 
		0, 0, 
		maxHp, maxSp, 
		width, height
	); 

	canvas.fillStyle = "black";
}

// All the game logic. 
	// Control everything that happens frame by frame.
function Logic(){

}

// Draw the game.
function Draw() {
	Logic();

	// Draw the player.
	context.fillStyle = "#dd88ff";
	context.fillRect(
		player.centerPosition.x + cellWidth/2, player.centerPosition.y + cellHeigth/2, // position
		player.width, player.height // dimensions
	);
}