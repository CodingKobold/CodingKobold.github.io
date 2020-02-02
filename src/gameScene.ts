import "phaser";
import { Majster } from './majster';
import { Dialog } from "./dialog";

import { GameTime } from './gameTime';
import { GameWindowFocus } from "./gameWindowFocus.enum";
import { RepairedItem } from './repairedItem';
import { RepairedItemType } from './repairedItemType.enum';
import { ItemType } from './ItemType.enum';

export class GameScene extends Phaser.Scene {
    // scene related
    private currentGameWindow: GameWindowFocus;

    // keyboard related
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private actionKey: Phaser.Input.Keyboard.Key;
    
    // majster related
    private majster: Majster;
    // equipment related
    private equipmentText: {[key:number]:  Phaser.GameObjects.Text};

    // objects related
    private graphics: Phaser.GameObjects.Graphics;
    private walls: Phaser.Physics.Arcade.StaticGroup;
    private entrance: Phaser.Physics.Arcade.StaticGroup;
    private workbench: Phaser.Physics.Arcade.Sprite;
    private wardrobe: Phaser.Physics.Arcade.Sprite;

    // time related
    private remainingTimeText: Phaser.GameObjects.Text;
    private gameTime: GameTime;
    private gameDuration: number = 2*60*1000; // 2 min
    private gameOverEvent: Phaser.Time.TimerEvent;

    // dialog related
    private requestDialog: Dialog;
    private responseDialog: Dialog;
    private clientDialogText: Phaser.GameObjects.Text;
    private majsterDialogText: Phaser.GameObjects.Text;
    private nieMaProblemuSaid: boolean;

    // score related
    private score: number = 100;

    constructor() {
        super({
            key: "GameScene"
        });
    }

    init(): void {
        this.graphics = this.add.graphics();
        this.currentGameWindow = GameWindowFocus.Majster;
    }

    preload(): void {         
        this.loadRoomAssets();
        this.loadGrassAssets();
        this.load.spritesheet('majster', Majster.image, { frameWidth: 32, frameHeight: 32 });
        this.load.image('dialog-box', 'images/dialog-box.png');
        this.load.image('client1', 'images/clients/client1.png');
        this.load.image('client2', 'images/clients/client2.png');
        this.load.image('client3', 'images/clients/client3.png');
        this.load.image('client4', 'images/clients/client4.png');
    }

    create(): void {
        // TODO: Remove when not needed anymore
        this.prepareGameShapes();
        this.drawGrassInitial();
        this.drawRoomInitial();
        this.prepareInput();
        this.prepareMajster();
        this.prepareRoomItems();
        this.preparePhysics();
        this.prepareDialogs();
        this.prepareTime();
        this.prepareEquipment();
    }
    
    update(): void {
        this.updateTime();

        if (this.currentGameWindow === GameWindowFocus.Items) {
            if (Phaser.Input.Keyboard.JustUp(this.actionKey)) {
                this.updateEquipment();
            }
            return;
        }
        else if (this.currentGameWindow === GameWindowFocus.Majster) {
            this.majster.move(this.cursors);
        }
        else if (this.currentGameWindow === GameWindowFocus.Dialog) {
            if (Phaser.Input.Keyboard.JustUp(this.actionKey)) {
                this.loadResponse();
                this.currentGameWindow = GameWindowFocus.Majster;
            }
        }

        if (Phaser.Input.Keyboard.JustUp(this.actionKey)) {
            this.checkClosestWorkbench();
            this.checkClosestWardrobe();
        }
    }

    prepareEquipment() {
        this.add.text(900, 300, "Ekwipunek Majstra:", { font: '24px Consolas' });

        let y = 350;
        let ySpacing = 40;
        this.equipmentText = {};

        Array.from(Array(5).keys()).forEach(x => {
            this.equipmentText[x] = this.add.text(900, y, ""), { font: '24px Consolas' };
            y += ySpacing;
        })

        this.updateEquipment();
    }

