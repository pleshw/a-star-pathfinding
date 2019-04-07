

// BIT representation for bitwise operations with movement. Explanation on `grid.js`
const TOP = 1;
const RIGHT = 2;
const LEFT = 4;
const BOTTOM = 8;
const DIAGONAL_TOP_RIGHT = TOP + RIGHT;
const DIAGONAL_TOP_LEFT = TOP + LEFT;
const DIAGONAL_BOTTOM_RIGHT = BOTTOM + RIGHT;
const DIAGONAL_BOTTOM_LEFT = BOTTOM + LEFT;

class GameObject {
	constructor( x, y, w, h ){
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}

	get position(){
		return {
			x: this.x,
			y: this.y
		};	
	}

	// The position will be the center of the object.
	get spriteCenterPosition(){
		return {
			x: this.x + (this.width/2),
			y: this.y + (this.height/2)
		};
	}

	get width(){
		return this.w;
	}

	get height(){
		return this.h;
	}

	move( bitOfMovement ){
		if (isBitOn(bitOfMovement, TOP)) this.y--;
		if (isBitOn(bitOfMovement, RIGHT)) this.x++;
		if (isBitOn(bitOfMovement, BOTTOM)) this.y++;
		if (isBitOn(bitOfMovement, LEFT)) this.x--;
	}
}