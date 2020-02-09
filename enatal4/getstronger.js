let ItemLimit = 50
let ItemCount = 0
const IMG = Ramu.Utils.getImage('img/9.png');
const ITEM_FRAMES = {
	t9: [
			new Rect(0, 0, 17, 17),
			new Rect(17, 0, 17, 17),
			new Rect(34, 0, 17, 17),
			new Rect(17, 0, 17, 17)
	],
		
	t90: [
			new Rect(0, 17, 17, 17),
			new Rect(17, 17, 17, 17),
			new Rect(34, 17, 17, 17),
			new Rect(17, 17, 17, 17)
	],
		
	tx: [
			new Rect(0, 34, 17, 17),
			new Rect(17, 34, 17, 17),
			new Rect(34, 34, 17, 17),
			new Rect(17, 34, 17, 17)
	],

	tblast: [
			new Rect(1, 52, 6, 8),
			new Rect(8, 52, 6, 8)
	],
		
	thand:		[ new Rect(51, 42, 33, 35) ],
	tscooter:	[ new Rect(51, 0, 55, 42) ]
}

Array.rand = (list) => {
	return list[Math.floor(Math.random() * list.length)]
}
Math.randInt = (max) => {
	return Math.floor(Math.random() * max)
}

class Item extends SimpleRectCollider {
	static instantiate() {
		const type = Array.rand(['t9', 't9', 't9', 't90', 't90', 'tx'])
		const x = Math.randInt(Ramu.width - 17)
		const i = new Item(x, -17, type)

	}
	
	constructor(x, y, type) {
		super(x, y, 17, 17)
		this.sprite = new SpritesheetAnimation(IMG, x, y, 17, 17)
		this.sprite.addFrame(ITEM_FRAMES[type])
		this.sprite.drawPriority = 1
		this.tag = type
		
		this.fallVelocity = 40;
		this.swingDirection = 0;
		this.timeToSwing = 5;
		this.currentTime = 5;
	}
	
	swing(){
		this.currentTime += Ramu.time.delta
		if (this.currentTime >= this.timeToSwing){
			this.swingDirection = Math.randInt(2)
			this.currentTime = 0
		}
		
		const dir = this.fallVelocity * Ramu.time.delta
		this.swingDirection == 1 ? this.addX(dir) : this.addX(-dir)
	}
	
	addX(x) {
		this.x += x
		this.sprite.x += x
	}
	
	update(){
		const vel = this.fallVelocity * Ramu.time.delta
		this.y += vel
		this.sprite.y += vel	
		
		this.swing()
		
		if (this.y > Ramu.height)
			this.destroy()
	}
	
	destroy() {
		super.destroy()
		this.sprite.destroy()
		ItemCount--
	}
}

class Blast extends SimpleRectCollider {
	constructor(x, y, type) {
		super(x, y, 17, 17)
		this.sprite = new SpritesheetAnimation(IMG, x, y, 17, 17)
		this.sprite.addFrame(ITEM_FRAMES.tblast)
		this.sprite.drawPriority = 1
	}
	
	update() {
		const vel = 60 * Ramu.time.delta
		this.y -= vel
		this.sprite.y -= vel
		
		if (Ramu.Utils.isOutOfCanvas(this))
			this.destroy()
	}
	
	onCollision() {
		const item = this.collision[0]
		switch(item.tag) {
			case 't9': game.score += 90; break
			case 't90': game.score += 900; break
			case 'tx': game.score -= 90; break
			default: return
		}
		
		item.destroy()
		this.destroy()
	}
	
	destroy() {
		super.destroy()
		this.sprite.destroy()
	}
}

class Game extends GameObj {
	start() {
		this.hand = new Spritesheet(IMG, ITEM_FRAMES.thand[0], (Ramu.width - 33) / 2, (Ramu.height - 35), 33, 35)
		this.hand.drawPriority = 3
		
		this.timeToInstantiate = 0.2
		this.currentTimeToInstantiate = 2
		
		this.score = 0
		this.setUI()
	}

	setUI() {
		// draw the scooter
		new Spritesheet(IMG, ITEM_FRAMES.tscooter[0], Ramu.width - 55, 0, 55, 52)
		
		this.tutorial = new Ramu.Text('press "space" to blast | move with the mouse', 1, 10, 250)
		
		this.endText = new Ramu.Text('It\'s over 9000!', Ramu.width / 2 - 50, Ramu.height / 2, 100)
		this.endText.font = '15px sans-serif'
		this.endText.canDraw = false
		
		this.pointsText = new Ramu.Text('0', Ramu.width - 54, 35, 10)
		this.pointsText.font = '15px sans-serif'
		this.pointsText.fillStyle = 'yellow'
	}
	
	updateHandPosition() {
		this.hand.x = Ramu.mousePosition.X - (this.hand.width / 2)
	}
	
	updatePoints() {
		this.pointsText.text = this.score.toString()
		this.updateHandPosition()
		if (this.score >= 9000) {
			this.endText.canDraw = true
			Ramu.inLoop = false
		}
	}
	
	update() {
		this.updateHandPosition()
		this.updatePoints()
		this.populate()

		if(Ramu.onKeyDown('space'))
			new Blast(this.hand.x + this.hand.width / 2, Ramu.height - this.hand.height)
	}
	
	populate() {
		this.currentTimeToInstantiate += Ramu.time.delta
		if (this.currentTimeToInstantiate >= this.timeToInstantiate) {
			if (ItemCount <= ItemLimit) {
				Item.instantiate()
				ItemCount++
			}
			this.currentTimeToInstantiate = 0
		}
	}
}
var game = new Game();
