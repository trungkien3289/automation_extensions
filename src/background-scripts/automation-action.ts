import { CaptureElementObject } from "./capture-element-object";
import { BackGroundConstants } from "./constants";
import { MessageQueue } from "./message-queue";
import { ProxySetting } from "./proxy-setting";
import { SettingModel } from "./setting-model";
import { YoutubeRequestTracking } from "./youtube-request-tracking";
import { ZCommandSendingStatus } from "./z-command-sending-status";
import { ZCommandSedingType } from "./z-command-sending-type";
import { ZCommandType } from "./z-command-type";

export class AutomationAction {
    static proxy_config: any = {type: 'direct'};
    static bypassList = [];
    static clickElementAction = (port: chrome.runtime.Port ,selector: string) => {
        chrome.tabs.query({}, function (tabs: chrome.tabs.Tab[]) {
            chrome.tabs.sendMessage(tabs[0].id as number, { command: ZCommandType.CLICK_ELEMENT, selector: selector }, function (response) {
                console.log(response);
                if (response.isSuccess) {
                    port.postMessage({
                        Command: ZCommandType.CLICK_ELEMENT,
                        IsSuccess: true,
                        ErrorMessage: "",
                    });
                } else {
                    port.postMessage({
                        Command: ZCommandType.CLICK_ELEMENT,
                        IsSuccess: false,
                        ErrorMessage: response.errorMessage,
                    });
                }
            });
        });
    }

