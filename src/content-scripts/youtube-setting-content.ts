export class YoutubeSettingContent{
    static quality: string = "default";
    static size: string = "default";
    static requestChange(
        quality?: any, 
        size?: any, 
        speed?: any, 
        volume?: any, 
        volumelevel?: any, 
        youtubevideoautoplaybehavior?: any, 
        playlistvideoautoplaybehavior?: any, 
        suggestedautoplay?: any, 
        autoexpanddescription?: any, 
        isOptionHandle?: any){
		if(!quality) {
			YoutubeSettingContent.askQualitySize();
		}
		else{
			YoutubeSettingContent.change(
                quality,
                size,
                speed,
                volume,
                volumelevel,
                youtubevideoautoplaybehavior,
                playlistvideoautoplaybehavior,
                suggestedautoplay,
                autoexpanddescription,
                isOptionHandle);
			//YouTubeHighDefinition.changeVideoQuality(document);
		}
	}

    static change(
        quality: any, 
        size: any,
        speed: any,
        volume: any,
        volumelevel: any,
        youtubevideoautoplaybehavior: any,
        playlistvideoautoplaybehavior: any,
        suggestedautoplay: any,
        autoexpanddescription: any,
        isOptionHandle: any){
		window.postMessage({ type: "FROM_CONTENT_SCRIPT_SET_VQ", text: quality }, "*");			
		window.postMessage({ type: "FROM_CONTENT_SCRIPT_SET_VS", text: size }, "*");			
		window.postMessage({ type: "FROM_CONTENT_SCRIPT_REQUEST_CHANGE", id:chrome.extension.getURL(''), speed:speed, volume:volume, volumelevel:volumelevel, youtubevideoautoplaybehavior:youtubevideoautoplaybehavior, playlistvideoautoplaybehavior:playlistvideoautoplaybehavior, suggestedautoplay:suggestedautoplay, autoexpanddescription: autoexpanddescription, isOptionHandle: isOptionHandle }, "*");		
	}

    static askQualitySize() {
		chrome.storage.local.get(null, function(items){
            if(items != null){
                YoutubeSettingContent.change(
                    items['video_quality'],
                    items['video_size'],
                    items['video_speed'],
                    items['volume'],
                    items['volumelevel'],
                    items['youtubevideoautoplaybehavior'],
                    items['playlistvideoautoplaybehavior'],
                    items['suggestedautoplay'],
                    items['autoexpanddescription'],
                    null);	
            }
        });			
	}

    static addScript(){
		var s = document.createElement('script');
		s.src = chrome.extension.getURL('youtube-setting/ythd.js');
		s.onload = function() {
			// this.parentNode.removeChild(this);
		};
		(document.head||document.documentElement).appendChild(s);
	} 
    
    static init(){
        YoutubeSettingContent.addScript();
        if(document.location.pathname.indexOf("/embed")==0) {
            //
        }
        else{
            YoutubeSettingContent.requestChange();
        }

        chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
            console.log("on recieve command change youtube video setting", request.action);
            switch (request.action) {
                case 'video_quality_change':{
                    try{
                        window.postMessage({ type: "SET_VIDEO_QUALITY", quality: request.quality }, "*");	
                        sendResponse({isSuccess: true});
                    }catch(e){
                        console.log("Change Youtube video quality error", e);
                        sendResponse({
                            isSuccess: false,
                            message: "Change Youtube video quality error: " + e
                        });
                    }
                    break;
                }
                case 'video_size_change':{
                    try{
                        window.postMessage({ type: "SET_VIDEO_SIZE", tabid: request.tabid, size: request.size }, "*");
                        sendResponse({isSuccess: true});
                    }catch(e){
                        console.log("Change Youtube video size error", e);
                        sendResponse({
                            isSuccess: false,
                            message: "Change Youtube video size error: " + e
                        });
                    }
                    break;
                }
                case 'video_speed_change':{
                    try{
                        window.postMessage({ type: "SET_VIDEO_SPEED", speed: request.speed }, "*");
                        sendResponse({isSuccess: true});
                    }catch(e){
                        console.log("Change Youtube video speed error", e);
                        sendResponse({
                            isSuccess: false,
                            message: "Change Youtube video speed error: " + e
                        });
                    }
                    break;
                }
                case 'video_volume_change':{
                    try{
                        window.postMessage({ type: "SET_VIDEO_VOLUME", volume: request.volume, volumeLevel: request.volumeLevel }, "*");
                        sendResponse({isSuccess: true});
                    }catch(e){
                        console.log("Change Youtube video volume error", e);
                        sendResponse({
                            isSuccess: false,
                            message: "Change Youtube video volume error: " + e
                        });
                    }
                    break;
                }
                case 'execute_script_on_page':{
                    try{
                        window.postMessage({ type: "EXECUTE_SCRIPT_ON_PAGE", script: request.script }, "*");
                        sendResponse({isSuccess: true});
                    }catch(e){
                        console.log("Execute script on page error", e);
                        sendResponse({
                            isSuccess: false,
                            message: "Execute script on page error: " + e
                        });
                    }
                    break;
                }
                case 'storage_answer':{
                    try{				
                        YoutubeSettingContent.askQualitySize();				
                    }catch(e){alert(e);}
                    break;
                }
                default:
                    break;
            }
        });

        window.addEventListener("message", function(event) {
            // We only accept messages from ourselves
              if (event.source != window)
                  return;
          
              if (event.data.type && (event.data.type == "FROM_PAGE")) {
                  //port.postMessage(event.data.text);	
                  //window.postMessage({ type: "FROM_CONTENT_SCRIPT", text: "Hello from the content page!" }, "*");
              }
              if (event.data.type && (event.data.type == "FROM_PAGE_SCRIPT_REQUEST_CHANGE")) {
                YoutubeSettingContent.requestChange();
              }
          }, false);
    }
}