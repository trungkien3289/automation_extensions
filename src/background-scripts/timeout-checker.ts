
export class TimeOutChecker {
    private readonly INTERVAL: number = 1;
    private defaultTimeoutSeconds:number =  60;
    private fireTimeoutEvent: any = null;
    private timeout:number = 60;
    private timer:any = null;

    start = (timeout: number, timeOutHandler: any) => {
        this.fireTimeoutEvent = timeOutHandler;
        this.defaultTimeoutSeconds = timeout;
        this.timeout = timeout;
        if(this.timer != null){
            this.stop();
        }
        this.timer = setInterval(this.timerHandler, this.INTERVAL*1000)
    }

    stop = () => {
        if(this.timer!= null){
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    timerHandler = () => {
        if(this.timeout < 0){
            this.fireTimeoutEvent();
        }else{
            this.timeout = this.timeout - this.INTERVAL;
        }
    }

    resetTimer = () => {
        this.timeout = this.defaultTimeoutSeconds;
    }

    isRunning = () => {
        if(this.timer != null){
            return true;
        }else{
            return false;
        }
    }
}