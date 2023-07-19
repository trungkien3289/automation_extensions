export class WebRTCMask{
    static init(){
        var script: any = document.getElementById("webrtc-control");
        var head = document.documentElement || document.head || document.querySelector("head");
        if (!script) {
            script = document.createElement('script');
            script.type = "text/javascript";
            script.setAttribute("id", "webrtc-control");
            if (head) head.appendChild(script);
        }
        try {
            var webrtc = '(' + function () {
                if (typeof navigator.getUserMedia !== "undefined") navigator.getUserMedia = () => {};
                if (typeof window.MediaStreamTrack !== "undefined") window.MediaStreamTrack = {} as any;
                if (typeof window.RTCPeerConnection !== "undefined") window.RTCPeerConnection = {} as any;
                // if (typeof navigator.webkitGetUserMedia !== "undefined") navigator.webkitGetUserMedia = undefined;
                if (typeof window.RTCSessionDescription !== "undefined") window.RTCSessionDescription = {} as any;
                // if (typeof window.webkitMediaStreamTrack !== "undefined") window.webkitMediaStreamTrack = undefined;
                if (typeof window.webkitRTCPeerConnection !== "undefined") window.webkitRTCPeerConnection = {} as any;
                // if (typeof window.webkitRTCSessionDescription !== "undefined") window.webkitRTCSessionDescription = undefined;
            } + ')();';
            /*  */
            script.textContent = webrtc;
        } catch (e) {}
    }
}