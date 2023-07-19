export class BrowserHistoryMask{
    static init(){
        chrome.storage.local.get('config', (storage) => {
			const config = storage.config;

			const embedScript = () => {
				const code = `(() => {
					Object.defineProperties(window.history, {
						length: {
							value: ${config.historyLength},
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
		});
    }
}