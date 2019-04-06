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
 let OCCUPIED = 2;
 let BLOCKED = 4;

class Grid{
	constructor( rows, cols ){
		this.r = rows;
		this.c = cols;

		// Array of cells.
		this.cell = [];
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

	isOcuppied( x, y ){
		return isBitOn( this.cell[this.index(x,y)], OCCUPIED );
	}

	isBlocked( x, y ){
		return isBitOn( this.cell[this.index(x,y)], BLOCKED );
	}
}