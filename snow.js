"use strict";

/*
	Sistema de Neve by Hermes Passer with Ramu 0.7b

	[x] - O sistema deve fazer cair flocos neve no mapa escolhido;
	
	[ ] - O sistema deve ser configurável para que:
	
		[x]	1) A neve pode começar (e parar) em um momento aleatório;

		[ ]	2) A neve pode começar (e parar) ao interagir com um evento;

		[x]	3) A intensidade dos flocos de neve seja configurada (pouco, médio ou muitos).
*/

Panorama.prototype.setImage = function(img){
	if (!(img instanceof Image)) throw Ramu.Utils.CustomTypeError(img, Image);

	this.left.img = img;
	this.center.img = img;
	this.right.img = img;
};

// to remove the memory leak on 0.7b SimpleParticle
let SimpleParticle_destroy = SimpleParticle.prototype.destroy;
SimpleParticle.prototype.destroy = function(){
	this.canUpdate = false;
	for (let i = 0; i < this.particles.length; i++)
		this.particles[i].destroy();
	
	SimpleParticle_destroy.call(this);
};
	
const SNOW_IMG = Ramu.Utils.getImage("img/snow.png");

class Snow extends Sprite{
	constructor(x = 1, y = 4, vel = 40){
		super(SNOW_IMG, x, y, 10, 10);
		this.colisor = new SimpleRectCollisor(x, y, 10, 10);
		this.colisor.tag = "snow";
		
		this.fallVelocity = vel;
		
		this.swingDirection = 0;
		this.timeToSwing = 1;
		this.currentTime = 2;
		
	}

	fall(){
		this.y += this.fallVelocity * Ramu.time.delta;
		this.colisor.y += this.fallVelocity * Ramu.time.delta;	
	}
	
	swing(){
		this.currentTime += Ramu.time.delta;
		if (this.currentTime >= this.timeToSwing){
			this.swingDirection = Math.trunc(Math.random() * 100);
			this.currenTime = 0;
		}
		
		let dir = SnowController.Wind * Ramu.time.delta;
		if (this.swingDirection > 50) {
			this.x -= dir;
			this.colisor.x -= dir;
		} else {
			this.x -= dir;
			this.colisor.x -= dir;
		}
	}
	
	update(){
		this.fall();
		this.swing();
		
		for (let i in this.colisor.collision)
			if (this.colisor.collision[i].tag !== "snow")
				new Destroyer(0.5, this); // destroy with delay to any object that is in collision with it will have time process it own isInCollision.	
		
		if (this.y > Ramu.height)
			this.destroy();
	}
	
	destroy(){
		super.destroy();
		this.colisor.destroy();
	}
}

class SnowController extends GameObj{
	start(){
		SnowController.Wind = 10;
		
		this.currentItensity = 0;
		this.itensity = {
			none: 0, little: 1, averange: 2, much: 3	
		};
		
		this.snowingSky = Ramu.Utils.getImage("img/sky_obscured.png");
		this.clearSky = Ramu.Utils.getImage("img/sky.png");
		this.sky = new Panorama(this.clearSky, 0, 0, 500, 500, 10);

		this.timeToInstantiate = 4;
		this.currentTimeInstantiate = 0;
		
		this.timeToChangeWeather = 5;
		this.currentTimeWeather = 0;
	}

	update(){
		this.defineWeather();
		this.snow();
	}

	defineWeather(){
		this.currentTimeWeather += Ramu.time.delta;
		
		if (this.currentTimeWeather < this.timeToChangeWeather)
			return;
		
		this.currentTimeWeather = 0;
		this.timeToChangeWeather = Math.random() * 10; // make the time change in a varied way

		let rand = Math.trunc(Math.random() * Object.values(this.itensity).length);
		
		switch(rand){
			case this.itensity.none:
				this.currentItensity = this.itensity.none;
				break;
			case this.itensity.little:
				this.currentItensity = this.itensity.little;
				break;
			case this.itensity.averange:
				this.currentItensity = this.itensity.averange;
				break;
			case this.itensity.much:
				this.currentItensity = this.itensity.much;
				break;
		}
		
		if (Ramu.debugMode)
			console.log("changing wheather to " + this.currentItensity + "...");
	}
	
	snow(){
		this.currentTimeInstantiate += Ramu.time.delta;
		
		if (this.currentTimeInstantiate < this.timeToInstantiate)
			return;
		
		this.currentTimeInstantiate = 0;
		
		switch(this.currentItensity){
			case this.itensity.none:
				this.setNone();
				break;
			case this.itensity.little:
				this.setLittle();
				break;
			case this.itensity.averange:
				this.setAvarange();
				break;
			case this.itensity.much:
				this.setMuch();
				break;
			default:
				this.setSnowhell();
		}	
	}
	
	setNone(){
		this.sky.setImage(this.clearSky);
		this.sky.velocity = 10;
		
		this.timeToInstantiate =  -1;
		SnowController.Wind = 10;
	}
	
	setLittle(){
		this.sky.setImage(this.snowingSky);
		this.sky.velocity = 20;
		
		this.timeToInstantiate =  1.5;
		SnowController.Wind = 15;
		
		new Snow(Math.random() * Ramu.width, -10, 40);
	}
	
	setAvarange(){
		this.sky.setImage(this.snowingSky);
		this.sky.velocity = 30;
		
		this.timeToInstantiate =  1;
		SnowController.Wind = 20;
		
		new Snow(Math.random() * Ramu.width, -10, 80);
	}
	
	setMuch(){
		this.sky.setImage(this.snowingSky);
		this.sky.velocity = 40;
		
		this.timeToInstantiate =  0.5;
		SnowController.Wind = 9;
		
		new Snow(Math.random() * Ramu.width, -10, 160);
	}
	
	setSnowhell(){
		this.sky.setImage(this.snowingSky);
		this.sky.velocity = 100;
		
		this.timeToInstantiate =  0.05;
		SnowController.Wind = 20;
		
		new Snow(Math.random() * Ramu.width, -10, 200);
	}
	
	invokeSnowHell(){
		this.timeToChangeWeather = 20;
		this.currentTimeWeather = 0;
		this.currentItensity = -1;
	}
}


class Game extends GameObj{
	start(){
		this.createGound();
		this.controller = new SnowController();
		
		this.text = new Text("Press space to sacrifice.", 70, 360, 160);
		
		this.cursedSnowmanSprite = new Sprite(Ramu.Utils.getImage("img/snowman.png"), 100, 370, 61, 84);
		this.cursedSnowmanColisor = new SimpleRectCollisor(100, 370, 61, 84);
		
		this.canSacrificy = true;
		this.particle = new SimpleParticle(SNOW_IMG, new Rect(125, 400, 10, 10), 1, 500);
		this.particle.destroyOnEnd = true;
	}

	update(){
		if (keyCode.space in Ramu.pressedKeys && this.canSacrificy){
			this.canSacrificy = false;
			this.text.destroy();
			// this.cursedSnowmanSprite.destroy();
			this.cursedSnowmanColisor.destroy();
			this.particle.init();
			
			new Destroyer(1, this.cursedSnowmanSprite);
						
			this.controller.invokeSnowHell();
		}
	}
	
	createGound(){
		this.groundleft = new Sprite(Ramu.Utils.getImage("img/ground.png"),1,450,200,50);
		this.groundleft.drawPriority = 0;
		this.groundleft_col = new SimpleRectCollisor(-50,450,250,50);
	}
}


var game = new Game();
Ramu.init(500, 500);
// Ramu.debugMode = true;