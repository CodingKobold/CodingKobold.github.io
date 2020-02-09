import "phaser";
import { Majster } from './majster';
import { Dialog } from "./dialog";

import { GameTime } from './gameTime';
import { GameWindowFocus } from "./gameWindowFocus.enum";
import { RepairedItem } from './repairedItem';
import { RepairedItemType } from './repairedItemType.enum';
import { GameStep } from "./gameStep.enum";
import { HintType } from "./hintTypes.enum";
import { ItemType } from './ItemType.enum';

export class GameScene extends Phaser.Scene {
    // game related
    private currentGameStep: GameStep;

    // scene related
    private currentGameWindow: GameWindowFocus;

    // keyboard related
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private actionKey: Phaser.Input.Keyboard.Key;

    // majster related
    private majster: Majster;

    // fixed item related
    // fill

    // equipment related
    private equipmentText: { [key: number]: Phaser.GameObjects.Text };

    // objects related
    private graphics: Phaser.GameObjects.Graphics;
    private walls: Phaser.Physics.Arcade.StaticGroup;
    private entrance: Phaser.Physics.Arcade.StaticGroup;
    private workbench: Phaser.Physics.Arcade.Sprite;
    private wardrobe: Phaser.Physics.Arcade.Sprite;
    private wardrobe2: Phaser.Physics.Arcade.Sprite;
    private wardrobe3: Phaser.Physics.Arcade.Sprite;
    private wardrobeItems: ItemType[];
    private wardrobe2Items: ItemType[];
    private wardrobe3Items: ItemType[];

    private repairedItemImage: Phaser.GameObjects.Image;

    // time related
    private remainingTimeText: Phaser.GameObjects.Text;
    private gameTime: GameTime;
    private gameDuration: number;
    private gameOverEvent: Phaser.Time.TimerEvent;

    // dialog related
    private requestDialog: Dialog;
    private responseDialog: Dialog;
    private clientDialogText: Phaser.GameObjects.Text;
    private majsterDialogText: Phaser.GameObjects.Text;
    private nieMaProblemuSaid: boolean;
    private clientImage: Phaser.GameObjects.Image;

    // hint related
    private hintArrows: Phaser.Physics.Arcade.Sprite[] = [];
    private hintsEnabled = true;

    // score related
    private pieniazki: number;
    private pieniazkiText: Phaser.GameObjects.Text;

    constructor() {
        super({
            key: "GameScene"
        });
    }

    init(): void {
        this.currentGameStep = GameStep.Start;
        this.graphics = this.add.graphics();
        this.currentGameWindow = GameWindowFocus.Majster;
        this.pieniazki = 0;
        this.gameDuration = 2 * 60 * 1000; // 2 min
        this.clientImage = null;
    }

    preload(): void {
        this.loadRoomAssets();
        this.loadGrassAssets();
        this.load.spritesheet('majster', Majster.image, { frameWidth: 64, frameHeight: 64 });
        this.load.image('dialog-box', 'images/dialog-box.png');
        this.load.image('client1', 'images/clients/client1.png');
        this.load.image('client2', 'images/clients/client2.png');
        this.load.image('client3', 'images/clients/client3.png');
        this.load.image('client4', 'images/clients/client4.png');

        this.load.image('tv', 'images/items/tv.png');
        this.load.image('rubbish', 'images/rubishHil.png');
        this.load.image('but', 'images/items/shoe.png');
        this.load.image('lampa', 'images/items/lamp.png');
        this.load.image('balon', 'images/items/baloon.png');
        this.load.image('arrow', 'images/arrow.png');
    }

    create(): void {
        // TODO: Remove when not needed anymore
        this.prepareGameShapes();
        this.drawGrassInitial();
        this.drawRoomInitial(160, 32, 736, 448);
        this.prepareInput();
        this.prepareMajster();
        this.prepareRoomItems();
        this.preparePhysics();
        this.prepareDialogs();
        this.prepareTime();
        this.prepareEquipment();
        this.preparePieniazki();

        if (this.hintsEnabled) { this.showHint(HintType.PrzyjmijZlecenie, [[375, 420]]) };

        this.wardrobeItems = [];
        this.wardrobeItems.push(ItemType.Kombinerki)
        this.wardrobeItems.push(ItemType.Obcegi)
        this.wardrobeItems.push(ItemType.Srubokret)
        this.wardrobeItems.push(ItemType.Mlotek)

        this.wardrobe2Items = []
        this.wardrobe2Items.push(ItemType.Kabel);
        this.wardrobe2Items.push(ItemType.Neonowka);

        this.wardrobe3Items = []
        this.wardrobe3Items.push(ItemType.Nit);
        this.wardrobe3Items.push(ItemType.Miara);
        this.wardrobe3Items.push(ItemType.Smar);
        this.wardrobe3Items.push(ItemType.ZardzewialaSrubka);
    }

