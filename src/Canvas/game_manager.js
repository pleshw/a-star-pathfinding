let gameCanvas;
let gameContext;

let backgroundCanvas;
let backgroundContext;

let gridCanvas;
let gridContext;

let grid;
let cellWidth, cellHeight;
let cellPadding = 1; // percentage

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
	}, {passive: true});
	gameCanvas.addEventListener("mouseout", _event => {
		drawCursor = false;
	}, {passive: true});

	gameCanvas.addEventListener("mousedown", _event => {
		mousedown = true;
	}, {passive: true});
	gameCanvas.addEventListener("mouseup", _event => {
		mousedown = false;
	}, {passive: true});
	gameCanvas.addEventListener("touchstart", _event => {
		mousedown = true;
		drawCursor = true;
		onCanvasMousePosition = getTouchPosition(gameCanvas, _event);
	},{passive: true});

	gameCanvas.addEventListener("mousemove", _event => {
		onCanvasMousePosition = getMousePosition(gameCanvas, _event);
	}, {passive: true});
	gameCanvas.addEventListener("touchmove", _event => {
		onCanvasMousePosition = getTouchPosition(gameCanvas, _event);
	}, {passive: true});



	Setup();
	setInterval( function(){Draw();}, 1000/30 );
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
	let gridRows = 22;
	let gridCols = 54;
	cellWidth = gridCanvas.width/gridCols;
	cellHeight = gridCanvas.height/gridRows;
	grid = new Grid( gridRows, gridCols, cellWidth, cellHeight );
	
	for(let y = 0; y < 19; y++){grid.block(13, y);}

	for(let y = 0; y < 19; y++){grid.block(21, y);}

	// drawGrid();

	// remove the default cursor
	gameCanvas.style.cursor = "none";
	// Instantiating the new player variables.
	const maxHp = 20; 
	const maxSp = 5;
	const width = 14;
	const height = 8; 
	// make a player at the bottom left of the grid.
	player = new Player( 
		0, 12, 
		maxHp, maxSp, 
		width, height
	);

	cursorImg.src = "src/img/Cursor.png";
}


// Draw the game.
function Draw() {
	// Clear the canvas.
	gameContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);


	for(let y = 0; y < grid.rows; y++)
		for(let x = 0; x < grid.rows; x++){
			if (grid.isBlocked(x, y)){
				gameContext.fillStyle = "lightgrey";
				gameContext.fillRect(
					x*cellWidth, y*cellHeight,
					cellWidth, cellHeight);
			}
		}

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
		if (mousedown && grid.isFree(selectedCell.x, selectedCell.y)){
			let v = A_Star(player.position, selectedCell, grid);
			if (v != -1) {
				gameContext.setLineDash([]);
				gameContext.beginPath();
				gameContext.strokeStyle = "rgba(142, 32, 58, .6)";
				v.forEach( (element, index, array) =>{
					if (array[index+1]){			
						gameContext.moveTo(
							cellWidth*(element.x)+(cellWidth/2), 
							cellHeight*(element.y)+(cellHeight/2));
						gameContext.lineTo(
							cellWidth*array[index+1].x+(cellWidth/2), 
							cellHeight*array[index+1].y+(cellHeight/2));
					}
					gameContext.endPath;
					// gameContext.fillStyle = "rgba(142, 32, 58, .6)";
					// gameContext.fillRect(
					// 	cellWidth*element.x, cellHeight*element.y,
					// 	cellWidth, cellHeight);
					gameContext.stroke();
				});
				player.x = v[v.length-2].x;
				player.y = v[v.length-2].y;
			}
			// console.log(Array.from(v)[1][1]);
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
		gameContext.beginPath();
		gameContext.strokeStyle = "white";
		gameContext.strokeRect(
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