export class CanvasNoise {
    static init(){
        chrome.storage.local.get('config', (storage) => {
            const config = storage.config || {};
            console.log("configs canvas noise", config);
            debugger
            if (config && config.canvasNoise != null) {
              var script = document.createElement('script');
      
              script.textContent = `
            {
              debugger
              const toBlob = HTMLCanvasElement.prototype.toBlob;
              const toDataURL = HTMLCanvasElement.prototype.toDataURL;
              HTMLCanvasElement.prototype.htGfd = function() {
                const {width, height} = this;
                const context = this.getContext('2d')|| this.getContext('webgl') || this.getContext('experimental-webgl');
                const shift = {
                  'r': ${config.canvasNoise.R},
                  'g': ${config.canvasNoise.G},
                  'b': ${config.canvasNoise.B}
                };
                const matt = context.getImageData(0, 0, width, height);
                for (let i = 0; i < height; i += 3) {
                  for (let j = 0; j < width; j += 3) {
                    const n = ((i * (width * 4)) + (j * 4));
                    matt.data[n + 0] = matt.data[n + 0] + shift.r;
                    matt.data[n + 1] = matt.data[n + 1] + shift.g;
                    matt.data[n + 2] = matt.data[n + 2] + shift.b;
                  }
                }
                context.putImageData(matt, 0, 0);
              };
      
              Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
                value: function() {
                  if (document.documentElement.dataset.htGfd !== 'false') {
                    this.htGfd();
                  }
                  return toBlob.apply(this, arguments);
                }
              });
              Object.defineProperty(HTMLCanvasElement.prototype, 'toDataURL', {
                value: function() {
                  try{
                    if (document.documentElement.dataset.htGfd !== 'false') {
                      this.htGfd();
                    }
                    return toDataURL.apply(this, arguments);
                  }catch(ex){
                    return toDataURL.apply(this, arguments);
                  }
                }
              });
              var orig_measureText = CanvasRenderingContext2D.prototype.measureText;
              CanvasRenderingContext2D.prototype.measureText = function(){
                  if(typeof arguments[0] === 'number'){
                      arguments[0] += '';
                  }
                  debugger
                  const addedChartRandomCount = Math.floor(Math.random() * 20) + 1;
                  for (let index = 0; index < addedChartRandomCount; index++) {
                      arguments[0] += "k";
                  }
                  return orig_measureText.apply(this, arguments);
              };
              document.documentElement.dataset.htGfd = true;
              var ctx = document.createElement('canvas').getContext('2d');
              // console.log(ctx.getImageData(0,0,1,1));
              ctx.fillStyle = "#f60";
              ctx.fillRect(125,1,62,20);
              var dataURL = ctx.canvas.toDataURL();
            }`;
      
              document.documentElement.appendChild(script);
      
              // make sure the script is injected
              if (document.documentElement.dataset.htGfd !== 'true') {
                document.documentElement.dataset.htGfd = 'true';
                window.top.document.documentElement.appendChild(Object.assign(document.createElement('script'), {
                  textContent: `
            [...document.querySelectorAll('iframe[sandbox]')]
              .filter(i => i.contentDocument.documentElement.dataset.htGfd === 'true')
              .forEach(i => {
                i.contentWindow.HTMLCanvasElement.prototype.toBlob = HTMLCanvasElement.prototype.toBlob;
                i.contentWindow.HTMLCanvasElement.prototype.toDataURL = HTMLCanvasElement.prototype.toDataURL;
                i.contentWindow.HTMLCanvasElement.prototype.htGfd = HTMLCanvasElement.prototype.htGfd;
              });
            `
                }));
              }
            }
      
            delete document.documentElement.dataset.htGfd;
          });
    }
}