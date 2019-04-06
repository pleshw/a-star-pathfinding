class Player extends GameObject{
	constructor( x, y, maxHp, maxSp, w, h ){
		super(x, y, w, h);

	// Player main stats.
		this.maxHp = maxHp;
		this.maxSp = maxSp;
		this.hp = this.maxHp;
		this.sp = this.maxSp;


	// Combat variables.
		this.damage = 5;
		this.armor = 0;

		this.moves = 2;
		this.maxMoves = 5;
	}

	get movesLeft(){
		return this.moves;
	}

	endTurn(){
		this.moves = 0;
	}

	canMove(){
		if (this.moves > 0) return true;
		return false;
	}

	move( bitOfMovement ){
		if (!this.canMove()) return false;
		this.moves--; 
		if (isBitOn(bitOfMovement, TOP)) this.y--;
		if (isBitOn(bitOfMovement, RIGHT)) this.x++;
		if (isBitOn(bitOfMovement, BOTTOM)) this.y++;
		if (isBitOn(bitOfMovement, LEFT)) this.x--;

	}
}