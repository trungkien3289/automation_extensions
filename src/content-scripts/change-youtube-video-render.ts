export class ChangeYoutubeVideoRender {
    static init = () => {
        console.log("Init change youtube video render");
        chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
            console.log("on recieve command change youtube video render", request.action);
            switch (request.action) {
                case 'change_youtube_video_render':{
                    try{
                        const url = chrome.runtime.getURL('youtube-setting/default.mp4');
                        fetch(url).then(response => response.blob()).then(data =>{
                            window.postMessage({ type: "CHANGE_YOUTUBE_VIDEO_RENDER", data: data }, "*");	
                        });
                       
                        sendResponse({isSuccess: true});
                    }catch(e){
                        console.log("Change Youtube video render error", e);
                        sendResponse({
                            isSuccess: false,
                            message: "Change Youtube video render error: " + e
                        });
                    }
                    break;
                }
                default:
                    break;
            }
        });
    }
}