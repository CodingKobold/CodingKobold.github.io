import { Majster } from "./majster";
import { GameWindowFocus } from "./gameWindowFocus.enum";
import { GameStep } from "./gameStep.enum";

export class HammeringScene extends Phaser.Scene {
    majster: Majster;

    readonly mlotekImage: string = 'images/hammer.png';
    readonly gwozdzImage: string = 'images/nail.png';

    readonly mlotekScale = 0.5;
    readonly gwozdzScale = 0.5;

    readonly screenSizeX = 1344;
    readonly screenSizeY = 720;

    readonly min = 0;
    readonly max = 1;
    readonly initialGwozdzAppearDelayRange = [500, 2000];
    readonly gwozdzReappearDelayRange = [300, 3000];

    readonly mlotekMargin = 300;
    readonly mlotekPositionXCount = 5;
    readonly mlotekPositionY = this.screenSizeY / 2;

    mlotekPositionsX: number[];
    mlotekIndexX: number = 3;
    mlotekAngle: number = 0;

    readonly gwozdzPositionY = this.screenSizeY / 2 + 100;
    gwozdziesToWin;
    
    private drivenGwozdzie;

    //TODO: Consider some gwozdzie needing more than one smash to finish
    gwozdzPresenceBitMapHandles: [number, Phaser.Physics.Arcade.Sprite][] =
        [...Array(this.mlotekPositionXCount).keys()].map(() => [0, null]);

    isSmashing = false;
    // this gets counted so we can determine whether the młotek stopped moving
    smashingProgress: number = 0;

    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    space: Phaser.Input.Keyboard.Key;
    hand: any;
    mlotek: Phaser.Physics.Arcade.Sprite;

    constructor() {
        super({ key: 'HammeringScene' });

        let moveArea = this.screenSizeX - 2 * this.mlotekMargin;
        let interval = moveArea / (this.mlotekPositionXCount - 1);
        this.mlotekPositionsX =
            [...Array(5).keys()]
                .map((v, i, _) => this.mlotekMargin + interval * i);
    }

    init(params: any): void {
        this.majster = params.majster;
    }

    preload(): void {
        this.load.image('mlotek', this.mlotekImage);
        this.load.image('gwozdz', this.gwozdzImage);
    }

    create() {
        this.add.text(this.screenSizeX / 2 - 250, 50, "Wbij gwoździa!",
            {
                font: '64px Consolas',
                fill: '#FBFBAC'
            });
        this.cursors = this.input.keyboard.createCursorKeys();
        this.space = this.input.keyboard.addKey('SPACE');

        this.gwozdziesToWin = this.majster.equipment.length;
        this.drivenGwozdzie = 0;

        this.mlotek = this.physics.add.sprite(this.mlotekPositionsX[this.mlotekIndexX], this.mlotekPositionY, 'mlotek');

        this.mlotek.scale = 0.5;
        this.mlotek.setX(this.mlotekPositionsX[this.mlotekIndexX]);

        let delay = 100;
        this.time.addEvent({ delay: delay, callback: this.makeGwozdziesRespawnIfNeeded, callbackScope: this, repeat: 0 });
    }

    update() {
        // allow movement when smashing animation is not in progress
        if (this.smashingProgress > 0) { return };

        // handle right and left arrow clicking 
        if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
            this.moveMlotekRight();
        }
        else if (Phaser.Input.Keyboard.JustDown(this.cursors.left)
            && this.mlotekIndexX > 0) {
            this.moveMlotekLeft();
        }

