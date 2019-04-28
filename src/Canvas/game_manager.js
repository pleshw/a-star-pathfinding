let gameCanvas;
let gameContext;

let clock = new Clock();

let backgroundCanvas;
let backgroundContext;

let gridCanvas;
let gridContext;

let grid;
let cellWidth, cellHeight;
let selectedCell, lastCellClicked;

let mouseOnCanvas = false;
let onCanvasMousePosition;
let mouseReady = false;
let isCursorOnCanvas = false;
const cursorImg = new Image();

let keydown = new Map();
let rightclick = false;
let mousedown = false;

let player;

window.addEventListener("load", function(){

	document.getElementsByTagName("body")[0].style.overflow = "hidden";

	gameCanvas = document.getElementById("gameCanvas");
	gameContext = gameCanvas.getContext('2d');

	backgroundCanvas = document.getElementById("backgroundCanvas");
	backgroundContext = backgroundCanvas.getContext('2d');

	gridCanvas = document.getElementById("gridCanvas");
	gridContext = gridCanvas.getContext('2d');

	// addEventListener("keydown", _target => {
	// 	keydown[_target.key] = true;
	// });
	// addEventListener("keyup", _target => {
	// 	keydown[_target.key] = false;
	// });

	gameCanvas.addEventListener("mouseover", _event => {
		mouseOnCanvas = true;
	});
	gameCanvas.addEventListener("mouseout", _event => {
		mouseOnCanvas = false;
		if (mouseOnCanvas) mouseReady = false;
	});
	gameCanvas.addEventListener("contextmenu", _event => {
		_event.stopImmediatePropagation();
		_event.preventDefault();
		rightclick = true;
		setTimeout(()=>{rightclick = false;}, 50);
		return false;
	});

	gameCanvas.addEventListener("mousedown", _event => {
		_event.stopImmediatePropagation();
		mousedown = true;
	});
	gameCanvas.addEventListener("mouseup", _event => {
		mousedown = false;
	});

	gameCanvas.addEventListener("mousemove", _event => {
		if (mouseOnCanvas) mouseReady = true;
		onCanvasMousePosition = getMousePosition(gameCanvas, _event);
	});

	gameCanvas.addEventListener("touchstart", _event => {
		isCursorOnCanvas = true;
		mousedown = true;
		onCanvasMousePosition = getTouchPosition(gameCanvas, _event);
	},{passive: true});
	gameCanvas.addEventListener("touchmove", _event => {
		isCursorOnCanvas = true;
		mousedown = true;
		onCanvasMousePosition = getTouchPosition(gameCanvas, _event);
	}, {passive: true});


	Setup();
	setInterval( function(){GameLoop();}, 1000/120 );
});




// Control the game settings.
	// Instantiate the main game variables and the player.
function Setup(){
	gameCanvas.width = gridCanvas.width = backgroundCanvas.width  = window.innerWidth;
	gameCanvas.height = gridCanvas.height = backgroundCanvas.height  = window.innerHeight;

	// Draw the background
	backgroundContext.fillStyle = "black";
	backgroundContext.fillRect( 0, 0, gameCanvas.width, gameCanvas.height );

	// Setup and draw the grid.
	const gridRows = 54;
	const gridCols = 78;

	// Get the final cell width and cell height of the grid
	const cellWidth = gridCanvas.width/gridCols;
	const cellHeight = gridCanvas.height/gridRows;
	grid = new Grid( gridRows, gridCols, cellWidth, cellHeight );
	// // make some barriers.
	for(let y = 0; y < 30; y++)
			grid.block( 
				getRandomInt(1, grid.cols), getRandomInt(0, grid.rows));

	drawGrid();

	// remove the default cursor
	gameCanvas.style.cursor = "none";
	// Instantiating the new player variables.
	const maxHp = 20; 
	const maxSp = 5;
	const width = 12;
	const height = 12; 
	// make a player at the bottom left of the grid.
	player = new Player( 
		0, 0, 
		maxHp, maxSp, 
		width, height
	);

	cursorImg.src = "src/img/cursor_3.png";
}


// Control the game logic { player movement, game time, monsters etc... }
function Logic(){
	// find the path from the player position to the selected cell
	if (mouseReady){
		// get the cell that is under the cursor.
		selectedCell = grid.positionOfCellOnGrid(onCanvasMousePosition.x,  onCanvasMousePosition.y);
		// On mouse down finds the way to the cursor and change the player path
		if (mousedown && !hasSamePosition(lastCellClicked, selectedCell)){
			const v = A_Star(player.position, selectedCell, grid);
			if (v != -1)
				player.path = v;
			lastCellClicked = selectedCell;
		}
	}
	player.move();
}


// Draw the game.
function Draw() {
	// Clear the canvas.
	gameContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

	if (player.movesLeft > 0)
		drawPath(player.path);


	drawObject( player );


	if (mouseReady){
		drawCursor( selectedCell );
	} // mouse ready

	gameContext.fillStyle = "white";
	gameContext.font = "8px Arial";
	gameContext.fillText(clock.fps + " fps", 10, 50);
}

function GameLoop(){
	clock.tick();
	Logic();
	Draw();
	console.log( 'Game running at: ' + clock.fps + ' fps');
}


