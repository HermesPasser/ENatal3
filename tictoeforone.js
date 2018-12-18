const BTN_IMG = Ramu.Utils.getImage('img/btn.png');

class ButtonWText extends SimpleSpritesheetButton{
	constructor(x,y,txt){
		super(x, y, 60, 60, BTN_IMG,
						new Rect(0,0,60,60),
						new Rect(59,0,60,60),
						new Rect(118,0,60,60));
		this.marginX = 15;
		this.marginY = 45;
		this.txt = new Text(txt, x + this.marginX, y + this.marginY, 60);
		this.txt.font = '60px sans-serif';
		
		this.setOnClick(function(){
			game.move(this);
		});
	}
	
	set text(txt){
		this.txt.text = txt;
	}
	
	get text(){
		return this.txt.text;
	}
}

class Game extends GameObj{
	start(){
		this.winPositions = [
			[0,1,2],
			[3,4,5],
			[6,7,8],
			
			[0,3,6],
			[1,4,7],
			[2,5,8],
			
			[0,4,8],
			[2,4,6]
		];
		
		// config
		this.selectPlayerChar = true;
		this.selectDifficult = true;
		this.hardMode = false;
		
		this.isPlayerTurn = true;
		this.player = '';
		this.ai = '';
		
		this.endGame = false;
		
		this.createUI();
	}
	
	update() {		
		if (!this.isPlayerTurn && !this.endGame)
			this.aiMove();
		
		if (!this.selectPlayerChar && !this.selectDifficult)
			return;
		
		if (this.selectPlayerChar && keyCode.x in Ramu.pressedKeys)
			this.setPlayerChar('x');
		
		else if (this.selectPlayerChar && keyCode.o in Ramu.pressedKeys)
			this.setPlayerChar('o');
		
		else if (this.selectDifficult && keyCode.y in Ramu.pressedKeys)
			this.setDifficulty(false);
		
		else if (this.selectDifficult && keyCode.n in Ramu.pressedKeys)
			this.setDifficulty(false);
	}
	
	setPlayerChar(txt) {
		this.player = txt;
		this.ai = txt === 'x' ? 'o': 'x';
		this.selectPlayerChar = false;
		this.infoDump.text = 'hard mode on ? (y/n)';
	}
	
	setDifficulty(isHardMode) {
		this.hardMode = isHardMode;
		this.selectDifficult = false;
		this.init();	
	}
	
	init() {
		this.isPlayerTurn = Boolean(Math.floor(Math.random() * 2)); // no new keyword 'cause is a cast
		this.turnText.text = `${this.currentTurn} turn`;
		this.infoDump.canDraw = false;
		this.turnText.canDraw = true;
		this.createGrid();
	}
	
	createUI() {
		this.infoDump = new Text('press "x"  or "o" to choice', 15, 200, 200);
		this.infoDump.font = '12px sans-serif';
		
		this.turnText = new Text(' turn', 70, 210, 200);
		this.turnText.font = '25px sans-serif';
		this.turnText.canDraw = false;	
	}
	
	createGrid() {
		this.btns = [
			new ButtonWText(10, 10, ''),
			new ButtonWText(70, 10, ''),
			new ButtonWText(130,10, ''),
			
			new ButtonWText(10, 70, ''),
			new ButtonWText(70, 70, ''),
			new ButtonWText(130,70, ''),
			
			new ButtonWText(10, 130, ''),
			new ButtonWText(70, 130, ''),
			new ButtonWText(130,130, '')
		];
	}
	
	get currentTurn() { // isso verificava se era a vez de quem
		return this.isPlayerTurn ? this.player : this.ai;
	}
	
	aiCheckEmpty(p1, p2, p3, turn) { // checa se existe a se é possivel dar 'velha' numa posição		
		if (this.btns[p1].text === '' && this.btns[p2].text === turn && this.btns[p3].text === turn){
			this.move(this.btns[p1]);
			return true;
		}
		
		if (this.btns[p1].text === turn && this.btns[p2].text === '' && this.btns[p3].text === turn){
			this.move(this.btns[p2]);
			return true;
		}
		
		if (this.btns[p1].text === turn && this.btns[p2].text === turn && this.btns[p3].text === ''){
			this.move(this.btns[p3]);
			return true;
		}
		
		return false;
	}
	
	aiMove() {	
		for (let i in this.winPositions){
			const pos = this.winPositions[i];

			// try to win
			if (this.aiCheckEmpty(pos[0], pos[1], pos[2], this.ai))
				return;
			
			// try to draw
			if (this.aiCheckEmpty(pos[0], pos[1], pos[2], this.player) && this.hardMode)
				return;
		}
		
		// first move
		
		for (let i in this.btns){
			if (this.btns[i].text === ''){
				this.move(this.btns[i]);
				return;
			}
		}		
	}
	
	move(btn){
		if (this.endGame || btn.text !== '')
			return;
		
		btn.text = this.currentTurn;
		
		if (this.checkVictory())
			return;
		
		if (this.checkDraw())
			return;
		
		this.isPlayerTurn = !this.isPlayerTurn;
		this.turnText.text = this.currentTurn + ' turn';
	}
	
	showVictoryText() {
		let winner = 'A.I';
		if (this.currentTurn === this.player)
			winner = 'player';
						
		this.infoDump.text = `${winner} (${this.currentTurn}) won!`;
		this.infoDump.canDraw = true;
		this.turnText.canDraw = false;
	}
	
	checkVictory() {
		for (let i in this.winPositions){
			const pos = this.winPositions[i];
			const pos1 = this.btns[pos[0]].text;
			const pos2 = this.btns[pos[1]].text;
			const pos3 = this.btns[pos[2]].text;
			
			if (pos1 === this.currentTurn && pos2 === this.currentTurn && pos3 === this.currentTurn){
				this.showVictoryText();
				this.endGame = true;
				return true;
			}
		}
		return false;
	}
	
	checkDraw(){
		for (let i in this.btns){
			if (this.btns[i].text === '')
				return false;
		}
		this.turnText.text = 'draw!'
		this.endGame = true;
		return true;
	}
}

Ramu.init(220,220);
var game = new Game();
