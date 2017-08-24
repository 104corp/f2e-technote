function getHello(){
	return "hello";
}

function getWorld(){
	return "world";
}

function getAllString(){
	return getHello() + " " + getWorld();
}

exports.getHello = getHello;
exports.getWorld = getWorld;
exports.getAllString = getAllString;