export class Majster {
	majster: Phaser.Physics.Arcade.Sprite;

	static image: string = 'images/majster.png';

	constructor(sprite: Phaser.Physics.Arcade.Sprite) {
		this.majster = sprite;

		this.majster.setCollideWorldBounds(true);
	}

	move(cursor: Phaser.Types.Input.Keyboard.CursorKeys): void {
		// y
		if (cursor.up.isDown) {
			this.majster.setVelocityY(-50);
		} 
		else if (cursor.down.isDown) {
			this.majster.setVelocityY(50);
		} 
		else if (Phaser.Input.Keyboard.JustUp(cursor.up) || Phaser.Input.Keyboard.JustUp(cursor.down)) {
			this.majster.setVelocityY(0);
		}

		// x
		if (cursor.right.isDown) {
			this.majster.setVelocityX(50);
		} else if (cursor.left.isDown) {
			this.majster.setVelocityX(-50);
		} else if (Phaser.Input.Keyboard.JustUp(cursor.right) || Phaser.Input.Keyboard.JustUp(cursor.left)) {
			this.majster.setVelocityX(0);
		}
    }
    
    setPosition(x: number, y: number): void{
        this.majster.setPosition(x, y);
    }
}
