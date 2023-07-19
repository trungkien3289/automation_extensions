export class AudioContextMask{
    static init(){
        var inject = function () {
            const context = {
              "BUFFER": null,
              "getChannelData": function (e:any) {
                const getChannelData = e.prototype.getChannelData;
                Object.defineProperty(e.prototype, "getChannelData", {
                  "value": function () {
                    const results_1 = getChannelData.apply(this, arguments);
                    if (context.BUFFER !== results_1) {
                      context.BUFFER = results_1;
                      for (var i = 0; i < results_1.length; i += 100) {
                        let index = Math.floor(Math.random() * i);
                        results_1[index] = results_1[index] + Math.random() * 0.0000001;
                      }
                    }
                    //
                    return results_1;
                  }
                });
              },
              "createAnalyser": function (e: any) {
                const createAnalyser = e.prototype.__proto__.createAnalyser;
                Object.defineProperty(e.prototype.__proto__, "createAnalyser", {
                  "value": function () {
                    const results_2 = createAnalyser.apply(this, arguments);
                    const getFloatFrequencyData = results_2.__proto__.getFloatFrequencyData;
                    Object.defineProperty(results_2.__proto__, "getFloatFrequencyData", {
                      "value": function () {
                        const results_3 = getFloatFrequencyData.apply(this, arguments);
                        for (var i = 0; i < arguments[0].length; i += 100) {
                          let index = Math.floor(Math.random() * i);
                          arguments[0][index] = arguments[0][index] + Math.random() * 0.1;
                        }
                        //
                        return results_3;
                      }
                    });
                    //
                    return results_2;
                  }
                });
              }
            };
            //
            context.getChannelData(AudioBuffer);
            context.createAnalyser(AudioContext);
            context.getChannelData(OfflineAudioContext);
            context.createAnalyser(OfflineAudioContext);
          };
          
          var script_1 = document.createElement('script');
          script_1.textContent = "(" + inject + ")()";
          document.documentElement.appendChild(script_1);
        
          var script_2 = document.createElement('script');
          script_2.textContent = `{
            const iframes = window.top.document.querySelectorAll("iframe[sandbox]");
            for (var i = 0; i < iframes.length; i++) {
              if (iframes[i].contentWindow) {
                if (iframes[i].contentWindow.AudioBuffer) {
                  if (iframes[i].contentWindow.AudioBuffer.prototype) {
                    if (iframes[i].contentWindow.AudioBuffer.prototype.getChannelData) {
                      iframes[i].contentWindow.AudioBuffer.prototype.getChannelData = AudioBuffer.prototype.getChannelData;
                    }
                  }
                }
        
                if (iframes[i].contentWindow.AudioContext) {
                  if (iframes[i].contentWindow.AudioContext.prototype) {
                    if (iframes[i].contentWindow.AudioContext.prototype.__proto__) {
                      if (iframes[i].contentWindow.AudioContext.prototype.__proto__.createAnalyser) {
                        iframes[i].contentWindow.AudioContext.prototype.__proto__.createAnalyser = AudioContext.prototype.__proto__.createAnalyser;
                      }
                    }
                  }
                }
        
                if (iframes[i].contentWindow.OfflineAudioContext) {
                  if (iframes[i].contentWindow.OfflineAudioContext.prototype) {
                    if (iframes[i].contentWindow.OfflineAudioContext.prototype.__proto__) {
                      if (iframes[i].contentWindow.OfflineAudioContext.prototype.__proto__.createAnalyser) {
                        iframes[i].contentWindow.OfflineAudioContext.prototype.__proto__.createAnalyser = OfflineAudioContext.prototype.__proto__.createAnalyser;
                      }
                    }
                  }
                }
        
                if (iframes[i].contentWindow.OfflineAudioContext) {
                  if (iframes[i].contentWindow.OfflineAudioContext.prototype) {
                    if (iframes[i].contentWindow.OfflineAudioContext.prototype.__proto__) {
                      if (iframes[i].contentWindow.OfflineAudioContext.prototype.__proto__.getChannelData) {
                        iframes[i].contentWindow.OfflineAudioContext.prototype.__proto__.getChannelData = OfflineAudioContext.prototype.__proto__.getChannelData;
                      }
                    }
                  }
                }
              }
            }
          }`;
          window.top.document.documentElement.appendChild(script_2);
    }
}