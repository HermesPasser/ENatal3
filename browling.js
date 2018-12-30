const BOWLING_IMG = Ramu.Utils.getImage('img/browling.png');
const PIN_Y = 20;

class Ball extends SpritesheetAnimation {
	constructor(x) {
		super(BOWLING_IMG, 250, -27, 27, 27);
		this.addFrame(new Rect(103, 0, 54, 54));
		this.addFrame(new Rect(158, 0, 54, 54));
		this.animationTime = 0.5;
		this.throwing = false;
	}
	
	throwBall(x) {
		this.throwing = true;
		this.x = x - this.width / 2;
		this.y = Ramu.height + 27;
	}
	
	update() {
		if (!this.throwing)
			return;
			
		this.y -= 180 * Ramu.time.delta;
		
		if (this.y <= PIN_Y){
			game.check();
			this.throwing = false;
			this.y = -54;
		}
	}
}

class Arrow extends Spritesheet {
	constructor() {
		super(BOWLING_IMG, new Rect(45, 0, 58, 64), 101, 432, 58, 64);
		this.canMove = true;
		this.goLeft = true;
		this.velocity = 80;
	}
	
	getPos() {
		return this.x + this.width / 2;
	}
	
	reset() {
		this.canMove = true;
		this.x = 101;
	}
	
	update() {
		if (!this.canMove)
			return;
		
		let vel = -this.velocity * Ramu.time.delta;
		
		if (!this.goLeft)
			vel = -vel;
		
		this.x += vel;
		
		if (this.x <= 0)
			this.goLeft = false;
		else if (this.x + this.width >= Ramu.width)
			this.goLeft = true;
	}
}

class Game extends GameObj {
	start() {
		new Text('Type 1, 2 and 3 to change de difficulty. Space to throw', 5, 15, 250);
		this.info = new Text('', 5, 200, 250);
		this.pin1 = new Spritesheet(BOWLING_IMG, new Rect(0, 0, 44, 90), 42, PIN_Y, 44, 90);
		this.pin2 = new Spritesheet(BOWLING_IMG, new Rect(0, 0, 44, 90), 103, PIN_Y, 44, 90);
		this.pin3 = new Spritesheet(BOWLING_IMG, new Rect(0, 0, 44, 90), 164, PIN_Y, 44, 90);
		this.ball = new Ball(10, 10);
		this.arrow = new Arrow();
		this.p1Text = 'One point. Press space to play again.';
		this.p3Text = 'Strike! Press space to play again.';
		this.throwed = false;
		this.endGame = false;
	}

	update() {
		if (keyCode.space in Ramu.lastKeysPressed) {
			
			if (!this.throwed){
				this.arrow.canMove = false;
				this.ball.throwBall(this.arrow.getPos());
				this.throwed = true
			} else if (this.endGame)
				this.reset();
		}
		
		if (keyCode.num1 in Ramu.pressedKeys || keyCode.numpad1 in Ramu.pressedKeys)
			this.arrow.velocity = 80;
		else if (keyCode.num2 in Ramu.pressedKeys || keyCode.numpad2 in Ramu.pressedKeys)
			this.arrow.velocity = 120;
		else if (keyCode.num3 in Ramu.pressedKeys || keyCode.numpad3 in Ramu.pressedKeys)
			this.arrow.velocity = 160;
		
	}
	
	check() {
		const pos = this.ball.x ;

		if (pos >= 94 && pos <= 155) {
			this.pin1.canDraw = false;
			this.pin2.canDraw = false;
			this.pin3.canDraw = false;
			this.info.text = this.p3Text;
		} else if (pos < 94){
			this.pin1.canDraw = false;
			this.info.text = this.p1Text;
		} else {
			this.pin3.canDraw = false;
			this.info.text = this.p1Text;
		}
		this.endGame = true;
	}
	
	reset() {
		this.pin1.canDraw = true;
		this.pin2.canDraw = true;
		this.pin3.canDraw = true;
		this.endGame = false;
		this.throwed = false;
		this.info.text = '';
		this.arrow.reset();
	}
}

var game = new Game();
Ramu.canvas.style.backgroundColor = '#FF6D6D';
Ramu.init(250, 500);
