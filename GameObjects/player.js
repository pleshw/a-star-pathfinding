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

	get stillCanMove(){
		return this.moves;
	}

	newTurn(){
		this.moves = this.maxMoves;
	}

}