let gameCanvas;
let gameContext;

let backgroundCanvas;
let backgroundContext;

let gridCanvas;
let gridContext;

let grid;
let cellWidth, cellHeight;

let mouseOnCanvas = false;
let onCanvasMousePosition;
let mouseReady = false;
let drawCursor = false;
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
		rightclick = true;
		drawCursor = true;
		onCanvasMousePosition = getTouchPosition(gameCanvas, _event);
	},{passive: true});
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
	const gridRows = 22;
	const gridCols = 54;
	cellWidth = gridCanvas.width/gridCols;
	cellHeight = gridCanvas.height/gridRows;
	grid = new Grid( gridRows, gridCols, cellWidth, cellHeight );
	// // make 5 barriers.
	// for(let y = 0; y < 21; y++){grid.block(11, y);}
	// for(let y = 0; y < 21; y++){grid.block(12, y);}
	// for(let y = 0; y < 19; y++){grid.block(13, y);}
	// for(let y = 0; y < 19; y++){grid.block(21, y);}
	// for(let j = 0; j < 19; j++){grid.block(22, j);}
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
		0, 12, 
		maxHp, maxSp, 
		width, height
	);

	cursorImg.src = "src/img/cursor_1.png";
}


// Control the game logic { player movement, game time, monsters etc... }
function Logic(){
	// make the player movement
	player.move();
}


// Draw the game.
function Draw() {
	Logic();

	// Clear the canvas.
	gameContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

	gameContext.fillStyle = "rgba(222, 173, 244, .4)";
	gameContext.font = "20px Arial";
	gameContext.fillText("Click to walk.", 10, 50);

	gameContext.fillStyle = "lightgrey";
	for(let y = 0; y < grid.rows; y++)
		for(let x = 0; x < grid.cols; x++)
			if (grid.isBlocked(x, y))
				gameContext.fillRect(
					x*cellWidth, y*cellHeight,
					cellWidth, cellHeight);

	// if player have moves draw the player path
	gameContext.beginPath();
	gameContext.strokeStyle = "rgba(242, 32, 58, .5)";
	if (player.movesLeft > 0)
		player.path.forEach( (element, index, array) =>{
			if (array[index+1]){			
				gameContext.moveTo(
					cellWidth*(element.x)+(cellWidth/2), 
					cellHeight*(element.y)+(cellHeight/2));
				gameContext.lineTo(
					cellWidth*array[index+1].x+(cellWidth/2), 
					cellHeight*array[index+1].y+(cellHeight/2));
			}
		}); // for each end
	// if end
	gameContext.stroke();
	gameContext.endPath;

	// Get the player drawing position.
	const playerHorizontalDrawing = ((2*cellWidth*player.position.x) + cellWidth  - player.width)/2;
	const playerVerticalDrawing = ((2*cellHeight*player.position.y) + cellHeight  - player.height)/2;
	// Draw the player at the center of the cell.
	gameContext.fillStyle = "rgba(182, 133, 244, .9)";
	gameContext.fillRect(
		playerHorizontalDrawing, playerVerticalDrawing,
		player.width, player.height);

	if (mouseReady){
		// get the cell that is under the cursor.
		const selectedCell = grid.positionOfCellInSpace(onCanvasMousePosition.x,  onCanvasMousePosition.y);

		// On mouse down finds the way to the cursor and change the player path
		if (mousedown){
			const v = A_Star(player.position, selectedCell, grid);
			if (v != -1)
				player.path = v;
		}		

		// Get the actual cell position in space
		const selectedCellFillPosition = {
			x: (cellWidth*selectedCell.x),
			y: (cellHeight*selectedCell.y),
		}

		// Paint
		gameContext.beginPath();
		gameContext.strokeStyle = "rgba(254,254,254, .6)";
		gameContext.strokeRect(
			selectedCellFillPosition.x, selectedCellFillPosition.y,
			cellWidth, cellHeight);
		gameContext.endPath;

		// Draw the cursor.
		gameContext.drawImage(cursorImg, 
			onCanvasMousePosition.x, onCanvasMousePosition.y,
			8, 8);
	}
}

// Clear the grid canvas.
function clearGrid(){
	gridContext.clearRect(0, 0, gridCanvas.width, gridCanvas.height);
}

// Draw the grid cols and rows at grid canvas.
function drawGrid(){
	gridContext.strokeStyle = "rgba(184,184,184, .1)";
	for( let x = 0; x < grid.cols+1; x++ ){
		gridContext.moveTo(x * cellWidth, 0);
		gridContext.lineTo(x * cellWidth, grid.rows*cellHeight );
	}
	for( let y = 0; y < grid.rows+1; y++ ){
		gridContext.moveTo(0, y * cellHeight);
		gridContext.lineTo(grid.cols*cellWidth, y * cellHeight );
	}
	gridContext.stroke();
}