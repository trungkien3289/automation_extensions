// export class NetworkAPIMask {
// 	static time = 1;
// 	static init() {
// 		function processFunctions(scope: any) {
// 			NetworkAPIMask.time = NetworkAPIMask.time + 1;

// 			if (NetworkAPIMask.time < 3000) {
// 				scope.Object.defineProperty(navigator.connection, "downlink", {
// 					enumerable: true,
// 					configurable: true,
// 					get: function () {
// 						return [4.8, 4.7, 4.15, 5.15, 5.15, 5, 7.15, 6.15, 7.15, 4.9, 4.9, 4.9, 4.9, 4.9, 4.9, 4.9, 5, 5, 8.05, 3.3, 3.9, 4.9, 5.15, 5.4, 5.15, 4.15, 7.1, 7.15, 7.3, 8, 8.15, 4.55, 6.5, 6.95, 6.2, 4.15][Math.floor(Math.random() * 36)];
// 					}
// 				});
// 				scope.Object.defineProperty(navigator.connection, "effectiveType", {
// 					enumerable: true,
// 					configurable: true,
// 					get: function () {
// 						return ['4g', '4g', '4g', '4g', '4g', '4g', '3g'][Math.floor(Math.random() * 7)];
// 					}
// 				});
// 				scope.Object.defineProperty(navigator.connection, "rtt", {
// 					enumerable: true,
// 					configurable: true,
// 					get: function () {
// 						return [50, 50, 100, 100, 150, 150, 150, 150, 100, 100, 100, 100, 100, 150, 200][Math.floor(Math.random() * 15)];
// 					}
// 				});
// 				scope.Object.defineProperty(navigator.connection, "saveData", {
// 					enumerable: true,
// 					configurable: true,
// 					get: function () {
// 						return false;
// 					}
// 				});
// 			}
// 		}

// 		processFunctions(window);

// 		var iwin = HTMLIFrameElement.prototype.__lookupGetter__('contentWindow'),
// 			idoc = HTMLIFrameElement.prototype.__lookupGetter__('contentDocument');

// 		Object.defineProperties(HTMLIFrameElement.prototype, {
// 			contentWindow: {
// 				get: function () {
// 					var frame = iwin.apply(this);
// 					if (this.src && this.src.indexOf('//') != -1 && location.host != this.src.split('/')[2]) return frame;
// 					try {
// 						frame.HTMLCanvasElement
// 					} catch (err) {
// 						/* do nothing*/
// 					}
// 					try {
// 						processFunctions(frame);
// 					} catch (err) {
// 						/* do nothing*/
// 					}
// 					return frame;
// 				}
// 			},
// 			contentDocument: {
// 				get: function () {
// 					if (this.src && this.src.indexOf('//') != -1 && location.host != this.src.split('/')[2]) return idoc.apply(this);
// 					var frame = iwin.apply(this);
// 					try {
// 						frame.HTMLCanvasElement
// 					} catch (err) {
// 						/* do nothing*/
// 					}
// 					processFunctions(frame);
// 					return idoc.apply(this);
// 				}
// 			}
// 		});
// 	}
// }