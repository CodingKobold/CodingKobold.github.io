import { ItemType } from "./itemType.enum";

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
    private currentIndex: integer;

    createRequest(item: ItemType): number {
        this.text = "";
        this.currentIndex = 0;
        this.currentRequest = this.generateRequest(item);

        return this.currentRequest.length;
    }

    createResponse(): number {
        this.text = "";
        this.currentIndex = 0;
        this.currentRequest = this.majsterResponse;

        return this.currentRequest.length;
    }

    nextLetter(): void {
        if (this.currentIndex === this.currentRequest.length) {
            return;
        }

        this.currentIndex++;
        this.text = this.currentRequest.slice(0, this.currentIndex);
    }

    private generateRequest(item: ItemType): string {
        let chosenRequest = this.requests[Math.floor(Math.random() * this.requests.length)];
        return `- ${chosenRequest}`.replace("[...]", item);
    }
}
