import { RepairedItemType } from "./repairedItemType.enum";
import { ItemType } from "./ItemType.enum";

export class Dialog {
    text: string = "";
    
    private requests: string[] = [
        "Panie napraw mi [...]!",
        "Sowicie Cię wynagrodzę za naprawę [...].",
        "[...]!!!",
        "Proszę, błagam o naprawę [...]...",
        "Karol to grubas. Naprawisz mi [...]?"
    ];

    private majsterResponse: string = "Nie ma problemu.";

    private currentRequest: string;
    private currentIndex: number;

    createRequest(item: RepairedItemType): number {
        this.reset();
        this.currentRequest = this.generateRequest(item);

        return this.currentRequest.length;
    }

    createResponse(): number {
        this.reset();
        this.currentRequest = `- ${this.majsterResponse}`;

        return this.currentRequest.length;
    }

    createNeededItemsText(items: ItemType[]): number {
        this.reset();
        this.currentRequest = this.generateNeededItemsDialog(items);

        return this.currentRequest.length;
    }

    nextLetter(): void {
        if (this.currentIndex === this.currentRequest.length) {
            return;
        }

        this.currentIndex++;
        this.text = this.currentRequest.slice(0, this.currentIndex);
    }

    private reset() {
        this.text = "";
        this.currentIndex = 0;
    }

    private generateRequest(item: RepairedItemType): string {
        let chosenRequest = this.requests[Math.floor(Math.random() * this.requests.length)];
        return `- ${chosenRequest}`.replace("[...]", item);
    }

    private generateNeededItemsDialog(items: ItemType[]): string {
        var dialog = "- Potrzebuję ";

        if (items.length === 1) {
            return dialog.concat(`${items[0]}.`);
        }

        for (let i = 0; i < items.length - 1; i++) {
            dialog = dialog.concat(`${items[i]}`);
            if (i !== items.length - 2) {
                dialog = dialog.concat(", ")
            }
        }
        
        return dialog.concat(` i ${items[items.length - 1]}..`);
    }
}
