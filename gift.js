const SANTA_IMG = Ramu.Utils.getImage('img/santa.png');
const COLORS = ['RED', 'GREEN', 'BLUE', 'YELLOW', 'PINK'];
const GIFTS = {
	RED: 	new Rect(112, 0, 9, 12),
	GREEN: 	new Rect(112, 12, 9, 12),
	BLUE: 	new Rect(112, 24, 9, 12),
	YELLOW: new Rect(112, 36, 9, 12),
	PINK: 	new Rect(112, 48, 9, 12)
};

Rect.prototype.copy = function(){
	return new Rect(this.x, this.y, this.width, this.height);
}

class Gift extends SimpleRectCollisor {
	static instance(x, y, color, toLeft){
		let gift = new Gift(x, y, 9, 12);
		// Creating the property
		gift.toLeft = toLeft;
		gift.sprite = new Spritesheet(SANTA_IMG, GIFTS[color], x, y, 9, 12);
		gift.sprite.drawPriority = 3;
		
		gift.tag = color;
		return gift;
	}

	update(){
		let vel = 20 * Ramu.time.delta;
		
		this.y += vel + 0.5;
		this.sprite.y = this.y;
		
		if (this.toLeft)
			vel = -vel;
		
		this.x += vel/2;
		this.sprite.x = this.x;
		
				
		if (Ramu.Utils.isOutOfCanvas(this))
			this.destroy();
	}
	
	onCollision(){
		for (let i in this.collision){
			if (this.collision[i].tag === this.tag){
				game.score++;
				this.tag = 'none';
				break;
			} /* else game.score--; */	
			
			if (this.collision[i].tag !== 'snow')
				new Destroyer(0.3, this); 
		}
	}
	
	destroy(){
		this.sprite.destroy();
		super.destroy();
	}
}

class Santa extends SpritesheetAnimation {
	constructor(x, y){
		super(SANTA_IMG, x, y, 111, 46);
		this.addFrame([new Rect(0, 0, 111, 46), new Rect(0, 46, 111, 46)]);
		this.timeToThrow = 1.5;
		this.currentTimeToThrow = 1.5;
		
		this.remainedColors = [];
		this.currentColor = '1';
		this.setRandColor();
		
		this.drawPriority = 2;
	}
	
	setRandColor(){
		if (this.remainedColors.length === 0)
			this.remainedColors = COLORS.slice()
		
		let index = 0;
		let tempColor = '';
		
		// to avoid the last color of previous array be the same as the new copy
		do {
			index = Math.trunc(Math.random() * this.remainedColors.length);
			tempColor = this.remainedColors[index];
		} while(this.currentColor === tempColor)
		
		this.currentColor = tempColor;
		this.remainedColors.splice(index, 1);
	}
	
	throwGift(left){
		Gift.instance(this.x + 95, this.y + 11, this.currentColor, left);
		this.currentTimeToThrow = 0;
		this.setRandColor();
	}
	
	input(){
		this.currentTimeToThrow += Ramu.time.delta;
		if (this.currentTimeToThrow >= this.timeToThrow){
			if (keyCode.q in Ramu.lastKeysPressed)
				this.throwGift(true);
			
			if (keyCode.e in Ramu.lastKeysPressed)
				this.throwGift(false);
		}

		let pos = 100 * Ramu.time.delta;
		
		if (keyCode.a in Ramu.pressedKeys || keyCode.left_arrow in Ramu.pressedKeys){
			if (this.x - pos >= 0) 
				this.x -= pos;
		} 
		
		else if (keyCode.d in Ramu.pressedKeys || keyCode.right_arrow in Ramu.pressedKeys){
			if (this.x + this.width + pos <= Ramu.width)
				this.x += pos;
		}
	}
}

class GiftGame extends GameObj {
	start() {
		this.santaDefX =  194;
		this.defaulFrame = new Rect(113, 61, 10, 9);
		
		this.score = 0;
		this.secs = 60;
		this.secsLeft = this.secs;
		this.started = false; 
		
		this.setScene();
		this.setUI();
		this.setObjs();
	}
	
	setScene(){
		this.sky = new SpriteAnimation(0, 0, 500, 500);
		this.sky.animationTime = 1;
		this.sky.addFrame([Ramu.Utils.getImage('img/sky_night1.png'), 
						   Ramu.Utils.getImage('img/sky_night2.png')]);
		
		this.chimneys = new Sprite(Ramu.Utils.getImage('img/chimney.png'), 50, 359, 380, 23);
		this.chimneys.drawPriority = 4;
		
		let empty = new Image();
		this.snowControl = new SnowController();
		this.snowControl.snowingSky = empty;
		this.snowControl.clearSky = empty;
		
		this.audio = new Ramu.Audio('https://upload.wikimedia.org/wikipedia/commons/f/f0/Jingle_Bells_%2890bpm%29_%28Kevin_MacLeod%29_%28ISRC_USUAN1100187%29.oga');	
	}
	
	setObjs(){
		this.santa = new Santa(this.santaDefX, 100);
	
		this.blueHouse = new SimpleRectCollisor(50, 359, 17, 2);
		this.blueHouse.tag = 'BLUE';
		this.greenHouse = new SimpleRectCollisor(98, 357, 17, 2);
		this.greenHouse.tag = 'GREEN';
		this.redHouse = new SimpleRectCollisor(194, 357, 17, 2);
		this.redHouse.tag = 'RED';
		this.yellowHouse = new SimpleRectCollisor(363, 363, 17, 2);
		this.yellowHouse.tag = 'YELLOW';
		this.pinkHouse = new SimpleRectCollisor(412, 357, 17, 2);
		this.pinkHouse.tag = 'PINK';
	}
	
	setUI(){		
		this.giftFrame = new Spritesheet(SANTA_IMG, this.defaulFrame, 461, 11, 30, 38);
		
		this.scoreTxt = new Text('score: 00', 451, 61, 100);
		this.scoreTxt.fillStyle = '#ffffff';
		
		this.playTxt = new Text('press space to play', 500/2 - 40, 500/2, 100);
		this.playTxt.fillStyle = '#ffffff';
		
		this.secTxt = new Text('60', 10, 53, 100);
		this.secTxt.fillStyle = '#ffffff';
		this.secTxt.font = '60px sans-serif';
		
		this.timeTxt = new Text('left', 33, 73, 100);
		this.timeTxt.fillStyle = '#ffffff';
		this.timeTxt.font = '15px sans-serif';		
	}
	
	updateUI(){
		this.secsLeft -= Ramu.time.delta;
		let txt = Math.trunc(this.secsLeft).toString();
		this.secTxt.text = txt.length == 1 ? '0' + txt : txt;
		
		this.scoreTxt.text = 'score: ' + this.score;
		
		let rc = GIFTS[this.santa.currentColor].copy();
		this.giftFrame.setSheet(new Rect(rc.x + 1, rc.y + 3, this.defaulFrame.width, this.defaulFrame.height));
	}
	
	update() {
		if (this.secsLeft <= 0.000 && this.started){
			this.audio.stop();
			this.playTxt.canDraw = true;
			this.started = false;
			this.santa.x = this.santaDefX;
			this.secsLeft = this.secs;
			this.giftFrame.setSheet(this.defaulFrame);
		}
		
		if (!this.started){			
			if (keyCode.space in Ramu.lastKeysPressed){
				this.audio.play();
				this.playTxt.canDraw = false;
				this.started = true;
				this.score = 0;
			}
			return;
		}

		this.updateUI();
		this.santa.input();
	}
}

var game = new GiftGame();
Ramu.init();
// Ramu.debugMode = true;
