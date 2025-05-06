import '../utils/webaudio-controls.js'

const getBaseURL = () => {
  const base = new URL('.', import.meta.url);
  return `${base}`;
};
export default class CollisionDriveGui extends HTMLElement {
  constructor(plug) {

    super();
    this._plug = plug;
    this._plug.gui = this;
    console.log(this._plug);

    this._root = this.attachShadow({ mode: 'open' });
    this.style.display = "inline-flex";

    this._root.innerHTML = `
        <style>
        .my-pedal {
            animation:none 0s ease 0s 1 normal none running;
            appearance:none;
            background:rgba(0, 0, 0, 0) url("./img/background/metal3.webp") repeat scroll 0% 0% / 100% 100% padding-box border-box;
            border:0.555556px solid rgb(73, 73, 73);
            bottom:0px;clear:none;
            clip:auto;
            color:rgb(33, 37, 41);
            columns:auto auto;
            contain:none;container:none;content:normal;cursor:auto;cx:0px;cy:0px;d:none;direction:ltr;display:inline-block;fill:rgb(0, 0, 0);filter:none;flex:0 1 auto;float:none;font:16px / 24px -apple-system, "system-ui", "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";gap:normal;grid:none / none / none / row / auto / auto;height:397.622px;hyphens:manual;inset:0px;isolation:auto;left:0px;margin:2px;marker:none;mask:none;offset:none 0px auto 0deg;opacity:1;order:0;orphans:2;outline:rgb(33, 37, 41) none 0px;overflow:visible;overlay:none;padding:1px;page:auto;perspective:none;position:unset;quotes:auto;r:0px;resize:none;right:0px;rotate:none;rx:auto;ry:auto;scale:none;speak:normal;stroke:none;top:0px;transform:matrix(1, 0, 0, 1, 0, 0);transition:all;translate:none;visibility:visible;widows:2;width:295.269px;x:0px;y:0px;zoom:1;};
        </style>
<div id="CollisionDrive" 
     class="resize-drag my-pedal gradiant-target" 
     style="border: 1px solid rgb(73, 73, 73); text-align: center; display: inline-block; vertical-align: baseline; padding: 1px; margin: 2px; box-sizing: border-box; 
background: url(&quot;./img/background/metal3.webp&quot;) 0% 0% / 100% 100%, 0% 0%; box-shadow: rgba(0, 0, 0, 0.7) 4px 5px 6px, rgba(0, 0, 0, 0.2) -2px -2px 5px 0px inset, rgba(255, 255, 255, 0.2) 3px 1px 1px 4px inset, rgba(0, 0, 0, 0.9) 1px 0px 1px 0px, rgba(0, 0, 0, 0.9) 0px 2px 1px 0px, rgba(0, 0, 0, 0.9) 1px 1px 1px 0px; border-radius: 15px; touch-action: none; width: 295.276px; position: relative; top: 0px; left: 0px; height: 397.625px; transform: translate(0px, 0px);" data-x="0" data-y="0"><div class="drag" style="padding: 1px; margin: 1px; text-align: center; display: inline-block; box-sizing: border-box; touch-action: none; position: absolute; top: 32.6667px; left: 7.16667px; width: 66px; height: 78.5px; transform: translate(106.214px, 3.49046px);" data-x="106.21354675292969" data-y="3.4904556274414062"><webaudio-knob id="/CollisionDrive/Bright" src="./img/knobs/simplegray.png" sprites="100" min="0" max="1" step="0.01" width="66" height="66" style="touch-action: none; display: block;"><style>

.webaudioctrl-tooltip{
  display:inline-block;
  position:absolute;
  margin:0 -1000px;
  z-index: 999;
  background:#eee;
  color:#000;
  border:1px solid #666;
  border-radius:4px;
  padding:5px 10px;
  text-align:center;
  left:0; top:0;
  font-size:11px;
  opacity:0;
  visibility:hidden;
}
.webaudioctrl-tooltip:before{
  content: "";
	position: absolute;
	top: 100%;
	left: 50%;
 	margin-left: -8px;
	border: 8px solid transparent;
	border-top: 8px solid #666;
}
.webaudioctrl-tooltip:after{
  content: "";
	position: absolute;
	top: 100%;
	left: 50%;
 	margin-left: -6px;
	border: 6px solid transparent;
	border-top: 6px solid #eee;
}

webaudio-knob{
  display:inline-block;
  position:relative;
  margin:0;
  padding:0;
  cursor:pointer;
  font-family: sans-serif;
  font-size: 11px;
}
.webaudio-knob-body{
  display:inline-block;
  position:relative;
  z-index:1;
  margin:0;
  padding:0;
}
</style>
<div class="webaudio-knob-body" tabindex="1" touch-action="none" style="background-image: url(&quot;./img/knobs/simplegray.png&quot;); background-size: 66px 6666px; outline: none; width: 66px; height: 66px; background-position: 0px -5148px; transform: rotate(0deg);"></div><div class="webaudioctrl-tooltip" style="display: inline-block; width: auto; height: auto; transition: opacity 0.1s, visibility 0.1s; opacity: 0; visibility: hidden; left: 1010.74px; top: -35.6042px;">0.78</div>
</webaudio-knob></div><div class="drag" style="padding: 1px; margin: 1px; text-align: center; display: inline-block; box-sizing: border-box; touch-action: none; position: absolute; top: 113.167px; left: 9px; width: 66px; height: 78.5px; transform: translate(52.8177px, 37.0798px);" data-x="52.81771469116211" data-y="37.07984924316406"><webaudio-knob id="/CollisionDrive/Gate" src="./img/knobs/simplegray.png" sprites="100" min="-30" max="-10" step="1" width="66" height="66" style="touch-action: none; display: block;"><style>

.webaudioctrl-tooltip{
  display:inline-block;
  position:absolute;
  margin:0 -1000px;
  z-index: 999;
  background:#eee;
  color:#000;
  border:1px solid #666;
  border-radius:4px;
  padding:5px 10px;
  text-align:center;
  left:0; top:0;
  font-size:11px;
  opacity:0;
  visibility:hidden;
}
.webaudioctrl-tooltip:before{
  content: "";
	position: absolute;
	top: 100%;
	left: 50%;
 	margin-left: -8px;
	border: 8px solid transparent;
	border-top: 8px solid #666;
}
.webaudioctrl-tooltip:after{
  content: "";
	position: absolute;
	top: 100%;
	left: 50%;
 	margin-left: -6px;
	border: 6px solid transparent;
	border-top: 6px solid #eee;
}

webaudio-knob{
  display:inline-block;
  position:relative;
  margin:0;
  padding:0;
  cursor:pointer;
  font-family: sans-serif;
  font-size: 11px;
}
.webaudio-knob-body{
  display:inline-block;
  position:relative;
  z-index:1;
  margin:0;
  padding:0;
}
</style>
<div class="webaudio-knob-body" tabindex="1" touch-action="none" style="background-image: url(&quot;./img/knobs/simplegray.png&quot;); background-size: 66px 6666px; outline: none; width: 66px; height: 66px; background-position: 0px -660px; transform: rotate(0deg);"></div><div class="webaudioctrl-tooltip" style="display: inline-block; width: auto; height: auto; transition: opacity 0.1s, visibility 0.1s; opacity: 0; visibility: hidden; left: 1013.5px; top: -35.6042px;">-28</div>
</webaudio-knob></div><div class="drag" style="padding: 1px; margin: 1px; text-align: center; display: inline-block; box-sizing: border-box; touch-action: none; position: absolute; top: 193.667px; left: 6.46875px; width: 66px; height: 78.5px; transform: translate(201.215px, -159.964px);" data-x="201.21527481079102" data-y="-159.9644317626953"><webaudio-knob id="/CollisionDrive/attack" src="./img/knobs/simplegray.png" sprites="100" min="0" max="5" step="0.1" width="66" height="66" style="touch-action: none; display: block;"><style>

.webaudioctrl-tooltip{
  display:inline-block;
  position:absolute;
  margin:0 -1000px;
  z-index: 999;
  background:#eee;
  color:#000;
  border:1px solid #666;
  border-radius:4px;
  padding:5px 10px;
  text-align:center;
  left:0; top:0;
  font-size:11px;
  opacity:0;
  visibility:hidden;
}
.webaudioctrl-tooltip:before{
  content: "";
	position: absolute;
	top: 100%;
	left: 50%;
 	margin-left: -8px;
	border: 8px solid transparent;
	border-top: 8px solid #666;
}
.webaudioctrl-tooltip:after{
  content: "";
	position: absolute;
	top: 100%;
	left: 50%;
 	margin-left: -6px;
	border: 6px solid transparent;
	border-top: 6px solid #eee;
}

webaudio-knob{
  display:inline-block;
  position:relative;
  margin:0;
  padding:0;
  cursor:pointer;
  font-family: sans-serif;
  font-size: 11px;
}
.webaudio-knob-body{
  display:inline-block;
  position:relative;
  z-index:1;
  margin:0;
  padding:0;
}
</style>
<div class="webaudio-knob-body" tabindex="1" touch-action="none" style="background-image: url(&quot;./img/knobs/simplegray.png&quot;); background-size: 66px 6666px; outline: none; width: 66px; height: 66px; background-position: 0px -6600px; transform: rotate(0deg);"></div><div class="webaudioctrl-tooltip" style="display: inline-block; width: auto; height: auto; transition: opacity 0.1s, visibility 0.1s; opacity: 0; visibility: hidden; left: 1013.8px; top: -35.6042px;">5.0</div>
</webaudio-knob></div><div class="drag" style="padding: 1px; margin: 1px; text-align: center; display: inline-block; box-sizing: border-box; touch-action: none; position: absolute; top: 274.167px; left: 0.666672px; width: 66px; height: 80px; transform: translate(114.79px, -2.86545px);" data-x="114.78993606567383" data-y="-2.865447998046875"><webaudio-switch id="/CollisionDrive/bypass" src="./img/switches/switch_1.png" sprites="100" width="64" height="40" style="touch-action: none;"><style>

.webaudioctrl-tooltip{
  display:inline-block;
  position:absolute;
  margin:0 -1000px;
  z-index: 999;
  background:#eee;
  color:#000;
  border:1px solid #666;
  border-radius:4px;
  padding:5px 10px;
  text-align:center;
  left:0; top:0;
  font-size:11px;
  opacity:0;
  visibility:hidden;
}
.webaudioctrl-tooltip:before{
  content: "";
	position: absolute;
	top: 100%;
	left: 50%;
 	margin-left: -8px;
	border: 8px solid transparent;
	border-top: 8px solid #666;
}
.webaudioctrl-tooltip:after{
  content: "";
	position: absolute;
	top: 100%;
	left: 50%;
 	margin-left: -6px;
	border: 6px solid transparent;
	border-top: 6px solid #eee;
}

webaudio-switch{
  display:inline-block;
  margin:0;
  padding:0;
  font-family: sans-serif;
  font-size: 11px;
  cursor:pointer;
}
.webaudio-switch-body{
  display:inline-block;
  margin:0;
  padding:0;
}
</style>
<div class="webaudio-switch-body" tabindex="1" touch-action="none" style="background-image: url(&quot;./img/switches/switch_1.png&quot;); background-size: 100% 200%; width: 64px; height: 40px; outline: none; background-position: 0px -100%;"><div class="webaudioctrl-tooltip" style="transition: opacity 0.1s, visibility 0.1s; opacity: 0; visibility: hidden;"></div></div>
</webaudio-switch></div><div class="drag" style="padding: 1px; margin: 1px; text-align: center; display: inline-block; box-sizing: border-box; touch-action: none; position: absolute; top: 356.167px; left: 9px; width: 66px; height: 78.5px; transform: translate(10.6146px, -320.572px);" data-x="10.614578247070312" data-y="-320.5720672607422"><webaudio-knob id="/CollisionDrive/drive" src="./img/knobs/simplegray.png" sprites="100" min="0" max="1" step="0.01" width="66" height="66" style="touch-action: none; display: block;"><style>

.webaudioctrl-tooltip{
  display:inline-block;
  position:absolute;
  margin:0 -1000px;
  z-index: 999;
  background:#eee;
  color:#000;
  border:1px solid #666;
  border-radius:4px;
  padding:5px 10px;
  text-align:center;
  left:0; top:0;
  font-size:11px;
  opacity:0;
  visibility:hidden;
}
.webaudioctrl-tooltip:before{
  content: "";
	position: absolute;
	top: 100%;
	left: 50%;
 	margin-left: -8px;
	border: 8px solid transparent;
	border-top: 8px solid #666;
}
.webaudioctrl-tooltip:after{
  content: "";
	position: absolute;
	top: 100%;
	left: 50%;
 	margin-left: -6px;
	border: 6px solid transparent;
	border-top: 6px solid #eee;
}

webaudio-knob{
  display:inline-block;
  position:relative;
  margin:0;
  padding:0;
  cursor:pointer;
  font-family: sans-serif;
  font-size: 11px;
}
.webaudio-knob-body{
  display:inline-block;
  position:relative;
  z-index:1;
  margin:0;
  padding:0;
}
</style>
<div class="webaudio-knob-body" tabindex="1" touch-action="none" style="background-image: url(&quot;./img/knobs/simplegray.png&quot;); outline: none; width: 66px; height: 66px; background-position: 0px -5412px; background-size: 66px 6666px; transform: rotate(0deg);"></div><div class="webaudioctrl-tooltip" style="display: inline-block; width: auto; height: auto; transition: opacity 0.1s, visibility 0.1s; opacity: 0; visibility: hidden; left: 1010.74px; top: -35.6042px;">0.82</div>
</webaudio-knob></div><div class="drag" style="padding: 1px; margin: 1px; text-align: center; display: inline-block; box-sizing: border-box; touch-action: none; position: absolute; top: 436.667px; left: 9px; width: 66px; height: 78.5px; transform: translate(151.791px, -284.281px);" data-x="151.7908058166504" data-y="-284.28126525878906"><webaudio-knob id="/CollisionDrive/level" src="./img/knobs/simplegray.png" sprites="100" min="-20" max="4" step="0.1" width="66" height="66" style="touch-action: none; display: block;"><style>

.webaudioctrl-tooltip{
  display:inline-block;
  position:absolute;
  margin:0 -1000px;
  z-index: 999;
  background:#eee;
  color:#000;
  border:1px solid #666;
  border-radius:4px;
  padding:5px 10px;
  text-align:center;
  left:0; top:0;
  font-size:11px;
  opacity:0;
  visibility:hidden;
}
.webaudioctrl-tooltip:before{
  content: "";
	position: absolute;
	top: 100%;
	left: 50%;
 	margin-left: -8px;
	border: 8px solid transparent;
	border-top: 8px solid #666;
}
.webaudioctrl-tooltip:after{
  content: "";
	position: absolute;
	top: 100%;
	left: 50%;
 	margin-left: -6px;
	border: 6px solid transparent;
	border-top: 6px solid #eee;
}

webaudio-knob{
  display:inline-block;
  position:relative;
  margin:0;
  padding:0;
  cursor:pointer;
  font-family: sans-serif;
  font-size: 11px;
}
.webaudio-knob-body{
  display:inline-block;
  position:relative;
  z-index:1;
  margin:0;
  padding:0;
}
</style>
<div class="webaudio-knob-body" tabindex="1" touch-action="none" style="background-image: url(&quot;./img/knobs/simplegray.png&quot;); background-size: 66px 6666px; outline: none; width: 66px; height: 66px; background-position: 0px -5346px; transform: rotate(0deg);"></div><div class="webaudioctrl-tooltip" style="display: inline-block; width: auto; height: auto; transition: opacity 0.1s, visibility 0.1s; opacity: 0; visibility: hidden; left: 1011.97px; top: -35.6042px;">-0.4</div>
</webaudio-knob></div><label for="CollisionDrive" style="display: block; touch-action: none; position: absolute; z-index: 1; width: 200px; left: 1.66667px; top: 4.11459px; transform: translate(23.2526px, 316.672px); border: none; color: rgb(251, 255, 0); font-family: Eater; font-size: 28px; -webkit-text-stroke: 1px rgb(0, 0, 0);" class="drag" contenteditable="false" data-x="23.25261688232422" data-y="316.6719665527344" font="Eater">CollisionDrive</label><label for="Bright" style="text-align: center; display: block; touch-action: none; position: absolute; z-index: 1; width: 43.6667px; left: 9.83334px; top: 82.2812px; transform: translate(92.1971px, 20.704px); border: none; color: rgb(251, 255, 0); font-family: Eater; -webkit-text-stroke: 1px rgb(0, 0, 0); font-size: 23px;" class="drag" contenteditable="false" data-x="92.19705581665039" data-y="20.704010009765625" font="Eater">Bright</label><label for="Gate" style="text-align: center; display: block; touch-action: none; position: absolute; z-index: 1; width: 40px; left: 11.6667px; top: 162.781px; transform: translate(48.8464px, 57.5937px); border: none; color: rgb(251, 255, 0); font-family: Eater; -webkit-text-stroke: 1px rgb(0, 0, 0); font-size: 23px;" class="drag target-style-label" contenteditable="false" data-x="48.84635925292969" data-y="57.59368896484375" font="Eater">Gate</label><label for="attack" style="text-align: center; display: block; touch-action: none; position: absolute; z-index: 1; width: 45.0521px; left: 9.13542px; top: 243.281px; transform: translate(193.859px, -140.241px); border: none; color: rgb(251, 255, 0); font-family: Eater; -webkit-text-stroke: 1px rgb(0, 0, 0); font-size: 23px;" class="drag" contenteditable="false" data-x="193.85939407348633" data-y="-140.24134826660156" font="Eater">attack</label><label for="bypass" style="text-align: center; display: none; touch-action: none; position: absolute; z-index: 1; width: 64px; left: 3.33334px; top: 325.281px; transform: translate(245.771px, 59.5833px); border: none; color: rgb(251, 255, 0); font-family: Eater; -webkit-text-stroke: 1px rgb(0, 0, 0); font-size: 23px;" class="drag" contenteditable="false" data-x="245.77083206176758" data-y="59.583343505859375" font="Eater">bypass</label><label for="drive" style="text-align: center; display: block; touch-action: none; position: absolute; z-index: 1; width: 40px; left: 11.6667px; top: 405.781px; transform: translate(3.7309px, -305.392px); border: none; color: rgb(251, 255, 0); font-family: Eater; -webkit-text-stroke: 1px rgb(0, 0, 0); font-size: 23px;" class="drag" contenteditable="false" data-x="3.7309036254882812" data-y="-305.3923645019531" font="Eater">drive</label><label for="level" style="text-align: center; display: block; touch-action: none; position: absolute; z-index: 1; width: 40px; left: 11.6667px; top: 486.281px; transform: translate(149.655px, -262.611px); border: none; color: rgb(251, 255, 0); font-family: Eater; -webkit-text-stroke: 1px rgb(0, 0, 0); font-size: 23px;" class="drag" contenteditable="false" data-x="149.65451431274414" data-y="-262.611083984375" font="Eater">level</label></div>`;

    this.isOn;
    this.state = new Object();
    this.setKnobs();
    this.setSliders();
    this.setSwitches();
    //this.setSwitchListener();
    this.setInactive();
    // Change #pedal to .my-pedal for use the new builder
    this._root.querySelector('.my-pedal').style.transform = 'none';
    //this._root.querySelector("#test").style.fontFamily = window.getComputedStyle(this._root.querySelector("#test")).getPropertyValue('font-family');

    // Compute base URI of this main.html file. This is needed in order
    // to fix all relative paths in CSS, as they are relative to
    // the main document, not the plugin's main.html
    this.basePath = getBaseURL();
    console.log("basePath = " + this.basePath)

    // Fix relative path in WebAudio Controls elements
    this.fixRelativeImagePathsInCSS();

    // optionnal : set image background using a relative URI (relative
    // to this file)
    //this.setImageBackground("/img/BigMuffBackground.png");

    // Monitor param changes in order to update the gui
    window.requestAnimationFrame(this.handleAnimationFrame);

  }

