import { Pair, Pairs } from "matter";

export class ItemSelectionScene extends Phaser.Scene {
    title: Phaser.GameObjects.Text;

    cursors: Phaser.Types.Input.Keyboard.CursorKeys;

    index: number = 0;
    selectableItems: [string, Phaser.GameObjects.Text][];

    wasDownDown: boolean = false;
    wasUpDown: boolean = false;

    baseStyle: any;
    selectedStyle: any;

    constructor() {
        super({
            key: "ItemSelectionScene"
        });

        this.selectableItems = [["Kowadło", null], ["Imadło", null], ["Cegła", null], ["Śrubokręt", null]];

        this.baseStyle = {
            font: '20px Consolas',
            align: 'left',
            fill: '#FFFFFF'
        };

        this.selectedStyle = {
            font: this.baseStyle.font,
            align: this.baseStyle.align,
            fill: '#FBFBAC'
        }
    }

    create(): void {
        var titleText: string = "Co wybierasz?";
        this.title = this.add.text(150, 50, titleText,
            {
                font: '64px Arial Bold',
                fill: '#FBFBAC'
            });

        this.cursors = this.input.keyboard.createCursorKeys();

        this.printItemsAndGetHandles();
    }

    update() {
        this.updateSelection();
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
            itemNameHandle[1] = this.printItemAndGetHandle(itemNameHandle[0], i, this.index == i);
        });
    }

    private printItemAndGetHandle(itemName: string, row: number, selected: boolean): Phaser.GameObjects.Text {
        let startX = 150;
        let startY = 130;
        let stepY = 30;
        var y = startY + row * stepY;
        return this.add.text(startX, y, itemName, selected ? this.selectedStyle : this.baseStyle);
    }

    private updatePrintedItems() {
        this.selectableItems.forEach((itemNameHandle, i, _) => {
            itemNameHandle[1].setStyle(this.index == i ? this.selectedStyle : this.baseStyle);
        })
    }
};