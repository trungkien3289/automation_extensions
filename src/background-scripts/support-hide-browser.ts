export class SupportHideBrowser {
    static init = () => {
        chrome.webNavigation.onCommitted.addListener((evt) => {
            console.log("webNavigation.onCommitted", evt);
            if (evt.frameId !== 0) {
                return;
            }
            var frameId = evt.frameId;
            console.log("before execute script to support hide browser");
            chrome.tabs.executeScript(evt.tabId, {
                runAt: 'document_start',
                frameId,
                code: `{
                    const script = document.createElement('script');
                    script.textContent = \`{
                        Object.defineProperty(document, 'hidden', {value: false});
                        Object.defineProperty(document, 'mozHidden', {value: false});
                        Object.defineProperty(document, 'msHidden', {value: false});
                        Object.defineProperty(document, 'webkitHidden', {value: false});
                        Object.defineProperty(document, 'visibilityState', {value: 'visible'});
                        Object.defineProperty(document, 'hasFocus', {value: false});
                        Object.defineProperty(window, 'onblur', {value: false});
                        Object.defineProperty(window, 'onfocus', {value: false});
                        Object.defineProperty(window, 'blur', {value: false});
                        Object.defineProperty(window, 'focus', {value: false});
                    }\`;
                    document.documentElement.appendChild(script);
                    script.remove();
                  }`
            }, () => chrome.runtime.lastError);
        });
    }
}