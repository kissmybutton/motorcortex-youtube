!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t(require("@donkeyclip/motorcortex")):"function"==typeof define&&define.amd?define(["@donkeyclip/motorcortex"],t):(e="undefined"!=typeof globalThis?globalThis:e||self)["@kissmybutton/motorcortex-youtube"]=t(e.MotorCortex)}(this,(function(e){"use strict";class t extends e.BrowserClip{get html(){return this.width=this.attrs.width||640,this.height=this.attrs.height||360,this.startFrom=this.attrs.startFrom||0,"\n      <div></div>\n    "}get css(){return"\n      #video{\n        display:none;\n      }\n    "}subscribeVideoListener(e){this.subscribers||(this.subscribers=[]),this.subscribers.push(e)}setVolume(e){this.entity.player.setVolume(100*e*(this.attrs.volume||1))}onAfterRender(){this.contextLoading();const e=this;let t;const i={player:t,startFrom:this.startFrom,loaded:!1,subscribeVideoListener:t=>e.subscribeVideoListener(t)};this.entity=i,this.setCustomEntity("video",i);const s=this.context.document.createElement("script");s.src="https://www.youtube.com/iframe_api",this.context.rootElement.appendChild(s),window.onYouTubeIframeAPIReady=()=>{t=new window.YT.Player(this.context.getElements("div")[0],{height:this.attrs.height,width:this.attrs.width,videoId:this.attrs.videoId,playerVars:{controls:0,playsinline:0,disablekb:1,enablejsapi:1,fs:0,iv_load_policy:3,modestbranding:1,rel:0,showinfo:0,ecver:2,start:this.startFrom/1e3},events:{onReady:()=>{i.loaded=!0,i.player=t;const s=e.DescriptiveIncident.volumeChangeSubscribe(e.id,e.setVolume.bind(e));e.setVolume(s),e.contextLoaded()},onStateChange:function(t){if(e.subscribers)for(let i=0;i<e.subscribers.length;i++)e.subscribers[i](t.data)}}})}}}class i extends e.MediaPlayback{onInitialise(){this.element.entity.subscribeVideoListener(this.stateChange.bind(this))}play(e){const t=this.element.entity,i=t.player.getPlayerState();return-1===i||3===i?(t.player.seekTo((e+this.element.entity.startFrom)/1e3),t.player.playVideo(),this.waitingHandler()):(1!==i&&(t.player.seekTo((e+this.element.entity.startFrom)/1e3),t.player.playVideo()),!0)}stateChange(e){switch(e){case 3:this.waitingHandler();break;case 1:this.canplayHandler()}}waitingHandler(){this.setBlock("Video loading",{exceptional:!0})}canplayHandler(){this.unblock()}stop(){this.element.entity.player.pauseVideo()}onProgress(e,t){const i=t+this.element.entity.startFrom;-1!==this.element.entity.player.getPlayerState()&&5!==this.element.entity.player.getPlayerState()||this.element.entity.player.pauseVideo(),this.element.entity.player.seekTo(i/1e3)}}return{npm_name:"@kissmybutton/motorcortex-youtube",version:"1.2.0",incidents:[{exportable:i,name:"Playback"}],Clip:{exportable:t,attributesValidationRules:{width:{optional:!0,type:"number",integer:!0,positive:!0},height:{optional:!0,type:"number",integer:!0,positive:!0},startFrom:{optional:!0,type:"number",integer:!0,min:0},videoId:{type:"string"},volume:{type:"number",min:0,max:1,default:1}}},capabilities:{speed:!1,preview:!1},audio:"on"}}));
