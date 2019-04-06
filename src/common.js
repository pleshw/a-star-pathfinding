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