    update(): void {
        this.updateTime();

        if (this.currentGameWindow === GameWindowFocus.Items) {
            if (Phaser.Input.Keyboard.JustUp(this.actionKey)) {
                this.updateEquipment();
            }
            return;
        }
        if (this.currentGameWindow === GameWindowFocus.Hammering) {
            return;
        }
        else if (this.currentGameWindow === GameWindowFocus.Majster) {
            this.majster.move(this.cursors);
        }
        else if (this.currentGameWindow === GameWindowFocus.Dialog) {
            if (Phaser.Input.Keyboard.JustUp(this.actionKey)) {
                this.loadResponse();
                this.currentGameWindow = GameWindowFocus.Majster;
                this.currentGameStep = GameStep.OrderTaken;
            }
        }

        if (Phaser.Input.Keyboard.JustUp(this.actionKey)) {
            this.checkClosestWorkbench();
            this.checkClosestWardrobe();
        }
    }

    private prepareEquipment(): void {
        this.add.text(1000, 300, "Ekwipunek Majstra", { font: '28px Consolas' });

        let y = 350;
        let ySpacing = 40;
        this.equipmentText = {};

        Array.from(Array(5).keys()).forEach(x => {
            this.equipmentText[x] = this.add.text(1030, y, ""), { font: '28px Consolas', align: 'center', fixedWidth: 300 };
            y += ySpacing;
        })

        this.updateEquipment();
    }

    private preparePieniazki(): void {
        this.add.text(915, 160, "Ciężko zarobione pieniądze", { font: '28px Consolas' });
        this.pieniazkiText = this.add.text(950, 195, `${this.pieniazki} PLN`, { font: '70px Consolas', fill: 'green', align: 'center', fixedWidth: 330 });
    }

    private prepareGameShapes() {
        let itemsArea: Phaser.Geom.Rectangle = new Phaser.Geom.Rectangle(880, 0, 464, 720);

        this.graphics.fillStyle(0x2e2e1f);
        this.graphics.fillRectShape(itemsArea);
    }

    private prepareTime() {
        this.gameTime = new GameTime();
        this.gameOverEvent = this.time.delayedCall(this.gameDuration, this.onGameOverEvent, [], this);

        this.add.text(990, 20, "Czas do zamknięcia", { font: '28px Consolas' });
        this.remainingTimeText = this.add.text(975, 55, this.gameTime.getTime(), { font: '70px Consolas' });
    }

    private prepareDialogs() {
        this.add.image(443, 648, 'dialog-box').setDisplaySize(890, 144);

        this.requestDialog = new Dialog();
        this.responseDialog = new Dialog();
        this.clientDialogText = this.add.text(130, 606, "", { font: '24px Consolas', fill: '#050505' });
        this.majsterDialogText = this.add.text(130, 646, "", { font: '24px Consolas', fill: '#ff0000' });
    }

    prepareMajster() {
        this.majster = new Majster(this.physics.add.sprite(32, 32, 'majster'))
        this.majster.setPosition(400, 300);
        this.majster.loadAnimations(this.anims);
    }

    prepareInput(): void {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.actionKey = this.cursors.space;
    }

    preparePhysics(): void {
        this.physics.add.collider(this.majster.majster, this.walls);
        this.physics.add.collider(this.majster.majster, this.workbench);
        this.physics.add.overlap(this.majster.majster, this.entrance, this.onEntranceEvent, null, this);
    }

    itemTakenFromWardrobe(){
        if(this.hintsEnabled){ 
            this.removeHintArrows();
            this.showHint(HintType.NaprawPrzedmiot, [[350, 60]]); 
        }
    }

