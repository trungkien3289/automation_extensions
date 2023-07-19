export class TimerNoise{
    static init(){
        const embedScript = () => {
            const code = `(() => {
                Object.defineProperties(window.performance.timing, {
                    loadEventStart: {
                        enumerable: true,
                        get: function () {
                            var faketimestamp = Math.round((new Date()).getTime() / 1);
                            return [faketimestamp][Math.floor(Math.random() * 1)];
                        }
                    },
                    requestStart: {
                        enumerable: true,
                        get: function () {
                            var faketimestamp = Math.round((new Date()).getTime() / 1);
                            return [faketimestamp][Math.floor(Math.random() * 1)];
                        }
                    },
                    responseStart: {
                        enumerable: true,
                        get: function () {
                            var faketimestamp = Math.round((new Date()).getTime() / 1);
                            var faketimestamp2 = faketimestamp + Math.floor(Math.random() * 200);
                            return [faketimestamp2][Math.floor(Math.random() * 1)];
                        }
                    },
                    loadEventEnd: {
                        enumerable: true,
                        get: function () {
                            var faketimestamp = Math.round((new Date()).getTime() / 1);
                            var faketimestamp2 = faketimestamp + Math.floor(Math.random() * 200);
                            return [faketimestamp2][Math.floor(Math.random() * 1)];
                        }
                    },
                    domComplete: {
                        enumerable: true,
                        get: function () {
                            var faketimestamp = Math.round((new Date()).getTime() / 1);
                            var faketimestamp2 = faketimestamp + Math.floor(Math.random() * 200);
                            return [faketimestamp2][Math.floor(Math.random() * 1)];
                        }
                    },
                    navigationStart: {
                        enumerable: true,
                        get: function () {
                            var faketimestamp = Math.round((new Date()).getTime() / 1);
                            return [faketimestamp][Math.floor(Math.random() * 1)];
                        }
                    },
                    domInteractive: {
                        enumerable: true,
                        get: function () {
                            var faketimestamp = Math.round((new Date()).getTime() / 1);
                            return [faketimestamp][Math.floor(Math.random() * 1)];
                        }
                    },
                    fetchStart: {
                        enumerable: true,
                        get: function () {
                            var faketimestamp = Math.round((new Date()).getTime() / 1);
                            return [faketimestamp][Math.floor(Math.random() * 1)];
                        }
                    },
                    domainLookupStart: {
                        enumerable: true,
                        get: function () {
                            var faketimestamp = Math.round((new Date()).getTime() / 1);
                            return [faketimestamp][Math.floor(Math.random() * 1)];
                        }
                    },
                    domainLookupEnd: {
                        enumerable: true,
                        get: function () {
                            var faketimestamp = Math.round((new Date()).getTime() / 1);
                            var faketimestamp2 = faketimestamp + Math.floor(Math.random() * 200);
                            return [faketimestamp2][Math.floor(Math.random() * 1)];
                        }
                    },
                    connectEnd: {
                        enumerable: true,
                        get: function () {
                            var faketimestamp = Math.round((new Date()).getTime() / 1);
                            var faketimestamp2 = faketimestamp + Math.floor(Math.random() * 200);
                            return [faketimestamp2][Math.floor(Math.random() * 1)];
                        }
                    },
                    responseEnd: {
                        enumerable: true,
                        get: function () {
                            var faketimestamp = Math.round((new Date()).getTime() / 1);
                            var faketimestamp2 = faketimestamp + Math.floor(Math.random() * 200);
                            return [faketimestamp2][Math.floor(Math.random() * 1)];
                        }
                    },
                    domContentLoadedEventEnd: {
                        enumerable: true,
                        get: function () {
                            var faketimestamp = Math.round((new Date()).getTime() / 1);
                            var faketimestamp2 = faketimestamp + Math.floor(Math.random() * 200);
                            return [faketimestamp2][Math.floor(Math.random() * 1)];
                        }
                    },	
                    connectStart: {
                        enumerable: true,
                        get: function () {
                            var faketimestamp = Math.round((new Date()).getTime() / 1);
                            return [faketimestamp][Math.floor(Math.random() * 1)];
                        }
                    },
                    secureConnectionStart: {
                        enumerable: true,
                        get: function () {
                            var faketimestamp = Math.round((new Date()).getTime() / 1);
                            return [faketimestamp][Math.floor(Math.random() * 1)];
                        }
                    },
                    domLoading: {
                        enumerable: true,
                        get: function () {
                            var faketimestamp = Math.round((new Date()).getTime() / 1);
                            return [faketimestamp][Math.floor(Math.random() * 1)];
                        }
                    },
                    domContentLoadedEventStart: {
                        enumerable: true,
                        get: function () {
                            var faketimestamp = Math.round((new Date()).getTime() / 1);
                            return [faketimestamp][Math.floor(Math.random() * 1)];
                        }
                    },
                    domContentunloadEventStart: {
                        enumerable: true,
                        get: function () {
                            var faketimestamp = Math.round((new Date()).getTime() / 1);
                            return [faketimestamp][Math.floor(Math.random() * 1)];
                        }
                    },
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