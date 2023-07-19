export class ProxySetting {
    public static applyProxy = (proxy: any, bypassSites: string[] = []) => {
        try{
            var config = {
                mode: "fixed_servers",
                rules: {
                    singleProxy: {
                        scheme: proxy.Scheme,
                        host: proxy.Host,
                        port: Number(proxy.Port)
                    },
                    bypassList: bypassSites
                }
            };
    
            chrome.proxy.settings.set({
                value: config,
                scope: 'regular'
            });
    
            if(proxy.UserName!=null && proxy.UserName!="" && proxy.Password!= null && proxy.Password!= ""){
                chrome.webRequest.onAuthRequired.addListener(
                  function(details) {
                      return {
                          authCredentials: {username: proxy.UserName, password: proxy.Password}
                      };
                  },
                  {urls: ["<all_urls>"]},
                  ['blocking']
                );
            }
           
            localStorage.freevpnStatus = 'connected';
            chrome.runtime.sendMessage(
                {status: 'connected'}
            );
        }catch(ex){
            console.log("Apply proxy error",ex);
        }
    }

    public static clearProxy = () => {
        chrome.proxy.settings.set({
            value: {
                mode: "direct"
            },
            scope: 'regular'
        });
    }
}