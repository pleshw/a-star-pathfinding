let canvas;
let context;

let player;

let grid;

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

	canvas.fillStyle = "black";

	const maxHp = 20; 
	const maxSp = 5;
	const width = 32
	const height =  32; 

	grid = new Grid( 30, 30 );

	// player at the bottom left of the grid.
	player = new Player( 
		0, canvas.height - height, 
		maxHp, maxSp, 
		width, height
	); 
}

// All the game logic. 
	// Control everything that happens frame by frame.
function Logic(){

}

// Draw the game.
function Draw() {
	context.fillRect(0, 0, canvas.width, canvas.height);
	Logic();

	// Draw the player.
	context.fillStyle = "lightgrey";
	context.fillRect(
		player.position.x, player.position.y, // position
		player.width, player.height // dimensions
	);
}