    static sendTextAction = (port: chrome.runtime.Port, selector: string, text: string) => {
        chrome.tabs.query({}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id as number, { command: ZCommandType.SEND_TEXT, selector: selector, text: text }, function (response) {
                console.log(response);
                if (response.isSuccess) {
                    port.postMessage({
                        Command: ZCommandType.SEND_TEXT,
                        IsSuccess: true,
                        ErrorMessage: "",
                    });
                } else {
                    port.postMessage({
                        Command: ZCommandType.SEND_TEXT,
                        IsSuccess: false,
                        ErrorMessage: response.errorMessage,
                    });
                }
            });
        });
    }

    static executeScriptAction = (port: chrome.runtime.Port, script: string) => {
        chrome.tabs.query({}, function (tabs) {
           
            chrome.tabs.sendMessage(tabs[0].id as number, { command: ZCommandType.EXECUTE_SCRIPT, script: script }, function (response) {
                console.log("finish execute script", response);
                if (response.isSuccess) {
                    port.postMessage({
                        Command: ZCommandType.EXECUTE_SCRIPT,
                        IsSuccess: true,
                        ErrorMessage: "",
                        Result: response.data
                    });
                } else {
                    port.postMessage({
                        Command: ZCommandType.EXECUTE_SCRIPT,
                        IsSuccess: false,
                        ErrorMessage: response.errorMessage,
                    });
                }
            });
        });
    }

    static executeScriptOnPageAction = (port: chrome.runtime.Port, script: string) => {
        chrome.tabs.query({}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id as number, { action: 'execute_script_on_page', 'script': script }, function (response) {
                console.log("finish execute script on page", response);
                if (response.isSuccess) {
                    port.postMessage({
                        Command: ZCommandType.EXECUTE_SCRIPT_ON_PAGE,
                        IsSuccess: true,
                        ErrorMessage: "",
                        Result: response.data
                    });
                } else {
                    port.postMessage({
                        Command: ZCommandType.EXECUTE_SCRIPT_ON_PAGE,
                        IsSuccess: false,
                        ErrorMessage: response.errorMessage,
                    });
                }
            });
        });
    }

    static scrollTopAction = (port: chrome.runtime.Port, offsetTop: number) => {
        chrome.tabs.query({}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id as number, { command: ZCommandType.SCROLL_TOP, offsetTop: offsetTop }, function (response) {
                console.log(response);
            });
        });

        return port.postMessage({
            Command: ZCommandType.SCROLL_TOP,
            IsSuccess: true,
            ErrorMessage: "",
        });
    }

    static scrollToElementAction = (port: chrome.runtime.Port, selector: string, offsetHeight: number) => {
        chrome.tabs.query({}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id as number, { command: ZCommandType.SCROLL_TO_ELEMENT, selector: selector, offsetHeight: offsetHeight }, function (response) {
                console.log(response);
            });
        });

        return port.postMessage({
            Command: ZCommandType.SCROLL_TO_ELEMENT,
            IsSuccess: true,
            ErrorMessage: "",
        });
    }

    static scrollToElementByXpathAction = (port: chrome.runtime.Port, xpath: string, offsetHeight: number) => {
        chrome.tabs.query({}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id as number, { command: ZCommandType.SCROLL_TO_ELEMENT_BY_XPATH, xpath: xpath, offsetHeight: offsetHeight }, function (response) {
                console.log(response);
            });
        });

        return port.postMessage({
            Command: ZCommandType.SCROLL_TO_ELEMENT_BY_XPATH,
            IsSuccess: true,
            ErrorMessage: "",
        });
    }

    static closeBrowserAction = (port: chrome.runtime.Port) => {
        chrome.tabs.query({}, function (tabs: chrome.tabs.Tab[]) {
            tabs.forEach(tab => {
                chrome.tabs.remove(tab.id as number);
            });
        });

        return port.postMessage({
            Command: ZCommandType.CLOSE_BROWSER,
            IsSuccess: true,
            ErrorMessage: "",
        });
    }

    static sendKeyAction = (port: chrome.runtime.Port, selector: string, key: string) => {
        chrome.tabs.query({}, function (tabs: chrome.tabs.Tab[]) {
            chrome.tabs.sendMessage(tabs[0].id as  number, { command: ZCommandType.SEND_KEY, selector: selector, key: key }, function (response) {
                if (response.isSuccess) {
                    port.postMessage({
                        Command: ZCommandType.SEND_KEY,
                        IsSuccess: true,
                        ErrorMessage: ""
                    });
                } else {
                    port.postMessage({
                        Command: ZCommandType.SEND_KEY,
                        IsSuccess: false,
                        ErrorMessage: response.errorMessage
                    });
                }
            });
        });
    }

    static querySelectorAll(port: chrome.runtime.Port, messageQueue: MessageQueue, selector: string) {
        chrome.tabs.query({}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id as number, { command: ZCommandType.QUERY_SELECTOR_ALL, selector: selector }, function (response) {
                console.log("finish query selector all", response);
                if (response.isSuccess) {
                    try {
                        messageQueue.clear();
                        messageQueue.addMessage({
                            Command: ZCommandType.QUERY_SELECTOR_ALL,
                            CommandType: ZCommandSedingType.MULTIPLE,
                            SendingStatus: ZCommandSendingStatus.START
                        });
    
                        for (let index = 0; index < response.data.length; index++) {
                            const element = response.data[index];
                            messageQueue.addMessage({
                                Command: ZCommandType.QUERY_SELECTOR_ALL,
                                CommandType: ZCommandSedingType.MULTIPLE,
                                SendingStatus: ZCommandSendingStatus.INPROGRESS,
                                Data: JSON.stringify(element)
                            });
                        }
    
                        messageQueue.addMessage({
                            Command: ZCommandType.QUERY_SELECTOR_ALL,
                            CommandType: ZCommandSedingType.MULTIPLE,
                            SendingStatus: ZCommandSendingStatus.FINISH
                        });
    
                        messageQueue.startMessageQueue();
                        // port.postMessage({
                        //     Command: ZCommandType.QUERY_SELECTOR_ALL,
                        //     IsSuccess: true,
                        //     Elements: response.data
                        // });
                    } catch (ex) {
                        console.log("Error when querySelectorAll", ex);
                        port.postMessage({
                            Command: ZCommandType.QUERY_SELECTOR_ALL,
                            IsSuccess: false,
                            ErrorMessage: ex
                        });
                    }
                } else {
                    port.postMessage({
                        Command: ZCommandType.QUERY_SELECTOR_ALL,
                        IsSuccess: false,
                        ErrorMessage: response.errorMessage
                    });
                }
    
            });
        });
    }

    static getAttributeByXPath(port: chrome.runtime.Port, xpath: string, attributeName: string) {
        chrome.tabs.query({}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id as number, { command: ZCommandType.GET_ATTRIBUTE_BY_XPATH, xpath: xpath, attributeName: attributeName }, function (response) {
                console.log("finish get attribute by xpath", response);
                if (response.isSuccess) {
                    port.postMessage({
                        Command: ZCommandType.GET_ATTRIBUTE_BY_XPATH,
                        Value: response.data,
                        IsSuccess: true,
                        ErrorMessage: ""
                    });
                } else {
                    port.postMessage({
                        Command: ZCommandType.GET_ATTRIBUTE_BY_XPATH,
                        Value: null,
                        IsSuccess: false,
                        ErrorMessage: response.errorMessage
                    });
                }
            });
        });
    }

    static clickElementByXPath(port: chrome.runtime.Port, xpath: string) {
        chrome.tabs.query({}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id as number, { command: ZCommandType.CLICK_ELEMENT_BY_XPATH, xpath: xpath }, function (response) {
                console.log("finish click element by xpath", response);
                if (response.isSuccess) {
                    port.postMessage({
                        Command: ZCommandType.CLICK_ELEMENT_BY_XPATH,
                        IsSuccess: true,
                        ErrorMessage: ""
                    });
                } else {
                    port.postMessage({
                        Command: ZCommandType.CLICK_ELEMENT_BY_XPATH,
                        IsSuccess: false,
                        ErrorMessage: response.errorMessage
                    });
                }
            });
        });
    }

    static focusElement(port: chrome.runtime.Port, selector: string) {
        chrome.tabs.query({}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id as number, { command: ZCommandType.FOCUS_ELEMENT, selector: selector }, function (response) {
                console.log("finish focus element", response);
                if (response.isSuccess) {
                    port.postMessage({
                        Command: ZCommandType.FOCUS_ELEMENT,
                        IsSuccess: true,
                        ErrorMessage: ""
                    });
                } else {
                    port.postMessage({
                        Command: ZCommandType.FOCUS_ELEMENT,
                        IsSuccess: false,
                        ErrorMessage: response.errorMessage
                    });
                }
            });
        });
    }

    static sendTextByXPathAction(port: chrome.runtime.Port, xpath: string, text: string) {
        chrome.tabs.query({}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id as number, { command: ZCommandType.SEND_TEXT_BY_XPATH, xpath: xpath, text: text }, function (response) {
                console.log(response);
                if (response.isSuccess) {
                    port.postMessage({
                        Command: ZCommandType.SEND_TEXT_BY_XPATH,
                        IsSuccess: true,
                        ErrorMessage: ""
                    });
                } else {
                    port.postMessage({
                        Command: ZCommandType.SEND_TEXT_BY_XPATH,
                        IsSuccess: false,
                        ErrorMessage: response.errorMessage
                    });
                }
            });
        });
    }

    static waitForElementVisibleAction(port: chrome.runtime.Port, elementSelector: string) {
        chrome.tabs.query({}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id as number, { command: ZCommandType.WAIT_FOR_ELEMENT_VISIBLE, elementSelector: elementSelector }, function (response) {
                console.log(response);
                if (response == null) {
                    port.postMessage({
                        Command: ZCommandType.WAIT_FOR_ELEMENT_VISIBLE,
                        IsVisible: false,
                        IsSuccess: true,
                        ErrorMessage: ""
                    });
                }
                if (response.isSuccess) {
                    port.postMessage({
                        Command: ZCommandType.WAIT_FOR_ELEMENT_VISIBLE,
                        IsVisible: response.data,
                        IsSuccess: true,
                        ErrorMessage: ""
                    });
                } else {
                    port.postMessage({
                        Command: ZCommandType.WAIT_FOR_ELEMENT_VISIBLE,
                        IsSuccess: false,
                        ErrorMessage: response.errorMessage
                    });
                }
            });
        });
    }

    static waitForElementVisibleByXPathAction(port: chrome.runtime.Port, xpath: string) {
        chrome.tabs.query({}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id as number, { command: ZCommandType.WAIT_FOR_ELEMENT_VISIBLE_BY_XPATH, xpath: xpath }, function (response) {
                console.log(response);
                if (response == null) {
                    port.postMessage({
                        Command: ZCommandType.WAIT_FOR_ELEMENT_VISIBLE_BY_XPATH,
                        IsVisible: false,
                        IsSuccess: true,
                        ErrorMessage: ""
                    });
                }
                if (response.isSuccess) {
                    port.postMessage({
                        Command: ZCommandType.WAIT_FOR_ELEMENT_VISIBLE_BY_XPATH,
                        IsVisible: response.data,
                        IsSuccess: true,
                        ErrorMessage: ""
                    });
                } else {
                    port.postMessage({
                        Command: ZCommandType.WAIT_FOR_ELEMENT_VISIBLE_BY_XPATH,
                        IsSuccess: false,
                        ErrorMessage: response.errorMessage
                    });
                }
            });
        });
    }

    static sh_exp_match(url: string, pattern: string) {
        pattern = pattern.replace(/\./g, '\\.');
        pattern = pattern.replace(/\*/g, '.*');
        pattern = pattern.replace(/\?/g, '.');
        var newRe = new RegExp('^' + pattern + '$');
        return newRe.test(url);
    }
    
    static handle_request(request: any) {
        var parser = document.createElement('a');
        parser.href = request.url;
        if (AutomationAction.sh_exp_match(parser.host, AutomationAction.bypassList.join('|')))
            return { type: 'direct' };
    
        return AutomationAction.proxy_config;
    }
    
    static setProxy(port: chrome.runtime.Port, proxy: any) {
        try {
            ProxySetting.applyProxy(proxy);
    
            port.postMessage({
                Command: ZCommandType.SET_PROXY,
                IsSuccess: true,
                ErrorMessage: ""
            });
        } catch (ex:any) {
            port.postMessage({
                Command: ZCommandType.SET_PROXY,
                IsSuccess: false,
                ErrorMessage: ex.message
            });
        }
    }
    
    static clearProxy(port: chrome.runtime.Port) {
        try {
            ProxySetting.clearProxy();
    
            port.postMessage({
                Command: ZCommandType.CLEAR_PROXY,
                IsSuccess: true,
                ErrorMessage: ""
            });
        } catch (ex: any) {
            port.postMessage({
                Command: ZCommandType.CLEAR_PROXY,
                IsSuccess: false,
                ErrorMessage: ex.message
            });
        }
    }
    
    static fakeUserAgent(port: chrome.runtime.Port, userAgent: string) {
        chrome.storage.local.get(BackGroundConstants.SavedConfigKey, (storage) => {
            let configs = storage.configs || {};
            if (userAgent !== null) {
                console.log('userAgent', userAgent);
                configs.userAgent = userAgent;
                configs.userAgentEnable = true;
                // setUserAgent(userAgent);
            }
    
            chrome.storage.local.set({
                [BackGroundConstants.SavedConfigKey]: configs
            });
    
            port.postMessage({
                Command: ZCommandType.SET_USER_AGENT,
                IsSuccess: true,
                ErrorMessage: ""
            });
        });
    }

    static captureScreen(port: chrome.runtime.Port, messageQueue: MessageQueue) {
        chrome.tabs.query({}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id as number, { command: ZCommandType.CAPTURE_SCREEN }, function (response) {
                console.log(response);
                if (response == null) {
                    port.postMessage({
                        Command: ZCommandType.CAPTURE_SCREEN,
                        IsSuccess: false,
                        ErrorMessage: "Capture screen error"
                    });
                }
                if (response.isSuccess) {
                    AutomationAction.DataURItoURL(port, messageQueue, response.imageBlob, ZCommandType.CAPTURE_SCREEN);
                } else {
                    port.postMessage({
                        Command: ZCommandType.CAPTURE_SCREEN,
                        IsSuccess: false,
                        ErrorMessage: response.errorMessage
                    });
                }
            });
        });
    }

    static capturePage(port: chrome.runtime.Port, messageQueue: MessageQueue) {
        chrome.tabs.query({active: true}, function (tabs) {
            try{
                chrome.tabs.captureVisibleTab({
                    "format": "png"
                }, function (dataURI) {
                    console.log(dataURI);
                    let base64data = dataURI.split(',')[1];
                    console.log(base64data);
                    try {
                        messageQueue.clear();
                        messageQueue.addMessage({
                            Command: ZCommandType.CAPTURE_PAGE,
                            CommandType: ZCommandSedingType.MULTIPLE,
                            SendingStatus: ZCommandSendingStatus.START
                        });
            
                        var elements = base64data.match(/.{1,500}/g) as string[];
            
                        for (let index = 0; index < elements.length; index++) {
                            const element = elements[index];
                            messageQueue.addMessage({
                                Command: ZCommandType.CAPTURE_PAGE,
                                CommandType: ZCommandSedingType.MULTIPLE,
                                SendingStatus: ZCommandSendingStatus.INPROGRESS,
                                Data: JSON.stringify(element)
                            });
                        }
            
                        messageQueue.addMessage({
                            Command: ZCommandType.CAPTURE_PAGE,
                            CommandType: ZCommandSedingType.MULTIPLE,
                            SendingStatus: ZCommandSendingStatus.FINISH,
                        });
            
                        messageQueue.startMessageQueue();
                    } catch (ex: any) {
                        console.log(ex);
                        port.postMessage({
                            Command: ZCommandType.CAPTURE_PAGE,
                            IsSuccess: false,
                            ErrorMessage: ex.message
                        });
                    }
                });
            }catch(ex: any){
                port.postMessage({
                    Command: ZCommandType.CAPTURE_PAGE,
                    IsSuccess: false,
                    ErrorMessage: ex.message
                });
            }
        });
    }
    
    static async DataURItoURL(port: chrome.runtime.Port, messageQueue: MessageQueue, imageBlob: any, commandType: ZCommandType) {
        var reader = new FileReader();
        reader.readAsDataURL(imageBlob);
        reader.onloadend = function () {
            var base64data = reader.result as string;
            try {
                messageQueue.clear();
                messageQueue.addMessage({
                    Command: commandType,
                    CommandType: ZCommandSedingType.MULTIPLE,
                    SendingStatus: ZCommandSendingStatus.START
                });
    
                var elements = base64data.match(/.{1,500}/g) as string[];
    
                for (let index = 0; index < elements.length; index++) {
                    const element = elements[index];
                    messageQueue.addMessage({
                        Command: commandType,
                        CommandType: ZCommandSedingType.MULTIPLE,
                        SendingStatus: ZCommandSendingStatus.INPROGRESS,
                        Data: JSON.stringify(element)
                    });
                }
    
                messageQueue.addMessage({
                    Command: commandType,
                    CommandType: ZCommandSedingType.MULTIPLE,
                    SendingStatus: ZCommandSendingStatus.FINISH,
                });
    
                messageQueue.startMessageQueue();
            } catch (ex: any) {
                console.log(ex);
                port.postMessage({
                    Command: commandType,
                    IsSuccess: false,
                    ErrorMessage: ex.message
                });
            }
        }
    }
    
    static getElementFromPoint(port: chrome.runtime.Port, x: number, y: number) {
        chrome.tabs.query({active: true}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id as number, { command: ZCommandType.GET_ELEMENT_FROM_POINT, x: x, y: y }, function (response) {
                console.log("finish get element from point", response);
                if (response.isSuccess) {
                    port.postMessage({
                        Command: ZCommandType.GET_ELEMENT_FROM_POINT,
                        IsSuccess: true,
                        ErrorMessage: "",
                        XPath: response.xpath 
                    });
                } else {
                    port.postMessage({
                        Command: ZCommandType.GET_ELEMENT_FROM_POINT,
                        IsSuccess: false,
                        ErrorMessage: response.errorMessage
                    });
                }
            });
        });
    }

    static clickElementFromPoint(port: chrome.runtime.Port, x: number, y: number) {
        chrome.tabs.query({ active: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id as number, { command: ZCommandType.CLICK_ELEMENT_FROM_POINT, x: x, y: y }, function (response) {
                console.log("finish click element from point", response);
                if (response.isSuccess) {
                    port.postMessage({
                        Command: ZCommandType.CLICK_ELEMENT_FROM_POINT,
                        IsSuccess: true,
                        ErrorMessage: "",
                    });
                } else {
                    port.postMessage({
                        Command: ZCommandType.CLICK_ELEMENT_FROM_POINT,
                        IsSuccess: false,
                        ErrorMessage: response.errorMessage
                    });
                }
            });
        });
    }

    //#region Youtube video settings
    static setYoutubeVideoQuantity(port: chrome.runtime.Port, quality: string) {
        try {
            chrome.tabs.query({ active: true, currentWindow: true}, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id as number, { action: 'video_quality_change', 'quality': quality }, function (response) {
                    if (response.isSuccess) {
                        port.postMessage({
                            Command: ZCommandType.SET_VIDEO_QUALITY,
                            IsSuccess: true,
                            ErrorMessage: "",
                        });
                    } else {
                        port.postMessage({
                            Command: ZCommandType.SET_VIDEO_QUALITY,
                            IsSuccess: false,
                            ErrorMessage: response.message
                        });
                    }
                });
            });
            chrome.storage.local.set({
                'video_quality': quality,
            }, function () {
            });
        } catch (ex) {
            port.postMessage({
                Command: ZCommandType.SET_VIDEO_QUALITY,
                IsSuccess: false,
                ErrorMessage: "Set youtube video quality fail"
            });
        }

    }

    static setYoutubeVideoSize(port: chrome.runtime.Port, size: any) {
        try {
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id as number, { action: 'video_size_change', "tabid": tabs[0].id, 'size': size }, function (response) {
                    if (response.isSuccess) {
                        port.postMessage({
                            Command: ZCommandType.SET_VIDEO_SIZE,
                            IsSuccess: true,
                            ErrorMessage: "",
                        });
                    } else {
                        port.postMessage({
                            Command: ZCommandType.SET_VIDEO_SIZE,
                            IsSuccess: false,
                            ErrorMessage: response.message
                        });
                    }
                });
            });
            chrome.storage.local.set({
                'video_size': size,
            }, function () {
            });
        } catch (ex) {
            port.postMessage({
                Command: ZCommandType.SET_VIDEO_SIZE,
                IsSuccess: false,
                ErrorMessage: "Set youtube video size fail"
            });
        }
    }

    static setYoutubeVideoSpeed(port: chrome.runtime.Port, speed: number) {
        try {
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id as number, { action: 'video_speed_change', 'speed': speed }, function (response) {
                    if (response.isSuccess) {
                        port.postMessage({
                            Command: ZCommandType.SET_VIDEO_SPEED,
                            IsSuccess: true,
                            ErrorMessage: "",
                        });
                    } else {
                        port.postMessage({
                            Command: ZCommandType.SET_VIDEO_SPEED,
                            IsSuccess: false,
                            ErrorMessage: response.message
                        });
                    }
                });
            });

            chrome.storage.local.set({
                'video_speed': speed,
            }, function () {
            });
        } catch (ex) {
            port.postMessage({
                Command: ZCommandType.SET_VIDEO_SPEED,
                IsSuccess: false,
                ErrorMessage: "Set youtube video speed fail"
            });
        }
    }

    static setYoutubeVideoVolume(port: chrome.runtime.Port, volume: number, volumeLevel: number) {
        try {
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id as number, { action: 'video_volume_change', 'volume': volume, 'volumeLevel': volumeLevel }, function (response) {
                    if (response.isSuccess) {
                        port.postMessage({
                            Command: ZCommandType.SET_VIDEO_VOLUME,
                            IsSuccess: true,
                            ErrorMessage: "",
                        });
                    } else {
                        port.postMessage({
                            Command: ZCommandType.SET_VIDEO_VOLUME,
                            IsSuccess: false,
                            ErrorMessage: response.message
                        });
                    }
                });
            });
            chrome.storage.local.set({
                'volume': volume,
                'volumelevel': volumeLevel,
            }, function () {
            });
        } catch (ex) {
            port.postMessage({
                Command: ZCommandType.SET_VIDEO_VOLUME,
                IsSuccess: false,
                ErrorMessage: "Set youtube video volume fail"
            });
        }

    }