        // handle space (driving the gwozdz)
        if (Phaser.Input.Keyboard.JustDown(this.space)) {
            this.driveGwozdz(this.mlotekIndexX);
        }
    }

    private moveMlotekRight() {
        if (this.mlotekIndexX < this.mlotekPositionsX.length - 1) {
            this.mlotek.x = this.mlotekPositionsX[++this.mlotekIndexX];
            this.mlotek.angle = 0;
        }
    }
    private moveMlotekLeft() {
        if (this.mlotekIndexX > 0) {
            this.mlotek.x = this.mlotekPositionsX[--this.mlotekIndexX];
            this.mlotek.angle = 0;
        }
    }

    private driveGwozdz(position: number) {
        if (position >= this.mlotekPositionXCount || position < 0) { return; }
        let bit = 0;

        if (this.gwozdzPresenceBitMapHandles[position][bit] == 1) {
            this.gwozdzPresenceBitMapHandles[position][bit] = 0;
            this.drivenGwozdzie += 1;
            let delay = Math.random() * 400 + 600;
            this.time.addEvent({ delay: delay, callback: this.makeGwozdziesRespawnIfNeeded, callbackScope: this, repeat: 0 });
        }
        this.smash();

        // handle finished game
        this.time.addEvent({ 
            delay: 500, 
            callback: () => {
                if (this.drivenGwozdzie == this.gwozdziesToWin) {
                    this.exit();
                }
            }, 
            callbackScope: this, 
            repeat: 0 
        });
    }

    private smash() {
        this.smashingProgress = 1;
        this.makeSwing();
    }

    private makeSwing() {
        let stepCount = 6;

        this.mlotek.angle = 0;
        // make mlotek lean back
        this.time.addEvent({
            startAt: 0,
            delay: 20,
            callback: () => { this.mlotek.angle += 1 },
            callbackScope: this,
            repeat: 15
        });

        // make młotek hit the gwóźdź
        this.time.addEvent({
            startAt: -100, delay: 20,
            callback: () => {
                this.mlotek.angle -= 15;
                // this is when the mlotek finishes smashing
                if (this.smashingProgress++ == stepCount + 1) {
                    this.smashingProgress = 0;
                    // restart młotek to initial position
                    this.time.addEvent({
                        startAt: 0,
                        delay: 20,
                        callback: () => { this.mlotek.angle += 15 },
                        callbackScope: this,
                        repeat: 5
                    });
                    // create new gwozdzie only after the mlotek has returned to it's original position
                    // this.time.addEvent({startAt: -100, callback: () => {this.updateGwozdzSprites}, repeat: 0});
                    this.updateGwozdzSprites();
                }
            },
            callbackScope: this, repeat: stepCount
        });
    }

    private makeGwozdziesRespawnIfNeeded() {
        console.log("Make gwozdzie respawn occurred");
        var sum = 0;
        this.gwozdzPresenceBitMapHandles.forEach(element => sum += element[0]);
        // there are no gwozdzie, add some
        if (sum == 0) {
            var position = Math.floor(Math.random() * this.mlotekPositionXCount);
            this.spawnGwozdz(position);
        }
    }

    private spawnGwozdz(position: number) {
        if (position >= this.mlotekPositionXCount || position < 0) { return; }
        let bit = 0;
        this.gwozdzPresenceBitMapHandles[position][bit] = 1;

        this.updateGwozdzSprites();
    }

    private updateGwozdzSprites() {
        this.gwozdzPresenceBitMapHandles.forEach((val, i) => {
            // remove gwozdz if it needed
            if (val[0] == 0 && val[1] != null) {
                val[1].destroy();
                val[1] = null;
            }
            // add gwozdz if needed
            if (val[0] == 1 && val[1] == null) {
                // a magic value has to be subtracted from mlotek position
                val[1] = this.physics.add.sprite(this.mlotekPositionsX[i] - 100, this.gwozdzPositionY, 'gwozdz')
                    .setScale(this.gwozdzScale);
            }
        });
    }

    private exit(): void {
        if (this.checkIfItemIsDestroyed()) {
            this.majster.repairedItem.isDestroyed = true;
        }

        let gameScene: any = this.scene.get('GameScene');
        this.majster.clearEquipment();
        gameScene.currentGameWindow = GameWindowFocus.Majster;
        gameScene.currentGameStep = GameStep.OrderReady;
        gameScene.updateEquipment();
        this.scene.stop();
    }

    private checkIfItemIsDestroyed(): boolean {
        if (this.majster.equipment.length !== this.majster.repairedItem.neededItems.length) {
            return true;
        }

        for (var item of this.majster.equipment) {
            if (!this.majster.repairedItem.neededItems.some(neededItem => neededItem === item)) 
            {
                return true;
            }
        }

        return false;
    }
}