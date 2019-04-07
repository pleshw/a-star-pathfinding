let gameCanvas;
let gameContext;

let backgroundCanvas;
let backgroundContext;

let gridCanvas;
let gridContext;

let grid;
let cellWidth, cellHeigth;
let cellPadding = 20; // percentage

let onCanvasMousePosition;
let drawCursor = false;
let cursorImg = new Image();

let keydown = new Map();
let mousedown = false;

let player;




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

	gameCanvas.addEventListener("mousedown", _event => {
		mousedown = true;
	});
	gameCanvas.addEventListener("mouseup", _event => {
		mousedown = false;
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

	// Draw the background
	backgroundContext.fillStyle = "black";
	backgroundContext.fillRect( 0, 0, gameCanvas.width, gameCanvas.height );

	// Setup and draw the grid.
	let gridRows = 20;
	let gridCols = 20;
	cellWidth = gridCanvas.width/gridCols;
	cellHeigth = gridCanvas.height/gridRows;
	grid = new Grid( gridRows, gridCols, cellWidth, cellHeigth );
	drawGrid();

	// remove the default cursor
	gameCanvas.style.cursor = "none";
	// Instantiating the new player variables.
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

	cursorImg.src = "src/img/Cursor.png";
}


// Draw the game.
function Draw() {
	// Clear the canvas.
	gameContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

	// Get the player drawing position.
	playerHorizontalDrawing = ((2*cellWidth*player.position.x) + cellWidth  - player.width)/2;
	playerVerticalDrawing = ((2*cellHeigth*player.position.y) + cellHeigth  - player.height)/2;
	// Draw the player at the center of the cell.
	gameContext.fillStyle = "#cfe";
	gameContext.fillRect(
		playerHorizontalDrawing, playerVerticalDrawing,
		player.width, player.height);

	if (drawCursor){
		// Draw the cursor.
		gameContext.drawImage(cursorImg, 
			onCanvasMousePosition.x, onCanvasMousePosition.y,
			12, 12);

		let finalPadding = cellPadding;
		if (mousedown) finalPadding += (cellPadding * (25/100));

		// Paint the cell that is under the cursor.
		let selectedCell = grid.positionOfCellAt(onCanvasMousePosition.x,  onCanvasMousePosition.y);
		// Get the margins of the fill -> padding% of cell width and height.
		let selectedCellFillMarginHorizontal = cellWidth*(finalPadding/100);
		let selectedCellFillMarginVertical = cellHeigth*(finalPadding/100);
		// Get the fill area -> (100-(padding*2))% of width and height -> center
		let selectedCellFillWidth = cellWidth*((100-(finalPadding*2))/100);
		let selectedCellFillHeight = cellHeigth*((100-(finalPadding*2))/100);
		// Get the fill position considering the margin
		let selectedCellFillPosition = {
			x: selectedCellFillMarginHorizontal + (cellWidth*selectedCell.x),
			y: selectedCellFillMarginVertical + (cellHeigth*selectedCell.y),
		}
		// Paint
		gameContext.fillStyle = "rgba(247, 189, 143, 0.5";
		gameContext.fillRect(
			selectedCellFillPosition.x, selectedCellFillPosition.y,
			selectedCellFillWidth, selectedCellFillHeight);
		
		if (mousedown){
			A_Star(player.position, selectedCell, grid);
		}
	}
}


// Clear the grid canvas.
function clearGrid(){
	gridContext.clearRect(0, 0, gridCanvas.width, gridCanvas.height);
}
// Draw the grid cols and rows at grid canvas.
function drawGrid(){
	gridContext.strokeStyle = "white";
	for( let x = 0; x < grid.cols; x++ ){
		gridContext.moveTo(x * cellWidth, 0);
		gridContext.lineTo(x * cellWidth, grid.rows*cellHeigth );
	}
	gridContext.stroke();
	for( let y = 0; y < grid.rows; y++ ){
		gridContext.moveTo(0, y * cellHeigth);
		gridContext.lineTo(grid.cols*cellWidth, y * cellHeigth );
	}
	gridContext.stroke();
}