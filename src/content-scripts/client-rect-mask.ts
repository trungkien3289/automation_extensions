export class ClientRectMask{
    static init(){
        const embedScript = () => {
            const code = `(() => {
              Object.defineProperties(Element.prototype, {
                getClientRects: {
                  value: () => [{
                    'top': 0,
                    'bottom': 0,
                    'left': 0,
                    'right': 0,
                    'height': 0,
                    'width': 0
                  }],
                  enumerable: true
                }
              });
            })();`;
      
            const script = document.createElement("script");
            script.textContent = code;
            document.documentElement.prepend(script);
            script.remove();
          };
      
          embedScript();
    }
}