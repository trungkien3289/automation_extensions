import { SettingModel } from "../background-scripts/setting-model";

export class YoutubeSkipAd {
    static enabled: boolean = false;
    static seconds = 1 * 1000;
    static closeId: any = 0;
    static autoCloserId: any = 0;
    static ads = {
        videoBanner: 'div.video-ads button.ytp-ad-overlay-close-button, div.video-ads div.close-padding', 
        videoSkip: 'div.video-ads button.ytp-ad-skip-button, div.video-ads button.videoAdUiSkipButton'
    };
    static init = () => {
        console.log("Init close ads youtube");

        chrome.storage.local.get('config', (storage) => {
            let config = new SettingModel();
            if(storage != null && storage.config != null){
              config = storage.config;
            }
            if(config){
                YoutubeSkipAd.enabled = config.enableAutoCloseYoutubeAds || false;
                YoutubeSkipAd.seconds = config.closeAdsAfterSeconds || 1;
            }

            if(YoutubeSkipAd.enabled){
                YoutubeSkipAd.startRun();
            }
        });
    }

    static enable = (enabled: boolean, closeAfterSeconds: number) => {
        YoutubeSkipAd.enabled = enabled || false;
        YoutubeSkipAd.seconds = closeAfterSeconds || 1;

        if(YoutubeSkipAd.enabled){
            YoutubeSkipAd.startRun();
        }else{
            YoutubeSkipAd.stopRun();
        }
    }

    static startRun = () => {
        YoutubeSkipAd.autoCloserId = setInterval(YoutubeSkipAd.autoCloser, 250);
    }

    static stopRun = () => {
        clearInterval(YoutubeSkipAd.autoCloserId);
    }

    static autoCloser = () => {
        if(YoutubeSkipAd.enabled == true){
            Object.keys(YoutubeSkipAd.ads).forEach(key => {
                YoutubeSkipAd.closeAd(YoutubeSkipAd.ads[key], YoutubeSkipAd.seconds);
            });
        }
    }

    static closeAd = (selector: string, autoCloseAfter: any) => {
        if (document.querySelectorAll(selector).length > 0) {
            // Convert seconds to milliseconds
            YoutubeSkipAd.seconds = autoCloseAfter * 1000;
            
            // Clear Interval
            clearInterval(YoutubeSkipAd.autoCloserId);
            
            // Click an Ad after X seconds
            setTimeout(function () {
                // Close Ad
                (document.querySelector(selector)as any).click();			
                // Restart timer
                YoutubeSkipAd.startRun();
            }, YoutubeSkipAd.seconds);
        }		
    }
}