    private prepareGameShapes() {
        let itemsArea: Phaser.Geom.Rectangle = new Phaser.Geom.Rectangle(880, 0, 464, 720);

        this.graphics.fillStyle(0x000000);
        this.graphics.fillRectShape(itemsArea);
    }

    private prepareTime() {
        this.gameTime = new GameTime();
        this.gameOverEvent = this.time.delayedCall(this.gameDuration, this.onGameOverEvent, [], this);

        this.add.text(900, 20,  "Czas do zamknięcia:", { font: '24px Consolas' });
        this.remainingTimeText = this.add.text(1180, 12, this.gameTime.getTime(),  { font: '36px Consolas Bold', fill: 'green' });
    }

    private prepareDialogs() {
        this.add.image(443, 648, 'dialog-box').setDisplaySize(890,144);

        this.requestDialog = new Dialog();
        this.responseDialog = new Dialog();
        this.clientDialogText = this.add.text(130, 606, "", { font: '24px Consolas', fill: '#050505' });
        this.majsterDialogText = this.add.text(130, 646, "", { font: '24px Consolas', fill: '#ff0000' });
    }

    prepareMajster() {
        this.majster = new Majster(this.physics.add.sprite(32,32,'majster'))
        this.majster.setPosition(250, 100);
        this.majster.loadAnimations(this.anims);
    }

    prepareInput(): void {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.actionKey = this.cursors.space;
    }

    preparePhysics(): void {
        this.physics.add.collider(this.majster.majster, this.walls);
        this.physics.add.collider(this.majster.majster, this.workbench);
        this.physics.add.overlap(this.majster.majster, this.entrance, this.takeOrder, null, this);
    }

    private loadGrassAssets(){
        this.load.image('grass1', 'images/grass/grass1.png');
        this.load.image('grass2', 'images/grass/grass2.png');
        this.load.image('grass3', 'images/grass/grass3.png');
        this.load.image('grass4', 'images/grass/grass4.png');
        this.load.image('grass5', 'images/grass/grass5.png');
        this.load.image('tree1', 'images/grass/tree1.png');
        this.load.image('tree2', 'images/grass/tree2.png');
        this.load.image('water1', 'images/grass/water1.png');
        this.load.image('water2', 'images/grass/water2.png');
        this.load.image('walk1', 'images/grass/walk1.png');
        this.load.image('walk2', 'images/grass/walk2.png');
        this.load.image('walk3', 'images/grass/walk3.png');
    }

    private drawGrassInitial(){
        for (var j = 0; j<=880; j+=16){
            for (var i = 0; i<=880; i+=16){
                var randNumber = Math.floor(Math.random() * 5) + 1;
                this.add.image(i, j, "grass"+ randNumber);
            }
        }
        this.add.image(75, 22, "tree1");
        this.add.image(15, 150, "tree2");
        this.add.image(92, 350, "tree2");
        this.add.image(750, 535, "tree2").setDisplaySize(55,55);
        this.add.image(40, 430, "water1");
        this.add.image(23, 255, "water2");
        this.add.image(376, 565, "walk1");
        for (var i=392; i<=648; i+=16){
            this.add.image(i, 569, "walk2");
        }
        this.add.image(648, 569, "walk3");
        
    }

