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
        
    gwozdzAlreadyReappearedTimes = 0;
    gwozdzFramesWithout = 0;

    isSmashing = false;
    smashProgress: number = 0;

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

    preload(): void {
        this.load.image('mlotek', this.mlotekImage);
        this.load.image('gwozdz', this.gwozdzImage);
        this.load.image('gwozdz_wbity', this.gwozdzWbityImage);
    }

    create() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.space = this.input.keyboard.addKey('SPACE');

        this.mlotek = this.physics.add.sprite(this.mlotekPositionsX[this.mlotekIndexX], this.mlotekPositionY, 'mlotek');
        this.mlotek.scale = 0.5;
        this.mlotek.x = this.mlotekPositionsX[this.mlotekIndexX];

        this.spawnGwozdz(0);
        this.spawnGwozdz(1);
        this.spawnGwozdz(2);
        this.spawnGwozdz(3);

    }

    update() {
        if (!this.isSmashing) {
            if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
                this.moveMlotekRight();
            }
            else if (Phaser.Input.Keyboard.JustDown(this.cursors.left)
                && this.mlotekIndexX > 0) {
                this.moveMlotekLeft();
            }
        }
        else {
            // smash mlotek here
        }

        if(Phaser.Input.Keyboard.JustDown(this.space)){
            this.driveGwozdz(this.mlotekIndexX);
        }
    }

    private moveMlotekRight() {
        if (this.mlotekIndexX < this.mlotekPositionsX.length - 1) {
            this.mlotek.x = this.mlotekPositionsX[++this.mlotekIndexX];
            console.log(`current mlotek x index: ${this.mlotekIndexX}`);
            console.log(`current mlotek x: ${this.mlotek.x}`);
        }
    }
    private moveMlotekLeft() {
        if (this.mlotekIndexX > 0) {
            this.mlotek.x = this.mlotekPositionsX[--this.mlotekIndexX];
            console.log(`current mlotek x index: ${this.mlotekIndexX}`);
            console.log(`current mlotek x: ${this.mlotek.x}`);
        }
    }

    private makeGwozdziesRespawnIfNeeded() {
        //todo: make this reapper only after certain amount of update calls
        var sum = 0;
        this.gwozdzPresenceBitMapHandles.forEach(element => sum += element[0]);

        if(sum == 0){
            //TODO: no gwodzie on table currently, make them respawn
        }
    }

    private spawnGwozdz(position: number) {
        if(position >= this.mlotekPositionXCount || position < 0){ return; }
        let bit = 0;
        this.gwozdzPresenceBitMapHandles[position][bit] = 1;

        this.updateGwozdzSprites();
    }

    private driveGwozdz(position: number) {
        if(position >= this.mlotekPositionXCount || position < 0){ return; }
        let bit = 0;
        this.gwozdzPresenceBitMapHandles[position][bit] = 0;

        this.updateGwozdzSprites();
    }

    private updateGwozdzSprites() {
        this.gwozdzPresenceBitMapHandles.forEach((val, i) => {
            // remove gwozdz if it needed
            if(val[0] == 0 && val[1] != null){
                val[1].destroy();
                val[1] = null;
            }
            
            // add gwozdz if needed
            if(val[0] == 1 && val[1] == null){
                val[1] = this.physics.add.sprite(this.mlotekPositionsX[i], this.gwozdzPositionY, 'gwozdz').setScale(this.gwozdzScale);
            }
        });
    }
}