    gwozdzDriven(){
        if(this.hintsEnabled){ 
            this.removeHintArrows();
            this.showHint(HintType.OddajPrzedmiot, [[375, 420]]); 
        }
    }

    private loadGrassAssets() {
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

    private drawGrassInitial() {
        for (var j = 0; j <= 880; j += 16) {
            for (var i = 0; i <= 880; i += 16) {
                var randNumber = Math.floor(Math.random() * 5) + 1;
                this.add.image(i, j, "grass" + randNumber);
            }
        }
        this.add.image(75, 22, "tree1");
        this.add.image(15, 150, "tree2");
        this.add.image(92, 350, "tree2");
        this.add.image(750, 535, "tree2").setDisplaySize(55, 55);
        this.add.image(40, 430, "water1");
        this.add.image(23, 255, "water2");
        this.add.image(376, 565, "walk1");
        for (var i = 392; i <= 648; i += 16) {
            this.add.image(i, 569, "walk2");
        }
        this.add.image(648, 569, "walk3");

    }

    private loadRoomAssets() {
        this.load.image('wall-corner', 'images/wall/corner.png');
        this.load.image('wall-middle', 'images/wall/middle.png'); 

        this.load.image('brick-left-corner', 'images/wall/brick-left-corner.png');
        this.load.image('brick-right-corner', 'images/wall/brick-right-corner.png');
        this.load.image('brick-middle', 'images/wall/brick-middle.png');
        
        for (var i = 1; i <= 4; i++){
            this.load.image('floor-' + i, 'images/wall/floor-' + i + '.png');
        }

        for (var i = 1; i <= 2; i++){
            this.load.image('carpet-corner-' + i, 'images/carpets/corner-' + i + '.png');
            this.load.image('carpet-edge-' + i, 'images/carpets/edge-' + i + '.png');
            this.load.image('carpet-center-' + i, 'images/carpets/center-' + i + '.png');
        }

        this.load.image('wall-window1', 'images/wall/window1.png');
        this.load.image('wall-door', 'images/wall/door.png');

        this.load.image('computer', 'images/furniture/komputer.png');
        this.load.image('plant', 'images/furniture/kwiatek.png');
        this.load.image('low-table', 'images/furniture/niski-stol.png');
        this.load.image('radio', 'images/furniture/radio.png');

        this.load.image('table-1', 'images/furniture/stol1.png');

        this.load.image('wardrobe-1', 'images/furniture/szafa1.png');
        this.load.image('wardrobe-2', 'images/furniture/szafa2.png');
        this.load.image('wardrobe-3', 'images/furniture/szafa3.png');

        this.load.image('mini-wardrobe', 'images/furniture/szafeczka.png');
        this.load.image('mini-wardrobe', 'images/furniture/szafeczka2.png');

        this.load.image('kwiatek', 'images/furniture/kwiatek.png');
        this.load.image('cat', 'images/cat.png');
    }

    private drawRoomInitial(posX: number, posY: number, width: number, height: number) {
        this.walls = this.physics.add.staticGroup();
        this.entrance = this.physics.add.staticGroup();

        var entrancePos = 96;
        var entranceLenght = 256;

        //left-top-corner & right-top-corner
        this.walls.create(posX, posY, "wall-corner");
        this.walls.create(posX + width - 32, posY, "wall-corner").setAngle(90);

        //left-bottom-corner & right-bottom-corner
        this.walls.create(posX, posY + height - 32, "wall-corner").setAngle(-90);
        this.walls.create(posX + width - 32, posY + height - 32, "wall-corner").setAngle(180);

        //left-outside-brick-corner & right-outside-brick-corner
        this.walls.create(posX, posY + height, "brick-left-corner"));
        this.walls.create(posX + width - 32, posY + height, "brick-right-corner");

        //top-edge & brick inside & bottom-edge & brick outside
        for (var i = posX + 32; i <= posX + width - 64; i += 32){
            this.walls.create(i, posY, "wall-middle");
            this.walls.create(i, posY + 32, "brick-middle");
            if (i <= posX + entrancePos || i >= posX + entrancePos + entranceLenght) {
                this.walls.create(i, posY + height - 32, "wall-middle").setAngle(180);
                this.walls.create(i, posY + height, "brick-middle");
            }
        }
        
        //left-edge & right-edge 
        for (var i = posY + 32; i <= posY + height - 64; i += 32){
            this.walls.create(posX, i, "wall-middle").setAngle(90);
            this.walls.create(posX + width - 32, i, "wall-middle").setAngle(-90);
        }  

        //entrance-left-top-corner & entrance-right-top-corner
        this.walls.create(posX + entrancePos + 32, posY + height - 32, "wall-corner").setAngle(90);
        this.walls.create(posX + entrancePos + entranceLenght - 32, posY + height - 32, "wall-corner");

        //entrance-left-bottom-corner & entrance-right-bottom-corner
        this.walls.create(posX + entrancePos + 32, posY + height + 32, "wall-corner").setAngle(-90);
        this.walls.create(posX + entrancePos + entranceLenght - 32, posY + height + 32, "wall-corner").setAngle(180);

        //entrance-left-outside-brick-corner & entrance-right-outside-brick-corner
        this.walls.create(posX + entrancePos + 32, posY + height + 64, "brick-left-corner");
        this.walls.create(posX + entrancePos + entranceLenght - 32, posY + height + 64, "brick-right-corner");

        //entrance-left-edge & entrance-right-edge
        this.walls.create(posX + entrancePos + 32, posY + height, "wall-middle").setAngle(90);
        this.walls.create(posX + entrancePos + entranceLenght - 32, posY + height, "wall-middle").setAngle(90);

        //entrance-bottom-edge & brick-outside
        for(var i = posX + entrancePos + 64; i <= posX + entrancePos + entranceLenght - 64; i += 32 ){
            this.walls.create(i, posY + height + 32, "wall-middle");
            this.walls.create(i, posY + height + 64, "brick-middle");
        } 
        
        //entrance-floor
        for (var i = posX + entrancePos + 56; i <= posX + entrancePos + entranceLenght - 56  ; i += 16 ){
            for (var j = posY + height - 40; j <= posY + height + 16; j += 16){
                this.entrance.create(i, j, "floor-1");
            }      
        }
        
        //floor
        for (var i = posX + 24; i <= posX + width - 48; i += 16){
            for (var j = posY + 56; j <= posY + height - 48; j += 16){
                var randNumber = Math.floor(Math.random() * 3) + 2;
                this.add.image(i, j, "floor-" + randNumber);
            }          
        }

        this.createCarpet(192, 94, 256, 144, 1);
        this.createCarpet(525, 336, 128, 96, 2);

        this.walls.create(580, 375, "cat").setDisplaySize(50,50);
    }

