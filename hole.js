const MINUTES = 1;
const STREET = Ramu.Utils.getImage('img/street.png');
const SHOVEL = Ramu.Utils.getImage('img/shovel.png');

Number.rand = function(max) {
	return Math.floor(Math.random() * max);
}

// cause SimpleSpritesheetButton is no good
class Hole extends Clickable {
	constructor(x, y) {
		super(x, y, 46, 46);
		this.sprite = new Spritesheet(SHOVEL, new Rect(0, 27, 23, 23), x, y, 46, 46);
		this.life = 6;
	}
	
	setRect(rect) {
		if (rect.x + rect.width <= Ramu.width){
			this.x = rect.x;
			this.sprite.x = rect.x;	
		}
		
		if (rect.y + rect.height <= Ramu.height){
			this.sprite.y = rect.y;
			this.y = rect.y;
		}
		
		this.width = rect.width;
		this.height = rect.height;
		this.sprite.width = rect.width;
		this.sprite.height = rect.height;
	}
	
	plug() {
		this.life--;
		this.setRect(new Rect(this.x + 2, this.y + 2, this.width - 5, this.height - 5));
		
		if (this.life <= 0){
			game.plug();
			this.destroy();
			this.sprite.destroy();
		}
	}
	
	onClick() {
		this.plug();
	}
}

class Game extends GameObj {
	start() {
		this.secs = MINUTES * 60;
		this.secsLeft = this.secs;
		this.score = 0;
		this.cappedHoles = 0;
		this.holeMax = 6;
		this.createUI();
		this.createObjs();
		this.digHoles();
	}
	
	createUI() {
		this.secTxt = new Text('60', 5, 25, 100);
		this.secTxt.font = '30px sans-serif';

		this.scoreTxt  = new Text('score', 120, 20, 100);
		this.scoreTxt.font = '20px sans-serif';
	}
	
	createObjs() {
		this.street = new Sprite(STREET, 0, 0, 200, 400);
		this.street.drawPriority = -1;
		this.dig = new Spritesheet(SHOVEL, new Rect(0, 0, 28, 27), 0, 0, 28, 27);
	}
	
	updateUI() {
		if (this.secsLeft <= 0){
			alert(`End game, you got ${this.score} points!`);
			window.location.reload(true);
			Ramu.inLoop = false;
		}
		
		this.secsLeft -= Ramu.time.delta;
		const txt = Math.trunc(this.secsLeft).toString();
		this.secTxt.text = txt.length == 1 ? '0' + txt : txt;
		this.scoreTxt.text = this.score.toString() + " points";
	}
	
	updateObjs() {
		this.dig.x = Ramu.mousePosition.X;
		this.dig.y = Ramu.mousePosition.Y;
	}
	
	update() {
		this.updateUI();
		this.updateObjs();			
	}
	
	digHoles() {
		
		let count = this.holeMax;
		for (let i = 0; i < this.holeMax; ++i){
		console.log(i)
			let x = Number.rand(Ramu.width - 46);
			let y = Number.rand(Ramu.height - 46);
			new Hole(x, y);
		}
	}
	
	plug() {
		this.cappedHoles++;
		this.score++;
		if (this.cappedHoles >= this.holeMax){
			this.holeMax++;
			this.cappedHoles = 0;
			this.digHoles();
		}
	}
}

new SnowController();
var game = new Game();
Ramu.init(200, 400);
