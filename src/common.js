 function isBitOn( byte, bit ){
 	return (byte & bit) == bit;
 }

function removeFromArray( arr, elmnt ){
	for (let i = arr.length - 1; i >= 0; i--) {
		if (arr[i] == elmnt) 
			arr.splice(i, 1);
	}
}

function heuristicEvaluate( a, b ){
	const distance = distance2d( a.x, a.y, b.x, b.y );
	return distance;
}

function collide( element1 , element2 ){
	if( element2.x > element1.x 
		&& element2.x < element1.x + 10  
		&& element2.y > element1.y 
		&& element2.y < element1.y + 10) return true;
	return false; 
}

function distance2d( x1, y1, x2, y2 ){
	const a = x2 - x1;
	const b = y2 - y1;
	return Math.sqrt( (a**2) + (b**2) );
}


class Stack{
	constructor(){
		this.arr = [];
	}
	get top(){
		return this.arr[0];
	}
	pop(){
		const tmp = this.arr[0];
		this.arr.pop();
		return tmp;
	}
	push(v){
		this.arr.push(v);
	}
	size(){
		return this.arr.size();
	}
	empty(){
		return this.arr.size() <= 0;
	}
}