export class SettingModel {
    id: string = "";
    name: string = "";

    //#region Device
    fakeCPU: boolean = true;
    fakeBattery: boolean = true;
    enableAudioApi: boolean = true;
    enablePlugins: boolean = false;
    enableMediaPlugins: boolean = false;
    //#endregion Device

    //#region FingerPrint
    fakeWebGL: boolean = true;
    fakeClientRects: boolean = true;
    browserplugsMagicBPhash: boolean = false;
    fakeCanvas: boolean = true;
    //#endregion FingerPrint

    browserplugsenabled:boolean = true;
    userAgentEnable:boolean = true;
    userAgent: string = "";
    geoIpEnabled: boolean = false;
    deviceFingerPrint: any;
    canvasNoise: any;

    randomTimersEnabled: boolean = true;
    fontEnabled: boolean = true;
    deviceFont: boolean = true;
    appVersion: string = "";
    vendor: string = "";
    platform: string = "";
    screen: any = {};
    historyLength: number = 0;
    fakeWebRTC: boolean = true;
    enableNetwork: boolean = true;
    enableFakeLanguage : boolean = true;
    language: string = "";
    proxyEnabled: boolean = true;

    proxies: any[] = [];
    byPassProxySites: any[] = [];

     // Close youtube ads setting
     enableAutoCloseYoutubeAds: boolean = true;
     closeAdsAfterSeconds: number = 1;
     enableSpeedUpStream : boolean = false;
}