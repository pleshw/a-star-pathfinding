class GameObject{
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
	get centerPosition(){
		return {
			x: this.x - (this.width/2),
			y: this.y - (this.height/2)
		};
	}

	get width(){
		return this.w;
	}

	get height(){
		return this.h;
	}
}