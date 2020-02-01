export class ItemListScene extends Phaser.Scene {
    readonly itemLimit: number = 9;
    readonly placeholder: string = [...Array(15).keys()].map((_, _1, _2) => '.')
        .reduce((prev, cur, _) => prev + cur);

    items: string[];
    textHandles: Phaser.GameObjects.Text[] = [];


    constructor(items: string[]) {
        super({ key: "ItemListScene" });
        this.items = items;
    }

    create() {
        this.items = ["Cegła", "kanapka", "piersiówka", "zmięta dycha"];

        this.printPlaceholdersAndGetHandles();

        this.items.forEach((v, i, _) => this.textHandles[i].text = `${i + 1}.${v}`);
    }

    private printPlaceholdersAndGetHandles() {
        let ySpacing = 30;
        var y = 50;
        for (let i = 0; i < this.itemLimit; i++) {
            this.textHandles.push(this.add.text(100, y, this.placeholder));
            y += ySpacing;
        }
    }
}