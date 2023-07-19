export class YoutubeRequestTracking {
    private static readonly trackUrls = {
        urls: [ "*://*.youtube.com/api/stats/watchtime*" , "*://*.youtube.com/api/stats/qoe*" , "*://*.youtube.com/youtubei/v1/log_event*", "*://*.youtube.com/youtubei/v1/player/heartbeat*", "*://*.googlevideo.com/videoplayback*",  "*://*.youtube.com/pcs/activeview*" ]
    };
      
    private static readonly reqBodyHeaders: any[] = ["requestBody"];
    private static readonly reqHeadersBlocking: any[] = ["requestHeaders", "blocking", "extraHeaders"];
    private static readonly reqHeaders = ["requestHeaders"];
    private static readonly resHeaders = ["responseHeaders"];
    private static tracker = window.browser || window.chrome;
    
    private static watchTimeRequest: any = {};
    private static qoeRequest: any = {};
    private static logEventRequest: any = {};
    private static heartbeatRequest: any = {};
    private static videoPlayBackRequest: any = {};
    private static audioPlayBackRequest: any = {};

    static init = () => {
        YoutubeRequestTracking.tracker.webRequest.onBeforeRequest.addListener(
            function(details: any) {
                if(details != null && details.url !== undefined) {
                    if(YoutubeRequestTracking.qoeRequest != null && details.url.includes("api/stats/qoe")) {
                        Object.assign(YoutubeRequestTracking.qoeRequest, {requestBody: {type: "FormData", value : `{"session_token":"${details.requestBody.formData.session_token[0]}"}` }});
                        console.log("Qoe: ", YoutubeRequestTracking.qoeRequest)
                    }
                
                    if(YoutubeRequestTracking.logEventRequest != null && details.url.includes("youtubei/v1/log_event")) {
                        let requestBodyValue = decodeURIComponent(String.fromCharCode.apply(null, new Uint8Array(details.requestBody.raw[0].bytes) as any));
                        let logEventBodyObject = JSON.parse(requestBodyValue);
                        let events: any[] = logEventBodyObject.events;
                        if(events!= null && events.length > 0){
                            let heartBeatEvents = events.filter((event: any) => {
                                return event.foregroundHeartbeat != null;
                            });

                            if(heartBeatEvents.length > 0){
                                logEventBodyObject.events = [heartBeatEvents[0]];
                                Object.assign(YoutubeRequestTracking.logEventRequest, {requestBody: {type: "Raw", value : JSON.stringify(logEventBodyObject) }});
                                console.log("logEventRequest: ", YoutubeRequestTracking.logEventRequest);
                            }else{
                                logEventBodyObject.events = [];
                                Object.assign(YoutubeRequestTracking.logEventRequest, {requestBody: {type: "Raw", value : JSON.stringify(logEventBodyObject) }});
                                console.log("logEventRequest: ", YoutubeRequestTracking.logEventRequest);
                            }
                        }else{
                            logEventBodyObject.events = [];
                            Object.assign(YoutubeRequestTracking.logEventRequest, {requestBody: {type: "Raw", value : JSON.stringify(logEventBodyObject) }});
                            console.log("logEventRequest: ", YoutubeRequestTracking.logEventRequest);
                        }
                    }

                    if(YoutubeRequestTracking.heartbeatRequest != null && details.url.includes("youtubei/v1/player/heartbeat")) {
                        let requestBodyValue = decodeURIComponent(String.fromCharCode.apply(null,
                            new Uint8Array(details.requestBody.raw[0].bytes) as any));
                        
                        Object.assign(YoutubeRequestTracking.heartbeatRequest, {requestBody: {type: "Raw", value : requestBodyValue}});
                        console.log("heartbeatRequest: ", YoutubeRequestTracking.heartbeatRequest)
                    }
                }
            }, YoutubeRequestTracking.trackUrls, YoutubeRequestTracking.reqBodyHeaders
        );
          
        YoutubeRequestTracking.tracker.webRequest.onBeforeSendHeaders.addListener(
            function(details) {
                if(details != null && details.url !== undefined) {
                    if(details.url.includes("api/stats/watchtime")) {
                        Object.assign(YoutubeRequestTracking.watchTimeRequest, {
                            url: details.url,
                            method : details.method,
                            requestHeaders : details.requestHeaders,
                            youtubeRequestType: "WATCH_TIME"
                        });
                
                        console.log("Watchtime: ", YoutubeRequestTracking.watchTimeRequest)
                    }
                
                    if(details.url.includes("api/stats/qoe")) {
                        Object.assign(YoutubeRequestTracking.qoeRequest, {
                            url: details.url,
                            method : details.method,
                            requestHeaders : details.requestHeaders,
                            youtubeRequestType: "QOE"
                        });
                    }
                
                    if(details.url.includes("youtubei/v1/log_event")) {
                        Object.assign(YoutubeRequestTracking.logEventRequest, {
                            url: details.url,
                            method : details.method,
                            requestHeaders : details.requestHeaders,
                            youtubeRequestType: "LOG_EVENT"
                        });
                    }

                    if(details.url.includes("youtubei/v1/player/heartbeat")) {
                        Object.assign(YoutubeRequestTracking.heartbeatRequest, {
                            url: details.url,
                            method : details.method,
                            requestHeaders : details.requestHeaders,
                            youtubeRequestType: "HEART_BEAT"
                        });
                    }

                    if(details.url.indexOf("googlevideo.com/videoplayback")>=0) {
                        if(details.url.indexOf("mime=video") >= 0){
                            Object.assign(YoutubeRequestTracking.videoPlayBackRequest, {
                                url: details.url,
                                method : details.method,
                                requestHeaders : details.requestHeaders,
                                youtubeRequestType: "VIDEO_PLAY_BACK"
                            });
                    
                            console.log("Video Play Back: ", YoutubeRequestTracking.videoPlayBackRequest);                           
                        }

                        if(details.url.indexOf("mime=audio") >= 0){
                            Object.assign(YoutubeRequestTracking.audioPlayBackRequest, {
                                url: details.url,
                                method : details.method,
                                requestHeaders : details.requestHeaders,
                                youtubeRequestType: "AUDIO_PLAY_BACK"
                            });
                    
                            console.log("Audio Play Back: ", YoutubeRequestTracking.audioPlayBackRequest);                           
                        }
                    }

                    if(details.url.includes("youtube.com/pcs/activeview")) {
                        chrome.tabs.getSelected(function(tab) {
                            chrome.tabs.sendMessage(tab.id as any, { message: "SkipYoutubeAds" });
                        });
                    }
                }
            }, YoutubeRequestTracking.trackUrls, YoutubeRequestTracking.reqHeadersBlocking
        );
    }

    static getRequests = () => {
        let results: any[] = [];
        if(!YoutubeRequestTracking.isEmpty(YoutubeRequestTracking.watchTimeRequest)){
            results.push(YoutubeRequestTracking.watchTimeRequest);
        }

        if(!YoutubeRequestTracking.isEmpty(YoutubeRequestTracking.qoeRequest)){
            results.push(YoutubeRequestTracking.qoeRequest);
        }

        if(!YoutubeRequestTracking.isEmpty(YoutubeRequestTracking.logEventRequest)){
            results.push(YoutubeRequestTracking.logEventRequest);
        }

        if(!YoutubeRequestTracking.isEmpty(YoutubeRequestTracking.heartbeatRequest)){
            results.push(YoutubeRequestTracking.heartbeatRequest);
        }

        if(!YoutubeRequestTracking.isEmpty(YoutubeRequestTracking.videoPlayBackRequest)){
            results.push(YoutubeRequestTracking.videoPlayBackRequest);
        }

        if(!YoutubeRequestTracking.isEmpty(YoutubeRequestTracking.audioPlayBackRequest)){
            results.push(YoutubeRequestTracking.audioPlayBackRequest);
        }
        
        return results;
    }

    static isEmpty = (obj: any) => {
        return Object.keys(obj).length === 0;
    }
    
}