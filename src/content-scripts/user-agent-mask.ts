export class UserAgentMask{
    static init(){
        chrome.storage.local.get('config', (storage) => {
            const config = storage.config;
            console.log("kaka: override navigator");
            if (config != null) {
              const embedScript = () => {
                const code = `(() => {
                  Object.defineProperties(Navigator.prototype, {
                    userAgent: {
                      value: '${config.userAgent}',
                      enumerable: true
                    }
                  });
                })();`;
      
                const codeAppVersion = `(() => {
                  Object.defineProperties(Navigator.prototype, {
                    appVersion: {
                      value: '${config.appVersion}',
                      enumerable: true
                    }
                  });
                })();`;
      
                const codeVendor = `(() => {
                  Object.defineProperties(Navigator.prototype, {
                    vendor: {
                      value: '${config.vendor}',
                      enumerable: true
                    }
                  });
                })();`;
      
                const codePlatform = `(() => {
                  Object.defineProperties(Navigator.prototype, {
                    platform: {
                      value: '${config.platform}',
                      enumerable: true
                    }
                  });
                })();`;
      
                const script = document.createElement("script");
                const scriptAppVersion = document.createElement("script");
                const scriptVendor = document.createElement("script");
                const scriptPlatform = document.createElement("script");
      
                script.textContent = code;
                scriptAppVersion.textContent = codeAppVersion;
                scriptVendor.textContent = codeVendor;
                scriptPlatform.textContent = codePlatform;
      
                document.documentElement.prepend(script);
                document.documentElement.prepend(scriptAppVersion);
                document.documentElement.prepend(scriptVendor);
                document.documentElement.prepend(scriptPlatform);
      
                script.remove();
                scriptAppVersion.remove();
                scriptVendor.remove();
                scriptPlatform.remove();
              };
      
              embedScript();
            }
          });
    }
}