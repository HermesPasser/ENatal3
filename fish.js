"use strict";

Boolean.rand = function() {
	return Boolean(Math.floor(Math.random() * 2));
}

Number.rand = function(max) {
	return Math.floor(Math.random() * max);
}

const FISH_IMG = Ramu.Utils.getImage('img/fish.png');

class Fish extends Clickable {
	constructor(r_size, r_sheet, val, vel) {
		super(r_size.x, r_size.y, r_size.width, r_size.height);
		this.sprite = new Spritesheet(FISH_IMG, r_sheet, r_size.x, r_size.y, r_size.width, r_size.height);
		this.sprite.canDraw = false;
		this.enabled = false;
		this.val = val;
		this.vel = vel;
	}
	
	addX(amount) {
		this.x += amount;
		this.sprite.x += amount;
	}
	
	animate() {
		this.enabled = true;
		this.sprite.canDraw = true;
		
		// define the direction
		if (Boolean.rand()) { 
			this.sprite.flipHorizontally = true;
			this.vel = -this.vel;
		}
	}
	
	copy() {
		let size = new Rect(this.x, this.y, this.width, this.height);
		return new Fish(size, this.sprite.sheet, this.val, this.vel);
	}
	
	destroy() {
		this.sprite.destroy();
		super.destroy();
	}
	
	onClick() {
		Ramu._clearInput();
		game.addScore(this.val);
		this.destroy();
	}
	
	setPos(x, y) {
		this.x = x;
		this.y = y;
		this.sprite.x = x;
		this.sprite.y = y;
	}
	
	update() {
		super.update();
		if (!this.enabled)
			return;
				
		this.addX(this.vel * Ramu.time.delta);
		
		if (this.x + this.width < 0)
			this.setPos(Ramu.width, this.y);
		else if (this.x > Ramu.width)
			this.setPos(-this.width, this.y);	
	}
}

class Game extends GameObj{
	start(){
		this.score = 0;
		this.level = 1;
		this.fishLimit = 6;
		this.caughtFish = 0;
		this.tries = 0;
		this.triesLimit = 5;
		this.setObjs();
		this.setUI();
		this.populate();
	}

	setObjs() {
		let difficulty = 10;
		this.baseFish = [
			new Fish(new Rect(-40, -40, 40, 21), new Rect(0, 0, 42, 21), 1, 4 * difficulty),
			new Fish(new Rect(-40, -40, 44, 18), new Rect(0, 21, 44, 18), 5, 8 * difficulty),
			new Fish(new Rect(-40, -40, 37, 24), new Rect(0, 39, 37, 24), 10, 12 * difficulty)	
		];
		this.screenArea = new Clickable(0, 0, Ramu.width, Ramu.height);
		this.screenArea.onClick = function() {
			game.tries++;
		}
	}
	
	setUI(){		
		this.scoreTxt = new Text('score: 0', 1, 10, 100);
		this.levelTxt = new Text('level: 1', 1, 30, 100);		
		this.triesTxt = new Text('tries: ', 1, 50, 100);		
	}
	
	updateUI(){
		this.scoreTxt.text = 'score: ' + this.score;
		this.levelTxt.text = 'level: ' + this.level;
		this.triesTxt.text = `tries: ${this.tries}/${this.triesLimit}`;
	}
	
	update(){
		this.updateUI();
		
		if (this.tries >= this.triesLimit){
			Ramu.inLoop = false;
			alert('You lose!');
			window.location.reload()
		}
	}
	
	populate(level) {
		for (let i = 0; i < this.fishLimit; ++i){
			const index = Number.rand(this.baseFish.length);
			let f = this.baseFish[index].copy();
			let x = Number.rand(Ramu.width);
			let y = Number.rand(Ramu.height);
			f.setPos(x, y);
			f.animate();
		}
	}
	
	addScore(amount) {
		this.score += amount;
		this.caughtFish++;
		this.level++;
		this.tries--; // to cancel the increment on screenArea
		if (this.caughtFish >= this.fishLimit){
			this.populate();	
			this.tries = 0;
			this.caughtFish = 0;
		}
	}
}

var game = new Game();
Ramu.init();
Ramu.canvas.style.backgroundColor = 'cyan';
Ramu.debugMode = true;