    private createCarpet(posX: number, posY: number, width: number, height: number, type: number){
        //left-top-corner & right-top-corner
        this.add.image(posX, posY, "carpet-corner-" + type);
        this.add.image(posX + width - 16, posY, "carpet-corner-" + type).setAngle(90);

        //left-bottom-corner & right-bottom-corner
        this.add.image(posX, posY + height - 16, "carpet-corner-" + type).setAngle(-90);
        this.add.image(posX + width - 16, posY + height - 16, "carpet-corner-" + type).setAngle(180);

        //top-edge & bottom-edge
        for (var i = posX + 16; i <= posX + width - 32; i += 16){
            this.add.image(i, posY, "carpet-edge-" + type);
            this.add.image(i, posY + height - 16, "carpet-edge-" + type).setAngle(180);
        }

        //left-edge & right-edge
        for (var i = posY + 16; i <= posY + height - 32; i += 16){
            this.add.image(posX, i, "carpet-edge-" + type).setAngle(-90);
            this.add.image(posX + width - 16, i, "carpet-edge-" + type).setAngle(90);
        }

        //center
        for (var i = posX + 16; i <= posX + width - 32; i += 16){
            for (var y = posY + 16; y <= posY + height - 32; y += 16){
                this.add.image(i, y, "carpet-center-" + type);
            }  
        }
    }

