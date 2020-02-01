import { RepairedItem } from './repairedItem';
import { ItemType } from './ItemType.enum';

export class Majster {
	majster: Phaser.Physics.Arcade.Sprite;
	repairedItem: RepairedItem = null;
	equipment: ItemType[];
	maxItemNumber: number;

	static image: string = 'images/majster.png';

	private velocity: integer = 200;

	constructor(sprite: Phaser.Physics.Arcade.Sprite) {
		this.majster = sprite;
		this.majster.setCollideWorldBounds(true);
	}

	move(cursor: Phaser.Types.Input.Keyboard.CursorKeys): void {
		// y
		if (cursor.up.isDown) {
			this.majster.setVelocityY(-this.velocity);
			this.majster.anims.play('up', true);
		} 
		else if (cursor.down.isDown) {
			this.majster.setVelocityY(this.velocity);
			this.majster.anims.play('down', true);
		} 
		else if (Phaser.Input.Keyboard.JustUp(cursor.up) || Phaser.Input.Keyboard.JustUp(cursor.down)) {
			this.majster.setVelocityY(0);
			this.majster.anims.stop();
		}

		// x
		if (cursor.right.isDown) {
			this.majster.setVelocityX(this.velocity);
			this.majster.anims.play('right', true);
		} else if (cursor.left.isDown) {
			this.majster.setVelocityX(-this.velocity);
			this.majster.anims.play('left', true);
		} else if (Phaser.Input.Keyboard.JustUp(cursor.right) || Phaser.Input.Keyboard.JustUp(cursor.left)) {
			this.majster.setVelocityX(0);
			this.majster.anims.stop();
		}
    }

	acceptRequest(repairedItem: RepairedItem): void{
		this.repairedItem = repairedItem;
		this.maxItemNumber = repairedItem.neededItems.length;
	}

    setPosition(x: number, y: number): void{
        this.majster.setPosition(x, y);
	}
	
	stop(): void {
		this.majster.setVelocity(0, 0);
	}
	
	loadAnimations(manager: Phaser.Animations.AnimationManager) : void {
		manager.create({
			key: 'down',
			frames: manager.generateFrameNumbers('majster', { start: 0, end: 2 }),
			frameRate: 10,
			repeat: -1});
		
		manager.create({
			key: 'up',
			frames: manager.generateFrameNumbers('majster', { start: 3, end: 5 }),
			frameRate: 10,
			repeat: -1});

		manager.create({
			key: 'right',
			frames: manager.generateFrameNumbers('majster', { start: 6, end: 8 }),
			frameRate: 10,
			repeat: -1});
		
		manager.create({
			key: 'left',
			frames: manager.generateFrameNumbers('majster', { start: 9, end: 11 }),
			frameRate: 10,
			repeat: -1});
	}
}
