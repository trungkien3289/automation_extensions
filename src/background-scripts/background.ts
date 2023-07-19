import { ContentSetting } from "../content-scripts/content";
import { AutomationAction } from "./automation-action";
import { CaptureElementObject } from "./capture-element-object";
import { BackGroundConstants } from "./constants";
import { MessageQueue } from "./message-queue";
import { ProxySetting } from "./proxy-setting";
import { SettingModel } from "./setting-model";
import { SpeedUpLiveStream } from "./speed-up-livestream";
import { SupportHideBrowser } from "./support-hide-browser";
import { TimeOutChecker } from "./timeout-checker";
import { YoutubeRequestTracking } from "./youtube-request-tracking";
import { ZCommandType } from "./z-command-type";
import { ZNotificationType } from "./z-notification-type";

export class BackGroundSetting {
    private config: SettingModel = new SettingModel();
    private timeoutChecker: TimeOutChecker;
    private port?: chrome.runtime.Port;
    private documentReadyState: boolean = false;
    private messageQueue?: MessageQueue; 
    constructor(){
        this.timeoutChecker = new TimeOutChecker();
        this.port = undefined;
    }

    initSetting = () => {
        this.config.fakeCPU = true;
        this.config.fakeBattery = true;
        this.config.enableAudioApi = true;
        this.config.enablePlugins = false;
        this.config.enableMediaPlugins = false;
        this.config.fakeWebGL = true;
        this.config.fakeClientRects = true;
        this.config.userAgentEnable = true;
        this.config.geoIpEnabled = false;

        let self = this;
        chrome.storage.local.set({
            [BackGroundConstants.SavedConfigKey]: self.config
         });
         this.overrideRequestHeader();
         this.connect();
         CaptureElementObject.init(this.port as chrome.runtime.Port, this.messageQueue as MessageQueue)
    }

    overrideRequestHeader = () => {
        chrome.webRequest.onHeadersReceived.addListener(
            function (details:any) {
                for (var i = 0; i < details.responseHeaders.length; ++i) {
                    if (details.responseHeaders[i].name.toLowerCase()
                        .indexOf('x-frame-options') > -1 ||
                        details.responseHeaders[i].name.toLowerCase()
                        .indexOf('strict-transport-security') > -1 ||
                        details.responseHeaders[i].name.toLowerCase()
                        .indexOf('x-xss-protection') > -1 ||
                        details.responseHeaders[i].name.toLowerCase()
                        .indexOf('content-security-policy') > -1 ||
                        details.responseHeaders[i].name.toLowerCase()
                        .indexOf('x-content-type-options') > -1) {
                        details.responseHeaders.splice(i, 1);
                        i--;
                    }
                }
                return {
                    responseHeaders: details.responseHeaders
                };
            }, {
                urls: ["<all_urls>"]
            }, ["blocking", "responseHeaders"]
        );
    }

    connect = () => {
        var self = this;
        let hostName = "zprofiler.com";
        this.port = chrome.runtime.connectNative(hostName);
        this.messageQueue = new MessageQueue(this.port);
        this.port.onMessage.addListener(this.onRecieveNativeMessage);
        this.port.onDisconnect.addListener(this.onDisconnected);
        var connectPort = this.port;
        console.log("send confirm connect host");
        connectPort.postMessage({
            Command: ZCommandType.CONFIRM_CONNECT_HOST,
            IsSuccess: true,
            Message: "Connect with browser successfully"
        });
        // console.log("finish send confirm connect host");
        // chrome.tabs.create({ url: "https://gooogle.com", active: true, selected:false }, function(tab: any){
        //     chrome.tabs.update(tab.id,{selected:true});
        // });
        // setTimeout(() => {
        //     // clean browser tab when start browser
        //     chrome.tabs.query({},(tabs) => {
        //     console.log("begin clean tabs");
        //     if (tabs.length > 1) {
        //         var tabids: number[] = [];
        //         tabs.forEach((element, index) => {
        //             if (index != 0) {
        //                 tabids.push(element.id as number);
        //             }
        //         });
        //         chrome.tabs.remove(tabids);
        //     }

        //     console.log("end clean tabs");
        //     });
        // }, 1000);

        chrome.tabs.onUpdated.addListener(function (tabid, info, tab) {
            console.log("browser update info", info.status);
            if (info.status == "complete") {
                self.documentReadyState = true;
            } else if (info.status == "loading") {
                self.documentReadyState = false;
            }
        });

        // SpeedUpLiveStream.init();
        YoutubeRequestTracking.init();
        SupportHideBrowser.init();
    }

