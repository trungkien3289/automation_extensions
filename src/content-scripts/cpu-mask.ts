export class CPUMask {
    static init() {
        chrome.storage.local.get('config', function (storage) {
            const config = storage.config || {};
            if (config.fakeCPU != null) {
                const embedScript = () => {
                    const code = `
                  (() => {
                    Object.defineProperties(Navigator.prototype, {
                      hardwareConcurrency: {
                        value: '${config.fakeCPU.HardwareConcurrency}',
                        configurable: false,
                        enumerable: true,
                        writable: false
                      },
                      deviceMemory: {
                        value: ['${config.fakeCPU.DeviceMemory}'],
                        configurable: false,
                        enumerable: true,
                        writable: false
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
        });
    }
}