    private loadRoomAssets() {
        this.load.image('wall-left-top-corner', 'images/wall/left-top-corner.png');
        this.load.image('wall-right-top-corner', 'images/wall/right-top-corner.png');
        this.load.image('wall-left', 'images/wall/left.png');
        this.load.image('wall-top', 'images/wall/top.png');
        this.load.image('wall-bottom', 'images/wall/bottom.png');
        this.load.image('wall-bottom-small', 'images/wall/bottom-small.png');
        this.load.image('wall-middle-right-corner', 'images/wall/middle-right-corner.png');
        this.load.image('wall-middle-left-corner', 'images/wall/middle-left-corner.png');

        this.load.image('wall-brick-center', 'images/wall/brick-center.png');
        this.load.image('wall-right-small', 'images/wall/right-small.png');
        this.load.image('wall-brick-left', 'images/wall/brick-left.png');
        this.load.image('wall-brick-right', 'images/wall/brick-right.png');
        this.load.image('wall-brick-right-center', 'images/wall/brick-right-center.png');

        this.load.image('wall-window1', 'images/wall/window1.png');
        this.load.image('wall-door', 'images/wall/door.png');

        this.load.image('floor-1', 'images/wall/floor1.png');
        this.load.image('floor-2', 'images/wall/floor-2.png');
        this.load.image('floor-3', 'images/wall/floor-3.png');
        this.load.image('floor-4', 'images/wall/floor-4.png');

        this.load.image('carpet-1', 'images/furniture/dywan1.png');
        this.load.image('carpet-2', 'images/furniture/dywan2.png');
        this.load.image('carpet-3', 'images/furniture/dywan3.png');

        this.load.image('computer', 'images/furniture/komputer.png');
        this.load.image('plant', 'images/furniture/kwiatek.png');
        this.load.image('low-table', 'images/furniture/kwiatek.png');
        this.load.image('radio', 'images/furniture/radio.png');

        this.load.image('table-1', 'images/furniture/stol1.png');

        this.load.image('wardrobe-1', 'images/furniture/szafa1.png');
        this.load.image('wardrobe-2', 'images/furniture/szafa2.png');
        this.load.image('wardrobe-3', 'images/furniture/szafa3.png');

        this.load.image('mini-wardrobe', 'images/furniture/szafeczka.png');
        this.load.image('mini-wardrobe', 'images/furniture/szafeczka2.png');
    }

