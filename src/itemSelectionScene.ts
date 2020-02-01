import { Majster } from './majster';
import { ItemType } from './ItemType.enum';
import { GameWindowFocus } from './gameWindowFocus.enum';

export class ItemSelectionScene extends Phaser.Scene {
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;

    private index: number = 0;
    private wordrobeToolActive: boolean;
    private wordrobeTools: ItemType[];
    private wordrobeTexts: Phaser.GameObjects.Text[];
    private majsterToolsTexts: Phaser.GameObjects.Text[];

    baseStyle: any = {
        font: '20px Consolas',
        fill: '#FFFFFF'
    };

    selectedStyle: any = {
        font: this.baseStyle.font,
        align: this.baseStyle.align,
        fill: '#FBFBAC'
    };

    private majster: Majster;

    constructor() {
        super({
            key: "ItemSelectionScene"
        });
    }

    init(params: any): void {
        this.majster = params.majster;
    }
    
    create(): void {
        this.cursors = this.input.keyboard.createCursorKeys();

        this.add.text(150, 50, "Co wybierasz?",
        {
            font: '32px Consolas',
            fill: '#FBFBAC'
        });

        this.wordrobeToolActive=true;
        this.wordrobeTools = Object.values(ItemType).filter(x => !this.majster.equipment.includes(x));
        this.wordrobeTexts = [];
        this.majsterToolsTexts = [];

        this.prepareWordrobeItems();
        this.prepareMajsterItems();
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.cursors.left) && this.wordrobeTools.length!==0)
        {
           this.wordrobeToolActive=true;
           this.index = 0;
           
            this.updateWordrobeItems();
            this.updateMajsterItems();
        }
        else if (Phaser.Input.Keyboard.JustDown(this.cursors.right) && this.majster.equipment.length!==0)
        {
            this.wordrobeToolActive=false;
            this.index = 0;

            this.updateWordrobeItems();
            this.updateMajsterItems();
        }

        if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
            this.moveSelectionUp();
            
            this.updateWordrobeItems();
            this.updateMajsterItems();
        }
        else if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
            this.moveSelectionDown();

            this.updateWordrobeItems();
            this.updateMajsterItems();
        }

        if (Phaser.Input.Keyboard.JustDown(this.cursors.shift))
        {
            this.exit();
        }

        if (Phaser.Input.Keyboard.JustDown(this.cursors.space))
        {
            if (this.wordrobeToolActive){
                this.ChooseTool();
            }
            else {
                this.removeTool();
            }
            
            this.updateWordrobeItems();
            this.updateMajsterItems();
        }
    }

    removeTool() {
        var item = this.majster.equipment[this.index];

        this.wordrobeTools.push(item);
        this.majster.equipment = this.majster.equipment.filter(x => x != item);
            
        this.index = this.index >= this.majster.equipment.length ? this.wordrobeTools.length-1 : 0;

    }

    private ChooseTool() {
        var item = this.wordrobeTools[this.index];

        this.majster.equipment.push(item);
        this.wordrobeTools = this.wordrobeTools.filter(x => x != item);
            
        this.index = this.index >= this.wordrobeTools.length ? this.wordrobeTools.length-1 : 0;
    }

    private exit(){
        let gameScene:any = this.scene.get('GameScene');

        gameScene.currentGameWindow = GameWindowFocus.Majster;
        this.scene.stop();
    }

    private moveSelectionDown() {
        if (this.index < this.wordrobeTools.length - 1) {
            this.index += 1;
        }
    }

    private moveSelectionUp() {
        if (this.index > 0) {
            this.index -= 1;
        }
    }

    private updateWordrobeItems() {
        this.wordrobeTexts.forEach(x => x.setText(""));

        this.wordrobeTools.forEach((item, i) => {
            let isSelected = (i == this.index && this.wordrobeToolActive);
            
            this.wordrobeTexts[i].setText(item)
            this.wordrobeTexts[i].setStyle( isSelected ? this.selectedStyle : this.baseStyle);
        });
    }

    private updateMajsterItems() {
        this.majsterToolsTexts.forEach(x => x.setText(""));

        this.majster.equipment.forEach((item, i) => {
            let isSelected = (i == this.index && !this.wordrobeToolActive);
            this.majsterToolsTexts[i].setText(item)
            this.majsterToolsTexts[i].setStyle( isSelected ? this.selectedStyle : this.baseStyle);
        });
    }

    private prepareWordrobeItems() {
        const startX = 150;
        const startY = 100;
        let stepY = 30;

        Object.keys(ItemType).forEach((item, i) => {
            let isSelected = (i == this.index && this.wordrobeToolActive);
            this.wordrobeTexts.push(this.add.text(startX, startY + i*stepY, "", isSelected ? this.selectedStyle : this.baseStyle));
        });

        this.updateWordrobeItems();
    }

    private prepareMajsterItems() {
        const startX = 500;
        const startY = 100;
        let stepY = 30;

        Object.keys(ItemType).forEach((item, i) => {
            let isSelected = (i == this.index && !this.wordrobeToolActive);
            this.majsterToolsTexts.push(this.add.text(startX, startY + i*stepY, "", isSelected  ? this.selectedStyle : this.baseStyle));
        });

        this.updateMajsterItems();
    }
};