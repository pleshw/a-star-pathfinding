let gameCanvas;
let gameContext;

let backgroundCanvas;
let backgroundContext;

let gridCanvas;
let gridContext;

let grid;
let cellWidth, cellHeight;
let cellPadding = 20; // percentage

let mouseOnCanvas = false;
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
		mouseOnCanvas = true;
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
	gameCanvas.width = gridCanvas.width = backgroundCanvas.width  = window.innerWidth;
	gameCanvas.height = gridCanvas.height = backgroundCanvas.height  = window.innerHeight;

	// Draw the background
	backgroundContext.fillStyle = "black";
	backgroundContext.fillRect( 0, 0, gameCanvas.width, gameCanvas.height );

	// Setup and draw the grid.
	let gridRows = 19;
	let gridCols = 30;
	cellWidth = gridCanvas.width/gridCols;
	cellHeight = gridCanvas.height/gridRows;
	grid = new Grid( gridRows, gridCols, cellWidth, cellHeight );
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
	playerVerticalDrawing = ((2*cellHeight*player.position.y) + cellHeight  - player.height)/2;
	// Draw the player at the center of the cell.
	gameContext.fillStyle = "#cfe";
	gameContext.fillRect(
		playerHorizontalDrawing, playerVerticalDrawing,
		player.width, player.height);

	if (drawCursor && mouseOnCanvas){
		let finalPadding = cellPadding;
		if (mousedown) finalPadding += (cellPadding * (25/100));

		// Paint the cell that is under the cursor.
		let selectedCell = grid.positionOfCellInSpace(onCanvasMousePosition.x,  onCanvasMousePosition.y);

		// On mouse down finds the way to the cursor
		if (mousedown){
			gameContext.fillStyle = "rgba(162, 132, 232, 0.3)";
			A_Star(player.position, selectedCell, grid).forEach( element =>{
				gameContext.fillRect(
					cellWidth*element.x, cellHeight*element.y,
					cellWidth, cellHeight);
			});
		}
		
		// Get the margins of the fill -> padding% of cell width and height.
		let selectedCellFillMarginHorizontal = cellWidth*(finalPadding/100);
		let selectedCellFillMarginVertical = cellHeight*(finalPadding/100);
		// Get the fill area -> (100-(padding*2))% of width and height -> center
		let selectedCellFillWidth = cellWidth*((100-(finalPadding*2))/100);
		let selectedCellFillHeight = cellHeight*((100-(finalPadding*2))/100);
		// Get the fill position considering the margin
		let selectedCellFillPosition = {
			x: selectedCellFillMarginHorizontal + (cellWidth*selectedCell.x),
			y: selectedCellFillMarginVertical + (cellHeight*selectedCell.y),
		}
		// Paint
		gameContext.fillStyle = "rgba(149, 189, 247, 0.5)";
		gameContext.fillRect(
			selectedCellFillPosition.x, selectedCellFillPosition.y,
			selectedCellFillWidth, selectedCellFillHeight);

		// Draw the cursor.
		gameContext.drawImage(cursorImg, 
			onCanvasMousePosition.x, onCanvasMousePosition.y,
			12, 12);
	}
}


// Clear the grid canvas.
function clearGrid(){
	gridContext.clearRect(0, 0, gridCanvas.width, gridCanvas.height);
}
// Draw the grid cols and rows at grid canvas.
function drawGrid(){
	gridContext.strokeStyle = "lightgrey";
	for( let x = 0; x < grid.cols+1; x++ ){
		gridContext.moveTo(x * cellWidth, 0);
		gridContext.lineTo(x * cellWidth, grid.rows*cellHeight );
	}
	gridContext.stroke();
	for( let y = 0; y < grid.rows+1; y++ ){
		gridContext.moveTo(0, y * cellHeight);
		gridContext.lineTo(grid.cols*cellWidth, y * cellHeight );
	}
	gridContext.stroke();
}