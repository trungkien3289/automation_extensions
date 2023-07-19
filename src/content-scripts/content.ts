import { AudioContextMask } from "./audio-context-mask";
import { AudioMask } from "./audio-mask";
import { AutomationEngine } from "./automation-engine";
import { BatteryMask } from "./battery-mask";
import { CanvasNoise } from "./canvas-noise";
import { ChangeYoutubeVideoRender } from "./change-youtube-video-render";
import { ClientRectMask } from "./client-rect-mask";
import { CPUMask } from "./cpu-mask";
import { FontMask } from "./font-mask";
import { GeoLocationMask } from "./geo-location-mask";
import { BrowserHistoryMask } from "./history-mask";
import { LanguageMask } from "./language-mask";
import { MediaDeviceMask } from "./media-device-mask";
import { NavigatorMask } from "./navigator-mask";
import { ScreenMask } from "./screen-mask";
import { TimeMask } from "./time-mask";
import { TimerNoise } from "./timer-noise";
import { UserAgentMask } from "./user-agent-mask";
import { WebGLMask } from "./webgl-mask";
import { WebRTCMask } from "./webRTC-mask";
import { YoutubeAdvTracking } from "./youtube-adv-tracking";
import { YoutubeSettingContent } from "./youtube-setting-content";
import { YoutubeSkipAd } from "./youtube-skip-ad";

export class ContentSetting {
    static init = () => {
        YoutubeSettingContent.init();
        AutomationEngine.init();
        YoutubeSkipAd.init();
        YoutubeAdvTracking.init();
    }

    static fakeFingerPrint = () => {
        WebGLMask.init();
        CPUMask.init();
        // BatteryMask.init();
        // AudioMask.init();
        NavigatorMask.init();
        MediaDeviceMask.init();
        TimerNoise.init();
        UserAgentMask.init();
        // ScreenMask.init();
        BrowserHistoryMask.init();
        WebRTCMask.init();
        ClientRectMask.init();
        // NetworkAPIMask.init();
        LanguageMask.init();
        GeoLocationMask.init();
        TimeMask.init();
        // AudioContextMask.init();
        CanvasNoise.init();
        FontMask.init();
    }
}

ContentSetting.init();