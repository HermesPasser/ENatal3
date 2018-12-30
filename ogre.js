const SANTAS = Ramu.Utils.getImage('img/ogresanta.png');
const DIFFICULTY = 10;

Number.rand = function(max) {
	return Math.floor(Math.random() * max);
}

class Santa extends Clickable {
	constructor(x, y, rect) {
		super(x, y, 44, 88);
		this.sprite = new Spritesheet(SANTAS, rect, x, y, 44, 88);
		this.isOgre = false;
		Santa.instances.push(this);
	}
	
	static isEmptySpace(x, y) {
		const rect = new Rect(x, y, 44, 88);
		for (let i = 0; i < Santa.instances.length; ++i) {
			const santaRect = Santa.instances[i].toRect();	
			if (Ramu.Math.overlap(rect, santaRect))
				return false;
		}
		return true;
	}
	
	static setOgre() {
		const sheetIndex = Number.rand(Santa.ogreRects.length);
		const sheet = Santa.ogreRects[sheetIndex];
		const santaIndex = Number.rand(Santa.instances.length);
		const santa = Santa.instances[santaIndex];
		santa.sprite.sheet = sheet;
		santa.isOgre = true;
	}
	
	static instatiateSantas(count) {
		for (let i = 0; i < count; ++i){
			let x = Number.rand(Ramu.width - 44);
			let y = Number.rand(Ramu.height - 88);	
			
			do {
				x = Number.rand(Ramu.width - 44);
				y = Number.rand(Ramu.height - 88);	
			} while(!Santa.isEmptySpace(x, y));
			
			new Santa(x, y, Santa.santaRect);
		}
	}
	
	static instantiate() {
		Santa.destroy();
		Santa.instatiateSantas(DIFFICULTY);
		Santa.setOgre();	
	}
	
	static destroy() {
		for (let i = 0; i < Santa.instances.length; ++i)
			Santa.instances[i].destroy();
	}
	
	onClick() {
		if (this.isOgre) {
			Santa.instantiate();
			return;
		}
		Ramu.inLoop = false;
		alert("This one isn't the ogre, you failed");
		window.location.reload();
	}
	
	destroy() {
		super.destroy();
		this.sprite.destroy();
	}
}

Santa.instances = [];
Santa.santaRect = new Rect(0, 0, 89, 177);
Santa.ogreRects = [
	new Rect(89, 0, 89, 177),
	new Rect(178, 0, 89, 177),
	new Rect(267, 0, 89, 177)
];

class Game extends GameObj {
	start() {
		this.secs = 60;
		this.secsLeft = this.secs;
		this.secTxt = new Text('60', 10, 30, 100);
		this.secTxt.font = '30px sans-serif';
		Santa.instantiate();
	}

	update() {
		if (this.secsLeft <= 0.000){
			alert('End Game');
			window.location.reload();
			Ramu.inLoop = false;
		}
		
		this.secsLeft -= Ramu.time.delta;
		let txt = Math.trunc(this.secsLeft).toString();
		this.secTxt.text = txt.length == 1 ? '0' + txt : txt;
	}
}

var game = new Game();
Ramu.canvas.style.backgroundColor = '#FF6D6D';
Ramu.init();
