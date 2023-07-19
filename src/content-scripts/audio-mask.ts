export class AudioMask{
    static init(){
        const embedScript = () => {
			const code = `
			(() => {
				Object.defineProperties(window, {
					OfflineAudioContext: {
						value: () =>  false,
						enumerable: true,
					},
					AudioContext: {
						value: () =>  false,
						enumerable: true,
					},
					webkitAudioContext: {
						value: () =>  false,
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
}