    onRecieveNativeMessage = (data: any) => {
        if (!data) {
            //There's no text
            this.sendError("Request data empty");
            return;
        }
        try {
            console.log("revice data from host", data);
            this.timeoutChecker.resetTimer();
            switch (data.Command) {
                case ZCommandType.SET_PROFILE_REQUEST: {
                    // clean browser tab when start browser
                    chrome.tabs.query({},(tabs) => {
                            console.log("begin clean tabs");
                            if (tabs.length > 1) {
                                var tabids: number[] = [];
                                tabs.forEach((element, index) => {
                                    if (index != 0) {
                                        tabids.push(element.id as number);
                                    }
                                });
                                chrome.tabs.remove(tabids);
                            }
    
                            console.log("end clean tabs");
                        });
                        var savedResponseData = data;
    
                    chrome.storage.local.get(BackGroundConstants.SavedConfigKey, (storage) => {
                        let config: SettingModel = storage.configs || new SettingModel();
                        console.log("SavedResponseData", savedResponseData);
                        var profile = savedResponseData.Profile;
                        config.id = profile.Id;
                        config.name = profile.Name;
                        this.config.browserplugsenabled = true;
                        
                        //#region Device
                        if (profile.CPU !== null) {
                            console.log('fakeCPU', profile.CPU);
                            config.fakeCPU = profile.CPU;
                        }
                        if (profile.Battery !== null) {
                            console.log('fakeBattery', profile.Battery);
                            config.fakeBattery = profile.Battery;
                        }
                        if (profile.EnableAudioApi !== null) {
                            console.log('enableAudioApi', profile.EnableAudioApi);
                            config.enableAudioApi = profile.EnableAudioApi;
                        }
                        if (profile.EnablePlugins !== null) {
                            console.log('enablePlugins', profile.EnablePlugins);
                            config.enablePlugins = profile.EnablePlugins;
                        }
                        if (profile.EnableMediaPlugins !== null) {
                            console.log('enableMediaPlugins', profile.EnableMediaPlugins);
                            config.enableMediaPlugins = profile.EnableMediaPlugins;
                        }
                        //#endregion Device
    
                        //#region Device Fonts
                        if (profile.Fonts !== null) {
                            console.log('fonts', profile.Fonts);
                            config.fontEnabled = true;
                            config.deviceFont = profile.Fonts;
                        }
                        //#endregion Fonts
    
                        //#region Content
                        if (profile.RandomTimersEnabled !== null) {
                            console.log('randomTimersEnabled', profile.RandomTimersEnabled);
                            config.randomTimersEnabled = profile.RandomTimersEnabled;
                        }
                        if (profile.UserAgent !== null) {
                            console.log('userAgent', profile.UserAgent);
                            config.userAgent = profile.UserAgent;
                            config.userAgentEnable = true;
                            // setUserAgent(profile.UserAgent);
                        }
                        if (profile.AppVersion !== null) {
                            console.log('appVersion', profile.AppVersion);
                            config.appVersion = profile.AppVersion;
                        }
                        if (profile.Vendor !== null) {
                            console.log('vendor', profile.Vendor);
                            config.vendor = profile.Vendor;
                        }
                        if (profile.Platform !== null) {
                            console.log('platform', profile.Platform);
                            config.platform = profile.Platform;
                        }
                        if (profile.Screen !== null) {
                            console.log('screen', profile.Screen);
                            config.screen = profile.Screen;
                        }
                        if (profile.HistoryLength !== null) {
                            console.log('historyBlock', profile.HistoryLength);
                            config.historyLength = profile.HistoryLength;
                        }
                        //#endregion Content
    
                        //#region FingerPrint
                        if (profile.WebGL !== null) {
                            console.log('fakeWebGL', profile.WebGL);
                            config.fakeWebGL = profile.WebGL;
                            console.log("save device finger print");
                            config.deviceFingerPrint = profile.DeviceFingerPrint;
                            console.log(config.deviceFingerPrint);
                            config.fakeWebGL = true;
                        }
                        if (profile.WebRTC !== null) {
                            console.log('WebRTC', profile.WebRTC);
                            config.fakeWebRTC = profile.WebRTC;
                        }
                        if (profile.FakeClientRects !== null) {
                            console.log('fakeClientRects', profile.FakeClientRects);
                            config.fakeClientRects = profile.FakeClientRects;
                        }
    
                        if (profile.Canvas !== null) {
                            console.log('canvas', profile.Canvas);
                            config.canvasNoise = profile.Canvas;
                            config.fakeCanvas = true;
                        }
    
                        //#region GEO
                        if (profile.EnableNetwork !== null) {
                            console.log('enableNetwork', profile.EnableNetwork);
                            config.enableNetwork = profile.EnableNetwork;
                        }
                        if (profile.Language !== null) {
                            console.log('language', profile.Language);
                            config.language = profile.Language;
                            config.enableFakeLanguage = true;
                            // setLanguage(profile.Language);
                        }
                        if (profile.GeoIpEnabled !== null) {
                            console.log('geoIpEnabled', profile.GeoIpEnabled);
                            config.geoIpEnabled = profile.GeoIpEnabled;
                        }
    
                        if (profile.ProxyEnabled !== null) {
                            console.log('proxyEnabled', profile.ProxyEnabled);
                            config.proxyEnabled = profile.ProxyEnabled;
                            if (profile.ProxyEnabled == true) {
                                if (profile.Proxies == null)  return;
                                var data = profile.Proxies[Math.floor(Math.random() * profile.Proxies.length)];
                                ProxySetting.applyProxy(data, profile.ByPassProxySites);
                            } else {
                                ProxySetting.clearProxy();
                            }
                        }
                        if (profile.Proxies !== null && profile.Proxies.length > 0) {
                            console.log('proxies', profile.Proxies);
                            config.proxies = profile.Proxies;
                            ProxySetting.applyProxy(profile.Proxies[0]);
                        }

                        if (profile.ByPassProxySites !== null) {
                            console.log('byPassProxySites', profile.ByPassProxySites);
                            config.byPassProxySites = profile.ByPassProxySites;
                        }
                        
                        chrome.storage.local.set({
                            [BackGroundConstants.SavedConfigKey] : config
                        },() => {
                            ContentSetting.fakeFingerPrint();
                        });
                        
                        this.sendResponse(ZCommandType.SET_PROFILE_REQUEST, true, "Set profile successfully");
                    });
                    break;
                }
                case ZCommandType.NAVIGATE: {
                    chrome.tabs.query({}, (tabs) => {
                        var firstTab = tabs[0];
                        const tabId = firstTab.id as number;
                        chrome.tabs.update(tabId, {url: data.URL});
                    });

                    (this.port as chrome.runtime.Port).postMessage({
                        Command: ZCommandType.NAVIGATE,
                        IsSuccess: true,
                        ErrorMessage: "",
                    });
                    break;
                }
                case ZCommandType.CLICK_ELEMENT: {
                    AutomationAction.clickElementAction(this.port as chrome.runtime.Port, data.ElementSelector);
                    break;
                }
                case ZCommandType.SEND_TEXT: {
                    AutomationAction.sendTextAction(this.port as chrome.runtime.Port, data.ElementSelector, data.Text);
                    break;
                }
                case ZCommandType.EXECUTE_SCRIPT: {
                    AutomationAction.executeScriptAction(this.port as chrome.runtime.Port, data.Script);
                    break;
                }
                case ZCommandType.EXECUTE_SCRIPT_ON_PAGE: {
                    AutomationAction.executeScriptOnPageAction(this.port as chrome.runtime.Port, data.Script);
                    break;
                }
                case ZCommandType.SCROLL_TOP: {
                    AutomationAction.scrollTopAction(this.port as chrome.runtime.Port, data.OffsetTop);
                    break;
                }
                case ZCommandType.CLOSE_BROWSER: {
                    AutomationAction.closeBrowserAction(this.port as chrome.runtime.Port);
                    break;
                }
                case ZCommandType.SEND_KEY: {
                    AutomationAction.sendKeyAction(this.port as chrome.runtime.Port, data.ElementSelector, data.Key);
                    break;
                }
                case ZCommandType.QUERY_SELECTOR_ALL: {
                    AutomationAction.querySelectorAll(this.port as chrome.runtime.Port, this.messageQueue as MessageQueue, data.ElementSelector);
                    break;
                }
                case ZCommandType.GET_ATTRIBUTE_BY_XPATH: {
                    AutomationAction.getAttributeByXPath(this.port as chrome.runtime.Port, data.XPath, data.AttributeName);
                    break;
                }
                case ZCommandType.CLICK_ELEMENT_BY_XPATH: {
                    AutomationAction.clickElementByXPath(this.port as chrome.runtime.Port, data.XPath);
                    break;
                }
                case ZCommandType.FOCUS_ELEMENT: {
                    AutomationAction.focusElement(this.port as chrome.runtime.Port, data.ElementSelector);
                    break;
                }
                case ZCommandType.SEND_MESSAGE_QUEUE_RESPONSE: {
                    this.messageQueue?.onRecieveResponseLastMessage();
                    break;
                }
                case ZCommandType.SEND_TEXT_BY_XPATH: {
                    AutomationAction.sendTextByXPathAction(this.port as chrome.runtime.Port, data.ElementXPath, data.Text);
                    break;
                }
                case ZCommandType.WAIT_FOR_DOCUMENT_READY: {
                    this.waitForDocumentReadyAction();
                    break;
                }
                case ZCommandType.WAIT_FOR_ELEMENT_VISIBLE: {
                    AutomationAction.waitForElementVisibleAction(this.port as chrome.runtime.Port, data.ElementSelector);
                    break;
                }
                case ZCommandType.WAIT_FOR_ELEMENT_VISIBLE_BY_XPATH: {
                    AutomationAction.waitForElementVisibleByXPathAction(this.port as chrome.runtime.Port, data.XPath);
                    break;
                }
                case ZCommandType.SET_PROXY: {
                    AutomationAction.setProxy(this.port as chrome.runtime.Port, data);
                    break;
                }
                case ZCommandType.CLEAR_PROXY: {
                    AutomationAction.clearProxy(this.port as chrome.runtime.Port);
                    break;
                }
                case ZCommandType.SET_USER_AGENT: {
                    AutomationAction.fakeUserAgent(this.port as chrome.runtime.Port, data.UserAgent);
                    break;
                }
                case ZCommandType.SET_ACTION_TIMEOUT: {
                    try {
                        let connectionPort = this.port;
                        this.timeoutChecker.start(
                            data.Timeout,
                            function () {
                                AutomationAction.closeBrowserAction(connectionPort as chrome.runtime.Port);
                            }
                        );
    
                        this.port?.postMessage({
                            Command: ZCommandType.SET_ACTION_TIMEOUT,
                            IsSuccess: true,
                        });
                    } catch (ex:any) {
                        this.port?.postMessage({
                            Command: ZCommandType.SET_ACTION_TIMEOUT,
                            IsSuccess: false,
                            ErrorMessage: ex.message
                        });
                    }
    
                    break;
                }
                case ZCommandType.CLEAR_ACTION_TIMEOUT: {
                    try {
                        this.timeoutChecker.stop();
    
                        this.port?.postMessage({
                            Command: ZCommandType.CLEAR_ACTION_TIMEOUT,
                            IsSuccess: true,
                        });
                    } catch (ex:any) {
                        this.port?.postMessage({
                            Command: ZCommandType.CLEAR_ACTION_TIMEOUT,
                            IsSuccess: false,
                            ErrorMessage: ex.message
                        });
                    }
                    break;
                }
                case ZCommandType.CAPTURE_SCREEN: {
                    AutomationAction.captureScreen(this.port as chrome.runtime.Port, this.messageQueue as MessageQueue);
                    break;
                }
                case ZCommandType.GET_ELEMENT_FROM_POINT: {
                    AutomationAction.getElementFromPoint(this.port as chrome.runtime.Port, data.X, data.Y);
                    break;
                }
                case ZCommandType.SET_VIDEO_QUALITY: {
                    AutomationAction.setYoutubeVideoQuantity(this.port as chrome.runtime.Port, data.Quality);
                    break;
                }
                case ZCommandType.SET_VIDEO_SIZE: {
                    AutomationAction.setYoutubeVideoSize(this.port as chrome.runtime.Port, data.Size);
                    break;
                }
                case ZCommandType.SET_VIDEO_SPEED: {
                    AutomationAction.setYoutubeVideoSpeed(this.port as chrome.runtime.Port, data.Speed);
                    break;
                }
                case ZCommandType.SET_VIDEO_VOLUME: {
                    AutomationAction.setYoutubeVideoVolume(this.port as chrome.runtime.Port, data.Volume, data.VolumeLevel);
                    break;
                }
                case ZCommandType.CAPTURE_ELEMENT_IMAGE: {
                    AutomationAction.captureElementImage(this.port as chrome.runtime.Port);
                    break;
                }
                case ZCommandType.SET_AUTO_CLOSE_YOUTUBE_ADS_SETTING: {
                    AutomationAction.setAutoCloseYoutubeAdsSetting(this.port as chrome.runtime.Port, data.Enabled, data.CloseAfterSeconds);
                    break;
                }
                case ZCommandType.ENABLE_SPEED_UP_STREAM: {
                    try{
                        chrome.storage.local.get(BackGroundConstants.SavedConfigKey, (storage) => {
                            let config: SettingModel = storage.config || new SettingModel();
                            config.enableSpeedUpStream = data.Enabled;
    
                            chrome.storage.local.set({
                                [BackGroundConstants.SavedConfigKey] : config
                            }, () => {
                                SpeedUpLiveStream.enable(data.Enabled);
                            });

                            this.port?.postMessage({
                                Command: ZCommandType.ENABLE_SPEED_UP_STREAM,
                                IsSuccess: true,
                                ErrorMessage: "",
                            });
                        });
                    }catch(ex: any){
                        this.port?.postMessage({
                            Command: ZCommandType.ENABLE_SPEED_UP_STREAM,
                            IsSuccess: false,
                            ErrorMessage: ex.message,
                        });
                    }
                    
                    break;
                }
                case ZCommandType.CHANGE_YOUTUBE_VIDEO_RENDER: {
                    AutomationAction.changeYoutubeVideoRender(this.port as chrome.runtime.Port);
                    break;
                }
                case ZCommandType.CAPTURE_PAGE: {
                    AutomationAction.capturePage(this.port as chrome.runtime.Port, this.messageQueue as MessageQueue);
                    break;
                }
                case ZCommandType.CLICK_ELEMENT_FROM_POINT:{
                    AutomationAction.clickElementFromPoint(this.port as chrome.runtime.Port, data.X, data.Y);
                    break;
                }
                case ZCommandType.GET_BROWSER_LOGGED_REQUESTS:{
                    AutomationAction.getYoutubeLoggedRequest(this.port as chrome.runtime.Port, this.messageQueue as MessageQueue);
                    break;
                }
                case ZCommandType.SCROLL_TO_ELEMENT: {
                    AutomationAction.scrollToElementAction(this.port as chrome.runtime.Port, data.ElementSelector, data.OffsetHeight);
                    break;
                }
                case ZCommandType.SCROLL_TO_ELEMENT_BY_XPATH: {
                    AutomationAction.scrollToElementByXpathAction(this.port as chrome.runtime.Port, data.XPath, data.OffsetHeight);
                    break;
                }
    
                default:
                    break;
            }
            return;
        } catch (ex) {
            this.sendError("Error in message data");
            return;
        }
    }

    onDisconnected = () => {
        this.port = undefined;
        this.timeoutChecker.stop();
    }

    sendError = (message: string) => {
        this.port?.postMessage({
            Command: ZCommandType.NOTIFICATION,
            Type: ZNotificationType.ERROR,
            Message: message
        });
    }

    sendResponse(command: ZCommandType, isSuccess: boolean, message: string) {
        this.port?.postMessage({
            Command: command,
            IsSuccess: status,
            Message: message
        });
    }

    waitForDocumentReadyAction = () => {
        if (this.documentReadyState) {
            this.port?.postMessage({
                Command: ZCommandType.WAIT_FOR_DOCUMENT_READY,
                IsReady: true,
                IsSuccess: true,
                ErrorMessage: ""
            });
        } else {
            this.port?.postMessage({
                Command: ZCommandType.WAIT_FOR_DOCUMENT_READY,
                IsReady: false,
                IsSuccess: true,
                ErrorMessage: ""
            });
        }
    }
}

var backgroundSetting = new BackGroundSetting();
console.log("start init background");
backgroundSetting.initSetting();
console.log("end init background");