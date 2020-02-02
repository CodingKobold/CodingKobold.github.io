import "phaser";

export class WelcomeScene extends Phaser.Scene {
    title: Phaser.GameObjects.Text;
    hint: Phaser.GameObjects.Text;

    constructor() {
        super({
            key: "WelcomeScene"
        });
    }

    preload(): void {         
        this.load.image('brigade-logo', 'images/brigade-logo.png');
        this.load.image('nie-ma-problemu', 'images/nie-ma-problemu.png');
    }

    create(): void {    
        this.add.image(675, 250, 'brigade-logo').setDisplaySize(900,400);
        this.add.image(675, 575, 'nie-ma-problemu').setDisplaySize(1400,600);

        var keyObj = this.input.keyboard.addKey('space');  // Get key object

        keyObj.on('down', function(event) { 
            this.scene.start("GameScene");
        }, this);
    }
};