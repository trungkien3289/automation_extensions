import * as $ from "jquery";
import { ZCommandType } from "../background-scripts/z-command-type";
import { YoutubeSkipAd } from "./youtube-skip-ad";
export class AutomationEngine{
    static createXPathFromElement(el: any) {
        let nodeElem = el;
        const parts:any[] = [];
        while (nodeElem && nodeElem.nodeType === Node.ELEMENT_NODE) {
          let nbOfPreviousSiblings = 0;
          let hasNextSiblings = false;
          let sibling = nodeElem.previousSibling;
          while (sibling) {
            if (sibling.nodeType !== Node.DOCUMENT_TYPE_NODE && sibling.nodeName === nodeElem.nodeName) {
              nbOfPreviousSiblings++;
            }
            sibling = sibling.previousSibling;
          }
          sibling = nodeElem.nextSibling;
          while (sibling) {
            if (sibling.nodeName === nodeElem.nodeName) {
              hasNextSiblings = true;
              break;
            }
            sibling = sibling.nextSibling;
          }
          const prefix = nodeElem.prefix ? nodeElem.prefix + ':' : '';
          const nth = nbOfPreviousSiblings || hasNextSiblings ? `[${nbOfPreviousSiblings + 1}]` : '';
          parts.push(prefix + nodeElem.localName + nth);
          nodeElem = nodeElem.parentNode;
        }
        return parts.length ? '/' + parts.reverse().join('/') : '';
    }
    
    static lookupElementByXPath(path: string) { 
        try{
            return  document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        }catch(ex){
            return null;
        }
    } 

    static getElementAttrs(el: any) {
        var attributes: any = {};
        [].slice.call(el.attributes).map((attr: any) => {
            attributes[attr.name] = attr.value;
        });
        return attributes;
    }
    
    static getTabImageBlob (x: number,y: number,w: number,h: number) {
        let canvas: any = window.document.createElementNS("http://www.w3.org/1999/xhtml", "canvas");
        canvas.style.width = w + "px";
        canvas.style.height = h + "px";
        canvas.width = w;
        canvas.height = h;
    
        let ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, w, h);
        ctx.save();
        ctx.drawWindow(document.defaultView, x, y, w, h, "rgba(255, 255, 255, 0)");
        ctx.restore();
    
