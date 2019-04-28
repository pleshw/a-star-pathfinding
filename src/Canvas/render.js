function drawGrid(){
	// Draw the grid cols and rows at grid canvas.
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
	// draw the barriers
	gridContext.fillStyle = "rgba(120, 100, 100, .8)";
	for(let y = 0; y < grid.rows; y++)
		for(let x = 0; x < grid.cols; x++)
			if (grid.isBlocked(x, y))
				gridContext.fillRect(
					x*cellWidth, y*cellHeight,
					cellWidth, cellHeight);
}

function clearGrid(){
	gridContext.clearRect(0, 0, gridCanvas.width, gridCanvas.height);
}

function updateGrid(){
	clearGrid();
	drawGrid();
}

function drawCursor( position, withBorder = false ){
		// Get the actual cell position in space
		const selectedCellCanvasPosition = {
			x: (cellWidth*selectedCell.x),
			y: (cellHeight*selectedCell.y),
		}
		if (withBorder) {
			// Paint the cell borders
			gameContext.beginPath();
			gameContext.strokeStyle = "rgba(254,254,254, .6)";
			gameContext.strokeRect(
				selectedCellCanvasPosition.x, selectedCellCanvasPosition.y,
				cellWidth, cellHeight);
			gameContext.endPath;
		}
		// Draw the cursor.
		gameContext.drawImage(cursorImg, 
			onCanvasMousePosition.x, onCanvasMousePosition.y,
			32, 32);
}



/** Recieve an array of positions(`as path`) 
	and an color then draw the path made on grid */ 
function drawPath( path, color = "rgba(242, 32, 58, .5)" ){
	gameContext.beginPath();
	gameContext.strokeStyle = color;
	
	path.forEach( (element, index, array) =>{
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
}



function drawObject( gameObj )
{
	/** Get the center of the cell that the object is positioned at. */
	const objHorizontalDrawing = ((2*cellWidth*gameObj.position.x) + cellWidth  - gameObj.width)/2;
	const objVerticalDrawing = ((2*cellHeight*gameObj.position.y) + cellHeight  - gameObj.height)/2;

	/** Draw the player at the center of the cell. */
	gameContext.fillStyle = "darkorange";
	gameContext.fillRect(
		objHorizontalDrawing, objVerticalDrawing,
		gameObj.width, gameObj.height);
}