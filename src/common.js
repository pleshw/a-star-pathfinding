 function isBitOn( byte, bit ){
 	return (byte & bit) == bit;
 }


function collide( element1 , element2 ){
	if( element2.x > element1.x 
		&& element2.x < element1.x + 10  
		&& element2.y > element1.y 
		&& element2.y < element1.y + 10) return true;
	return false; 
}

function distance2d( x1, y1, x2, y2 ){
	let a = x2 - x1;
	let b = y2 - y1;
	return Math.sqrt( (a**2) + (b**2) );
}