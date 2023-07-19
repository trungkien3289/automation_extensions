export class BatteryMask{
    static init(){
        chrome.storage.local.get('config', (storage) => {
            const config = storage.config || {};
            if(config.fakeBattery){
                const embedScript = () => {
                    const code = `
                    (() => {
                        Object.defineProperties(BatteryManager.prototype, {
                            charging: {
                            value: '${config.fakeBattery.Charging}',
                            enumerable: true,
                            },
                            chargingTime: {
                                value: ['${config.fakeBattery.ChargingTime}'],
                                enumerable: true,
                            },
                            dischargingTime: {
                                value: '${config.fakeBattery.DischargingTime}',
                                enumerable: true,
                            },
                            level: {
                                value: ['${config.fakeBattery.Level}'],
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
            }
        });

    }
}