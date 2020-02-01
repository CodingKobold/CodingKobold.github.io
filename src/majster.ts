export class Majster {
	majster: Phaser.Physics.Arcade.Sprite;

	static image: string = 'images/majster.png';

	constructor(sprite: Phaser.Physics.Arcade.Sprite) {
		this.majster = sprite;

		this.majster.setCollideWorldBounds(true);
	}

	move(cursor: Phaser.Types.Input.Keyboard.CursorKeys): void {
		// up
		if (Phaser.Input.Keyboard.JustDown(cursor.up)) {
			this.majster.setVelocityY(-50);
		} else if (Phaser.Input.Keyboard.JustUp(cursor.up)) {
			this.majster.setVelocityY(0);
		}

		// down
		if (Phaser.Input.Keyboard.JustDown(cursor.down)) {
			this.majster.setVelocityY(50);
		} else if (Phaser.Input.Keyboard.JustUp(cursor.down)) {
			this.majster.setVelocityY(0);
		}

		// right
		if (Phaser.Input.Keyboard.JustDown(cursor.right)) {
			this.majster.setVelocityX(50);
		} else if (Phaser.Input.Keyboard.JustUp(cursor.right)) {
			this.majster.setVelocityX(0);
		}

		// left
		if (Phaser.Input.Keyboard.JustDown(cursor.left)) {
			this.majster.setVelocityX(-50);
		} else if (Phaser.Input.Keyboard.JustUp(cursor.left)) {
			this.majster.setVelocityX(0);
		}
    }
    
    setPosition(x: number, y: number): void{
        this.majster.setPosition(x, y);
    }
}