  fixRelativeImagePathsInCSS() {

    // change webaudiocontrols relative paths for spritesheets to absolute
    let webaudioControls = this._root.querySelectorAll(
      'webaudio-knob, webaudio-slider, webaudio-switch, img'
    );
    webaudioControls.forEach((e) => {
      let currentImagePath = e.getAttribute('src');
      if (currentImagePath !== undefined) {
        //console.log("Got wc src as " + e.getAttribute("src"));
        let imagePath = e.getAttribute('src');
        e.setAttribute('src', this.basePath + '/' + imagePath);
        //console.log("After fix : wc src as " + e.getAttribute("src"));
      }
    });

    let sliders = this._root.querySelectorAll('webaudio-slider');
    sliders.forEach((e) => {
      let currentImagePath = e.getAttribute('knobsrc');
      if (currentImagePath !== undefined) {
        let imagePath = e.getAttribute('knobsrc');
        e.setAttribute('knobsrc', this.basePath + '/' + imagePath);
      }
    });

    // BMT Get all fonts
    // Need to get the attr font
    let usedFonts = "";
    let fonts = this._root.querySelectorAll('label[font]');
    fonts.forEach((e) => {
      if (!usedFonts.includes(e.getAttribute("font"))) usedFonts += "family=" + e.getAttribute("font") + "&";
    });
    let link = document.createElement('link');
    link.rel = "stylesheet";
    if (usedFonts.slice(0, -1)) link.href = "https://fonts.googleapis.com/css2?" + usedFonts.slice(0, -1) + "&display=swap";
    document.querySelector('head').appendChild(link);

    // BMT Adapt for background-image
    let divs = this._root.querySelectorAll('div');
    divs.forEach((e) => {
      if ('background-image' in e.style) {
      console.log("e.style.backgroundImage = " + e.style.backgroundImage);
      // extract in var p the path between 'url("' and '")', using javascript regexp 
      let p = e.style.backgroundImage.match(/url\(["']?([^"']*)["']?\)/);
      if (p !== null) {
        let imagePath = p[1];
        console.log("imagePath 1 = " + imagePath);
        if (imagePath != "") {
          // remove everything after last 3 chars after last .
          imagePath = imagePath.replace(/(.*)(.{4})/, '$1');
          // add baseURL
          imagePath = this.basePath + '/' + imagePath ;
          console.log("imagePath 2 = " + imagePath);
          e.style.backgroundImage = 'url(' + imagePath + ')';
          console.log("After fix : wc src as " + e.style.backgroundImage);
        }
      }
      

/*
        let currentImagePath = e.style.backgroundImage.slice(4, -1);
        console.log("currentImagePath = " + currentImagePath);
        if (currentImagePath !== undefined) {
          let imagePath = e.style.backgroundImage.slice(5, -2);
          console.log("imagePath 2 = " + imagePath);
          console.log("this.basePath = " + this.basePath);
          if (imagePath != "") {
            // remove everything after last 3 chars after last .
            imagePath = imagePath.replace(/(.*)(.{4})/, '$1');
            // add baseURL
            imagePath = this.basePath + '/' + imagePath + '.png';
            console.log("imagePath 3 = " + imagePath);

            e.style.backgroundImage = 'url(' + imagePath + ')';
            console.log("After fix : wc src as " + e.style.backgroundImage);
          }
        }
          */
      }
    });

  }

