const MINUTES = 1;
const TREE = Ramu.Utils.getImage('img/tree.png');
const GIFTS = Ramu.Utils.getImage('img/santa.png');
const IMG_RECT = {
	TREE: 		new Rect(0, 0, 88, 83),
	SANTA: 		new Rect(0, 83, 14, 22),
	BALL: 		new Rect(15, 83, 18, 21),
	BELL: 		new Rect(34, 85, 20, 20),
	STAR: 		new Rect(60, 86, 19, 18),
	
	GIFTRED: 	new Rect(112, 0, 9, 12),
	GIFTGREEN: 	new Rect(112, 12, 9, 12),
	GIFTBLUE: 	new Rect(112, 24, 9, 12),
	GIFTYELLOW: new Rect(112, 36, 9, 12),
	GIFTPINK: 	new Rect(112, 48, 9, 12)
};

const POINTS = { // Define your custom points here
	1: 1,
	5: 2,
	10: 20
};

class Game extends GameObj {
	start() {
		this.secs = MINUTES * 60;
		this.secsLeft = this.secs;
		this.score = 0;
		this.currentNumItems = 0;
		this.started = false;
		
		new Spritesheet(TREE, IMG_RECT.TREE, 65, 0, 176, 166);
		
		this.createUI();
		this.createObjs();
	}
	
	createUI() {
		this.secTxt = new Text('60', 10, 53, 100);
		this.secTxt.font = '60px sans-serif';
		this.playTxt = new Text('press space to play', 105, 180, 100);
		
		this.instruction = new Text('type the ornaments count on the tree', 0, 198, 500);

		this.scoreTxt  = new Text('score', 235, 22, 100);
		this.scoreTxt.font = '20px sans-serif';
		this.pointsTxt = new Text('0', 250, 50, 100);
		this.pointsTxt.font = '30px sans-serif';
	}
	
	updateUI() {
		if (this.secsLeft <= 0.000 && this.started){
			this.secsLeft = this.secs;
			Ramu.inLoop = false;
		}
		
		this.secsLeft -= Ramu.time.delta;
		let txt = Math.trunc(this.secsLeft).toString();
		this.secTxt.text = txt.length == 1 ? '0' + txt : txt;
		
		this.pointsTxt.text = this.score.toString();
	}
	
	createObjs() {
		this.items = [];
		// just ignoring the 0 because is easier
		this.items[1] = new Spritesheet(TREE, IMG_RECT.SANTA, 70, 46, 14, 22);
		this.items[2] = new Spritesheet(TREE, IMG_RECT.BALL, 230, 84, 13, 16);
		this.items[3] = new Spritesheet(TREE, IMG_RECT.BELL, 74, 149, 15, 15);
		this.items[4] = new Spritesheet(TREE, IMG_RECT.STAR, 145, -5, 19, 18);
		this.items[5] = new Spritesheet(GIFTS, IMG_RECT.GIFTBLUE, 217, 146, 9, 12);
		this.items[6] = new Spritesheet(GIFTS, IMG_RECT.GIFTRED, 66, 93, 9, 12);
		this.items[7] = new Spritesheet(GIFTS, IMG_RECT.GIFTGREEN, 220, 55, 9, 12);
		this.items[8] = new Spritesheet(GIFTS, IMG_RECT.GIFTYELLOW, 74, 122, 9, 12);
		this.items[9] = new Spritesheet(GIFTS, IMG_RECT.GIFTPINK, 224, 121, 9, 12);
		this.clearTree();
	}
	
	clearTree() {
		for (let i in this.items)
			this.items[i].canDraw = false;
	}
	
	showItems() {
		this.clearTree();
		let len = this.items.length;
		this.currentNumItems = Math.floor(Math.random() * len);
		
		for (let i = 1; i <= num; ++i)
			this.items[i].canDraw = true;
				
		if (num === 0)
			this.showItems();
	}
	
	numberPressed() {
		let values = Object.values(Ramu.lastKeysPressed);
		if (values.length === 0)
			return 0;
		
		switch(values[0]){
			case 49:
			case 97: 
				return 1;
				break;
			case 50:
			case 98: //2
				return 2;
				break;
			case 51:
			case 99: //3
				return 3;
				break;
			case 52:
			case 100: //4
				return 4;
				break;
			case 53:
			case 101: //5
				return 5;
				break;
			case 54:
			case 102: //6
				return 6;
				break;
			case 55:
			case 103: //7
				return 7;
				break;
			case 56:
			case 104: //8
				return 8;
				break;
			case 57:
			case 105: //9
				return 9;
				break;
			default:
				return -1;
		}
	}
	
	update() {	
		if (this.secsLeft <= 0 && this.started){
			this.playTxt.canDraw = true;
			this.secsLeft = this.secs;
			this.started = false;
		}
		
		if (!this.started){			
			if (keyCode.space in Ramu.lastKeysPressed) {
				this.playTxt.canDraw = false;
				this.started = true;
				this.score = 0;
				this.showItems();
			}
			return;
		}
		
		this.updateUI();
		
		let num = this.numberPressed();
		if (num > 0) {
			if (num === this.currentNumItems)
				this.score += POINTS[this.currentNumItems] || num;
			else
				this.score--;
			
			this.showItems();	
		}
	}
}

var game = new Game();
Ramu.init(295, 200);
Ramu.canvas.style.backgroundColor = '#f4425f';
Ramu.debugMode = true;