    private prepareRoomItems() {
        this.workbench = this.physics.add.staticSprite(350, 130, 'table-1');
        this.physics.add.collider(this.majster.majster, this.workbench, null, null, this);

        // wardrobe 1
        let x = this.physics.add.staticSprite(732, 80, 'wardrobe-1');
        this.physics.add.collider(this.majster.majster, x, null, null, this);

        x = this.physics.add.staticSprite(816, 80, 'wardrobe-1');
        this.physics.add.collider(this.majster.majster, x, null, null, this);

        this.wardrobe = this.physics.add.staticSprite(774, 80, 'wardrobe-1');
        this.physics.add.collider(this.majster.majster, this.wardrobe, null, null, this);

        // wardrobe 2
        this.wardrobe2 = this.physics.add.staticSprite(750, 275, 'wardrobe-2');
        this.physics.add.collider(this.majster.majster, this.wardrobe2, null, null, this);

        // wardrobe 3
        this.wardrobe3 = this.physics.add.staticSprite(250, 300, 'wardrobe-3');
        this.physics.add.collider(this.majster.majster, this.wardrobe3, null, null, this);

    }

    private updateTime(): void {
        this.gameTime.update(this.gameOverEvent.getProgress());
        this.remainingTimeText.setText(this.gameTime.getTime())

        let textColor = this.gameOverEvent.getProgress() < 0.5
            ? 'green'
            : this.gameOverEvent.getProgress() < 0.75 ? 'orange' : 'red';

        this.remainingTimeText.setColor(textColor);
    }

    private showHint(hint: HintType, arrowPositions: [number, number][]) {
        let hintArrow = 'arrow';

        arrowPositions.forEach(pos => {
            this.hintArrows.push(this.physics.add.sprite(pos[0], pos[1], hintArrow)
                .setAngle(-90)
                .setScale(0.3));
        })

        if (hint.length > 0) {
            var dialogLength = this.responseDialog.createHint(hint);
            this.time.addEvent({
                delay: 20,
                callback: this.updateResponse,
                callbackScope: this,
                repeat: dialogLength,
                args: [dialogLength]
            });
        }
    }

    private removeHint() {
        this.clearResponse();
        this.removeHintArrows();
    }

    removeHintArrows() {
        if (this.hintArrows != null && this.hintArrows.length != 0) {
            this.hintArrows.forEach((a) => a.destroy());
        }
    }

    onGameOverEvent(): void {
        this.scene.stop('ItemSelectionScene')
        this.scene.stop('HammeringScene')
        this.scene.start('ScoreScene', { score: this.pieniazki });
    }

    private onEntranceEvent(): void {
        if (this.currentGameStep === GameStep.Start) {
            this.takeOrder();
        }
        if (this.currentGameStep === GameStep.OrderReady) {
            this.updatePieniazki();
            this.majster.repairedItem = null;
            this.repairedItemImage.destroy();
            this.currentGameStep = GameStep.Start;
            if(this.hintsEnabled){
                this.hintsEnabled = false;
                this.removeHintArrows();
            }
        }
    }

    private takeOrder(): void {
        if (this.majster.repairedItem !== null) {
            return;
        }

        if(this.hintsEnabled){ this.removeHint(); }

        let repairedItem = new RepairedItem()

        this.majster.acceptRequest(repairedItem);
        this.repairedItemImage = this.add.image(365, 465, repairedItem.repairedItemType.toLowerCase()).setDisplaySize(40,40);
        this.currentGameWindow = GameWindowFocus.Dialog;
        this.nieMaProblemuSaid = false;
        this.majster.stop();

        this.loadRequest(this.majster.repairedItem.repairedItemType);
    }

    private loadRequest(item: RepairedItemType): void {
        var randNumber = Math.floor(Math.random() * 3) + 1;

        if (this.clientImage !== null) {
            this.clientImage.destroy();
        }
        
        this.clientImage = this.add.image(66, 646, "client" + randNumber).setDisplaySize(90, 90);
        this.currentGameWindow = GameWindowFocus.Dialog;
        let dialogLength = this.requestDialog.createRequest(item);
        this.time.addEvent({ delay: 20, callback: this.updateRequest, callbackScope: this, repeat: dialogLength, args: [dialogLength] });
    }

    private updateRequest(dialogLength: number): void {
        this.requestDialog.nextLetter();
        this.clientDialogText.setText(this.requestDialog.text);

        if (this.clientDialogText.text.length === dialogLength) {
            this.time.addEvent({ delay: 200, callback: this.showTakeAssignmentText, callbackScope: this });
        }
    }

    private showTakeAssignmentText(): void {
        if (!this.nieMaProblemuSaid) {
            this.majsterDialogText.setText("Przyjmij zlecenie [SPACJA]");
        }
    }

