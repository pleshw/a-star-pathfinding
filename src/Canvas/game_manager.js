let canvas;
let context;

let player;

let grid;
let cellWidth, cellHeigth;

let keydown = new Map();

window.addEventListener("load", function(){
	canvas = document.getElementById("canvas");
	context = canvas.getContext('2d');

	addEventListener("keypress", function(target){
		keydown[target.key] = true;
	});

	addEventListener("keyup", function(target){
		keydown[target.key] = false;
	});


	Setup();
	setInterval( function(){Draw();}, 1000/60 );
});




// Control the game settings.
	// Instantiate the main game variables and the player.
function Setup(){
	canvas.width  = 800;
	canvas.height = 600;

	// setup the grid´[our map]´.
	grid = new Grid( 12, 12 );
	cellWidth = canvas.width/grid.cols;
	cellHeigth = canvas.height/grid.rows;

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
}

// The game logic.
function Logic(){
	if (keydown['w']) player.move(TOP);
	if (keydown['d']) player.move(RIGHT);
	if (keydown['s']) player.move(BOTTOM);
	if (keydown['a']) player.move(LEFT);
}

// Draw the game.
function Draw() {
	Logic();

	// draw the background
	context.fillStyle = "black";
	context.fillRect( 0, 0, canvas.width, canvas.height );

	// Draw the player at the center of the cell.
	context.fillStyle = "#cfe";
	playerHorizontalDrawing = ((2*cellWidth*player.position.x) + cellWidth  - player.width)/2;
	playerVerticalDrawing = ((2*cellHeigth*player.position.y) + cellHeigth  - player.height)/2;
	context.fillRect(
		playerHorizontalDrawing, playerVerticalDrawing,
		player.width, player.height // dimensions
	);

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


}