/*
	This class implements a grid.

	A grid is a bunch of cells, each one filled with a byte value.

	Cell representation: { 
		Free: 1
		Occupied: 2
		Blocked: 4
	}
	** Other values can have any interpretation.

	Consider a cell that represents a bathroom and is occupied[2] and closed[8] 
		the value for this cell will be 5.
	To check if this bathroom is free you can use bitwise operations like this
		if(cell & free == free) isFree = true;
			selected cell byte representation: 	0000 1010[10]
			free cell byte representation: 		0000 0001[0]
												------------
												0000 0000 -> false
 */

 let FREE = 1;
 let SELECTED = 2;
 let OCCUPIED = 4;
 let BLOCKED = 8;

class Grid{
	constructor( rows, cols, cellWidth, cellHeight ){
		this.r = rows;
		this.c = cols;

		// Array of cells.
		this.cell = [];

		this.cellWidth = cellWidth;
		this.cellHeight = cellHeight;

		for( let i = 0; i < rows * cols; i++ )
			this.cell[i] = 1;
	}

	get rows(){
		return this.r;
	}

	get cols(){
		return this.c;
	}

	get length(){
		return this.rows * this.cols;
	}

	get buffer(){
		return this.cell;
	}

	index( x, y ){
		return x + ( y * this.cols );
	}

	isFree( x, y ){
		return isBitOn( this.cell[this.index(x,y)], FREE );
	}

	isSelected( x, y ){
		return isBitOn( this.cell[this.index(x,y)], SELECTED );
	}

	isOcuppied( x, y ){
		return isBitOn( this.cell[this.index(x,y)], OCCUPIED );
	}

	isBlocked( x, y ){
		return isBitOn( this.cell[this.index(x,y)], BLOCKED );
	}

	select( x, y ){
		if (!this.isSelected(x, y)){
			this.cell[this.index(x,y)] += SELECTED;
			return true;
		}
		return false;
	}

	// return the position considering the grid an matrix of a cell in a given position.
		// This function consider a cell as an element in space
		// This function return the position on the buffer[x,y] of a cell in a given position.
		/*
			Example: cell at position 8,0 on canvas is the cell at position 1 on buffer.
		 */ 
	cellAt( x, y ){
		let final_x = Math.floor(x/this.cellWidth);
		let final_y = Math.floor(y/this.cellHeight);
		return this.index(final_x, final_y);
	}

	// Return the same as cellAt function, but as an 2d coordinate.
	positionOfCellAt( x, y ){
		return { 
			x: Math.floor(x/this.cellWidth),
			y: Math.floor(y/this.cellHeight)
		}
	}
}