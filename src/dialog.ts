import { ItemType } from "./itemType.enum";

export class Dialog {
	private requests: string[] = ["Panie napraw mi [...]!", "Sowicie Cię wynagrodzę za naprawę [...]."];
    private currentRequest: string;
    private currentIndex: integer;

    text: string = "";
	answer: string = "Nie ma problemu.";

    create(item: ItemType): void {
        this.text = "";
        this.currentIndex = 0;
        this.currentRequest = this.generateRequest(item);
    }

    nextLetter(): void {
        if (this.currentIndex === this.currentRequest.length - 1) {
            return;
        }

        this.currentIndex++;
        this.text = this.currentRequest.slice(0, this.currentIndex);
    }

    private generateRequest(item: ItemType): string {
        let chosenRequest = this.requests[Math.floor(Math.random() * this.requests.length)];
        return chosenRequest.replace("[...]", item);
    }
}
