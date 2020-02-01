export class GameTime{
    totalGameTime: number = 8*3600; //seconds 
    currentTime: number = this.totalGameTime;
    
    update(gameProgress: number){
        this.currentTime = this.totalGameTime*(1-gameProgress);
    }

    getTime(): string {
        let hours = Math.floor(this.currentTime/3600);
        let minutes = Math.floor((this.currentTime - hours*3600)/60);
        let seconds = Math.floor(this.currentTime - hours*3600-minutes*60);

        return this.addLeadingZero(hours)+':'+this.addLeadingZero(minutes)+':'+this.addLeadingZero(seconds);
    }

    private addLeadingZero(num: number): string{
        return ("0" + num).slice(-2);
    }
}
