export class MessageQueue {
    private messages: any[] = [];
    private port: chrome.runtime.Port;
    constructor(port: chrome.runtime.Port){
        this.port = port;
    }

    startMessageQueue = () => {
        this.sendMessage();
    }

    sendMessage = () => {
        if (this.messages.length > 0) {
            var message = this.messages.shift();
            this.port.postMessage(message);
        }
    }

    addMessage = (message: any) => {
        this.messages.push(message);
    }

    onRecieveResponseLastMessage = () => {
        this.sendMessage();
    }

    clear = () => {
        this.messages = [];
    }
};