export class LanguageMask{
    static init(){
        chrome.storage.local.get('config', (storage) => {
            const config = storage.config|| {};
      
            const embedScript = () => {
              const code = `(() => {
                Object.defineProperties(Navigator.prototype, {
                  language: {
                    value: '${config.language}',
                    configurable: false,
                    enumerable: true,
                    writable: false
                  },
                  languages: {
                    value: ['${config.language}'],
                    configurable: false,
                    enumerable: true,
                    writable: false
                  },
                });
      
                Object.defineProperty(navigator, 'webdriver', { get: () => undefined })
              })();`;
      
              const script = document.createElement("script");
              script.textContent = code;
              document.documentElement.prepend(script);
              script.remove();
            };
      
            embedScript();
        });
    }
}