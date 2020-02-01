import { Majster } from './majster';
import { ItemType } from './ItemType.enum';

export class ItemSelectionScene extends Phaser.Scene {
    title: Phaser.GameObjects.Text;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;

    index: number = 0;
    selectableItems: ItemType[]=[];
    private equipmentText: {[key:number]:  Phaser.GameObjects.Text};


    wasDownDown: boolean = false;
    wasUpDown: boolean = false;

    baseStyle: any;
    selectedStyle: any;

    private majster: Majster;

    constructor() {
        super({
            key: "ItemSelectionScene"
        });
        
        this.selectableItems = Object.values(ItemType);
        
        this.baseStyle = {
            font: '20px Arial Bold',
            align: 'center',
            fill: '#FFFFFF'
        };

        this.selectedStyle = {
            font: this.baseStyle.font,
            align: this.baseStyle.align,
            fill: '#FBFBAC'
        }
    }

    init(params: any): void {
        this.majster = params.majster;
    }
    
    create(): void {
        this.cursors = this.input.keyboard.createCursorKeys();

        this.title = this.add.text(150, 50, "Co wybierasz?",
        {
            font: '32px Consolas Bold',
            fill: '#FBFBAC'
        });

        this.printItemsAndGetHandles();
    }

    update() {
        this.updateSelection();

        if (Phaser.Input.Keyboard.JustDown(this.cursors.shift))
        {
            this.exit();
        }
    }

    private updateSelection() {
        if (this.cursors.up.isDown && !this.wasUpDown) {
            this.moveSelectionUp();
            this.updatePrintedItems();
        }
        if (this.cursors.down.isDown && !this.wasDownDown) {
            this.moveSelectionDown();
            this.updatePrintedItems();
        }

        this.wasDownDown = this.cursors.down.isDown;
        this.wasUpDown = this.cursors.up.isDown;
    }

    private exit(){
        this.majster.equipment.push(ItemType.Kabel);
        this.majster.equipment.push(ItemType.Obcegi);

        this.scene.switch("GameScene");
    }

    private moveSelectionDown() {
        if (this.index < this.selectableItems.length - 1) {
            this.index += 1;
            console.log(`Selection moved down, current index: ${this.index}`);
        }
    }

    private moveSelectionUp() {
        if (this.index > 0) {
            this.index -= 1;
            console.log(`Selection moved up, current index: ${this.index}`);
        }
    }

    private printItemsAndGetHandles() {
        var i = 0;
        this.selectableItems.forEach((itemNameHandle, i, _) => {
           this.printItemAndGetHandle(itemNameHandle, i, this.index == i);
        });
    }

    private printItemAndGetHandle(itemName: string, row: number, selected: boolean): Phaser.GameObjects.Text {
        let startX = 150;
        let startY = 100;
        let stepY = 30;
        var y = startY + row * stepY;
        return this.add.text(startX, y, itemName, selected ? this.selectedStyle : this.baseStyle);
    }



    private updatePrintedItems() {
        this.selectableItems.forEach((itemNameHandle, i, _) => {
            //itemNameHandle[1].setStyle(this.index == i ? this.selectedStyle : this.baseStyle);
        })
    }
};