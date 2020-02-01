export class HammeringScene extends Phaser.Scene {
    readonly mlotekImage: string = 'images/mlotek_czarny.png';
    readonly gwozdzImage: string = 'images/gwozdz_czarny.png';
    readonly gwozdzWbityImage: string = 'images/gwozdz_wbity_czarny.png';

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
    readonly gwozdzReappearingTimes = 3;

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

    gwozdzDrivenEvent: Phaser.Time.TimerEvent;

    constructor() {
        super({ key: 'HammeringScene' });

        let moveArea = this.screenSizeX - 2 * this.mlotekMargin;
        let interval = moveArea / (this.mlotekPositionXCount - 1);
        this.mlotekPositionsX =
            [...Array(5).keys()]
                .map((v, i, _) => this.mlotekMargin + interval * i);
    }

    preload(): void {
        this.load.image('mlotek', this.mlotekImage);
        this.load.image('gwozdz', this.gwozdzImage);
        this.load.image('gwozdz_wbity', this.gwozdzWbityImage);
    }

    create() {
        this.add.text(this.screenSizeX / 2 - 250, 50, "Wbij gwoździa!",
            {
                font: '64px Consolas',
                fill: '#FBFBAC'
            });
        this.cursors = this.input.keyboard.createCursorKeys();
        this.space = this.input.keyboard.addKey('SPACE');


        this.mlotek = this.physics.add.sprite(this.mlotekPositionsX[this.mlotekIndexX], this.mlotekPositionY, 'mlotek');

        this.mlotek.scale = 0.5;
        this.mlotek.setX(this.mlotekPositionsX[this.mlotekIndexX]);

        let delay = Math.random() * 1500 + 500;
        this.time.addEvent({ delay: delay, callback: this.makeGwozdziesRespawnIfNeeded, callbackScope: this, repeat: 1 });
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

    private smash() {
        this.smashingProgress = 1;
        this.makeSwing();
        // this.time.addEvent({ delay: 800, callback: this.updateGwozdzSprites, callbackScope: this, repeat: 0 });
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
                    this.time.addEvent({startAt: -100, callback: () => {this.updateGwozdzSprites}, repeat: 0});
                }
            },
            callbackScope: this, repeat: stepCount
        });

    }

    private drive() {
        this.mlotek.setAngularVelocity(-800);
    }

    private stopTheMlotek() {
        this.mlotek.setAngularVelocity(0);
        this.isSmashing = false;
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

    private driveGwozdz(position: number) {
        if (position >= this.mlotekPositionXCount || position < 0) { return; }
        let bit = 0;

        if (this.gwozdzPresenceBitMapHandles[position][bit] == 1) {
            this.gwozdzPresenceBitMapHandles[position][bit] = 0;
            // make gwozdz appear after the delay
        }
        this.smash();

        let delay = Math.random() * 1500 + 500;
        this.time.addEvent({ delay: delay, callback: this.makeGwozdziesRespawnIfNeeded, callbackScope: this });
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
        // mlotek has to be reinitialized to drawn over gwoździe
        this.reinitializeMlotek()
    }

    private reinitializeMlotek() {
        if(this.mlotek != null) { this.mlotek.destroy(); }
        this.mlotek = this.physics.add.sprite(this.mlotekPositionsX[this.mlotekIndexX], this.mlotekPositionY, 'mlotek')
            .setScale(0.5);
    }
}