        let data = canvas.toDataURL("image/png");
        data = atob(data.split(',', 2)[1]);
        data = Uint8Array.from(data, (ch: any) => ch.charCodeAt(0));
        return new Blob([data], {type: 'image/png'});
    };

    static init(){
        $(document).ready(function($){
            chrome.runtime.onMessage.addListener(function (data, sender, sendResponse) {
                console.log("begine handler command");
                switch (data.command) {
                    case ZCommandType.CLICK_ELEMENT:{
                        try{
                            console.log("click element");
                            if($(data.selector).length == 0){
                                throw "Cannot found element";
                            }
                            let el = $(data.selector)[0];
                            AutomationEngine.fire(el, 'mouseover');
                            AutomationEngine.fire(el, 'mousedown');
                            // el.click();
                            AutomationEngine.fire(el, 'click');
                            AutomationEngine.fire(el, 'mouseup');
                            // el.focus();
                            // el.click();
                            // $(data.selector)[0].focus();
                            // $(data.selector)[0].click();
                            sendResponse({
                                isSuccess: true,
                                errorMessage: "",
                            });
                        }catch(e){
                            console.log("Automation error:", "click action error", e);
                            console.log(e);
                            sendResponse({
                                isSuccess: false,
                                errorMessage: e,
                            });
                        }
                        break;
                    }
                    case ZCommandType.SEND_TEXT:{
                        try{
                            // console.log("send text");
                            // if($(data.selector).length == 0){
                            //     throw "Cannot found element";
                            // }
                            // $($(data.selector)[0]).focus();
                            // $($(data.selector)[0]).val(data.text);
                            // sendResponse({
                            //     isSuccess: true,
                            //     errorMessage: "",
                            // });

                            const el = document.querySelector(data.selector) as any;
                            if (!el) throw new Error(`type: No element matches '${data.selector}'`);
                            el.focus();
                            el.value = '';
                            const array = data.text.split('');
                            AutomationEngine.step(el, array, function(){
                                sendResponse({
                                    isSuccess: true,
                                    errorMessage: "",
                                });
                            });
                        }catch(e){
                            console.log("Automation error:", "send text action error", e);
                            console.log(e);
                            sendResponse({
                                isSuccess: false,
                                errorMessage: e,
                            });
                        }
                        break;
                    }
                    case ZCommandType.EXECUTE_SCRIPT:{
                        try{
                            console.log("execute script");
                            var result = eval(data.script);
                            sendResponse({
                                isSuccess: true,
                                errorMessage: "",
                                data: result
                            });
                        }catch(e: any){
                            console.log("Automation error:", "execute script action error", e);
                            console.log(e);
                            sendResponse({
                                isSuccess: false,
                                errorMessage: e.message,
                            });
                        }
                        break;
                    }
                    case ZCommandType.SCROLL_TOP:{
                        try{
                            $("html, body").stop().animate({ scrollTop: data.offsetTop }, 600);
                        }catch(e){
                            console.log("Automation error:", "scroll top action error", e);
                            console.log(e);
                        }
                        break;
                    }
                    case ZCommandType.QUERY_SELECTOR_ALL:{
                        try{
                            console.log("query selector all");
                            var elements = window.top?.document.querySelectorAll(data.selector);
                            console.log("query selector all result: ", elements);
                            var results:any[] = [];
                            if(elements != null && elements.length > 0){
                                for (let i = 0; i < elements.length; i++) {
                                    const domElement = elements[i];
                                    results.push({
                                        XPath: AutomationEngine.createXPathFromElement(domElement)
                                        // Attributes: getElementAttrs(domElement)
                                    })
                                }
                            }
        
                            sendResponse({
                                isSuccess: true,
                                errorMessage: "",
                                data: results
                            });
                        }catch(e: any){
                            console.log("Automation error:", "query selector all action error", e);
                            console.log(e);
                            sendResponse({
                                isSuccess: false,
                                errorMessage: e.message
                            });
                        }
                        break;
                    }
                    case ZCommandType.GET_ATTRIBUTE_BY_XPATH:{
                        try{
                            console.log("get attribute by xpath");
                            var element: any = AutomationEngine.lookupElementByXPath(data.xpath);
                            if(element == null) throw "Cannot found element";
                            var value = element.getAttribute(data.attributeName);
                            sendResponse({
                                isSuccess: true,
                                errorMessage: "",
                                data: value
                            });
                        }catch(e){
                            console.log("Automation error:", "get attribute by xpath action error", e);
                            console.log(e);
                            sendResponse({
                                isSuccess: false,
                                errorMessage: e
                            });
                        }
                        break;
                    }
                    case ZCommandType.CLICK_ELEMENT_BY_XPATH:{
                        try{
                            console.log("click element by xpath");
                            var element: any = AutomationEngine.lookupElementByXPath(data.xpath);
                            if(element == null) throw "Cannot found element";
                            // element.click();
                            AutomationEngine.fire(element, 'mouseover');
                            AutomationEngine.fire(element, 'mousedown');
                            // element.click();
                            AutomationEngine.fire(element, 'click');
                            AutomationEngine.fire(element, 'mouseup');
                            sendResponse({
                                isSuccess: true,
                                errorMessage: ""
                            });
                        }catch(e){
                            console.log("Automation error:", "click element by xpath action error", e);
                            console.log(e);
                            sendResponse({
                                isSuccess: false,
                                errorMessage: e
                            });
                        }
                        break;
                    }
                    case ZCommandType.FOCUS_ELEMENT:{
                        try{
                            console.log("focus element action");
                            var element: any = AutomationEngine.lookupElementByXPath(data.xpath);
                            if(element == null) throw "Cannot found element";
                            element.focus();
                            sendResponse({
                                isSuccess: true,
                                errorMessage: ""
                            });
                        }catch(e){
                            console.log("Automation error:", "focus element action error", e);
                            console.log(e);
                            sendResponse({
                                isSuccess: false,
                                errorMessage: e
                            });
                        }
                        break;
                    }
                    case ZCommandType.SEND_TEXT_BY_XPATH:{
                        try{
                            console.log("send text by xpath");
                            var element: any = AutomationEngine.lookupElementByXPath(data.xpath);
                            if(element == null) throw "Cannot found element";
                            $(element).focus();
                            $(element).val(data.text);
                            sendResponse({
                                isSuccess: true,
                                errorMessage: ""
                            });
                        }catch(e){
                            console.log("Automation error:", "send text by xpath action error", e);
                            console.log(e);
                            sendResponse({
                                isSuccess: false,
                                errorMessage: e
                            });
                        }
                        break;
                    }
                    case ZCommandType.WAIT_FOR_DOCUMENT_READY:{
                        try{
                            console.log("wait for document ready");
                            var isDocumentReady = document.readyState == 'complete';
                            sendResponse({
                                isSuccess: true,
                                errorMessage: "",
                                data: isDocumentReady
                            });
                        }catch(e){
                            console.log("Automation error:", "wait for document ready error", e);
                            console.log(e);
                            sendResponse({
                                isSuccess: false,
                                errorMessage: e
                            });
                        }
                        break;
                    }
                    case ZCommandType.WAIT_FOR_ELEMENT_VISIBLE:{
                        try{
                            console.log("wait for element visible");
                            var found = $(data.elementSelector);
                            if(found.length > 0) {
                                sendResponse({
                                    isSuccess: true,
                                    errorMessage: "",
                                    data: true
                                });
                            }else{
                                sendResponse({
                                    isSuccess: true,
                                    errorMessage: "",
                                    data: false
                                });
                            }
                        }catch(e){
                            console.log("Automation error:", "wait for element visible action error", e);
                            console.log(e);
                            sendResponse({
                                isSuccess: false,
                                errorMessage: e
                            });
                        }
                        break;
                    }
                    case ZCommandType.WAIT_FOR_ELEMENT_VISIBLE_BY_XPATH:{
                        try{
                            console.log("wait for element visible by xpath");
                            var element: any = AutomationEngine.lookupElementByXPath(data.xpath);
                            if(element != null) {
                                sendResponse({
                                    isSuccess: true,
                                    errorMessage: "",
                                    data: true
                                });
                            }else{
                                sendResponse({
                                    isSuccess: true,
                                    errorMessage: "",
                                    data: false
                                });
                            }
                        }catch(e){
                            console.log("Automation error:", "wait for element visible by xpath action error", e);
                            console.log(e);
                            sendResponse({
                                isSuccess: false,
                                errorMessage: e
                            });
                        }
                        break;
                    }
                    case ZCommandType.GET_ELEMENT_FROM_POINT:{
                        try{
                            console.log("get attribute by xpath");
                            var element: any = document.elementFromPoint(data.x, data.y);
                            if(element == null) throw "Cannot found element";
                            var xpath = AutomationEngine.createXPathFromElement(element);
                            sendResponse({
                                isSuccess: true,
                                errorMessage: "",
                                xpath: xpath
                            });
                        }catch(e){
                            console.log("Automation error:", "get attribute by xpath action error", e);
                            console.log(e);
                            sendResponse({
                                isSuccess: false,
                                errorMessage: e
                            });
                        }
                        break;
                    }
                    case ZCommandType.CLICK_ELEMENT_FROM_POINT:{
                        try{
                            console.log("Click element from point");
                            var element: any = window.top?.document.elementFromPoint(data.x, data.y);
                            if(element == null) throw "Cannot found element";
                            console.log("Found element: ",element);
                            element.click();
                            sendResponse({
                                isSuccess: true,
                                errorMessage: "",
                            });
                        }catch(ex: any){
                            console.log("Automation error:", "Click element from point action error", ex);
                            sendResponse({
                                isSuccess: false,
                                errorMessage: ex.message
                            });
                        }
                        break;
                    }
                    case ZCommandType.CAPTURE_SCREEN:{
                        try{
                            const doc = document;
                            const del = doc.documentElement;
                            let w: any = doc.defaultView;
        
                            let imageBlob = AutomationEngine.getTabImageBlob(w.scrollX, w.scrollY,
                                Math.min(w.innerWidth, del.clientWidth),
                                Math.min(w.innerHeight,del.clientHeight));
        
                            sendResponse({
                                isSuccess: true,
                                errorMessage: "",
                                imageBlob: imageBlob,
                            });
                        }catch(ex){
                            console.log("Automation error:", "capture screen error", ex);
                            sendResponse({
                                isSuccess: false,
                                errorMessage: ex
                            });
                        }
                        break;
                    }
                    case ZCommandType.SET_AUTO_CLOSE_YOUTUBE_ADS_SETTING:{
                        try{
                            console.log("Set auto close youtube ads setting");
                            YoutubeSkipAd.enable(data.enabled, data.closeAfterSeconds);
                            sendResponse({
                                isSuccess: true,
                                errorMessage: "",
                            });
                            
                        }catch(ex: any){
                            console.log("Automation error:", "Set auto close youtube ads setting action error", ex);
                            console.log(ex);
                            sendResponse({
                                isSuccess: false,
                                errorMessage: ex.message
                            });
                        }
                        break;
                    }
                    case ZCommandType.CAPTURE_PAGE:{
                        try{
                            const doc = document;
                            const del = doc.documentElement;
                            let w: any = doc.defaultView;
        
                            let imageBlob = AutomationEngine.getTabImageBlob(w.scrollX, w.scrollY,
                                Math.min(w.innerWidth, del.clientWidth),
                                Math.min(w.innerHeight,del.clientHeight));
        
                            sendResponse({
                                isSuccess: true,
                                errorMessage: "",
                                imageBlob: imageBlob,
                            });
                        }catch(ex: any){
                            console.log("Automation error:", "capture screen error", ex);
                            sendResponse({
                                isSuccess: false,
                                errorMessage: ex.message
                            });
                        }
                        break;
                    }
                    case ZCommandType.SCROLL_TO_ELEMENT:{
                        try{
                            let element = document.querySelector(data.selector);
                            if(element == null) throw "SCROLL_TO_ELEMENT error, cannot found element";
                                AutomationEngine.scrollToElement(element, data.offsetHeight);
                        }catch(e){
                            console.log("Automation error:", "scroll to element action error", e);
                            console.log(e);
                        }
                        break;
                    }
                    case ZCommandType.SCROLL_TO_ELEMENT_BY_XPATH:{
                        try{
                            var element: any = AutomationEngine.lookupElementByXPath(data.xpath);
                            if(element == null) throw "Cannot found element";
                            AutomationEngine.scrollToElement(element, data.offsetHeight);
                        }catch(e){
                            console.log("Automation error:", "scroll to element by xpath action error", e);
                            console.log(e);
                        }
                        break;
                    }
                
                    default:
                        break;
                }
        
                return true;
                
            });
        });
    }

    //#region Typing string in input functions
    static letter = (el: any, a: any) => {
        const keyCode = a.charCodeAt(0);
        el.dispatchEvent(new KeyboardEvent('keydown', { keyCode }));
        el.dispatchEvent(new KeyboardEvent('keypress', { keyCode }));
        el.value += a;
        el.dispatchEvent(new Event('input'));
        el.dispatchEvent(new KeyboardEvent('keyup', { keyCode }));
    }

    static step = (el: any, array: any[], ok: any) => {
        const a = array.shift();
        if (a) {
            AutomationEngine.letter(el, a);
            setTimeout(() => {AutomationEngine.step(el, array, ok)}, 100);
        } else {
            el.dispatchEvent(new Event('change'));
            ok();
        }
    }

    static fire = (element: any, name: any) => {
        const ev = new MouseEvent(name, {
          cancellable: true,
          bubbles: true,
        } as any);
        element.dispatchEvent(ev);
    }

    //#endregion

    //#region 
    static scrollToElement = (element: any, offsetHeight: number) => {
        try{
            let offsetHeightArray = AutomationEngine.findPosition(element) as any;
            let realScrollHeight = offsetHeightArray[0] - Math.round(element.clientHeight/2) - offsetHeight;
            window.scrollTo(0, realScrollHeight);
        }catch(ex){

        }
    }
    static findPosition = (obj: any) => {
        var currenttop = 0;
        if (obj.offsetParent) {
            do {
                currenttop += obj.offsetTop;
            } while ((obj = obj.offsetParent));
            return [currenttop];
        }

        return [0];
    }
    //#endregion
}