//#endregion

//#region  default profile actions
    static captureElementImage(port: chrome.runtime.Port){
        try{
            CaptureElementObject.startCaptureElement();
            port.postMessage({
                Command: ZCommandType.CAPTURE_ELEMENT_IMAGE,
                IsSuccess: true,
                ErrorMessage: "",
            });
        }catch(ex){
            port.postMessage({
                Command: ZCommandType.CAPTURE_ELEMENT_IMAGE,
                IsSuccess: false,
                ErrorMessage: ex
            });
        }
    }
//#endregion

//#region set youtube skip ads setting

static setAutoCloseYoutubeAdsSetting(
    port: chrome.runtime.Port,
    enabled: boolean,
    closeAfterSeconds: number
  ) {
    try {
      chrome.storage.local.get(
        BackGroundConstants.SavedConfigKey,
        (storage) => {
          console.log("storage: ",storage);
          let config = new SettingModel();
          if(storage != null && storage.config != null){
            config = storage.config;
          }
          config.enableAutoCloseYoutubeAds = enabled;
          config.closeAdsAfterSeconds = closeAfterSeconds;

          chrome.storage.local.set(
            {
              [BackGroundConstants.SavedConfigKey]: config,
            },
            () => {
              chrome.tabs.query({}, function (tabs) {
                chrome.tabs.sendMessage(
                  tabs[0].id as number,
                  {
                    command: ZCommandType.SET_AUTO_CLOSE_YOUTUBE_ADS_SETTING,
                    enabled: enabled,
                    closeAfterSeconds: closeAfterSeconds,
                  },
                  function (response) {
                    console.log(response);
                    if (response && response.isSuccess) {
                      port.postMessage({
                        Command:
                          ZCommandType.SET_AUTO_CLOSE_YOUTUBE_ADS_SETTING,
                        IsSuccess: true,
                        ErrorMessage: "",
                      });
                    } else {
                      port.postMessage({
                        Command:
                          ZCommandType.SET_AUTO_CLOSE_YOUTUBE_ADS_SETTING,
                        IsSuccess: false,
                        ErrorMessage: response
                          ? response.errorMessage
                          : "Set auto close youtube ads fail",
                      });
                    }
                  }
                );
              });
            }
          );
        }
      );
    } catch (ex: any) {
      port.postMessage({
        Command: ZCommandType.SET_AUTO_CLOSE_YOUTUBE_ADS_SETTING,
        IsSuccess: false,
        ErrorMessage: ex.message,
      });
    }
  }
  //#endregion

  static changeYoutubeVideoRender(port: chrome.runtime.Port) {
    try {
      chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
        console.log(changeInfo.url);
        if (
          changeInfo.url &&
          changeInfo.url.indexOf("youtube.com/watch") >= 0
        ) {
          AutomationAction.sendCommandFakeRender(port);
        }
      });

      AutomationAction.sendCommandFakeRender(port);
      port.postMessage({
        Command: ZCommandType.CHANGE_YOUTUBE_VIDEO_RENDER,
        IsSuccess: true,
        ErrorMessage: "",
      });
    } catch (ex: any) {
      port.postMessage({
        Command: ZCommandType.CHANGE_YOUTUBE_VIDEO_RENDER,
        IsSuccess: false,
        ErrorMessage: ex.message,
      });
    }
  }

  static sendCommandFakeRender(port: chrome.runtime.Port) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id as number,
        { action: "change_youtube_video_render" },
        function (response) {}
      );
    });
  }

  static getYoutubeLoggedRequest(port: chrome.runtime.Port, messageQueue: MessageQueue){
    try {

        let requests = YoutubeRequestTracking.getRequests();
        console.log(requests);
        let jsonString = JSON.stringify(requests);

        messageQueue.clear();
        messageQueue.addMessage({
            Command: ZCommandType.GET_BROWSER_LOGGED_REQUESTS,
            CommandType: ZCommandSedingType.MULTIPLE,
            SendingStatus: ZCommandSendingStatus.START
        });

        var elements = jsonString.match(/.{1,500}/g) as string[];
            
        for (let index = 0; index < elements.length; index++) {
            const element = elements[index];
            messageQueue.addMessage({
                Command: ZCommandType.GET_BROWSER_LOGGED_REQUESTS,
                CommandType: ZCommandSedingType.MULTIPLE,
                SendingStatus: ZCommandSendingStatus.INPROGRESS,
                Data: element
            });
        }

        messageQueue.addMessage({
            Command: ZCommandType.GET_BROWSER_LOGGED_REQUESTS,
            CommandType: ZCommandSedingType.MULTIPLE,
            SendingStatus: ZCommandSendingStatus.FINISH
        });

        messageQueue.startMessageQueue();
    } catch (ex) {
        console.log("Error when run action GET_BROWSER_LOGGED_REQUESTS", ex);
        port.postMessage({
            Command: ZCommandType.GET_BROWSER_LOGGED_REQUESTS,
            IsSuccess: false,
            ErrorMessage: ex
        });
    }
  }
}