export class WebGLMask {
  static init() {
    chrome.storage.local.get('config', (storage) => {
      const data = storage.config;
        var jsonConfig = JSON.stringify(data);
        var inject = function (zData) {
          var data = zData;
          console.log("start fake webgl");
          var browserplugsR = [
            'ANGLE (NVIDIA Quadro 2000M Direct3D11 vs_5_0 ps_5_0)',
            'ANGLE (NVIDIA Quadro K420 Direct3D9Ex vs_3_0 ps_3_0)',
            'ANGLE (NVIDIA Quadro 2000M Direct3D9Ex vs_3_0 ps_3_0)',
            'ANGLE (NVIDIA Quadro K2000M Direct3D11 vs_5_0 ps_5_0)',
            'ANGLE (Intel(R) HD Graphics Direct3D9Ex vs_3_0 ps_3_0)',
            'ANGLE (Intel(R) HD Graphics Family Direct3D9Ex vs_3_0 ps_3_0)',
            'ANGLE (ATI Radeon HD 3800 Series Direct3D9Ex vs_3_0 ps_3_0)',
            'ANGLE (Intel(R) HD Graphics 4000 Direct3D11 vs_5_0 ps_5_0)',
            'ANGLE (Intel(R) HD Graphics 4000 Direct3D11 vs_5_0 ps_5_0)',
            'ANGLE (AMD Radeon R9 200 Series Direct3D11 vs_5_0 ps_5_0)',
            'ANGLE (Intel(R) HD Graphics Direct3D9Ex vs_3_0 ps_3_0)',
            'ANGLE (Intel(R) HD Graphics Family Direct3D9Ex vs_3_0 ps_3_0)',
            'ANGLE (Intel(R) HD Graphics Direct3D9Ex vs_3_0 ps_3_0)',
            'ANGLE (Intel(R) HD Graphics Family Direct3D9Ex vs_3_0 ps_3_0)',
            'ANGLE (Intel(R) HD Graphics 4000 Direct3D9Ex vs_3_0 ps_3_0)',
            'ANGLE (Intel(R) HD Graphics 3000 Direct3D9Ex vs_3_0 ps_3_0)',
            'ANGLE (Mobile Intel(R) 4 Series Express Chipset Family Direct3D9Ex vs_3_0 ps_3_0)',
            'ANGLE (Intel(R) G33/G31 Express Chipset Family Direct3D9Ex vs_0_0 ps_2_0)',
            'ANGLE (Intel(R) Graphics Media Accelerator 3150 Direct3D9Ex vs_0_0 ps_2_0)',
            'ANGLE (Intel(R) G41 Express Chipset Direct3D9Ex vs_3_0 ps_3_0)',
            'ANGLE (NVIDIA GeForce 6150SE nForce 430 Direct3D9Ex vs_3_0 ps_3_0)',
            'ANGLE (Intel(R) HD Graphics 4000)',
            'ANGLE (Mobile Intel(R) 965 Express Chipset Family Direct3D9Ex vs_3_0 ps_3_0)',
            'ANGLE (Intel(R) HD Graphics Family)',
            'ANGLE (NVIDIA GeForce GTX 760 Direct3D11 vs_5_0 ps_5_0)',
            'ANGLE (NVIDIA GeForce GTX 760 Direct3D11 vs_5_0 ps_5_0)',
            'ANGLE (NVIDIA GeForce GTX 760 Direct3D11 vs_5_0 ps_5_0)',
            'ANGLE (AMD Radeon HD 6310 Graphics Direct3D9Ex vs_3_0 ps_3_0)',
            'ANGLE (Intel(R) Graphics Media Accelerator 3600 Series Direct3D9Ex vs_3_0 ps_3_0)',
            'ANGLE (Intel(R) G33/G31 Express Chipset Family Direct3D9 vs_0_0 ps_2_0)',
            'ANGLE (AMD Radeon HD 6320 Graphics Direct3D9Ex vs_3_0 ps_3_0)',
            'ANGLE (Intel(R) G33/G31 Express Chipset Family (Microsoft Corporation - WDDM 1.0) Direct3D9Ex vs_0_0 ps_2_0)',
            'ANGLE (Intel(R) G41 Express Chipset)',
            'ANGLE (ATI Mobility Radeon HD 5470 Direct3D9Ex vs_3_0 ps_3_0)',
            'ANGLE (Intel(R) Q45/Q43 Express Chipset Direct3D9Ex vs_3_0 ps_3_0)',
            'ANGLE (NVIDIA GeForce 310M Direct3D9Ex vs_3_0 ps_3_0)',
            'ANGLE (Intel(R) G41 Express Chipset Direct3D9 vs_3_0 ps_3_0)',
            'ANGLE (Mobile Intel(R) 45 Express Chipset Family (Microsoft Corporation - WDDM 1.1) Direct3D9Ex vs_3_0 ps_3_0)',
            'ANGLE (NVIDIA GeForce GT 440 Direct3D9Ex vs_3_0 ps_3_0)',
            'ANGLE (ATI Radeon HD 4300/4500 Series Direct3D9Ex vs_3_0 ps_3_0)',
            'ANGLE (AMD Radeon HD 7310 Graphics Direct3D9Ex vs_3_0 ps_3_0)',
            'ANGLE (Intel(R) HD Graphics)',
            'ANGLE (Intel(R) 4 Series Internal Chipset Direct3D9Ex vs_3_0 ps_3_0)',
            'ANGLE (AMD Radeon(TM) HD 6480G Direct3D9Ex vs_3_0 ps_3_0)',
            'ANGLE (ATI Radeon HD 3200 Graphics Direct3D9Ex vs_3_0 ps_3_0)',
            'ANGLE (AMD Radeon HD 7800 Series Direct3D9Ex vs_3_0 ps_3_0)',
            'ANGLE (Intel(R) G41 Express Chipset (Microsoft Corporation - WDDM 1.1) Direct3D9Ex vs_3_0 ps_3_0)',
            'ANGLE (NVIDIA GeForce 210 Direct3D9Ex vs_3_0 ps_3_0)',
            'ANGLE (NVIDIA GeForce GT 630 Direct3D9Ex vs_3_0 ps_3_0)',
            'ANGLE (AMD Radeon HD 7340 Graphics Direct3D9Ex vs_3_0 ps_3_0)',
            'ANGLE (Intel(R) 82945G Express Chipset Family Direct3D9 vs_0_0 ps_2_0)',
            'ANGLE (NVIDIA GeForce GT 430 Direct3D9Ex vs_3_0 ps_3_0)',
            'ANGLE (NVIDIA GeForce 7025 / NVIDIA nForce 630a Direct3D9Ex vs_3_0 ps_3_0)',
            'ANGLE (Intel(R) Q35 Express Chipset Family Direct3D9Ex vs_0_0 ps_2_0)',
            'ANGLE (Intel(R) HD Graphics 4600 Direct3D9Ex vs_3_0 ps_3_0)',
            'ANGLE (AMD Radeon HD 7520G Direct3D9Ex vs_3_0 ps_3_0)',
            'ANGLE (AMD 760G (Microsoft Corporation WDDM 1.1) Direct3D9Ex vs_3_0 ps_3_0)',
            'ANGLE (NVIDIA GeForce GT 220 Direct3D9Ex vs_3_0 ps_3_0)',
            'ANGLE (NVIDIA GeForce 9500 GT Direct3D9Ex vs_3_0 ps_3_0)',
            'ANGLE (Intel(R) HD Graphics Family Direct3D9 vs_3_0 ps_3_0)',
            'ANGLE (Intel(R) Graphics Media Accelerator HD Direct3D9Ex vs_3_0 ps_3_0)',
            'ANGLE (NVIDIA GeForce 9800 GT Direct3D9Ex vs_3_0 ps_3_0)',
            'ANGLE (Intel(R) Q965/Q963 Express Chipset Family (Microsoft Corporation - WDDM 1.0) Direct3D9Ex vs_0_0 ps_2_0)',
            'ANGLE (NVIDIA GeForce GTX 550 Ti Direct3D9Ex vs_3_0 ps_3_0)',
            'ANGLE (Intel(R) Q965/Q963 Express Chipset Family Direct3D9Ex vs_0_0 ps_2_0)',
            'ANGLE (AMD M880G with ATI Mobility Radeon HD 4250 Direct3D9Ex vs_3_0 ps_3_0)',
            'ANGLE (NVIDIA GeForce GTX 650 Direct3D9Ex vs_3_0 ps_3_0)',
            'ANGLE (ATI Mobility Radeon HD 5650 Direct3D9Ex vs_3_0 ps_3_0)',
            'ANGLE (ATI Radeon HD 4200 Direct3D9Ex vs_3_0 ps_3_0)',
            'ANGLE (AMD Radeon HD 7700 Series Direct3D9Ex vs_3_0 ps_3_0)',
            'ANGLE (Intel(R) G33/G31 Express Chipset Family)',
            'ANGLE (Intel(R) 82945G Express Chipset Family Direct3D9Ex vs_0_0 ps_2_0)',
            'ANGLE (SiS Mirage 3 Graphics Direct3D9Ex vs_2_0 ps_2_0)',
            'ANGLE (NVIDIA GeForce GT 430)',
            'ANGLE (AMD RADEON HD 6450 Direct3D9Ex vs_3_0 ps_3_0)',
            'ANGLE (ATI Radeon 3000 Graphics Direct3D9Ex vs_3_0 ps_3_0)',
            'ANGLE (Intel(R) 4 Series Internal Chipset Direct3D9 vs_3_0 ps_3_0)',
            'ANGLE (Intel(R) Q35 Express Chipset Family (Microsoft Corporation - WDDM 1.0) Direct3D9Ex vs_0_0 ps_2_0)',
            'ANGLE (NVIDIA GeForce GT 220 Direct3D9 vs_3_0 ps_3_0)',
            'ANGLE (AMD Radeon HD 7640G Direct3D9Ex vs_3_0 ps_3_0)',
            'ANGLE (AMD 760G Direct3D9Ex vs_3_0 ps_3_0)',
            'ANGLE (AMD Radeon HD 6450 Direct3D9Ex vs_3_0 ps_3_0)',
            'ANGLE (NVIDIA GeForce GT 640 Direct3D9Ex vs_3_0 ps_3_0)',
            'ANGLE (NVIDIA GeForce 9200 Direct3D9Ex vs_3_0 ps_3_0)',
            'ANGLE (NVIDIA GeForce GT 610 Direct3D9Ex vs_3_0 ps_3_0)',
            'ANGLE (AMD Radeon HD 6290 Graphics Direct3D9Ex vs_3_0 ps_3_0)',
            'ANGLE (ATI Mobility Radeon HD 4250 Direct3D9Ex vs_3_0 ps_3_0)',
            'ANGLE (NVIDIA GeForce 8600 GT Direct3D9 vs_3_0 ps_3_0)',
            'ANGLE (ATI Radeon HD 5570 Direct3D9Ex vs_3_0 ps_3_0)',
            'ANGLE (AMD Radeon HD 6800 Series Direct3D9Ex vs_3_0 ps_3_0)',
            'ANGLE (Intel(R) G45/G43 Express Chipset Direct3D9Ex vs_3_0 ps_3_0)',
            'ANGLE (ATI Radeon HD 4600 Series Direct3D9Ex vs_3_0 ps_3_0)',
            'ANGLE (NVIDIA Quadro NVS 160M Direct3D9Ex vs_3_0 ps_3_0)',
            'ANGLE (Intel(R) HD Graphics 3000)',
            'ANGLE (NVIDIA GeForce G100)', 'ANGLE (AMD Radeon HD 8610G + 8500M Dual Graphics Direct3D9Ex vs_3_0 ps_3_0)',
            'ANGLE (Mobile Intel(R) 4 Series Express Chipset Family Direct3D9 vs_3_0 ps_3_0)',
            'ANGLE (NVIDIA GeForce 7025 / NVIDIA nForce 630a (Microsoft Corporation - WDDM) Direct3D9Ex vs_3_0 ps_3_0)',
            'ANGLE (Intel(R) Q965/Q963 Express Chipset Family Direct3D9 vs_0_0 ps_2_0)',
            'ANGLE (AMD RADEON HD 6350 Direct3D9Ex vs_3_0 ps_3_0)',
            'ANGLE (ATI Radeon HD 5450 Direct3D9Ex vs_3_0 ps_3_0)',
            'ANGLE (NVIDIA GeForce 9500 GT)',
            'ANGLE (AMD Radeon HD 6500M/5600/5700 Series Direct3D9Ex vs_3_0 ps_3_0)',
            'ANGLE (Mobile Intel(R) 965 Express Chipset Family)',
            'ANGLE (NVIDIA GeForce 8400 GS Direct3D9Ex vs_3_0 ps_3_0)',
            'ANGLE (Intel(R) HD Graphics Direct3D9 vs_3_0 ps_3_0)',
            'ANGLE (NVIDIA GeForce GTX 560 Direct3D9Ex vs_3_0 ps_3_0)',
            'ANGLE (NVIDIA GeForce GT 620 Direct3D9Ex vs_3_0 ps_3_0)',
            'ANGLE (NVIDIA GeForce GTX 660 Direct3D9Ex vs_3_0 ps_3_0)',
            'ANGLE (AMD Radeon(TM) HD 6520G Direct3D9Ex vs_3_0 ps_3_0)',
            'ANGLE (NVIDIA GeForce GT 240 Direct3D9Ex vs_3_0 ps_3_0)',
            'ANGLE (AMD Radeon HD 8240 Direct3D9Ex vs_3_0 ps_3_0)',
            'ANGLE (NVIDIA Quadro NVS 140M)',
            'ANGLE (Intel(R) Q35 Express Chipset Family Direct3D9 vs_0_0 ps_2_0)'
          ];
          var config = {
            "random": {
              "value": function () {
                return Math.random()
              },
              "item": function (e: any) {
                var rand = e.length * config.random.value();
                return e[Math.floor(rand)];
              },
              "array": function (e: any) {
                var rand = config.random.item(e);
                return new Int32Array([rand, rand]);
              },
              "items": function (e: any, n: any) {
                var length = e.length;
                var result = new Array(n);
                var taken = new Array(length);
                if (n > length) n = length;
                //
                while (n--) {
                  var i = Math.floor(config.random.value() * length);
                  result[n] = e[i in taken ? taken[i] : i];
                  taken[i] = --length in taken ? taken[length] : length;
                }
                //
                return result;
              }
            },
            "spoof": {
              "webgl": {
                "buffer": function (target: any) {
                  const bufferData = target.prototype.bufferData;
                  Object.defineProperty(target.prototype, "bufferData", {
                    "value": function () {
                      // var index = Math.floor(config.random.value() * 10);
                      // var noise = 0.1 * config.random.value() * arguments[1][index];
                      // arguments[1][index] = arguments[1][index] + noise;
                      arguments[1][0] = arguments[1][0] + 0.1 * data.canvasNoise.R;
                      arguments[1][3] = arguments[1][3] + 0.1 * data.canvasNoise.G;
                      arguments[1][9] = arguments[1][9] + 0.1 * data.canvasNoise.B;
                      return bufferData.apply(this, arguments);
                    }
                  });
                },
                "parameter": function (target: any) {
                  const getParameter = target.prototype.getParameter;
                  Object.defineProperty(target.prototype, "getParameter", {
                    "value": function () {
                      console.log("fake webgl parameter");
                      var BR0WSERplugsGL2: any = {};
                      
                      var webGlParameters = data.deviceFingerPrint.WebGLInfor.WebGLParameters;
                      webGlParameters.forEach(function (parameter: any) {
                        if (!BR0WSERplugsGL2.hasOwnProperty(parameter.Id) || (BR0WSERplugsGL2.hasOwnProperty(parameter.Id) && parameter.Value != null && parameter.Value != "")) {
                          BR0WSERplugsGL2[parameter.Id] = parameter.Value;
                        }
                      });

                      var webGlExtensions = data.deviceFingerPrint.WebGLInfor.Extensions;
                      webGlExtensions.forEach(function (extension: any) {
                        extension.Parameters.forEach((para: any) => {
                          if (!BR0WSERplugsGL2.hasOwnProperty(para.Id) || (BR0WSERplugsGL2.hasOwnProperty(para.Id) && para.Value != null && para.Value != "")) {
                            BR0WSERplugsGL2[para.Id] = para.Value;
                          }
                        });
                      });

                      console.log("Name:" + arguments[0] + "Value" + BR0WSERplugsGL2[arguments[0]]);

                      switch (arguments[0]) {
                        case 35658:
                          return data.fakeWebGL.Plus1;
                        case 34024:
                        case 3379:
                        case 34076:
                        case 32883:
                        case 35071:
                          return data.fakeWebGL.Plus5;
                        case 35376:
                          return data.fakeWebGL.Plus2;
                        case 35377:
                          return data.fakeWebGL.Plus3;
                        case 35379:
                          return data.fakeWebGL.Plus4;
                        case 37446:
                          {
                            if (data.fakeWebGL.BrowserplugsR <= browserplugsR.length - 1) {
                              return browserplugsR[data.fakeWebGL.BrowserplugsR];
                            } else {
                              return "ANGLE (Intel(R) HD Graphics 4000)";
                            }
                          }

                        default:
                          return BR0WSERplugsGL2[arguments[0]];
                      }
                    }
                  });
                }
              }
            }
          };
          config.spoof.webgl.buffer(WebGLRenderingContext);
          config.spoof.webgl.buffer(WebGL2RenderingContext);
          config.spoof.webgl.parameter(WebGLRenderingContext);
          config.spoof.webgl.parameter(WebGL2RenderingContext);
          document.documentElement.dataset.wgscriptallow = 'true';
        };

        var script_1 = document.createElement("script");
        script_1.textContent = "(" + inject + ")("+jsonConfig+")";
        document.documentElement.appendChild(script_1);
    });

    if (document.documentElement.dataset.wgscriptallow !== "true") {
      var script_2 = document.createElement('script');
      script_2.textContent = `{
          const iframes = window.top.document.querySelectorAll("iframe[sandbox]");
          for (var i = 0; i < iframes.length; i++) {
            if (iframes[i].contentWindow) {
              if (iframes[i].contentWindow.WebGLRenderingContext) {
                iframes[i].contentWindow.WebGLRenderingContext.prototype.bufferData = WebGLRenderingContext.prototype.bufferData;
                iframes[i].contentWindow.WebGLRenderingContext.prototype.getParameter = WebGLRenderingContext.prototype.getParameter;
              }
              if (iframes[i].contentWindow.WebGL2RenderingContext) {
                iframes[i].contentWindow.WebGL2RenderingContext.prototype.bufferData = WebGL2RenderingContext.prototype.bufferData;
                iframes[i].contentWindow.WebGL2RenderingContext.prototype.getParameter = WebGL2RenderingContext.prototype.getParameter;
              }
            }
          }
        }`;
      //
      window.top.document.documentElement.appendChild(script_2);
    }

  }
}