    private drawRoomInitial() {
        this.walls = this.physics.add.staticGroup();
        this.entrance = this.physics.add.staticGroup();

        var topStartPoint = 24;
        var bottomStopPoint = 480;
        var leftStartPoint = 168;
        var rightStopPoint = 856; //16 * x +12

        //podłoga
        for (var j = topStartPoint+53; j<= bottomStopPoint-10; j+=16){
            for (var i = leftStartPoint+22; i<=rightStopPoint-10; i+=16){
                var randNumber = Math.floor(Math.random() * 3) + 2;
                this.add.image(i, j, "floor-"+randNumber);
            }
        }

        //środkowy murek
        for (var i=leftStartPoint + 27; i<=rightStopPoint - 16; i += 16) {
            this.walls.create(i, topStartPoint + 30, "wall-brick-center");
        }  
        
        //górna ściana
        for (var i = leftStartPoint + 16; i <= rightStopPoint - 16; i += 16) {
            this.walls.create(i, topStartPoint, "wall-top");
        }

        for (var i = leftStartPoint + 22; i <= rightStopPoint - 8; i += 16) {
            this.walls.create(i, topStartPoint+12, "wall-bottom-small");
        }
 
        //lewa ściana
        for (var i=topStartPoint+8; i<=bottomStopPoint-16; i+=16){
            this.walls.create(leftStartPoint, i, "wall-left");
        }

        for (var i=topStartPoint+22; i<=bottomStopPoint-16; i+=16){
            this.walls.create(leftStartPoint+11, i, "wall-right-small");
        }  

        //prawa ściana
        for (var i=topStartPoint+16; i<=bottomStopPoint-32; i+=16){
            this.walls.create(rightStopPoint, i, "wall-brick-right-center");
        }

        for (var i=topStartPoint+16; i<=bottomStopPoint-40; i+=16){
            this.walls.create(rightStopPoint-11, i, "wall-right-small").setAngle(180);
        }

        //dolna ściana
        for (var i=leftStartPoint+16; i<=rightStopPoint-16; i+=16){
            if (i <= leftStartPoint+144 || i >= leftStartPoint + 272){
                this.walls.create(i, bottomStopPoint-24, "wall-top").setAngle(180);
                this.walls.create(i, bottomStopPoint-36, "wall-bottom-small").setAngle(180);
            }       
        }

        // //narożniki zewnętrzne i wewnętrzne
        this.walls.create(leftStartPoint+11, topStartPoint+12, "wall-middle-right-corner");
        this.walls.create(rightStopPoint-11, topStartPoint+12, "wall-middle-left-corner");
        this.walls.create(leftStartPoint+11, bottomStopPoint-36, "wall-middle-left-corner").setAngle(180);
        this.walls.create(rightStopPoint-11, bottomStopPoint-36, "wall-middle-right-corner").setAngle(180);

        this.walls.create(leftStartPoint, topStartPoint, "wall-left-top-corner");
        this.walls.create(rightStopPoint, topStartPoint, "wall-right-top-corner");
        this.walls.create(rightStopPoint, bottomStopPoint-24, "wall-left-top-corner").setAngle(180);
        this.walls.create(leftStartPoint, bottomStopPoint-24, "wall-right-top-corner").setAngle(180);

        //dolny murek
        this.walls.create(leftStartPoint, bottomStopPoint, "wall-brick-left");
        this.walls.create(rightStopPoint, bottomStopPoint, "wall-brick-right");

        for (var i=leftStartPoint+16; i<=rightStopPoint-16; i+=16){      
            if (i <= leftStartPoint+128 || i >= leftStartPoint + 272){
                this.walls.create(i, bottomStopPoint, "wall-brick-center");
            } 
        }

        //okna
        this.add.image(leftStartPoint+64, bottomStopPoint-4, "wall-window1");

        //wejście
        var doorStartPointTop = 539; //520
        var doorStartPointLeft = 300; 
        var doorAreaLenght = doorStartPointLeft + 128;

        //wejście-podłoga!!!
        for (var j = 42 ;j<=90; j+=16){
            for(var i = 16; i<=128; i+=16){
                this.entrance.create(doorStartPointLeft+i, doorStartPointTop-j, "floor-1");
            }
        }

        this.walls.create(doorStartPointLeft, doorStartPointTop, "wall-brick-left");
        this.walls.create(doorAreaLenght + 16, doorStartPointTop, "wall-brick-right");
        for (var i=doorStartPointLeft+16; i<=doorAreaLenght; i+=16 ){
            this.walls.create(i, doorStartPointTop, "wall-brick-center");
        }

        this.walls.create(doorStartPointLeft, doorStartPointTop-24, "wall-right-top-corner").setAngle(180);
        this.walls.create(doorAreaLenght+16, doorStartPointTop-24, "wall-left-top-corner").setAngle(180);

        for (var i=doorStartPointLeft+16; i<=doorAreaLenght; i+=16){
            this.walls.create(i, doorStartPointTop-24, "wall-top").setAngle(180);
            this.walls.create(i, doorStartPointTop-36, "wall-bottom-small").setAngle(180);
        }

        this.add.image(doorStartPointLeft + doorAreaLenght/6, doorStartPointTop-2, "wall-door");

        for (var i=40; i<=72; i+=16){
            this.walls.create(doorStartPointLeft, doorStartPointTop-i, "wall-brick-right-center").setAngle(180);
            this.walls.create(doorStartPointLeft+11, doorStartPointTop-i, "wall-right-small");

            this.walls.create(doorAreaLenght+16, doorStartPointTop-i, "wall-brick-right-center");
            this.walls.create(doorAreaLenght+5, doorStartPointTop-i, "wall-right-small").setAngle(180);
        }

        this.walls.create(doorStartPointLeft+11, doorStartPointTop-88, "wall-right-small");
        this.walls.create(doorAreaLenght+5, doorStartPointTop-88, "wall-right-small").setAngle(180);
    }

    private prepareRoomItems() {
        this.workbench = this.physics.add.staticSprite(300, 200, 'table-1');
        this.wardrobe = this.physics.add.staticSprite(700, 200, 'wardrobe-1');

        this.physics.add.collider(this.majster.majster, this.workbench, null, null, this);
        this.physics.add.collider(this.majster.majster, this.wardrobe, null, null, this);
    }