  setImageBackground() {

    // check if the shadowroot host has a background image
    let mainDiv = this._root.querySelector('#main');
    mainDiv.style.backgroundImage =
      'url(' + this.basePath + '/' + imageRelativeURI + ')';

    //console.log("background =" + mainDiv.style.backgroundImage);
    //this._root.style.backgroundImage = "toto.png";

  }

  attributeChangedCallback() {

    console.log('Custom element attributes changed.');
    this.state = JSON.parse(this.getAttribute('state'));
    let tmp = '/PingPongDelayFaust/bypass';

    if (this.state[tmp] == 1) {
      this._root.querySelector('#switch1').value = 0;
      this.isOn = false;
    } else if (this.state[tmp] == 0) {
      this._root.querySelector('#switch1').value = 1;
      this.isOn = true;
    }

    this.knobs = this._root.querySelectorAll('.knob');
    console.log(this.state);

    for (var i = 0; i < this.knobs.length; i++) {
      this.knobs[i].setValue(this.state[this.knobs[i].id], false);
      console.log(this.knobs[i].value);
    }

  }
  handleAnimationFrame = () => {
    this._root.getElementById('/CollisionDrive/Bright').value = this._plug.audioNode.getParamValue('/CollisionDrive/Bright');


    this._root.getElementById('/CollisionDrive/Gate').value = this._plug.audioNode.getParamValue('/CollisionDrive/Gate');


    this._root.getElementById('/CollisionDrive/attack').value = this._plug.audioNode.getParamValue('/CollisionDrive/attack');


    this._root.getElementById('/CollisionDrive/drive').value = this._plug.audioNode.getParamValue('/CollisionDrive/drive');


    this._root.getElementById('/CollisionDrive/level').value = this._plug.audioNode.getParamValue('/CollisionDrive/level');


    this._root.getElementById('/CollisionDrive/bypass').value = 1 - this._plug.audioNode.getParamValue('/CollisionDrive/bypass');

    window.requestAnimationFrame(this.handleAnimationFrame);
  }

