import { MessageQueue } from "./message-queue";
import { ZCommandSendingStatus } from "./z-command-sending-status";
import { ZCommandSedingType } from "./z-command-sending-type";
import { ZCommandType } from "./z-command-type";

export class CaptureElementObject{
    static port?: chrome.runtime.Port;
    static messageQueue: MessageQueue;
    static gPopupPort?: chrome.runtime.Port;
    static notify(message: string) {
        chrome.notifications.create({
            "type": "basic",
            "title": "zchanger",
            "message": message,
        });

        console.error('zchanger notification shown:\n> ' + String(message).split('\n').join('\n> '));
    }

    static onError(e: any){
        CaptureElementObject.notify('Something went wrong, sorry about that!\n\n' + e)
    }

    static executeScript(action: any, tabId: number){
        chrome.tabs.executeScript({ file: '/capture-element/content-script.js' })
            .then(_ => chrome.tabs.sendMessage(tabId, { action: action }))
            // .then(response => {
            //     if (response. !== action) {
            //         throw _.error;
            //     }
            //     else if (_.message) {
            //         CaptureElementObject.notify(_.message);
            //     }
            // })
            .catch(CaptureElementObject.onError);
    }

    static init(port: chrome.runtime.Port, messageQueue: MessageQueue) {
        CaptureElementObject.port = port;
        CaptureElementObject.messageQueue = messageQueue;
        chrome.runtime.onMessage.addListener(cmd => {
            switch (cmd.cmd) {
                case "capture_element":
                    console.log('Download capture image');
                    if (cmd.error) {
                        CaptureElementObject.onError(cmd.error);
                    }
                    CaptureElementObject.downloadImage(cmd.url);
                    break;

                default:
                    break;
            }

        });

        // Add IPC message listener.
        chrome.runtime.onConnect.addListener(function (aPort) {
            if ("zchanger-popup" == aPort.name) {
                // Handle messages from our browser action popup.
                CaptureElementObject.gPopupPort = aPort;
                aPort.onMessage.addListener((aMessage: any, sender: any) => {
                    switch (aMessage.msg) {
                        case "capture_element":
                            CaptureElementObject.startCaptureElement();
                            break;
                        default:
                            break;
                    }
                });

                aPort.onDisconnect.addListener(function () {
                    CaptureElementObject.gPopupPort = undefined;
                });
            }
        });
    }

    static async downloadImage(aDataURI: string){
        const blob = await (await fetch(aDataURI)).blob();
        var reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function () {
            var base64data = reader.result as string;
            try {
                CaptureElementObject.messageQueue.clear();
                CaptureElementObject.messageQueue.addMessage({
                    Command: ZCommandType.SAVE_ELEMENT_IMAGE,
                    CommandType: ZCommandSedingType.MULTIPLE,
                    SendingStatus: ZCommandSendingStatus.START
                });
    
                var elements = base64data.match(/.{1,500}/g) as string[];
    
                for (let index = 0; index < elements.length; index++) {
                    const element = elements[index];
                    CaptureElementObject.messageQueue.addMessage({
                        Command: ZCommandType.SAVE_ELEMENT_IMAGE,
                        CommandType: ZCommandSedingType.MULTIPLE,
                        SendingStatus: ZCommandSendingStatus.INPROGRESS,
                        Data: JSON.stringify(element)
                    });
                }
    
                CaptureElementObject.messageQueue.addMessage({
                    Command: ZCommandType.SAVE_ELEMENT_IMAGE,
                    CommandType: ZCommandSedingType.MULTIPLE,
                    SendingStatus: ZCommandSendingStatus.FINISH
                });
    
                CaptureElementObject.messageQueue.startMessageQueue();
            } catch (ex) {
                console.log("Error when Save Element Image", ex);
                CaptureElementObject.port?.postMessage({
                    Command: ZCommandType.SAVE_ELEMENT_IMAGE,
                    IsSuccess: false,
                    ErrorMessage: ex
                });
            }
        }
    }

    static startCaptureElement() {
        chrome.tabs.query({
             active: true, currentWindow: true 
            }, tabs => CaptureElementObject.executeScript('area-to-printer', tabs[0].id as number));
    }
}