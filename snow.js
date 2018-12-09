"use strict";

/*
	Sistema de Neve

	- O sistema deve fazer cair flocos neve no mapa escolhido;
	- O sistema deve ser configurável para que:

		1) A neve pode começar (e parar) em um momento aleatório;

		2) A neve pode começar (e parar) ao interagir com um evento;

		3) A intensidade dos flocos de neve seja configurada (pouco, médio ou muitos).
*/

Panorama.prototype.setImage = function(img){
	if (!(img instanceof Image)) throw Ramu.Utils.CustomTypeError(img, Image);

	this.left.img = img;
	this.center.img = img;
	this.right.img = img;
};

const SNOW_IMG = Ramu.Utils.getImage("img/snow.png");

class Snow extends Sprite{
	constructor(x = 1, y = 4, vel = 40){
		super(SNOW_IMG, x, y, 10, 10);
		this.colisor = new SimpleRectCollisor(x, y, 10, 10);
		this.fallVelocity = vel;
	}
	
	start(){
		
		
	}
	
	fall(){
		this.y += this.fallVelocity * Ramu.time.delta;
		this.colisor.y += this.fallVelocity * Ramu.time.delta;	
	}
	
	update(){
		this.fall();
		
		if (this.y > Ramu.height)
			this.destroy();
	}
}



class SnowController extends GameObj{
	start(){
		this.itensity = {
			none: 0, little: 1, averange: 2, much: 3
			
		};
		
		this.snowingSky = Ramu.Utils.getImage("img/sky.png");
		this.clearSky = Ramu.Utils.getImage("img/sky_obscured.png");
		
		this.sky = new Panorama(this.clearSky, 0, 0, 500, 500, 10);
		
	}

	update(){
	
	}
}



class Game extends GameObj{
	start(){
		new Snow();
		new SnowController();
	}

	update(){
	
	}
}


var game = new Game();
Ramu.init(500, 500);
Ramu.debugMode = true;