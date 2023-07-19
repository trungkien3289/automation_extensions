export class YoutubeAdvTracking {
    static init = () => {
        console.log("Init youtube adv tracking");
        chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

            if(request.message == "SkipYoutubeAds"){
                const defined = v => v !== null && v !== undefined;
                const timeout = setTimeout(() => {
                    const ad: any = [...document.querySelectorAll('.ad-showing') as any][0];
                    if (defined(ad)) {
                        const video = document.querySelector('video');
                        if(video) {
                            const timeout1 = setTimeout(() => {
                                const ad1: any = [...document.querySelectorAll('.ad-showing') as any][0];
                                if (defined(ad1)) {
                                    const video1: any = document.querySelector('video');
                                    if (defined(video1) && video1.currentTime > 4) {
                                        video1.currentTime = video1.duration;
                                    }
                                }
                            }, 2000);
                        }                         
                    }
                }, 2500);

                return function() {
                    clearTimeout(timeout);
                }
            }
            return;
        });
    }
}