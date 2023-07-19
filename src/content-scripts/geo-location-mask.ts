export class GeoLocationMask{
    static init(){
        let lat: string = "35.159225299999996";
        let lon: string = "-98.44228709999999";
        let scripts = document.getElementsByTagName('script');

        for (let i = 0; i < scripts.length; i++) {
            if (scripts[i].text.indexOf("coords") !== -1) {
                scripts[i].text = scripts[i].text.replace(/position\.coords\.latitude/g, lat);
                scripts[i].text = scripts[i].text.replace(/position\.coords\.longitude/g, lon);
                scripts[i].text = scripts[i].text.replace(/coords\.latitude/g, lat);
                scripts[i].text = scripts[i].text.replace(/coords\.longitude/g, lon);
            }
        }

        let script = document.createElement('script');
        script.innerHTML = 'navigator.geolocation.getCurrentPosition=function(a,b){a({coords:{latitude:' + lat + ',longitude:' + lon + '},timestamp:Date.now()})};var position={coords:{latitude:' + lat + ',longitude:' + lon + '}};';
        document.head.insertBefore(script, document.head.firstChild);
    }
}