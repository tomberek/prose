// importScripts('pandoc.js');
importScripts('js-pandoc.js');
window={};
debug= false;
pandoc = true;
strict = true;
html5= true;
pan_xtables= false;
md_extra= false;
mdx_xtables = false;
addcoordinates= false;
debug= false;

options ={
    pandoc : true,
    strict : true,
    html5: true,
    pan_xtables: false,
    md_extra: false,
    mdx_xtables : false,
    addcoordinates: false,
    debug: false
}
pandocToHtml = Pandoc;
self.onmessage = function(e){
    if (typeof pandocToHtml !== "undefined"){
        self.postMessage(pandocToHtml(e.data));
    } else {self.postMessage("loading...");}
}
