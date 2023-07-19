import { BackGroundConstants } from "./constants";
import { SettingModel } from "./setting-model";

export class SpeedUpLiveStream{
    static isEnable = false;
    static allowUrlPatterns = [];
    static blockTimeout: any = null;
    static timeout = 120000 // start block after 120s (120000) for loading image, css ...

    static init = () => {
        chrome.storage.local.get(BackGroundConstants.SavedConfigKey, (storage) => {
            let config: SettingModel = storage.config || new SettingModel();
            SpeedUpLiveStream.enable(config.enableSpeedUpStream);
        });
    }

    static enable = (isEnabled: boolean) => {
        console.log("Enable speed up stream: ", isEnabled);
        if(isEnabled){
            SpeedUpLiveStream.isEnable = true;
            SpeedUpLiveStream.run();
        }else{
            SpeedUpLiveStream.isEnable = false;
            SpeedUpLiveStream.stopBlocking()
            chrome.webNavigation.onCompleted.removeListener(SpeedUpLiveStream.startBlocking)
            chrome.webNavigation.onBeforeNavigate.removeListener(SpeedUpLiveStream.stopBlocking)
            SpeedUpLiveStream.clearBlockTimeout()
        }
        
    }

    static loadAllowUrlPatterns = () => {
        const url = chrome.runtime.getURL('youtube-setting/allowUrlPatterns.json');
        return fetch(url)
          .then(response => response.json())
          .then(patterns => patterns)
    }

    static run = () => {
        SpeedUpLiveStream.loadAllowUrlPatterns().then(data => {
            SpeedUpLiveStream.allowUrlPatterns = data;
            SpeedUpLiveStream.registerBlocking();
        })
    }
      
    static registerBlocking = () => {
        SpeedUpLiveStream.startBlocking();
        chrome.webNavigation.onCompleted.addListener(SpeedUpLiveStream.startBlocking, { url: [{hostContains: '.youtube.com'}] })
        chrome.webNavigation.onBeforeNavigate.addListener(SpeedUpLiveStream.stopBlocking, { url: [{hostContains: '.youtube.com'}] })
    }

    static startBlocking = () => {
        SpeedUpLiveStream.clearBlockTimeout()
        SpeedUpLiveStream.blockTimeout = setTimeout(()=>{
          chrome.webRequest.onBeforeRequest.addListener(
            SpeedUpLiveStream.blockListener,
            {urls: ["<all_urls>"]},
            ["blocking"]
          )
          SpeedUpLiveStream.clearBlockTimeout()
        }, SpeedUpLiveStream.timeout)
      }
      
      static stopBlocking = () => {
        SpeedUpLiveStream.clearBlockTimeout()
        chrome.webRequest.onBeforeRequest.removeListener(SpeedUpLiveStream.blockListener)
      }
      
      static clearBlockTimeout = () => {
        if(SpeedUpLiveStream.blockTimeout!==null) {
          clearTimeout(SpeedUpLiveStream.blockTimeout)
          SpeedUpLiveStream.blockTimeout = null
        }
      }
      
      static isAllow = (details) => {
          for (let index = 0; index < SpeedUpLiveStream.allowUrlPatterns.length; index++) {
              const pattern = SpeedUpLiveStream.allowUrlPatterns[index]
              const isUrlContainsAllowPattern = details.url.indexOf(pattern) !== -1
              if(isUrlContainsAllowPattern) return true
          }
          return false
      }
      
      static blockListener = (details: any) => {
        if(!SpeedUpLiveStream.isAllow(details)){
            return {cancel: true};
        }else{
            return {};
        }
      }
      
}