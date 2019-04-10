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

 var FREE = 1;
 var SELECTED = 2;
 var OCCUPIED = 4;
 var BLOCKED = 8;

class Grid{
	constructor( rows, cols, cellWidth, cellHeight ){
		this._rows = rows;
		this._cols = cols;

		// Array of cells.
		this.cell = [];

		this.cell_width = cellWidth;
		this.cell_height = cellHeight;

		for( let i = 0; i < rows * cols; i++ )
			this.cell[i] = 1;
	}

	get rows(){
		return this._rows;
	}

	get cols(){
		return this._cols;
	}

	copy( clone ){
		for(let y = 0; y < this.rows; y++)
			for(let x = 0; x < this.rows; x++){
				this.cell[this.index(x,y)] = clone.cell[grid.index(x,y)];
			}
	}

	get cellWidth(){
		return this.cell_width;
	}

	get cellHeight(){
		return this.cell_height;
	}

	get length(){
		return this.rows * this.cols;
	}

	get buffer(){
		return this.cell;
	}

	index( x, y ){
		if (!this.cellExist(x, y)) return -1;
		return x + ( y * this.cols );
	}

	cellAt( x, y ){
		if (!this.cellExist(x, y)) return -1;
		 return this.cell[this.index(x, y)];
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

	free( x, y ){
		if (!this.isFree(x, y)){
			if (this.isBlocked(x, y)) this.cell[this.index(x,y)] -= BLOCKED;
			if (this.isOcuppied(x, y)) this.cell[this.index(x,y)] -= OCCUPIED;
			this.cell[this.index(x,y)] += FREE;
			return true;
		}

		return false;
	}

	block( x, y ){
		if (!this.isBlocked(x, y)){
			if (this.isFree(x, y)) this.cell[this.index(x,y)] -= FREE;
			if (this.isOcuppied(x, y)) this.cell[this.index(x,y)] -= OCCUPIED;
			this.cell[this.index(x,y)] += BLOCKED;
			return true;
		}

		return false;
	}

	// return true if the cell is valid
	cellExist( x, y ){
		if (x < 0 || y < 0) return false;
		if (x >= this.cols || y >= this.rows) return false;
		return true;
	}



	// return the cell state of adjacent cells to the cell at given position.
	adjacentsOf( x, y ){
		return{
			top: this.cellAt(x, y-1),
			right:  this.cellAt(x+1, y),
			bottom: this.cellAt(x, y+1),
			left: this.cellAt(x-1, y),
			diagonalTopRight: this.cellAt(x+1, y-1),
			diagonalTopLeft: this.cellAt(x-1, y-1),
			diagonalBottomRight: this.cellAt(x+1, y+1),
			diagonalBottomLeft: this.cellAt(x-1, y+1)
		};
	}

	// return the position of any valid cell that is adjacent to the cell at given position.
	positionOfAdjacents( x, y ){
		let adjacents = [
			 {x: x,   y: y-1},
			 {x: x+1, y: y},
			 {x: x,   y: y+1},
			 {x: x-1, y: y},
			 {x: x+1, y: y-1},
			 {x: x-1, y: y-1},
			 {x: x+1, y: y+1},
			 {x: x-1, y: y+1}
		];
		return adjacents.filter( _pos=>{return this.cellExist(_pos.x, _pos.y);} );
	}

	// return the position of any valid cell that is adjacent to the cell at given position.
	positionOfAdjacentsWithNoDiagonals( x, y ){
		let adjacents = [
			 {x: x,   y: y-1},
			 {x: x+1, y: y},
			 {x: x,   y: y+1},
			 {x: x-1, y: y}
		];
		return adjacents.filter( _pos=>{return this.cellExist(_pos.x, _pos.y);} );
	}

	// return the state of a cell
		// if it does not exist return -1.
	cellInSpace( x, y ){
		if ( !this.cellExist(x, y) ) return -1; 
		return this.cell[this.indexOfCellInSpace(x, y)];
	}

	// return the position considering the grid an matrix of a cell in a given position.
		// This function consider a cell as an element in space
		// This function return the position on the buffer[x,y] of a cell in a given position.
		/*
			Example: cell at position 8,0 on canvas is the cell at position 1 on buffer.
		 */ 
	indexOfCellInSpace( x, y ){
		let final_x = Math.floor(x/this.cell_width);
		let final_y = Math.floor(y/this.cell_height);
		return this.index(final_x, final_y);
	}

	// Return the same as cellInSpace function, but as an 2d coordinate.
	positionOfCellInSpace( x, y ){
		return { 
			x: Math.floor(x/this.cell_width),
			y: Math.floor(y/this.cell_height)
		}
	}
}