    private loadResponse() {
        this.nieMaProblemuSaid = true;
        let dialogLength = this.responseDialog.createResponse();
        this.time.addEvent({ delay: 50, callback: this.updateResponse, callbackScope: this, repeat: dialogLength, args: [dialogLength] });

        this.repairedItemImage.setPosition(355, 100);
    
        if (this.hintsEnabled) {
            this.showInvestigateHint();
        }
    }

    private showInvestigateHint() {
        this.time.addEvent({
            startAt: -1500,
            callback: this.showHint,
            callbackScope: this,
            repeat: 0,
            args: [HintType.ZbadajPrzedmiot, [[350, 60]]]
        });
    }

    private updateResponse(): void {
        this.responseDialog.nextLetter();
        this.majsterDialogText.setText(this.responseDialog.text);
    }

    private clearResponse() {
        this.majsterDialogText.setText("");
    }

    private checkClosestWorkbench(): void {
        if (this.majster.repairedItem === null) {
            return;
        }

        if (this.currentGameStep === GameStep.OrderReady) {
            return;
        }

        let shouldUse = this.shouldUseFurniture(this.workbench);

        if (shouldUse) {
            if (this.majster.equipment.length !== 0) {
                this.currentGameStep = GameStep.ItemHammered;
                this.currentGameWindow = GameWindowFocus.Hammering;
                this.scene.launch('HammeringScene', { majster: this.majster });
            } else if (this.currentGameStep === GameStep.OrderTaken || this.currentGameStep === GameStep.ItemInvestigated) {
                if (this.hintsEnabled) {
                    this.showTakeToolsHint();
                }
                this.updateEquipment();
                let dialogLength = this.responseDialog.createNeededItemsText(this.majster.repairedItem.neededItems);
                this.time.addEvent({ delay: 20, callback: this.updateResponse, callbackScope: this, repeat: dialogLength, args: [dialogLength] });
            }
        }
    }

    private showTakeToolsHint() {
        this.removeHintArrows();
        this.showHint(HintType.ZbierzNarzedzia, 
            [[247,228],[780,17],[750, 203]]);
    }

    private checkClosestWardrobe(): void {
        if (this.majster.repairedItem === null) {
            return;
        }

        if (this.currentGameStep === GameStep.OrderReady) {
            return;
        }

        let shouldUseWardrobe = this.shouldUseFurniture(this.wardrobe);

        if (shouldUseWardrobe) {
            this.majster.stop();
            this.takeTools(this.wardrobeItems);
        }

        let shouldUseWardrobe2 = this.shouldUseFurniture(this.wardrobe2);

        if (shouldUseWardrobe2) {
            this.majster.stop();
            this.takeTools(this.wardrobe2Items);
        }

        let shouldUseWardrobe3 = this.shouldUseFurniture(this.wardrobe3);

        if (shouldUseWardrobe3) {
            this.majster.stop();
            this.takeTools(this.wardrobe3Items);
        }
    }

    private shouldUseFurniture(sprite: Phaser.Physics.Arcade.Sprite): boolean {
        let distanceToObject = Phaser.Math.Distance.Between(this.majster.majster.x, this.majster.majster.y, sprite.x, sprite.y);

        if (distanceToObject < 100.0) {
            return true;
        }

        return false;
    }

    private takeTools(availableItems: ItemType[]): void {
        this.scene.launch('ItemSelectionScene', { majster: this.majster, availableTools: availableItems });
        this.currentGameWindow = GameWindowFocus.Items;
    }

    private updateEquipment(): void {
        for (let i = 0; i < 5; i++) {
            if (this.majster.equipment.length > i) {
                this.equipmentText[i].setText(`${i + 1}. ${this.majster.equipment[i]}`);
            } else {
                this.equipmentText[i].setText(`${i + 1}. ................`);
            }
        }
    }

    private updatePieniazki(): void {
        let value = this.majster.repairedItem.neededItems.length * 20;

        if (this.majster.repairedItem.isDestroyed) {
            value *= -1;
        }

        this.pieniazki += value;

        if (this.pieniazki < 0) {
            this.pieniazkiText.setColor("red");
        } else {
            this.pieniazkiText.setColor("green");
        }
        this.pieniazkiText.setText(`${this.pieniazki} PLN`);
    }
};