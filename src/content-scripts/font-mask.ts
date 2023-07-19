export class FontMask{
    static init(){
        this.addNoiseMethod1();
        this.addNoiseMethod2();
    }

    static getDeviceFont(deviceFonts: any[]){
        return '(' + function () {
            'use strict';
    
            function defineobjectproperty(val:any, e:any, c?:any, w?:any) {
                // Makes an object describing a property
                return {
                    value: val,
                    enumerable: !!e,
                    configurable: !!c,
                    writable: !!w
                }
            }
    
            var DEFAULT = 'auto';
            var originalStyleSetProperty = CSSStyleDeclaration.prototype.setProperty;
            var originalSetAttrib = Element.prototype.setAttribute;
            var originalNodeAppendChild = Node.prototype.appendChild;
            var FontListToUse = deviceFonts.map(function (x) {
                return x.toLowerCase();
            });
            var baseFonts = ["auto"];
            var keywords = ["inherit", "auto", "default"];
            baseFonts.push.apply(baseFonts, FontListToUse);
            baseFonts.push.apply(baseFonts, keywords);
    
            function getAllowedFontFamily(family:any) {
                var fonts = family.replace(/"|'/g, '').split(',');
                var allowedFonts = fonts.filter(function (font:any) {
                    if (font && font.length) {
                        var normalised = font.trim().toLowerCase();
                        // Allow base fonts
                        for (var allowed of baseFonts)
                            if (normalised == allowed) return true;
                        // Allow web fonts
                        // for (var allowed of document.fonts.values() as any[])
                        //     if (normalised == allowed) return true;

                    }

                    return false;

                })
                return allowedFonts.map(function (f:any) {
                    var trimmed = f.trim();
                    return ~trimmed.indexOf(' ') ? "'" + trimmed + "'" : trimmed;
                }).join(", ");
            }
    
            function modifiedCssSetProperty(this:any, key:any, val:any) {
                if (key.toLowerCase() == 'font-family') {
                    var keyresult = key.toLowerCase();
                    var allowed = getAllowedFontFamily(val);
                    var oldFF = this.fontFamily;
                    return originalStyleSetProperty.call(this, 'font-family', allowed || DEFAULT);
                }
                return originalStyleSetProperty.call(this, key, val);
            }
    
            function makeModifiedSetCssText(originalSetCssText:any) {
                return function modifiedSetCssText(this:any, css:any) {
                    var fontFamilyMatch = css.match(/\b(?:font-family:([^;]+)(?:;|$))/i);
                    if (fontFamilyMatch && fontFamilyMatch.length == 1) {
                        css = css.replace(/\b(font-family:[^;]+(;|$))/i, '').trim();
                        var allowed = getAllowedFontFamily(fontFamilyMatch[1]) || DEFAULT;
                        if (css.length && css[css.length - 1] != ';')
                            css += ';'
                        css += "font-family: " + allowed + ";"
                    }
                    return originalSetCssText.call(this, css);
                }
            }
    
            var modifiedSetAttribute = (function () {
                var innerModify = makeModifiedSetCssText(function (this:any, val:any) {
                    return originalSetAttrib.call(this, 'style', val);
                })
                return function modifiedSetAttribute(this:any, key:any, val:any) {
                    if (key.toLowerCase() == 'style') {
                        return innerModify.call(this, val);
                    }
                    return originalSetAttrib.call(this, key, val);
                }
            })();
    
            function makeModifiedInnerHTML(originalInnerHTML:any) {
                return function modifiedInnerHTML(this:any, html:any) {
                    var retval = originalInnerHTML.call(this, html);
                    recursivelyModifyFonts(this.parentNode);
                    return retval;
                }
            }
    
            function recursivelyModifyFonts(elem:any) {
                if (elem) {
                    if (elem.style && elem.style.fontFamily) {
                        modifiedCssSetProperty.call(elem.style, 'font-family', elem.style.fontFamily);
                    }
                    if (elem.childNodes)
                        elem.childNodes.forEach(recursivelyModifyFonts);
                }
                return elem;
            }
    
            function modifiedAppend(this:any, child:any) {
                child = recursivelyModifyFonts(child);
                return originalNodeAppendChild.call(this, child);
            }
    
            var success = true;
            function overrideFunc(obj:any, name:any, f:any) {
                try {
                    Object.defineProperty(obj.prototype, name, defineobjectproperty(f, true));
                } catch (e) {
                    success = false;
                }
            }
    
            function overrideSetter(obj:any, name:any, makeSetter:any) {
                try {
                    var current = Object.getOwnPropertyDescriptor(obj.prototype, name) as any;
                    current.set = makeSetter(current.set);
                    current.configurable = false;
                    Object.defineProperty(obj.prototype, name, current);
                } catch (e) {
                    success = false;
                }
            }
    
            overrideFunc(Node, 'appendChild', modifiedAppend);
            overrideFunc(CSSStyleDeclaration, 'setProperty', modifiedCssSetProperty);
            overrideFunc(Element, 'setAttribute', modifiedSetAttribute);
    
            try {
                Object.defineProperty(CSSStyleDeclaration.prototype, "fontFamily", {
                    set: function fontFamily(f) {
                        modifiedCssSetProperty.call(this, 'font-family', f);
                    },
                    get: function fontFamily() {
                        return this.getPropertyValue('font-family');
                    }
                })
            } catch (e) {
                success = false;
            }
    
            overrideSetter(CSSStyleDeclaration, 'cssText', makeModifiedSetCssText);
            overrideSetter(Element, 'innerHTML', makeModifiedInnerHTML);
            overrideSetter(Element, 'outerHTML', makeModifiedInnerHTML);
        } + ')();';
    }

    static addNoiseMethod1(){
        chrome.storage.local.get('config', (storage) => {
            const config = storage.config || {};
            var deviceFonts = config.deviceFingerPrint.Fonts || [];
            var customFontsScriptText = FontMask.getDeviceFont(deviceFonts);
            var script = document.createElement('script') as any;
            script.textContent = customFontsScriptText;
            (document.head || document.documentElement).appendChild(script)
            script.parentNode.removeChild(script)
        });
    }

    static addNoiseMethod2(){
        var inject = function () {
            var rand = {
              "noise": function () {
                var SIGN = Math.random() < Math.random() ? -1 : 1;
                return Math.floor(Math.random() + SIGN * Math.random());
              },
              "sign": function () {
                const tmp = [-1, -1, -1, -1, -1, -1, +1, -1, -1, -1];
                const index = Math.floor(Math.random() * tmp.length);
                return tmp[index];
              }
            };
            //
            Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
              get () {
                const height = Math.floor(this.getBoundingClientRect().height);
                const valid = height && rand.sign() === 1;
                const result = valid ? height + rand.noise() : height;
               
                return result;
              }
            });
            //
            Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
              get () {
                const width = Math.floor(this.getBoundingClientRect().width);
                const valid = width && rand.sign() === 1;
                const result = valid ? width + rand.noise() : width;
               
                return result;
              }
            });
            //
            document.documentElement.dataset.fbscriptallow = 'true';
          };
          
          var script_1 = document.createElement('script');
          script_1.textContent = "(" + inject + ")()";
          document.documentElement.appendChild(script_1);
          
          if (document.documentElement.dataset.fbscriptallow !== "true") {
            var script_2 = document.createElement('script');
            script_2.textContent = `{
              const iframes = window.top.document.querySelectorAll("iframe[sandbox]");
              for (var i = 0; i < iframes.length; i++) {
                if (iframes[i].contentWindow) {
                  if (iframes[i].contentWindow.HTMLElement) {
                    iframes[i].contentWindow.HTMLElement.prototype.offsetWidth = HTMLElement.prototype.offsetWidth;
                    iframes[i].contentWindow.HTMLElement.prototype.offsetHeight = HTMLElement.prototype.offsetHeight;
                  }
                }
              }
            }`;
            //
            window.top.document.documentElement.appendChild(script_2);
        }
    }
}