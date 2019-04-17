class Enemie extends GameObject{
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

		this.path = [];
	}

	get movesLeft(){
		return this.path.length;
	}

	get nextStep(){
		return this.path[this.movesLeft-2];
	}

	endTurn(){
		this.moves = 0;
	}

	canMove(){
		if (this.moves > 0) return true;
		return false;
	}

	move(){
		if (!this.movesLeft || this.movesLeft <= 1) return;
		this.x = this.nextStep.x;
		this.y = this.nextStep.y;
		this.path.pop();
	}
}