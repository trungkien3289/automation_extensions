export class MediaDeviceMask{
    static init(){
            function processFunctions(scope: any) {
                scope.Object.defineProperty(navigator.mediaDevices, "enumerateDevices", {
                    enumerable: true,
                    configurable: true,
                    get: function () {
                        return undefined;
                    }
                });
    
                scope.Object.defineProperty(navigator, "webkitGetUserMedia", {
                    enumerable: true,
                    configurable: true,
                    get: function () {
                        return [];
                    }
                });
            }
    
            processFunctions(window);
    
            var iwin:any = Object.getOwnPropertyDescriptor(HTMLIFrameElement.prototype as any, "contentWindow")?.get;
            var idoc:any =  Object.getOwnPropertyDescriptor(HTMLIFrameElement.prototype as any, "contentDocument")?.get;
            Object.defineProperties(HTMLIFrameElement.prototype, {
                contentWindow: {
                    get: function () {
                        var frame = iwin.apply(this);
                        if (this.src && this.src.indexOf('//') != -1 && location.host != this.src.split('/')[2]) return frame;
                        try {
                            frame.HTMLCanvasElement
                        } catch (err) {
                            /* do nothing*/
                        }
                        try {
                            processFunctions(frame);
                        } catch (err) {
                            /* do nothing*/
                        }
                        return frame;
                    }
                },
                contentDocument: {
                    get: function () {
                        if (this.src && this.src.indexOf('//') != -1 && location.host != this.src.split('/')[2]) return idoc.apply(this);
                        var frame = iwin.apply(this);
                        try {
                            frame.HTMLCanvasElement
                        } catch (err) {
                            /* do nothing*/
                        }
                        try {
                            processFunctions(frame);
                        } catch (err) {
                            /* do nothing*/
                        }
                        return idoc.apply(this);
                    }
                }
            });
    }
}