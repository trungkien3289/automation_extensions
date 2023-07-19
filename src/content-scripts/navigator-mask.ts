export class NavigatorMask{
    static init(){
        chrome.storage.local.get('config', (storage) => {
            const config = storage.config || {};
            console.log("List plugins", config.deviceFingerPrint.PluginsData);
            const embedScript = () => {
                const code = `
                (() => {
                    Object.defineProperties(navigator, {
                        plugins: {
                            value: ${config.deviceFingerPrint.PluginsData},
                            enumerable: true,
                        },
                        mimeTypes: {
                            value: ${config.deviceFingerPrint.MimeTypesData},
                            enumerable: true,
                        }
                    });
                })();`;
    
                const script = document.createElement("script");
                script.textContent = code;
                document.documentElement.prepend(script);
                script.remove();
            };
    
            embedScript();
    
            console.log("fake plugins and mimeTypes");
        });
    }
}