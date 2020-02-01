import { RepairedItemType } from './repairedItemType.enum';
import { ItemType } from './ItemType.enum';

export class RepairedItem {
    repairedItemType: RepairedItemType;
    neededItems: ItemType[] = [];

    constructor() {
        const repairedItemIndex = this.generateRandom(0, Object.keys(RepairedItemType).length);
        const neededItemNumber = this.generateRandom(2, 5);
        this.repairedItemType = RepairedItemType[Object.keys(RepairedItemType)[repairedItemIndex]];
        
        this.generateNeededItems(neededItemNumber);
    }

    private generateNeededItems(neededItemNumber: number): void{
        while (this.neededItems.length < neededItemNumber)
        {
            let neededItemIndex = this.generateRandom(0, Object.keys(ItemType).length);
            let item = ItemType[Object.keys(ItemType)[neededItemIndex]];

            if (!this.neededItems.includes(item)){
                this.neededItems.push(item);
            }
        }
    }

    private generateRandom(min: number, max: number): number{
       return Math.floor(Math.random() * (max-min))+min;
    }
}