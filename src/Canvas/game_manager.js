let gameCanvas;
let gameContext;

let backgroundCanvas;
let backgroundContext;

let gridCanvas;
let gridContext;

let onCanvasMousePosition;
let drawCursor = false;

let keydown = new Map();

let player;

let grid;
let cellWidth, cellHeigth;



window.addEventListener("load", function(){
	gameCanvas = document.getElementById("gameCanvas");
	gameContext = gameCanvas.getContext('2d');

	backgroundCanvas = document.getElementById("backgroundCanvas");
	backgroundContext = backgroundCanvas.getContext('2d');

	gridCanvas = document.getElementById("gridCanvas");
	gridContext = gridCanvas.getContext('2d');

	addEventListener("keydown", _target => {
		keydown[_target.key] = true;
	});
	addEventListener("keyup", _target => {
		keydown[_target.key] = false;
	});

	gameCanvas.addEventListener("mouseover", _event => {
		drawCursor = true;
	});
	gameCanvas.addEventListener("mouseout", _event => {
		drawCursor = false;
	});

	gameCanvas.addEventListener("mousemove", _event => {
		onCanvasMousePosition = getMousePosition(gameCanvas, _event);
	});


	Setup();
	setInterval( function(){Draw();}, 1000/120 );
});




// Control the game settings.
	// Instantiate the main game variables and the player.
function Setup(){
	gameCanvas.width = gridCanvas.width = backgroundCanvas.width  = 800;
	gameCanvas.height = gridCanvas.height = backgroundCanvas.height  = 600;

	// draw the background
	backgroundContext.fillStyle = "black";
	backgroundContext.fillRect( 0, 0, gameCanvas.width, gameCanvas.height );

	// remove the default cursor
	gameCanvas.style.cursor = "none";

	// setup the grid´[our map]´.
	grid = new Grid( 12, 12 );
	cellWidth = gridCanvas.width/grid.cols;
	cellHeigth = gridCanvas.height/grid.rows;

	// drawing the grid lines
		// the first and the last line are not required.
	gridContext.strokeStyle = "white";
	for( let x = 1; x < grid.cols; x++ ){
		gridContext.moveTo(x * cellWidth, 0);
		gridContext.lineTo(x * cellWidth, grid.rows*cellHeigth );
	}
	gridContext.stroke();
	for( let y = 1; y < grid.rows; y++ ){
		gridContext.moveTo(0, y * cellHeigth);
		gridContext.lineTo(grid.cols*cellWidth, y * cellHeigth );
	}
	gridContext.stroke();

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


// Draw the game.
function Draw() {
	gameContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

	// Draw the player at the center of the cell.
	gameContext.fillStyle = "#cfe";
	playerHorizontalDrawing = ((2*cellWidth*player.position.x) + cellWidth  - player.width)/2;
	playerVerticalDrawing = ((2*cellHeigth*player.position.y) + cellHeigth  - player.height)/2;
	gameContext.fillRect(
		playerHorizontalDrawing, playerVerticalDrawing,
		player.width, player.height // dimensions
	);

	// Drawing the game cursor.
	gameContext.fillStyle = "red";
	if (drawCursor)
		gameContext.fillRect( 
			onCanvasMousePosition.x, onCanvasMousePosition.y, 
			32, 32 );
}