  get properties() {

    this.boundingRect = {
      dataWidth: {
        type: Number,
        value: null
      },
      dataHeight: {
        type: Number,
        value: null
      }
    };
    return this.boundingRect;

  }

  static get observedAttributes() {

    return ['state'];

  }

  setKnobs() {
    this._root.getElementById("/CollisionDrive/Bright").addEventListener("input", (e) => this._plug.audioNode.setParamValue("/CollisionDrive/Bright", e.target.value));
    this._root.getElementById("/CollisionDrive/Gate").addEventListener("input", (e) => this._plug.audioNode.setParamValue("/CollisionDrive/Gate", e.target.value));
    this._root.getElementById("/CollisionDrive/attack").addEventListener("input", (e) => this._plug.audioNode.setParamValue("/CollisionDrive/attack", e.target.value));
    this._root.getElementById("/CollisionDrive/drive").addEventListener("input", (e) => this._plug.audioNode.setParamValue("/CollisionDrive/drive", e.target.value));
    this._root.getElementById("/CollisionDrive/level").addEventListener("input", (e) => this._plug.audioNode.setParamValue("/CollisionDrive/level", e.target.value));

  }

  setSliders() {

  }

  setSwitches() {
    this._root.getElementById("/CollisionDrive/bypass").addEventListener("change", (e) => this._plug.audioNode.setParamValue("/CollisionDrive/bypass", 1 - e.target.value));

  }

  setInactive() {

    let switches = this._root.querySelectorAll(".switch webaudio-switch");

    switches.forEach(s => {
      console.log("### SWITCH ID = " + s.id);
      this._plug.audioNode.setParamValue(s.id, 0);
    });

  }
}
try {
  customElements.define('wap-collisiondrive',
    CollisionDriveGui);
  console.log("Element defined");
} catch (error) {
  console.log(error);
  console.log("Element already defined");
}
