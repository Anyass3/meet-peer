"use strict";function _typeof(t){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function _defineProperty(t,r,e){return r in t?Object.defineProperty(t,r,{value:e,enumerable:!0,configurable:!0,writable:!0}):t[r]=e,t}function _toConsumableArray(t){return _arrayWithoutHoles(t)||_iterableToArray(t)||_unsupportedIterableToArray(t)||_nonIterableSpread()}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _iterableToArray(t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}function _arrayWithoutHoles(t){if(Array.isArray(t))return _arrayLikeToArray(t)}function _slicedToArray(t,r){return _arrayWithHoles(t)||_iterableToArrayLimit(t,r)||_unsupportedIterableToArray(t,r)||_nonIterableRest()}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _unsupportedIterableToArray(t,r){if(t){if("string"==typeof t)return _arrayLikeToArray(t,r);var e=Object.prototype.toString.call(t).slice(8,-1);return"Object"===e&&t.constructor&&(e=t.constructor.name),"Map"===e||"Set"===e?Array.from(t):"Arguments"===e||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e)?_arrayLikeToArray(t,r):void 0}}function _arrayLikeToArray(t,r){(null==r||r>t.length)&&(r=t.length);for(var e=0,n=new Array(r);e<r;e++)n[e]=t[e];return n}function _iterableToArrayLimit(t,r){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(t)){var e=[],n=!0,o=!1,i=void 0;try{for(var a,u=t[Symbol.iterator]();!(n=(a=u.next()).done)&&(e.push(a.value),!r||e.length!==r);n=!0);}catch(t){o=!0,i=t}finally{try{n||null==u.return||u.return()}finally{if(o)throw i}}return e}}function _arrayWithHoles(t){if(Array.isArray(t))return t}var _$=function t(r,e){return{__init__:function(r,e){var n=this;if(this.Type="abqueryObject",t.is_proto(r))return r;if(t.typeof(r,"function"))return t.ready(r);if(this.num=1,this.__query__=document,e&&t.typeof(e,"number")?this.num=e:e&&t.is_html(e)&&(this.__query__=e),this.query=r||document,this.new=t.typeof(r,"string")&&t.is_new(r),this.new||t.is_html(this.query))(this.num>1||t.is_array(this.query))&&(this.many=!0),t.is_html(this.query)?this.$$=this.query:(this.$$=_toConsumableArray(Array(this.num).keys()).reduce((function(t){return[].concat(_toConsumableArray(t),[document.createElement(n.query.slice(1,-1))])}),[]),1===this.num&&(this.$$=this.$$[0]));else{var o,i=_slicedToArray(t.clean(this.query,!0),2),a=i[0],u=i[1];u?(o=function(t){return n.__query__.querySelectorAll(t)},this.many=!0):o=function(t){return n.__query__.querySelector(t)},t.is_array(a)?(this.$$=a.reduce((function(t,r){return[].concat(_toConsumableArray(t),u?_toConsumableArray(o(r)):[o(r)])}),[]),this.many=!0):this.$$=o(a)}return this.arr=Array.from(this.many?this.$$:[this.$$]),this.__get__(this.arr),this.__html_proto__(["id"])},__get__:function(r,e){var n=this;if(t.is_array(t.clean(r))||t.is_array(r)){r=Object.assign(t.is_array(r)?r:t.clean(r));var o=function(e){t.__get__(n,e,(function(){return t(r[e])}))};for(var i in r)o(i)}else for(var a in t.typeof(r,"string")&&e&&(r=_defineProperty({},r,e)),r)t.__set__(this,a,r[a]);return this},__set__:function(r,e){for(var n in t.typeof(r,"string")&&e&&(r=_defineProperty({},r,e)),r)t.__set__(this,n,r[n]);return this},__define_prop__:function(r){var e=this,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{_get:function(){return e.prop(prop)},_set:function(t){return e.prop(prop,t)}};for(var o in t.typeof(r,"string")&&n&&(r=_defineProperty({},r,n)),r)t.__define_prop__(this,o,r[o]);return this},__html_proto__:function(){var t=this,r=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];return this.__define_prop__([].concat(_toConsumableArray(Object.keys(HTMLElement.prototype)),_toConsumableArray(r)).filter((function(t){return!/^on/.test(t)})).reduce((function(r,e){return["click","style","focus","blur"].includes(e)?Object.assign({},r):Object.assign({},r,_defineProperty({},e,{_get:function(){return t.prop(e)},_set:function(r){return t.prop(e,r)}}))}),{}))},show:function(){var t=this,r=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=r.cls,n=void 0===e?"":e,o=r.animate,i=void 0===o?"abquery-show":o,a=r.delay,u=void 0===a?600:a,s=r.keep,c=void 0!==s&&s,_=arguments.length>1&&void 0!==arguments[1]?arguments[1]:function(){};return n?this.addClass(n):this.rmClass("abquery-d-none, d-none").rmCss("display"),this.addClass(i),setTimeout((function(){c||t.rmClass(i)}),u),_(),this},hide:function(){var t=this,r=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=r.cls,n=void 0===e?"":e,o=r.animate,i=void 0===o?"abquery-hide":o,a=r.delay,u=void 0===a?600:a,s=r.keep,c=void 0!==s&&s,_=arguments.length>1&&void 0!==arguments[1]?arguments[1]:function(){};return this.addClass(i),setTimeout((function(){n?t.rmClass(n):t.addClass("abquery-d-none"),c||t.rmClass(i)}),u),_(),this},toggleDisplay:function(){var r=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=e.cls,o=void 0===n?"":n;return this.run((function(e){t(e).hasClass(o||["abquery-d-none","d-none"],{someClass:!0})?r.show({cls:o}):r.hide({cls:o})}))},addClass:function(t){return this.$run((function(t,r){r.trim()&&t.classList.add(r)}),t)},hasClass:function(t){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},e=r.someClass,n=void 0!==e&&e,o=r.someEl,i=void 0!==o&&o,a=function(t,r){return t.classList.contains(r)};return this.$runBool(a,t,{someArr:n,someEl:i})},rmClass:function(t){return this.$run((function(t,r){r.trim()&&t.classList.remove(r)}),t)},toggleClass:function(t){return this.$run((function(t,r){t.classList.toggle(r)}),t)},css:function(r,e){var n=arguments.length>2&&void 0!==arguments[2]&&arguments[2],o=function(t){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"!";return[t.split(r)[0].trim(),n||!!t.split(r)[1]]};return this.$set((function(e,n,i){if(t.is_array(t.clean(r))||void 0===i)return e.style.getPropertyValue(n);var a=_slicedToArray(t.typeof(i,"number")?[i,!1]:o(i),2),u=a[0],s=a[1];e.style.setProperty(n,u,s?"important":"")}),r,e)},rmCss:function(t){return this.$run((function(t,r){t.style.removeProperty(r)}),t)},attr:function(r,e){return this.$set((function(e,n,o){if(t.is_array(t.clean(r))||void 0===o)return e.getAttribute(n);e.setAttribute(n,o)}),r,e)},rmAttr:function(t){return this.$run((function(t,r){t.removeAttribute(r)}),t)},appendParent:function(r){return this.$run((function(r,e){t.e(e).appendChild(r)}),r)},detachParent:function(){return this.run((function(t){t.parentNode.removeChild(t)}))},append:function(r){return this.$run((function(r,e){r.appendChild(t.e(e))}),r)},detach:function(r){return this.$run((function(r,e){r.removeChild(t.e(e))}),r)},index:function(r){var e=this.arr.indexOf(t.e(r));return e>=0?e:Error(console.error("cannot find index of arg"))},run:function(t){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},e=r.delay,n=void 0===e?0:e,o=r.every,i=void 0===o?0:o,a=this.arr;return i?setInterval((function(){return a.forEach(t)}),i):n?setTimeout((function(){return a.forEach(t)}),n):a.forEach(t),this},$run:function(r,e){var n=this;return e=t.clean(e),t.is_array(e)||(e=[e]),e.forEach((function(t){return n.run((function(e){return r(e,t)}))})),this},$runBool:function(r,e){var n=this,o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},i=o.someArr,a=void 0!==i&&i,u=o.someEl,s=void 0!==u&&u;t.is_array(e)||(e=[e]);var c=function(t){return s?n.arr.some((function(e){return r(e,t)})):n.arr.every((function(e){return r(e,t)}))};return a?e.some(c):e.every(c)},$set:function(r,e,n){var o=[];e=t.clean(e);var i=t.typeof(e,"string");return this.run((function(a){if(t.is_dict(e))for(var u in e)r(a,u,e[u]);else t.is_array(e)||void 0===n?(i&&(e=[e]),o=[].concat(_toConsumableArray(o),_toConsumableArray(e.reduce((function(t,e){return[].concat(_toConsumableArray(t),[r(a,e)])}),[])))):r(a,e,n)})),(t.is_array(e)||i)&&void 0===n?1===this.arr.length&&i?o[0]:o:this},prop:function(r,e){return this.$set((function(e,n,o){if(t.is_array(t.clean(r))||void 0===o)return e[n];try{e[n]=o}catch(t){console.error(t)}}),r,e)},get class(){return this.prop("className")},get parent(){return t(this.arr[0].parentNode)},get parents(){var r=Array.from(this.arr.reduce((function(t,r){return t.add(r.parentNode)}),new Set));return t(r)},get child(){return t(this.arr[0].firstElementChild)},get children(){var r=this.arr.reduce((function(t,r){return[].concat(_toConsumableArray(t),_toConsumableArray(Array.from(r.children)))}),[]);return t(r)},get len(){return this.arr.length},get html(){return this.prop("innerHTML")},get text(){return this.prop("textContent")},get val(){var r=t.form_data(this.$$),e=Object.keys(r);return 1===e.length?r[e[0]]:r},set class(t){this.prop("className",t)},set html(t){this.prop("innerHTML",t)},set text(t){this.prop("textContent",t)},set val(r){this.run((function(e){e[t.form_value(e,!0)]=r}))},on:function(r,e){return this.$run((function(r,n){t.on(n,e,r)}),r)},hover:function(t){return this.on("mouseover,mouseout",t)},click:function(t){return this.on("click",t)},debounce:function(r,e,n){return t.typeof(r,"function")&&(void 0===e||t.typeof(e,"number"))?this.run(t.debounce(r,e)):this.on(r,t.debounce(e,n))},throttle:function(r,e,n){return t.typeof(r,"function")&&(void 0===e||t.typeof(e,"number"))?this.run(t.throttle(r,e)):this.on(r,t.throttle(e,n))},$:function(r,e){if(t.is_new(r))return this.$new(r,e);var n=Array.from(this.arr.reduce((function(e,n){return new Set([].concat(_toConsumableArray(e),_toConsumableArray(t(r,n).arr)))}),new Set)).filter((function(t){return null!==t}));if(!n)throw Error("query:".concat(r," is not in parent/s"));return 1===n.length?t(n[0]):t(n)},$new:function(r,e){var n=t(r,e);return this.append(n.$$),n}}.__init__(r,e)};_$.is_proto=function(t){return!!t&&t.Type===_$().Type},_$.is_array=function(t){return!!t&&([].__proto__===t.__proto__||NodeList===t.__proto__.constructor)},_$.is_html=function(t){var r=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];if(!t)return!1;var e=function(t){return t.__proto__.constructor.toString().includes("HTML")};return r?(_$.is_array(t)||(t=[t]),e(t[0])):e(t)},_$.is_new=function(t){return _$.typeof(t,"string")&&/^<[a-z]+>$/.test(t)},_$.typeof=function(t,r){return _typeof(t)===r},_$.is_dict=function(t){if(!t)return!1;return{}.__proto__===t.__proto__},_$.__get__=function(t,r,e){var n=_$.typeof(e,"function")?e:function(){return e};return Object.defineProperty(t,r,{get:n})},_$.__set__=function(t,r,e){return Object.defineProperty(t,r,{set:e})},_$.__define_prop__=function(t,r,e){var n=e._get,o=e._set,i=_$.typeof(n,"function")?n:function(){return n};return Object.defineProperty(t,r,{get:i,set:o})},_$.obj_text=function(t){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"";for(var e in t)r+="".concat(e,": ").concat(t[e],"; ").trim();return r},_$.clean=function(t){var r=arguments.length>1&&void 0!==arguments[1]&&arguments[1];if(_$.is_array(t))t=t.toString();else if(!_$.typeof(t,"string"))return t;var e=!1;return"*"===t[0]&&(t=t.slice(1),e=!0),t=1===(t=t.split(",").reduce((function(t,r){return[].concat(_toConsumableArray(t),[r.trim()])}),[])).length?t[0]:t,r?[t,e]:t},_$.e=function(t){return _$.is_proto(t)?t.$$:t},_$.form_data=function(t){return _$.is_array(t)||(t=[t]),Array.from(t).reduce((function(t,r){var e=_$.form_value(r);return null===e||"submit"===r.type?t:Object.assign({},t,_defineProperty({},r.name||r.id,e))}),{})},_$.form_value=function(t){var r=arguments.length>1&&void 0!==arguments[1]&&arguments[1];return"INPUT"===t.tagName||"TEXTAREA"===t.tagName?["radio","checkbox"].includes(t.type)?r?"checked":t.checked:"file"===t.type?!0===t.multiple?r?"files":t.files:r?"files[0]":t.files[0]:r?"value":t.value:"SELECT"===t.tagName?r?"select.option.selected":Array.from(t.options).filter((function(t){return t.selected})).map((function(t){return t.value})):null},_$.debounce=function(t){var r,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:2e3;return function(){for(var n=arguments.length,o=new Array(n),i=0;i<n;i++)o[i]=arguments[i];r&&clearTimeout(r),r=setTimeout((function(){t.apply(void 0,o)}),e)}},_$.throttle=function(t){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:2e3,e=0;return function(){var n=(new Date).getTime();if(!(n-e<r))return e=n,t.apply(void 0,arguments)}},_$.styleElementId="abquery-stylesheet",_$.css_prefix=function(t){return["","-webkit-","-moz-"].reduce((function(r,e){return r+"".concat(e).concat(t.trim(),";")}),"")},_$.init_style_defaults=function(){if(!_$("abquery-init_style_defaults").$$){var t="".concat(_$.css_prefix("animation: abquery-keyframe-show .6s cubic-bezier(0, 0.9, 0.3, 1.2) forwards"),"\n        opacity: 0;").concat(_$.css_prefix("transform: translateY(-4rem) scale(.8)")),r="0% {".concat(_$.css_prefix("transform: scale(1)"),"opacity: 1;}\n        20%{").concat(_$.css_prefix("transform: scale(.9)"),"} 100% {").concat(_$.css_prefix("transform: none"),"opacity: 0;}");return _$.add_keyframes("abquery-keyframe-show","100%{opacity: 1;".concat(_$.css_prefix("transform: none"),"}")),_$.add_style(".abquery-show",t),_$.add_keyframes("abquery-keyframe-hide",r),_$.add_style(".abquery-hide","".concat(_$.css_prefix("animation: abquery-keyframe-hide .6s ease-out"))),_$.add_style(".abquery-d-none","display:none !important").attr("abquery-init_style_defaults",!0)}},_$.gen_frames=function(t,r){return"\n        @keyframes ".concat(t," {").concat(r,"}\n        @-webkit-keyframes ").concat(t," {").concat(r,"}\n        ")},_$.get_styles=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:_$.styleElementId,r=_$("#".concat(t));return r.$$||(r=_$.new("style").attr({type:"text/css",id:"".concat(t)})),r},_$.add_keyframes=function(t,r){var e=arguments.length>2&&void 0!==arguments[2]?arguments[2]:_$.styleElementId,n=_$.get_styles(e);return n.appendParent(document.head).html+=_$.gen_frames(t,r),n},_$.add_style=function(t,r,e){var n=_$.get_styles(e);return n.appendParent(document.head).html+="".concat(t," {").concat(r,"}"),n},_$.on=function(t,r){var e=arguments.length>2&&void 0!==arguments[2]?arguments[2]:document;return e.addEventListener(t,r)},_$.ready=function(t){_$.on("DOMContentLoaded",t)},_$.new=function(t,r){return _$("<".concat(t,">"),r)},_$.id=function(t){return _$(t.toString().split(",").reduce((function(t,r){return[].concat(_toConsumableArray(t),["#"+r.trim()])}),[]).toString())},_$.cls=function(t){return _$("*"+t.toString().split(",").reduce((function(t,r){return[].concat(_toConsumableArray(t),["."+r.trim()])}),[]).toString())},_$.attrs=function(t){return _$("*"+t.toString().split(",").reduce((function(t,r){return[].concat(_toConsumableArray(t),["["+r.trim()+"]"])}),[]).toString())},window.$=_$,_$.init_style_defaults();