    private updateTime(): void {
        this.gameTime.update(this.gameOverEvent.getProgress());
        this.remainingTimeText.setText(this.gameTime.getTime())
        
        let textColor = this.gameOverEvent.getProgress() < 0.5  
            ? 'green' 
            : this.gameOverEvent.getProgress() < 0.75 ? 'orange' : 'red';

        this.remainingTimeText.setColor(textColor);
    }

    onGameOverEvent(): void {
        this.scene.start('ScoreScene', { score: this.score });
    }

    private takeOrder(): void {
        if (this.majster.repairedItem !== null) {
            return;
        }

        this.majster.acceptRequest(new RepairedItem())
        this.currentGameWindow = GameWindowFocus.Dialog;
        this.nieMaProblemuSaid = false;
        this.majster.stop();

        this.loadRequest(this.majster.repairedItem.repairedItemType);
    }

    private loadRequest(item: RepairedItemType): void {
        var randNumber = Math.floor(Math.random() * 3) + 1;
        this.add.image(66, 646, "client"+randNumber).setDisplaySize(90,90);
        this.currentGameWindow = GameWindowFocus.Dialog;
        let dialogLength = this.requestDialog.createRequest(item);
        this.time.addEvent({delay: 50, callback: this.updateRequest, callbackScope: this, repeat: dialogLength, args: [dialogLength] });
    }

    private updateRequest(dialogLength: number): void {
        this.requestDialog.nextLetter();
        this.clientDialogText.setText(this.requestDialog.text);

        if (this.clientDialogText.text.length === dialogLength) {
            this.time.addEvent({delay: 300, callback: this.showTakeAssignmentText, callbackScope: this });
        }
    }

    private showTakeAssignmentText(): void {
        if (!this.nieMaProblemuSaid) {
            this.majsterDialogText.setText("Przyjmij zlecenie");
        }
    }

    private loadResponse() {
        this.nieMaProblemuSaid = true;
        let dialogLength = this.responseDialog.createResponse();
        this.time.addEvent({delay: 50, callback: this.updateResponse, callbackScope: this, repeat: dialogLength, args: [dialogLength] });
    }

    private updateResponse(): void {
        this.responseDialog.nextLetter();
        this.majsterDialogText.setText(this.responseDialog.text);
    }

    private checkClosestWorkbench(): void {
        if (this.majster.repairedItem === null) {
            return;
        }

        let shouldUse = this.shouldUseFurniture(this.workbench);
        
        if (shouldUse) {
            if (this.majster.equipment.length !== 0) {
                this.scene.switch('HammeringScene');
            } else {
                this.updateEquipment();
                let dialogLength = this.responseDialog.createNeededItemsText(this.majster.repairedItem.neededItems);
                this.time.addEvent({delay: 50, callback: this.updateResponse, callbackScope: this, repeat: dialogLength, args: [dialogLength] });
            }
        }
    }

    private checkClosestWardrobe(): void {
        if (this.majster.repairedItem === null) {
            return;
        }

        let shouldUse = this.shouldUseFurniture(this.wardrobe);

        if (shouldUse) {
            this.majster.stop();
            this.takeTools();
        }
    }

    private shouldUseFurniture(sprite: Phaser.Physics.Arcade.Sprite): boolean {
        let distanceToObject = Phaser.Math.Distance.Between(this.majster.majster.x, this.majster.majster.y, sprite.x, sprite.y);            
        
        if (distanceToObject < 40.0) {
            return true;
        }

        return false;
    }

    private takeTools(): void {
        this.scene.launch('ItemSelectionScene', { majster: this.majster });
        this.currentGameWindow = GameWindowFocus.Items;
    }

    private updateEquipment(): void {
        for (let i = 0; i < 5; i++) {
            if (this.majster.equipment.length > i) {
                this.equipmentText[i].setText(`${i + 1}. ${this.majster.equipment[i]}`);
            } else {
                this.equipmentText[i].setText(`${i + 1}. ......................`);
            }
        }
    }
};