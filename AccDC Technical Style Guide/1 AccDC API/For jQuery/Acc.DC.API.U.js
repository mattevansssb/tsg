/*!
AccDC API - 2.0.3 (03/19/2013) jQuery Module
Copyright 2010-2013 Bryan Garaventa (WhatSock.com)
Part of AccDC, a Cross-Browser JavaScript accessibility API, distributed under the terms of the Open Source Initiative OSI - MIT License
*/
(function(pL){

var getEl = function(e){
if (document.getElementById) return document.getElementById(e);
else if (document.all) return document.all[e];
else return null;
},

createEl = function(t){
var o = document.createElement(t);
if (arguments.length === 1) return o;
if (arguments[1]) setAttr(o, arguments[1]);
if (arguments[2]) css(o, arguments[2]);
if (arguments[3]) addClass(o, arguments[3]);
if (arguments[4]) o.appendChild(arguments[4]);
return o;
},

createText = function(s){
return document.createTextNode(s);
},

createAttr = function(a){
return document.createAttribute(a);
},

getAttr = function(e, n){
if (!e) return null;
var a;
if (e.getAttribute)
a = e.getAttribute(n);
if (!a && e.getAttributeNode)
a = e.getAttributeNode(n);
if (!a && e[n])
a = e[n];
return a;
},

remAttr = function(e, n){
if (!e) return false;
var a = isArray(n) ? n : [n];
for (var i = 0; i < a.length; i++){
if (e.removeAttribute) e.removeAttribute(a[i]);
}
return e;
},

getText = function(n){
if (!n) return '';
return n.innerText || n.textContent || pL.find.getText([n]) || '';
},

css = function(obj, p, v){
if (!obj) return null;
if (obj.nodeName && typeof p === 'string' && !v) return obj.style && obj.style[p] ? obj.style[p] : xGetComputedStyle(obj, p);
var o = isArray(obj) ? obj : [obj],
check = 'top left bottom right width height';
for (var i = 0; i < o.length; i++){
if (typeof p === 'string'){
try {
o[i].style[xCamelize(p)] = check.indexOf(p) !== -1 && typeof v === 'number' ? v + 'px' : v;
} catch (ex) {
/*@cc_on
@if (@_jscript_version <= 5.7) // IE7 and down
if (p != 'display') continue;
var s = '',
t = o[i].nodeName.toLowerCase();
switch(t){
case 'table' :
case 'tr' :
case 'td' :
case 'li' :
s = 'block';
break;
case 'caption' :
s = 'inline';
break;
}
o[i].style[p] = s;
@end @*/
}
} else if (typeof p === 'object'){
for (var a = 1; a < arguments.length; a++){
for (var n in arguments[a]){
try {
o[i].style[xCamelize(n)] = check.indexOf(n) !== -1 && typeof arguments[a][n] === 'number' ? arguments[a][n] + 'px' : arguments[a][n];
} catch (ex) {
/*@cc_on
@if (@_jscript_version <= 5.7) // IE7 and down
if (n != 'display') continue;
var s = '',
t = o[i].nodeName.toLowerCase();
switch(t){
case 'table' :
case 'tr' :
case 'td' :
case 'li' :
s = 'block';
break;
case 'caption' :
s = 'inline';
break;
}
o[i].style[n] = s;
@end @*/
}
}
}
}
}
return obj;
},

trim = function(str){
return str.replace(/^\s+|\s+$/g, '');
},

setAttr = function(obj, name, value){
if (!obj) return null;
pL(obj).attr(name, value);
return obj;
},

isArray = function(v){
return v && typeof v === 'object' && typeof v.length === 'number' && typeof v.splice === 'function' && !(v.propertyIsEnumerable('length'));
},

inArray = function(search, stack){
if (stack.indexOf) return stack.indexOf(search);
for (var i = 0; i < stack.length; i++){
if (stack[i] === search) return i;
}
return -1;
},

hasClass = function(obj, cn){
if (!obj || !obj.className) return false;
var names = cn.split(' '),
i = 0;
for (var n = 0; n < names.length; n++){
if (obj.className.indexOf(names[n]) !== -1) i += 1;
}
if (i === names.length) return true;
return false;
},

addClass = function(obj, cn){
if (!obj) return null;
pL(obj).addClass(cn);
return obj;
},

remClass = function(obj, cn){
if (!obj) return null;
pL(obj).removeClass(cn);
return obj;
},

firstChild = function(e, t){
var e = e ? e.firstChild : null;
while(e){
if (e.nodeType === 1 && (!t || t.toLowerCase() === e.nodeName.toLowerCase())) break;
e = e.nextSibling;
}
return e;
},

insertBefore = function(f, s){
if (!f) return s;
f.parentNode.insertBefore(s, f);
return s;
},

nowI = 0,

now = function(v){
return new Date().getTime() + (nowI++);
},

sraCSS = {
position: 'absolute',
clip: 'rect(1px 1px 1px 1px)',
clip: 'rect(1px, 1px, 1px, 1px)',
padding: 0,
border: 0,
height: '1px',
width: '1px',
overflow: 'hidden',
zIndex: -1000
},

sraCSSClear = function(o){
css(o, {
position: '',
clip: 'auto',
padding: '',
height: '',
width: '',
overflow: '',
zIndex: ''
});
return o;
},

getWin = function(){
return {
width: window.document.documentElement.clientWidth || window.document.body.clientWidth,
height: window.document.documentElement.clientHeight || window.document.body.clientHeight
};
},

transition = function(ele, targ, config){
if (!ele) return;
var uTotalTime = config.duration,
iTargetY = targ.top,
iTargetX = targ.left,
startY = xTop(ele),
startX = xLeft(ele);
var dispX = iTargetX - startX,
dispY = iTargetY - startY,
freq = Math.PI / (2 * uTotalTime),
startTime = new Date().getTime(),
tmr = setInterval( function(){
var elapsedTime = new Date().getTime() - startTime;
if (elapsedTime < uTotalTime){
var f = Math.abs(Math.sin(elapsedTime * freq));
xTop(ele, Math.round(f * dispY + startY));
xLeft(ele, Math.round(f * dispX + startX));
config.step.apply(ele);
} else {
clearInterval(tmr);
xLeft(ele, iTargetX);
xTop(ele, iTargetY);
config.complete.apply(ele);
}
}, 10);
},

xOffset = function(c, p){
var o = {left:0, top:0},
p = p || document.body;
while (c && c != p) {
o.left += c.offsetLeft;
o.top += c.offsetTop;
c = c.offsetParent;
}
return o;
},

xCamelize = function(cssPropStr){
  var i, c, a, s;
  a = cssPropStr.split('-');
  s = a[0];
  for (i=1; i<a.length; i++) {
    c = a[i].charAt(0);
    s += a[i].replace(c, c.toUpperCase());
  }
  return s;
},

xGetComputedStyle = function(e, p, i){
if (!e) return null;
var s,
v = 'undefined',
dv = document.defaultView;
if(dv && dv.getComputedStyle){
if (e == document) e = document.body;
s = dv.getComputedStyle(e,'');
if (s)
v = s.getPropertyValue(p);
} else if (e.currentStyle)
v = e.currentStyle[xCamelize(p)];
  else return null;
  return i ? (parseInt(v) || 0) : v;
},

xNum = function(){
for(var i=0; i<arguments.length; i++){
if (isNaN(arguments[i]) || typeof arguments[i] !== 'number') return false;
}
return true;
},

xDef = function(){
for(var i=0; i<arguments.length; i++){
if (typeof arguments[i] === 'undefined') return false;
}
return true;
},

xStr = function(){
for(var i=0; i<arguments.length; i++){
if (typeof arguments[i] !== 'string') return false;
}
  return true;
},

xHeight = function(e,h){
var css, pt=0, pb=0, bt=0, bb=0;
if (!e) return 0;
if (xNum(h)) {
if (h<0) h = 0;
else h=Math.round(h);
} else h=-1;
css=xDef(e.style);
if(css && xDef(e.offsetHeight) && xStr(e.style.height)) {
if(h>=0) {
if (document.compatMode=='CSS1Compat') {
pt=xGetComputedStyle(e,'padding-top',1);
if (pt !== null) {
pb=xGetComputedStyle(e,'padding-bottom',1);
bt=xGetComputedStyle(e,'border-top-width',1);
bb=xGetComputedStyle(e,'border-bottom-width',1);
}
else if(xDef(e.offsetHeight,e.style.height)){
e.style.height=h+'px';
pt=e.offsetHeight-h;
}
}
h-=(pt+pb+bt+bb);
if(isNaN(h)||h<0) return;
else e.style.height=h+'px';
}
h=e.offsetHeight;
} else if(css && xDef(e.style.pixelHeight)) {
if(h>=0) e.style.pixelHeight=h;
h=e.style.pixelHeight;
}
return h;
},

xWidth = function(e,w){
var css, pl=0, pr=0, bl=0, br=0;
if (!e) return 0;
if (xNum(w)) {
if (w<0) w = 0;
else w=Math.round(w);
} else w=-1;
css=xDef(e.style);
if(css && xDef(e.offsetWidth) && xStr(e.style.width)) {
if(w>=0) {
if (document.compatMode=='CSS1Compat') {
pl=xGetComputedStyle(e,'padding-left',1);
if (pl !== null) {
pr=xGetComputedStyle(e,'padding-right',1);
bl=xGetComputedStyle(e,'border-left-width',1);
br=xGetComputedStyle(e,'border-right-width',1);
}
else if(xDef(e.offsetWidth,e.style.width)){
e.style.width=w+'px';
pl=e.offsetWidth-w;
}
}
w-=(pl+pr+bl+br);
if(isNaN(w)||w<0) return;
else e.style.width=w+'px';
}
w=e.offsetWidth;
}
else if(css && xDef(e.style.pixelWidth)) {
if(w>=0) e.style.pixelWidth=w;
w=e.style.pixelWidth;
}
return w;
},

xTop = function(e, iY){
if (!e) return 0;
var css=xDef(e.style);
if(css && xStr(e.style.top)) {
if(xNum(iY)) e.style.top=iY+'px';
else {
iY=parseInt(e.style.top);
if(isNaN(iY)) iY=xGetComputedStyle(e,'top',1);
if(isNaN(iY)) iY=0;
}
}
else if(css && xDef(e.style.pixelTop)) {
if(xNum(iY)) e.style.pixelTop=iY;
else iY=e.style.pixelTop;
}
return iY;
},

xLeft = function(e, iX){
if (!e) return 0;
var css=xDef(e.style);
if (css && xStr(e.style.left)) {
if(xNum(iX)) e.style.left=iX+'px';
else {
iX=parseInt(e.style.left);
if(isNaN(iX)) iX=xGetComputedStyle(e,'left',1);
if(isNaN(iX)) iX=0;
}
}
else if(css && xDef(e.style.pixelLeft)) {
if(xNum(iX)) e.style.pixelLeft=iX;
else iX=e.style.pixelLeft;
}
return iX;
};

/*
The following drag and drop components are derived from the open source jquery.event.drag and jquery.event.drop plugins by ThreeDubMedia at
http://threedubmedia.com/code/event/drag
and
http://threedubmedia.com/code/event/drop
*/

//helper drag functionality
(function( $ ){
$.fn.drag = function( str, arg, opts ){
// figure out the event type
var type = typeof str == "string" ? str : "",
// figure out the event handler...
fn = $.isFunction( str ) ? str : $.isFunction( arg ) ? arg : null;
// fix the event type
if ( type.indexOf("drag") !== 0 ) 
type = "drag"+ type;
// were options passed
opts = ( str == fn ? arg : opts ) || {};
// trigger or bind event handler
return fn ? this.bind( type, opts, fn ) : this.trigger( type );
};
// local refs (increase compression)
var $event = $.event, 
$special = $event.special,
// configure the drag special event 
drag = $special.drag = {
// these are the default settings
defaults: {
which: 1, // mouse button pressed to start drag sequence
distance: 0, // distance dragged before dragstart
not: ':input', // selector to suppress dragging on target elements
handle: null, // selector to match handle target elements
relative: false, // true to use "position", false to use "offset"
drop: true, // false to suppress drop events, true or selector to allow
click: false // false to suppress click events after dragend (no proxy)
},

// the key name for stored drag data
datakey: "dragdata",

// prevent bubbling for better performance
noBubble: true,

// count bound related events
add: function( obj ){ 
// read the interaction data
var data = $.data( this, drag.datakey ),
// read any passed options 
opts = obj.data || {};
// count another realted event
data.related += 1;

// extend data options bound with this event
// don't iterate "opts" in case it is a node 
$.each( drag.defaults, function( key, def ){
if ( opts[ key ] !== undefined )
data[ key ] = opts[ key ];
});
},
// forget unbound related events
remove: function(){
$.data( this, drag.datakey ).related -= 1;
},
// configure interaction, capture settings
setup: function(){
// check for related events
if ( $.data( this, drag.datakey ) ) 
return;
// initialize the drag data with copied defaults
var data = $.extend({ related:0 }, drag.defaults );
// store the interaction data
$.data( this, drag.datakey, data );
// bind the mousedown event, which starts drag interactions
$event.add( this, "touchstart mousedown", drag.init, data );
// prevent image dragging in IE...
if ( this.attachEvent ) 
this.attachEvent("ondragstart", drag.dontstart ); 
},
// destroy configured interaction
teardown: function(){
var data = $.data( this, drag.datakey ) || {};
// check for related events
if ( data.related )  
return;
// remove the stored data
$.removeData( this, drag.datakey );
// remove the mousedown event
$event.remove( this, "touchstart mousedown", drag.init );
// enable text selection
drag.textselect( true ); 
// un-prevent image dragging in IE...
if ( this.detachEvent ) 
this.detachEvent("ondragstart", drag.dontstart ); 
},
// initialize the interaction
init: function( event ){
// sorry, only one touch at a time
if ( drag.touched ) 
return;
// the drag/drop interaction data
var dd = event.data, results;
// check the which directive
if ( event.which != 0 && dd.which > 0 && event.which != dd.which )  
return; 
// check for suppressed selector
if ( $( event.target ).is( dd.not ) ) 
return;
// check for handle selector
if ( dd.handle && !$( event.target ).closest( dd.handle, event.currentTarget ).length ) 
return;

drag.touched = event.type == 'touchstart' ? this : null;
dd.propagates = 1;
dd.mousedown = this;
dd.interactions = [ drag.interaction( this, dd ) ];
dd.target = event.target;
dd.pageX = event.pageX;
dd.pageY = event.pageY;
dd.dragging = null;
// handle draginit event... 
results = drag.hijack( event, "draginit", dd );
// early cancel
if ( !dd.propagates )
return;
// flatten the result set
results = drag.flatten( results );
// insert new interaction elements
if ( results && results.length ){
dd.interactions = [];
$.each( results, function(){
dd.interactions.push( drag.interaction( this, dd ) );
});
}
// remember how many interactions are propagating
dd.propagates = dd.interactions.length;
// locate and init the drop targets
if ( dd.drop !== false && $special.drop ) 
$special.drop.handler( event, dd );
// disable text selection
drag.textselect( false ); 
// bind additional events...
if ( drag.touched )
$event.add( drag.touched, "touchmove touchend", drag.handler, dd );
else  
$event.add( document, "mousemove mouseup", drag.handler, dd );
// helps prevent text selection or scrolling
if ( !drag.touched || dd.live )
return false;
},
// returns an interaction object
interaction: function( elem, dd ){
var offset = xOffset(elem),
position = css(elem, 'position');
if (position == 'fixed')
offset.top = elem.offsetTop;
else if (dd.relative || position == 'relative'){
var po = xOffset(elem.parentNode);
offset = {
top: offset.top - po.top,
left: offset.left - po.left
};
}
return {
drag: elem, 
callback: new drag.callback(), 
droppable: [],
offset: offset
};
},
// handle drag-releatd DOM events
handler: function( event ){ 
// read the data before hijacking anything
var dd = event.data;
// handle various events
switch ( event.type ){
// mousemove, check distance, start dragging
case !dd.dragging && 'touchmove': 
event.preventDefault();
case !dd.dragging && 'mousemove': 
//  drag tolerance, x� + y� = distance�
if ( Math.pow(  event.pageX-dd.pageX, 2 ) + Math.pow(  event.pageY-dd.pageY, 2 ) < Math.pow( dd.distance, 2 ) ) 
break; // distance tolerance not reached
event.target = dd.target; // force target from "mousedown" event (fix distance issue)
drag.hijack( event, "dragstart", dd ); // trigger "dragstart"
if ( dd.propagates ) // "dragstart" not rejected
dd.dragging = true; // activate interaction
// mousemove, dragging
case 'touchmove':
event.preventDefault();
case 'mousemove': 
if ( dd.dragging ){
// trigger "drag"
drag.hijack( event, "drag", dd );
if ( dd.propagates ){
// manage drop events
if ( dd.drop !== false && $special.drop )
$special.drop.handler( event, dd ); // "dropstart", "dropend"
break; // "drag" not rejected, stop
}
event.type = "mouseup"; // helps "drop" handler behave
}
// mouseup, stop dragging
case 'touchend':  
case 'mouseup': 
default:
if ( drag.touched )
$event.remove( drag.touched, "touchmove touchend", drag.handler ); // remove touch events
else  
$event.remove( document, "mousemove mouseup", drag.handler ); // remove page events
if ( dd.dragging ){
if ( dd.drop !== false && $special.drop ) 
$special.drop.handler( event, dd ); // "drop"
drag.hijack( event, "dragend", dd ); // trigger "dragend"
}
drag.textselect( true ); // enable text selection
// if suppressing click events...
if ( dd.click === false && dd.dragging )
$.data( dd.mousedown, "suppress.click", new Date().getTime() + 5 );
dd.dragging = drag.touched = false; // deactivate element
break;
}
},

// re-use event object for custom events
hijack: function( event, type, dd, x, elem ){
// not configured
if ( !dd ) 
return;
// remember the original event and type
var orig = { event:event.originalEvent, type: event.type },
// is the event drag related or drog related?
mode = type.indexOf("drop") ? "drag" : "drop",
// iteration vars
result, i = x || 0, ia, $elems, callback,
len = !isNaN( x ) ? x : dd.interactions.length;
// modify the event type
event.type = type;
// remove the original event
event.originalEvent = null;
// initialize the results
dd.results = [];
// handle each interacted element
do if ( ia = dd.interactions[ i ] ){
// validate the interaction
if ( type !== "dragend" && ia.cancelled )
continue;
// set the dragdrop properties on the event object
callback = drag.properties( event, dd, ia );
// prepare for more results
ia.results = [];
// handle each element
$( elem || ia[ mode ] || dd.droppable ).each(function( p, subject ){
// identify drag or drop targets individually
callback.target = subject;
// force propagtion of the custom event
event.isPropagationStopped = function(){ return false; };
// handle the event
result = subject ? $event.handle.call( subject, event, callback ) : null;
// stop the drag interaction for this element
if ( result === false ){
if ( mode == "drag" ){
ia.cancelled = true;
dd.propagates -= 1;
}
if ( type == "drop" ){
ia[ mode ][p] = null;
}
}
// assign any dropinit elements
else if ( type == "dropinit" )
ia.droppable.push( drag.element( result ) || subject );
// accept a returned proxy element 
if ( type == "dragstart" )
ia.proxy = $( drag.element( result ) || ia.drag )[0];
// remember this result
ia.results.push( result );
// forget the event result, for recycling
delete event.result;
// break on cancelled handler
if ( type !== "dropinit" )
return result;
});
// flatten the results
dd.results[ i ] = drag.flatten( ia.results );
// accept a set of valid drop targets
if ( type == "dropinit" )
ia.droppable = drag.flatten( ia.droppable );
// locate drop targets
if ( type == "dragstart" && !ia.cancelled )
callback.update(); 
}
while ( ++i < len )
// restore the original event & type
event.type = orig.type;
event.originalEvent = orig.event;
// return all handler results
return drag.flatten( dd.results );
},
// extend the callback object with drag/drop properties...
properties: function( event, dd, ia ){
var obj = ia.callback;
// elements
obj.drag = ia.drag;
obj.proxy = ia.proxy || ia.drag;
// starting mouse position
obj.startX = dd.pageX;
obj.startY = dd.pageY;
// current distance dragged
obj.deltaX = event.pageX - dd.pageX;
obj.deltaY = event.pageY - dd.pageY;
// original element position
obj.originalX = ia.offset.left;
obj.originalY = ia.offset.top;
// adjusted element position
obj.offsetX = obj.originalX + obj.deltaX;  
obj.offsetY = obj.originalY + obj.deltaY;
// assign the drop targets information
obj.drop = drag.flatten( ( ia.drop || [] ).slice() );
obj.available = drag.flatten( ( ia.droppable || [] ).slice() );
return obj;
},
element: function( arg ){
if ( arg && ( arg.pL || arg.nodeType == 1 ) )
return arg;
},
flatten: function( arr ){
return $.map( arr, function( member ){
return member && member.pL ? $.makeArray( member ) : 
member && member.length ? drag.flatten( member ) : member;
});
},
// toggles text selection attributes ON (true) or OFF (false)
textselect: function( bool ){ 
$( document )[ bool ? "unbind" : "bind" ]("selectstart", drag.dontstart );
css(document, "MozUserSelect", bool ? "" : "none" );
document.unselectable = ( bool ? "off" : "on" );
},
// suppress "selectstart" and "ondragstart" events
dontstart: function(){ 
return false; 
},
// a callback instance contructor
callback: function(){}
};
// callback methods
drag.callback.prototype = {
update: function(){
if ( $special.drop && this.available.length )
$.each( this.available, function( i ){
$special.drop.locate( this, i );
});
}
};

// patch $.event.$dispatch to allow suppressing clicks
var $dispatch = $event.dispatch;
$event.dispatch = function( event ){
if ( $.data( this, "suppress."+ event.type ) - new Date().getTime() > 0 ){
$.removeData( this, "suppress."+ event.type );
return;
}
return $dispatch.apply( this, arguments );
};

// event fix hooks for touch events...
var touchHooks = 
$event.fixHooks.touchstart = 
$event.fixHooks.touchmove = 
$event.fixHooks.touchend =
$event.fixHooks.touchcancel = {
props: "clientX clientY pageX pageY screenX screenY".split( " " ),
filter: function( event, orig ) {
if ( orig ){
var touched = ( orig.touches && orig.touches[0] )
|| ( orig.changedTouches && orig.changedTouches[0] )
|| null; 
// iOS webkit: touchstart, touchmove, touchend
if ( touched ) 
$.each( touchHooks.props, function( i, prop ){
event[ prop ] = touched[ prop ];
});
}
return event;
}
};

// share the same special event configuration with related events...
$special.draginit = $special.dragstart = $special.dragend = drag;
})(pL);

(function( $ ){

// local refs (increase compression)
var $event = $.event,
// ref the special event config
drag = $event.special.drag,
// old drag event add method
origadd = drag.add,
// old drag event teradown method
origteardown = drag.teardown;

// allow events to bubble for delegation
drag.noBubble = false;

// the namespace for internal live events
drag.livekey = "livedrag";

// new drop event add method
drag.add = function( obj ){ 
// call the old method
origadd.apply( this, arguments );
// read the data
var data = $.data( this, drag.datakey );
// bind the live "draginit" delegator
if ( !data.live && obj.selector ){
data.live = true;
$event.add( this, "draginit."+ drag.livekey, drag.delegate );
}
};

// new drop event teardown method
drag.teardown = function(){ 
// call the old method
origteardown.apply( this, arguments );
// read the data
var data = $.data( this, drag.datakey ) || {};
// bind the live "draginit" delegator
if ( data.live ){
// remove the "live" delegation
$event.remove( this, "draginit."+ drag.livekey, drag.delegate );
data.live = false;
}
};

// identify potential delegate elements
drag.delegate = function( event ){
// local refs
var elems = [], target, 
// element event structure
events = $.data( this, "events" ) || {};
// query live events
$.each( events || [], function( key, arr ){
// no event type matches
if ( key.indexOf("drag") !== 0 )
return;
$.each( arr || [], function( i, obj ){
// locate the element to delegate
target = $( event.target ).closest( obj.selector, event.currentTarget )[0];
// no element found
if ( !target ) 
return;
// add an event handler
$event.add( target, obj.origType+'.'+drag.livekey, obj.origHandler || obj.handler, obj.data );
// remember new elements
if ( $.inArray( target, elems ) < 0 )
elems.push( target );
});
});
// if there are no elements, break
if ( !elems.length ) 
return false;
// return the matched results, and clenup when complete
return $( elems ).bind("dragend."+ drag.livekey, function(){
$event.remove( this, "."+ drag.livekey ); // cleanup delegation
});
};
})( pL );
//helper drag end

//helper drop functionality
(function($){
$.fn.drop = function( str, arg, opts ){
// figure out the event type
var type = typeof str == "string" ? str : "",
// figure out the event handler...
fn = $.isFunction( str ) ? str : $.isFunction( arg ) ? arg : null;
// fix the event type
if ( type.indexOf("drop") !== 0 ) 
type = "drop"+ type;
// were options passed
opts = ( str == fn ? arg : opts ) || {};
// trigger or bind event handler
return fn ? this.bind( type, opts, fn ) : this.trigger( type );
};
// DROP MANAGEMENT UTILITY
// returns filtered drop target elements, caches their positions
$.drop = function( opts ){ 
opts = opts || {};
// safely set new options...
drop.multi = opts.multi === true ? Infinity : 
opts.multi === false ? 1 : !isNaN( opts.multi ) ? opts.multi : drop.multi;
drop.delay = opts.delay || drop.delay;
drop.tolerance = $.isFunction( opts.tolerance ) ? opts.tolerance : 
opts.tolerance === null ? null : drop.tolerance;
drop.mode = opts.mode || drop.mode || 'overlap';
};
// local refs (increase compression)
var $event = $.event, 
$special = $event.special,
// configure the drop special event
drop = $.event.special.drop = {
// these are the default settings
multi: 1, // allow multiple drop winners per dragged element
delay: 20, // async timeout delay
mode: 'overlap', // drop tolerance mode
// internal cache
targets: [], 
// the key name for stored drop data
datakey: "dropdata",
// prevent bubbling for better performance
noBubble: true,
// count bound related events
add: function( obj ){ 
// read the interaction data
var data = $.data( this, drop.datakey );
// count another realted event
data.related += 1;
},
// forget unbound related events
remove: function(){
$.data( this, drop.datakey ).related -= 1;
},
// configure the interactions
setup: function(){
// check for related events
if ( $.data( this, drop.datakey ) ) 
return;
// initialize the drop element data
var data = { 
related: 0,
active: [],
anyactive: 0,
winner: 0,
location: {}
};
// store the drop data on the element
$.data( this, drop.datakey, data );
// store the drop target in internal cache
drop.targets.push( this );
},
// destroy the configure interaction
teardown: function(){ 
var data = $.data( this, drop.datakey ) || {};
// check for related events
if ( data.related )  
return;
// remove the stored data
$.removeData( this, drop.datakey );
// reference the targeted element
var element = this;
// remove from the internal cache
drop.targets = $.grep( drop.targets, function( target ){ 
return ( target !== element ); 
});
},
// shared event handler
handler: function( event, dd ){ 
// local vars
var results, $targets;
// make sure the right data is available
if ( !dd ) 
return;
// handle various events
switch ( event.type ){
// draginit, from $.event.special.drag
case 'mousedown': // DROPINIT >>
case 'touchstart': // DROPINIT >>
// collect and assign the drop targets
$targets =  $( drop.targets );
if ( typeof dd.drop == "string" )
$targets = $targets.filter( dd.drop );
// reset drop data winner properties
$targets.each(function(){
var data = $.data( this, drop.datakey );
data.active = [];
data.anyactive = 0;
data.winner = 0;
});
// set available target elements
dd.droppable = $targets;
// activate drop targets for the initial element being dragged
$special.drag.hijack( event, "dropinit", dd ); 
break;
// drag, from $.event.special.drag
case 'mousemove': // TOLERATE >>
case 'touchmove': // TOLERATE >>
drop.event = event; // store the mousemove event
if ( !drop.timer )
// monitor drop targets
drop.tolerate( dd ); 
break;
// dragend, from $.event.special.drag
case 'mouseup': // DROP >> DROPEND >>
case 'touchend': // DROP >> DROPEND >>
drop.timer = clearTimeout( drop.timer ); // delete timer
if ( dd.propagates ){
$special.drag.hijack( event, "drop", dd ); 
$special.drag.hijack( event, "dropend", dd ); 
}
break;
}
},

// returns the location positions of an element
locate: function( elem, index ){ 
var data = $.data( elem, drop.datakey ),
posi = xOffset(elem),
height = xHeight(elem), 
width = xWidth(elem);
var location = { 
elem: elem, 
width: width, 
height: height,
top: posi.top, 
left: posi.left, 
right: posi.left + width, 
bottom: posi.top + height
};
// drag elements might not have dropdata
if ( data ){
data.location = location;
data.index = index;
data.elem = elem;
}
return location;
},
// test the location positions of an element against another OR an X,Y coord
contains: function( target, test ){ // target { location } contains test [x,y] or { location }
return ( ( test[0] || test.left ) >= target.left && ( test[0] || test.right ) <= target.right
&& ( test[1] || test.top ) >= target.top && ( test[1] || test.bottom ) <= target.bottom ); 
},
// stored tolerance modes
modes: { // fn scope: "$.event.special.drop" object 
// target with mouse wins, else target with most overlap wins
'intersect': function( event, proxy, target ){
return this.contains( target, [ event.pageX, event.pageY ] ) ? // check cursor
1e9 : this.modes.overlap.apply( this, arguments ); // check overlap
},
// target with most overlap wins
'overlap': function( event, proxy, target ){
// calculate the area of overlap...
return Math.max( 0, Math.min( target.bottom, proxy.bottom ) - Math.max( target.top, proxy.top ) )
* Math.max( 0, Math.min( target.right, proxy.right ) - Math.max( target.left, proxy.left ) );
},
// proxy is completely contained within target bounds
'fit': function( event, proxy, target ){
return this.contains( target, proxy ) ? 1 : 0;
},
// center of the proxy is contained within target bounds
'middle': function( event, proxy, target ){
return this.contains( target, [ proxy.left + proxy.width * .5, proxy.top + proxy.height * .5 ] ) ? 1 : 0;
}
},
// sort drop target cache by by winner (dsc), then index (asc)
sort: function( a, b ){
return ( b.winner - a.winner ) || ( a.index - b.index );
},
// async, recursive tolerance execution
tolerate: function( dd ){
// declare local refs
var i, drp, drg, data, arr, len, elem,
// interaction iteration variables
x = 0, ia, end = dd.interactions.length,
// determine the mouse coords
xy = [ drop.event.pageX, drop.event.pageY ],
// custom or stored tolerance fn
tolerance = drop.tolerance || drop.modes[ drop.mode ];
// go through each passed interaction...
do if ( ia = dd.interactions[x] ){
// check valid interaction
if ( !ia )
return; 
// initialize or clear the drop data
ia.drop = [];
// holds the drop elements
arr = []; 
len = ia.droppable.length;
// determine the proxy location, if needed
if ( tolerance )
drg = drop.locate( ia.proxy ); 
// reset the loop
i = 0;
// loop each stored drop target
do if ( elem = ia.droppable[i] ){ 
data = $.data( elem, drop.datakey );
drp = data.location;
if ( !drp ) continue;
// find a winner: tolerance function is defined, call it
data.winner = tolerance ? tolerance.call( drop, drop.event, drg, drp ) 
// mouse position is always the fallback
: drop.contains( drp, xy ) ? 1 : 0; 
arr.push( data );
} while ( ++i < len ); // loop 
// sort the drop targets
arr.sort( drop.sort );
// reset the loop
i = 0;
// loop through all of the targets again
do if ( data = arr[ i ] ){
// winners...
if ( data.winner && ia.drop.length < drop.multi ){
// new winner... dropstart
if ( !data.active[x] && !data.anyactive ){
// check to make sure that this is not prevented
if ( $special.drag.hijack( drop.event, "dropstart", dd, x, data.elem )[0] !== false ){ 
data.active[x] = 1;
data.anyactive += 1;
}
// if false, it is not a winner
else
data.winner = 0;
}
// if it is still a winner
if ( data.winner )
ia.drop.push( data.elem );
}
// losers... 
else if ( data.active[x] && data.anyactive == 1 ){
// former winner... dropend
$special.drag.hijack( drop.event, "dropend", dd, x, data.elem ); 
data.active[x] = 0;
data.anyactive -= 1;
}
} while ( ++i < len ); // loop 
} while ( ++x < end ) // loop
// check if the mouse is still moving or is idle
if ( drop.last && xy[0] == drop.last.pageX && xy[1] == drop.last.pageY ) 
delete drop.timer; // idle, don't recurse
else  // recurse
drop.timer = setTimeout(function(){ 
drop.tolerate( dd ); 
}, drop.delay );
// remember event, to compare idleness
drop.last = drop.event; 
}
};
// share the same special event configuration with related events...
$special.dropinit = $special.dropstart = $special.dropend = drop;
})(pL);

(function($){
// local refs (increase compression)
var $event = $.event,
// ref the drop special event config
drop = $event.special.drop,
// old drop event add method
origadd = drop.add,
// old drop event teradown method
origteardown = drop.teardown;

// allow events to bubble for delegation
drop.noBubble = false;

// the namespace for internal live events
drop.livekey = "livedrop";

// new drop event add method
drop.add = function( obj ){ 
// call the old method
origadd.apply( this, arguments );
// read the data
var data = $.data( this, drop.datakey );
// bind the live "dropinit" delegator
if ( !data.live && obj.selector ){
data.live = true;
$event.add( this, "dropinit."+ drop.livekey, drop.delegate );
}
};

// new drop event teardown method
drop.teardown = function(){ 
// call the old method
origteardown.apply( this, arguments );
// read the data
var data = $.data( this, drop.datakey ) || {};
// remove the live "dropinit" delegator
if ( data.live ){
// remove the "live" delegation
$event.remove( this, "dropinit", drop.delegate );
data.live = false;
}
};

// identify potential delegate elements
drop.delegate = function( event, dd ){
// local refs
var elems = [], $targets, 
// element event structure
events = $.data( this, "events" ) || {};
// query live events
$.each( events || [], function( key, arr ){
// no event type matches
if ( key.indexOf("drop") !== 0 )
return;
$.each( arr, function( i, obj ){
// locate the elements to delegate
$targets = $( event.currentTarget ).find( obj.selector );
// no element found
if ( !$targets.length ) 
return;
// take each target...
$targets.each(function(){
// add an event handler
$event.add( this, obj.origType +'.'+ drop.livekey, obj.origHandler || obj.handler, obj.data );
// remember new elements
if ( $.inArray( this, elems ) < 0 )
elems.push( this );
});
});
});
// may not exist when artifically triggering dropinit event
if ( dd )
// clean-up after the interaction ends
$event.add( dd.drag, "dragend."+drop.livekey, function(){
$.each( elems.concat( this ), function(){
$event.remove( this, '.'+ drop.livekey );
});
});
//drop.delegates.push( elems );
return elems.length ? $( elems ) : false;
};

})( pL );
//helper drop end

/*
AccDC API Core
Support: http://whatsock.com/
*/

var $A = function(dc, dcA, dcI, onReady, disableAsync){
if (typeof dc === 'object' && !isArray(dc) && 'id' in dc){}
else {
disableAsync = onReady;
onReady = dcI;
dcI = dcA;
dcA = dc;
dc = null;
}
var fn = function(){
if (disableAsync) pL.ajaxSetup({async: false});
pL.accDC(dcA, dcI, dc);
if (disableAsync) pL.ajaxSetup({async: true});
};
if (onReady) pL(fn);
else fn();
};

$A.reg = {};

$A.fn = {
globalDC: {},
wheel: { },
debug: false
};

pL.extend($A, {

sraCSS: sraCSS,
sraCSSClear: sraCSSClear,
getEl: getEl,
createEl: createEl,
getAttr: getAttr,
remAttr: remAttr,
getText: getText,
css: css,
setAttr: setAttr,
inArray: inArray,
hasClass: hasClass,
addClass: addClass,
remClass: remClass,

globalDCMerge: function(){
$A.find('*', function(dc){
pL.extend(true, dc, $A.fn.globalDC);
});
},

genId: function(id){
return now(id || 'AccDC');
},

announce: function(str, noRepeat, aggr){
if (typeof str !== 'string')
str = getText(str);
return window.String.prototype.announce.apply(str, [str, null, noRepeat, aggr]);
},

query: function(sel, con, call){
if (con && typeof con === 'function'){
call = con;
con = null;
}
var r = [];
if (isArray(sel)) r = sel;
else if (typeof sel !== 'string') r.push(sel);
else pL.find(sel, con, r);
if (call && typeof call === 'function') pL.each(r, call);
return r;
},

find: function(ids, fn){
var ids = ids.split(',');
for (var id in $A.reg){
if (ids[0] === '*' || inArray(id, ids) !== -1)
fn.apply($A.reg[id], [$A.reg[id]]);
}
},

destroy: function(id, p){
if (!$A.reg[id]) return false;
var r = $A.reg[id],
a = r.accDCObj,
c = r.containerDiv;
if (p && r.loaded){
pL(a).after(c);
remAttr(c, 'id');
}
if (r.loaded)
pL(a).remove();
r.accDCObj = r.containerDiv = a = c = null;
var iv = r.indexVal,
wh = r.siblings;
wh.splice(iv, 1);
for (var i = 0; i < wh.length; i++){
wh[i].indexVal = i;
wh[i].siblings = wh;
}
if ($A.reg[id].parent && $A.reg[id].parent.children && $A.reg[id].parent.children.length){
var pc = -1,
cn = $A.reg[id].parent.children;
for (var i = 0; i < cn.length; i++){
if (cn[i].id == id) pc = i;
}
if (pc >= 0)
$A.reg[id].parent.children.splice(pc, 1);
}
delete $A.reg[id];
},

morph: function(dc, obj, dcI){
if (dc.nodeType === 1 && dc.nodeName){
dcI = obj;
obj = dc;
dc = null;
}
var c = {
fn: {
morph: true,
morphObj: obj
},
autoStart: true
};
pL.extend(c, dcI);
pL.accDC([c], null, dc);
},

setFocus: function(o){
var oTI = null;
if (getAttr(o, 'tabindex')) oTI = getAttr(o, 'tabindex');
setAttr(o, 'tabindex', -1);
o.focus();
if (oTI) setAttr(o, 'tabindex', oTI);
else remAttr(o, 'tabindex');
return o;
}

});

$A.load = function(target, source, hLoadData, callback){
return pL(target).load(source, hLoadData, callback);
};
$A.get = function(source, hGetData, callback, hGetType){
return pL.get(source, hGetData, callback, hGetType);
};
$A.getJSON = function(source, hJSONData, callback){
return pL.getJSON(source, hJSONData, callback);
};
$A.getScript = function(source, callback, disableAsync){
if (typeof callback === 'boolean'){
disableAsync = callback;
callback = null;
}
if (disableAsync) pL.ajaxSetup({async: false});
pL.getScript(source, callback);
if (disableAsync) pL.ajaxSetup({async: true});
};
$A.post = function(source, hPostData, callback, hPostType){
return pL.post(source, hPostData, callback, hPostType);
};
$A.ajax = function(ajaxOptions){
return pL.ajax(ajaxOptions);
};

$A.bind = function(ta, e, fn){
if (e == 'load' && (ta == 'body' || ta == window || ta == document || ta == document.body))
pL(document).ready(function(ev){
fn(ev);
});
else
pL(ta).bind(e, fn);
return ta;
};
$A.unbind = function(ta, e){
pL(ta).unbind(e);
return ta;
};
$A.trigger = function(ta, e){
pL(ta).trigger(e);
return ta;
};

window[(window.AccDCNamespace ? window.AccDCNamespace : '$A')] = $A;

var sraClass = 'sra' + now(),

sraTemp = '<span class="' + sraClass + '" style="position: absolute; clip: rect(1px 1px 1px 1px); padding: 0; border: 0; height: 1px; width: 1px; overflow: hidden; z-index: -1000;"></span>',

refDOM = function(dc){
var c = dc ? dc.accDCObj : document;
$A.query('.' + sraClass, c, function(){
css(this, {
display: '',
visibility: ''
});
pL(this).html('&nbsp;').html('');
css(this, {
display: 'none',
visibility: 'hidden'
});
});
},

calcPosition = function(dc, objArg, posVal){
var obj = objArg || dc.posAnchor;
if (obj && typeof obj == 'string') obj = pL(obj).get(0);
else if (!obj) obj = dc.triggerObj;
if (!obj) return;
var
autoPosition = posVal || dc.autoPosition,
pos = { },
aPos = {
height: xHeight(dc.accDCObj),
width: xWidth(dc.accDCObj)
},
oPos = xOffset(obj);
var position = css(dc.accDCObj, 'position');
if (position == 'relative'){
var po = xOffset(obj.parentNode),
co = xOffset(obj);
oPos = {
top: co.top - po.top,
left: co.left - po.left
};
} else if (position == 'fixed' && css(obj, 'position') == 'fixed')
oPos.top = obj.offsetTop;
oPos.height = xHeight(obj);
oPos.width = xWidth(obj);
if (autoPosition == 1){
pos.left = oPos.left;
pos.top = oPos.top - aPos.height;
} else if (autoPosition == 2){
pos.left = oPos.left + oPos.width;
pos.top = oPos.top - aPos.height;
} else if (autoPosition == 3){
pos.left = oPos.left + oPos.width;
pos.top = oPos.top;
} else if (autoPosition == 4){
pos.left = oPos.left + oPos.width;
pos.top = oPos.top + oPos.height;
} else if (autoPosition == 5){
pos.left = oPos.left;
pos.top = oPos.top + oPos.height;
} else if (autoPosition == 6){
pos.left = oPos.left - aPos.width;
pos.top = oPos.top + oPos.height;
} else if (autoPosition == 7){
pos.left = oPos.left - aPos.width;
pos.top = oPos.top;
} else if (autoPosition == 8){
pos.left = oPos.left - aPos.width;
pos.top = oPos.top - aPos.height;
} else if (autoPosition == 9){
pos.left = oPos.left;
pos.top = oPos.top;
} else if (autoPosition == 10){
pos.left = oPos.left + oPos.width - aPos.width;
pos.top = oPos.top - aPos.height;
} else if (autoPosition == 11){
pos.left = oPos.left + oPos.width - aPos.width;
pos.top = oPos.top;
} else if (autoPosition == 12){
pos.left = oPos.left + oPos.width - aPos.width;
pos.top = oPos.top + oPos.height;
}
if (typeof dc.offsetTop === 'number' && (dc.offsetTop < 0 || dc.offsetTop > 0))
pos.top += dc.offsetTop;
if (typeof dc.offsetLeft === 'number' && (dc.offsetLeft < 0 || dc.offsetLeft > 0))
pos.left += dc.offsetLeft;
css(dc.accDCObj, pos);
};

window.String.prototype.announce = function announce(strm, loop, noRep, aggr){
if (strm && strm.nodeName && strm.nodeType === 1) strm = getText(strm);
var obj = strm || this,
str = strm ? strm : this.toString();
if (typeof str !== 'string') return obj;
if (!loop) String.announce.alertMsgs.push(str);
if ((String.announce.alertMsgs.length == 1 || loop)){
var timeLength = String.announce.baseDelay + (String.announce.iterate(String.announce.alertMsgs[0], /\s|\,|\.|\:|\;|\!|\(|\)|\/|\?|\@|\#|\$|\%|\^|\&|\*|\\|\-|\_|\+|\=/g) * String.announce.charMultiplier);
if (!(noRep && String.announce.lastMsg == String.announce.alertMsgs[0])){
String.announce.lastMsg = String.announce.alertMsgs[0];
if (aggr)
String.announce.placeHolder2.innerHTML = String.announce.alertMsgs[0];
else
String.announce.placeHolder.innerHTML = String.announce.alertMsgs[0];
}
String.announce.alertTO = setTimeout(function(){
String.announce.placeHolder.innerHTML = String.announce.placeHolder2.innerHTML = '';
String.announce.alertMsgs.shift();
if (String.announce.alertMsgs.length >= 1)
announce(String.announce.alertMsgs[0], true, noRep, aggr);
}, timeLength);
}
return obj;
};

window.String.announce = {
alertMsgs: [],
clear: function(){
if (this.alertTO) clearTimeout(this.alertTO);
this.alertMsgs = [];
},
baseDelay: 1000,
charMultiplier: 10,
lastMsg: '',
iterate: function(str, regExp){
var iCount = 0;
str.replace(regExp, function(){
iCount++;
});
return iCount;
}
};

$A.bind(window, 'load', function(){
if (!String.announce.placeHolder){
String.announce.placeHolder = createEl('span', {
'aria-live': 'polite'
}, sraCSS);
pL('body').append(String.announce.placeHolder);
String.announce.placeHolder2 = createEl('span', {
role: 'alert'
}, sraCSS);
pL('body').append(String.announce.placeHolder2);
}
});

pL.accDC = function(accDCObjects, gImport, parentDC){
var wheel = [],
ids = [],

getScript = function(dc, u, f){
pL.ajax({
async: false,
type: "GET",
url: u,
data: null,
success: function(){
if (f) return f.apply(dc, arguments);
},
dataType: 'script'
});
},

changeTabs = function(dc, isClose){
var dc = wheel[dc.indexVal];
if (dc.isTab){
if (dc.tabState){
for (var w = 0; w < wheel.length; w++){
var wl = wheel[w];
if (wl.isTab){
var ss = pL(wl.triggerObj).data('sra');
if (ss){
if (wl.loaded){
pL(ss).html('<span>&nbsp;' + wl.tabRole + '&nbsp;' + wl.tabState + '</span>');
} else pL(ss).html('<span>&nbsp;' + wl.tabRole + '</span>');
}
}
}
$A.query(dc.trigger, function(){
if (this != dc.triggerObj){
pL(pL(this).data('sra')).html('<span>&nbsp;' + dc.tabRole + '</span>');
}
});
}
} else if (dc.isToggle){
if (dc.toggleState)
$A.query(dc.trigger, function(){
var ss = pL(this).data('sra');
if (ss){
if (!isClose){
pL(ss).html('<span>&nbsp;' + dc.toggleRole + '&nbsp;' + dc.toggleState + '</span>');
} else pL(ss).html('<span>&nbsp;' + dc.toggleRole + '</span>');
}
});
}
return wheel[dc.indexVal] = dc;
},

loadAccDCObj = function(dc){
var dc = wheel[dc.indexVal];
if ((dc.loaded && !dc.allowReopen && !dc.isToggle) || dc.fn.override || dc.lock || dc.loading || dc.closing)
return dc;
else if (dc.loaded && (dc.allowReopen || dc.isToggle)){
dc.fn.bypass = true;
closeAccDCObj(dc);
dc.fn.bypass = false;
if (dc.isToggle) return dc;
}
dc.cancel = false;
dc.content = '';
var nid = now();
dc.accDCObjId = dc.fn.accDCObjId = 'AccDC' + nid;
dc.closeId = 'AccDC' + (nid + (nowI+=1));
dc.containerId = dc.containerDivId = 'AccDC' + (nid + (nowI+=1));
if (dc.importCSS) dc.fn.importCSSId = 'AccDC' + (nid + (nowI+=1));
dc.fn.sraStart = createEl('div', null, sraCSS);
dc.fn.sraEnd = createEl('div', null, sraCSS);
pL(dc.fn.sraStart).html(sraTemp);
pL(dc.fn.sraEnd).html(sraTemp);
dc.containerDiv = createEl('div', {
id: dc.containerId
});
dc.accDCObj = createEl('div', {
id: dc.fn.accDCObjId
});
if (dc.className) addClass(dc.accDCObj, dc.className);
pL(dc.accDCObj)
.append(dc.fn.sraStart)
.append(dc.containerDiv)
.append(dc.fn.sraEnd);
$A.bind(dc.accDCObj, {
mouseover: function(ev){
dc.mouseOver.apply(this, [ev, dc]);
},
mouseout: function(ev){
dc.mouseOut.apply(this, [ev, dc]);
},
resize: function(ev){
dc.resize.apply(this, [ev, dc]);
},
scroll: function(ev){
dc.scroll.apply(this, [ev, dc]);
},
click: function(ev){
dc.click.apply(this, [ev, dc]);
},
dblclick: function(ev){
dc.dblClick.apply(this, [ev, dc]);
},
mousedown: function(ev){
dc.mouseDown.apply(this, [ev, dc]);
},
mouseup: function(ev){
dc.mouseUp.apply(this, [ev, dc]);
},
mousemove: function(ev){
dc.mouseMove.apply(this, [ev, dc]);
},
mouseenter: function(ev){
dc.mouseEnter.apply(this, [ev, dc]);
},
mouseleave: function(ev){
dc.mouseLeave.apply(this, [ev, dc]);
},
keydown: function(ev){
dc.keyDown.apply(this, [ev, dc]);
},
keypress: function(ev){
dc.keyPress.apply(this, [ev, dc]);
},
keyup: function(ev){
dc.keyUp.apply(this, [ev, dc]);
},
error: function(ev){
dc.error.apply(this, [ev, dc]);
},
focusin: function(ev){
dc.focusIn.apply(this, [ev, dc]);
},
focusout: function(ev){
dc.focusOut.apply(this, [ev, dc]);
}
});
if (!dc.ranJSOnceBefore){
dc.ranJSOnceBefore = true;
if (dc.reverseJSOrder){
dc.runOnceBefore.apply(dc, [dc]);
if (dc.allowCascade){
if (dc.fn.proto.runOnceBefore) dc.fn.proto.runOnceBefore.apply(dc, [dc]);
if ($A.fn.globalDC.runOnceBefore) $A.fn.globalDC.runOnceBefore.apply(dc, [dc]);
}
dc.reverseJSOrderPass = true;
}
if (dc.runJSOnceBefore.length){
for (var j = 0; j < dc.runJSOnceBefore.length; j++) getScript(dc, dc.runJSOnceBefore[j]);
}
if (dc.allowCascade){
if (dc.fn.proto.runJSOnceBefore && dc.fn.proto.runJSOnceBefore.length){
for (var j = 0; j < dc.fn.proto.runJSOnceBefore.length; j++) getScript(dc, dc.fn.proto.runJSOnceBefore[j]);
}
if ($A.fn.globalDC.runJSOnceBefore && $A.fn.globalDC.runJSOnceBefore.length){
for (var j = 0; j < $A.fn.globalDC.runJSOnceBefore.length; j++) getScript(dc, $A.fn.globalDC.runJSOnceBefore[j]);
}
}
if (!dc.reverseJSOrder && !dc.reverseJSOrderPass){
dc.runOnceBefore.apply(dc, [dc]);
if (dc.allowCascade){
if (dc.fn.proto.runOnceBefore) dc.fn.proto.runOnceBefore.apply(dc, [dc]);
if ($A.fn.globalDC.runOnceBefore) $A.fn.globalDC.runOnceBefore.apply(dc, [dc]);
}
} else dc.reverseJSOrderPass = false;
}
if (dc.reverseJSOrder){
dc.runBefore.apply(dc, [dc]);
if (dc.allowCascade){
if (dc.fn.proto.runBefore) dc.fn.proto.runBefore.apply(dc, [dc]);
if ($A.fn.globalDC.runBefore) $A.fn.globalDC.runBefore.apply(dc, [dc]);
}
dc.reverseJSOrderPass = true;
}
if (dc.runJSBefore.length){
for (var j = 0; j < dc.runJSBefore.length; j++) getScript(dc, dc.runJSBefore[j]);
}
if (dc.allowCascade){
if (dc.fn.proto.runJSBefore && dc.fn.proto.runJSBefore.length){
for (var j = 0; j < dc.fn.proto.runJSBefore.length; j++) getScript(dc, dc.fn.proto.runJSBefore[j]);
}
if ($A.fn.globalDC.runJSBefore && $A.fn.globalDC.runJSBefore.length){
for (var j = 0; j < $A.fn.globalDC.runJSBefore.length; j++) getScript(dc, $A.fn.globalDC.runJSBefore[j]);
}
}
if (!dc.reverseJSOrder && !dc.reverseJSOrderPass){
dc.runBefore.apply(dc, [dc]);
if (dc.allowCascade){
if (dc.fn.proto.runBefore) dc.fn.proto.runBefore.apply(dc, [dc]);
if ($A.fn.globalDC.runBefore) $A.fn.globalDC.runBefore.apply(dc, [dc]);
}
} else dc.reverseJSOrderPass = false;
if (dc.cancel){
dc.cancel = dc.loading = false;
return dc;
}
dc.loading = true;
if (dc.showHiddenBounds){
setAttr(dc.fn.sraStart, {
id: 'h' + now(),
role: 'heading',
'aria-level': dc.ariaLevel
});
pL(dc.fn.sraStart).append('<span>' + dc.role + '&nbsp;' + dc.accStart + '</span>');
if (dc.showHiddenClose){
dc.fn.closeLink = createEl('a', {
id: dc.closeId,
href: '#'
}, dc.sraCSS, dc.closeClassName);
dc.fn.closeLink.innerHTML = dc.accClose;
insertBefore(dc.fn.sraEnd, dc.fn.closeLink);
if (dc.displayHiddenClose)
$A.bind(dc.fn.closeLink, {
focus: function(){
sraCSSClear(this);
},
blur: function(){
css(this, dc.sraCSS);
}
});
else setAttr(dc.fn.closeLink, 'tabindex', '-1');
}
pL(dc.fn.sraEnd).append('<span>' + dc.role + '&nbsp;' + dc.accEnd + '</span>');
}
if (dc.forceFocus){
setAttr(dc.fn.sraStart, 'tabindex', -1);
css(dc.fn.sraStart, 'outline', 'none');
}
if (dc.displayInline)
css([dc.accDCObj, dc.containerDiv], 'display', 'inline');
switch (dc.mode){
case 1 :
pL(dc.containerDiv).load(dc.source, dc.hLoadData, function(responseText, textStatus, XMLHttpRequest){
dc.hLoad(responseText, textStatus, XMLHttpRequest, dc);
parseRemaining(dc);
});
break;
case 2 :
dc.request = pL.get(dc.source, dc.hGetData, function(source, textStatus){
dc.hGet(source, textStatus, dc);
dc.hSource(dc.content);
parseRemaining(dc);
}, dc.hGetType);
break;
case 3 :
dc.request = pL.getJSON(dc.source, dc.hJSONData, function(source, textStatus){
dc.hJSON(source, textStatus, dc);
dc.hSource(dc.content);
parseRemaining(dc);
});
break;
case 4 :
dc.request = pL.getScript(dc.source, function(source, textStatus){
dc.hScript(source, textStatus, dc);
dc.hSource(dc.content);
parseRemaining(dc);
});
break;
case 5 :
dc.request = pL.post(dc.source, dc.hPostData, function(source, textStatus){
dc.hPost(source, textStatus, dc);
dc.hSource(dc.content);
parseRemaining(dc);
}, dc.hPostType);
break;
case 6 :
dc.request = pL.ajax(dc.ajaxOptions);
break;
default :
dc.hSource(dc.source);
parseRemaining(dc);
}
return wheel[dc.indexVal] = dc;
},

parseRemaining = function(dc){
var dc = wheel[dc.indexVal];
dc.runDuring.apply(dc, [dc]);
if (dc.allowCascade){
if (dc.fn.proto.runDuring) dc.fn.proto.runDuring.apply(dc, [dc]);
if ($A.fn.globalDC.runDuring) $A.fn.globalDC.runDuring.apply(dc, [dc]);
}
if (dc.cancel){
dc.cancel = dc.loading = false;
return dc;
}
for (var w = 0; w < wheel.length; w++){
var wl = wheel[w];
if (wl.loaded && !wl.allowMultiple){
wl.fn.bypass = true;
dc.close(wl);
wl.fn.bypass = false;
}
}
css(dc.accDCObj, dc.cssObj);
if (dc.autoFix) setAutoFix(dc);
if (dc.fn.morph && dc.fn.morphObj){
pL(dc.fn.morphObj).after(dc.accDCObj);
pL(dc.containerDiv).append(dc.fn.morphObj);
dc.fn.morph = false;
} else if (dc.isStatic){
if (dc.append)
pL(dc.isStatic).append(dc.accDCObj);
else if (dc.prepend){
if (!firstChild(pL(dc.isStatic).get(0)))
pL(dc.isStatic).append(dc.accDCObj);
else
insertBefore(firstChild(pL(dc.isStatic).get(0)), dc.accDCObj);
}else
pL(dc.isStatic).html(dc.accDCObj);
}else if (dc.targetObj && (!dc.returnFocus || dc.triggerObj))
pL(dc.targetObj).after(dc.accDCObj);
else if (dc.triggerObj)
pL(dc.triggerObj).after(dc.accDCObj);
else if ($A.fn.debug)
alert('Error: The dc.triggerObj property must be programatically set if no trigger or targetObj is specified during setup. View the Traversal and Manipulation section in the WhatSock.com Core API documentation for additional details.');
if (dc.importCSS){
dc.fn.cssLink = createEl('link', {
id: dc.fn.importCSSId,
rel: 'stylesheet',
type: 'text/css',
href: dc.importCSS
});
dc.accDCObj.appendChild(dc.fn.cssLink);
}
if (dc.isDraggable && dc.drag.persist && dc.drag.x && dc.drag.y)
css(dc.accDCObj, {
left: dc.drag.x,
top: dc.drag.y
});
else if (dc.autoPosition > 0 && !dc.isStatic && !dc.autoFix)
calcPosition(dc);
var forceFocus = dc.forceFocus;
dc.loading = false;
dc.loaded = true;
if (dc.isTab || dc.isToggle)
changeTabs(dc);
$A.query('.' + dc.closeClassName, dc.accDCObj, function(){
$A.bind(this, 'click', function(ev){
dc.close();
ev.preventDefault();
});
});
$A.bind(dc.fn.closeLink, 'focus', function(ev){
dc.tabOut(ev, dc);
});
if (dc.timeoutVal)
dc.timer = setTimeout(function(){
dc.timeout(dc);
}, dc.timeoutVal);
if (dc.dropTarget && dc.accDD.on){
dc.accDD.dropTargets = [];
dc.accDD.dropAnchors = [];
$A.query(dc.dropTarget, function(){
dc.accDD.dropAnchors.push(this);
dc.accDD.dropTargets.push(this);
});
}
if (!dc.ranJSOnceAfter){
dc.ranJSOnceAfter = true;
if (dc.reverseJSOrder){
dc.runOnceAfter.apply(dc, [dc]);
if (dc.allowCascade){
if (dc.fn.proto.runOnceAfter) dc.fn.proto.runOnceAfter.apply(dc, [dc]);
if ($A.fn.globalDC.runOnceAfter) $A.fn.globalDC.runOnceAfter.apply(dc, [dc]);
}
dc.reverseJSOrderPass = true;
}
if (dc.runJSOnceAfter.length){
for (var j = 0; j < dc.runJSOnceAfter.length; j++) getScript(dc, dc.runJSOnceAfter[j]);
}
if (dc.allowCascade){
if (dc.fn.proto.runJSOnceAfter && dc.fn.proto.runJSOnceAfter.length){
for (var j = 0; j < dc.fn.proto.runJSOnceAfter.length; j++) getScript(dc, dc.fn.proto.runJSOnceAfter[j]);
}
if ($A.fn.globalDC.runJSOnceAfter && $A.fn.globalDC.runJSOnceAfter.length){
for (var j = 0; j < $A.fn.globalDC.runJSOnceAfter.length; j++) getScript(dc, $A.fn.globalDC.runJSOnceAfter[j]);
}
}
if (!dc.reverseJSOrder && !dc.reverseJSOrderPass){
dc.runOnceAfter.apply(dc, [dc]);
if (dc.allowCascade){
if (dc.fn.proto.runOnceAfter) dc.fn.proto.runOnceAfter.apply(dc, [dc]);
if ($A.fn.globalDC.runOnceAfter) $A.fn.globalDC.runOnceAfter.apply(dc, [dc]);
}
} else
dc.reverseJSOrderPass = false;
}
if (dc.reverseJSOrder){
dc.runAfter.apply(dc, [dc]);
if (dc.allowCascade){
if (dc.fn.proto.runAfter) dc.fn.proto.runAfter.apply(dc, [dc]);
if ($A.fn.globalDC.runAfter) $A.fn.globalDC.runAfter.apply(dc, [dc]);
}
dc.reverseJSOrderPass = true;
}
if (dc.runJSAfter.length){
for (var j = 0; j < dc.runJSAfter.length; j++) getScript(dc, dc.runJSAfter[j]);
}
if (dc.allowCascade){
if (dc.fn.proto.runJSAfter && dc.fn.proto.runJSAfter.length){
for (var j = 0; j < dc.fn.proto.runJSAfter.length; j++) getScript(dc, dc.fn.proto.runJSAfter[j]);
}
if ($A.fn.globalDC.runJSAfter && $A.fn.globalDC.runJSAfter.length){
for (var j = 0; j < $A.fn.globalDC.runJSAfter.length; j++) getScript(dc, $A.fn.globalDC.runJSAfter[j]);
}
}
if (!dc.reverseJSOrder && !dc.reverseJSOrderPass){
dc.runAfter.apply(dc, [dc]);
if (dc.allowCascade){
if (dc.fn.proto.runAfter) dc.fn.proto.runAfter.apply(dc, [dc]);
if ($A.fn.globalDC.runAfter) $A.fn.globalDC.runAfter.apply(dc, [dc]);
}
} else
dc.reverseJSOrderPass = false;
if ((parseInt(dc.shadow.horizontal) || parseInt(dc.shadow.vertical)) && dc.shadow.color)
setShadow(dc);
if (dc.autoFix && (!dc.isDraggable || !dc.drag.persist || !dc.drag.x || !dc.drag.y))
sizeAutoFix(dc);
if (dc.isDraggable)
setDrag(dc);
//refDOM(dc);
if (forceFocus)
$A.setFocus(dc.fn.sraStart);
if ($A.fn.debug && !getEl(dc.containerId))
alert('Error: The Automatic Accessibility Framework has been overwritten within the AccDC Dynamic Content Object with id=' + dc.id + '. New content should be added in a proper manner using the "source", "containerDiv", or "content" properties to ensure accessibility. View the Setup, Traversal and Manipulation, and Mode Handlers sections in the WhatSock.com Core API documentation for additional details.');
if (dc.announce) $A.announce(dc.containerDiv);
if ($A.bootstrap) $A.bootstrap(dc.containerDiv);
return wheel[dc.indexVal] = dc;
},

closeAccDCObj = function(dc){
var dc = wheel[dc.indexVal];
dc.runBeforeClose.apply(dc, [dc]);
if (dc.allowCascade){
if (dc.fn.proto.runBeforeClose) dc.fn.proto.runBeforeClose.apply(dc, [dc]);
if ($A.fn.globalDC.runBeforeClose) $A.fn.globalDC.runBeforeClose.apply(dc, [dc]);
}
if (!dc.loaded || dc.lock) return dc;
dc.closing = true;
if (dc.isDraggable)
unsetDrag(dc);
pL(dc.accDCObj).remove();
if (dc.fn.containsFocus && !dc.fn.bypass)
dc.fn.toggleFocus = true;
dc.fn.override = true;
if (dc.returnFocus && dc.triggerObj && !dc.fn.bypass){
if (dc.triggerObj.nodeName.toLowerCase() == 'form'){
var s = pL(dc.triggerObj).find('[type=submit]').get(0);
if (s && s.focus) s.focus();
} else {
if (dc.triggerObj.focus) dc.triggerObj.focus();
else $A.setFocus(dc.triggerObj);
}
}
dc.loaded = dc.fn.override = false;
if (dc.isTab || dc.isToggle)
changeTabs(dc, true);
dc.fn.triggerObj = dc.triggerObj;
dc.closing = false;
dc.runAfterClose.apply(dc, [dc]);
if (dc.allowCascade){
if (dc.fn.proto.runAfterClose) dc.fn.proto.runAfterClose.apply(dc, [dc]);
if ($A.fn.globalDC.runAfterClose) $A.fn.globalDC.runAfterClose.apply(dc, [dc]);
}
return wheel[dc.indexVal] = dc;
},

unsetTrigger = function(dc){
var dc = wheel[dc.indexVal];
$A.query(dc.fn.triggerB, function(){
$A.unbind(this, dc.fn.bindB);
if (dc.isTab || dc.isToggle)
pL(this).data('sra').remove();
});
dc.fn.triggerB = dc.fn.bindB = '';
return wheel[dc.indexVal] = dc;
},

setTrigger = function(dc){
var dc = wheel[dc.indexVal];
unsetTrigger(dc);
return wheel[dc.indexVal] = setBindings(dc);
},

setAutoFix = function(dc){
var dc = wheel[dc.indexVal];
if (!dc.loading && !dc.loaded) return dc;
var cs = {
position: 'fixed',
right: '',
bottom: '',
top: '',
left: ''
};
switch (dc.autoFix){
case 1 :
cs.top = 0;
cs.left = '40%';
break;
case 2 :
cs.top = 0;
cs.right = 0;
break;
case 3 :
cs.top = '40%';
cs.right = 0;
break;
case 4 :
cs.bottom = 0;
cs.right = 0;
break;
case 5 :
cs.bottom = 0;
cs.left = '40%';
break;
case 6 :
cs.bottom = 0;
cs.left = 0;
break;
case 7 :
cs.top = '40%';
cs.left = 0;
break;
case 8 :
cs.top = 0;
cs.left = 0;
break;
case 9 :
cs.top = '40%';
cs.left = '40%';
default :
cs = dc.cssObj;
}
css(dc.accDCObj, cs);
return wheel[dc.indexVal] = dc;
},

sizeAutoFix = function(dc){
var dc = wheel[dc.indexVal];
if (!dc.loading && !dc.loaded) return dc;
var win = getWin();
var bodyW = win.width,
bodyH = win.height,
aW = xWidth(dc.accDCObj),
aH = xHeight(dc.accDCObj);
if (bodyW > aW) var npw = parseInt(aW / bodyW * 100 / 2);
else var npw = 50;
if (bodyH > aH) var nph = parseInt(aH / bodyH * 100 / 2);
else var nph = 50;
switch (dc.autoFix){
case 1 :
case 5 :
css(dc.accDCObj, 'left', 50 - npw + '%');
break;
case 3 :
case 7 :
css(dc.accDCObj, 'top', 50 - nph + '%');
break;
case 9 :
css(dc.accDCObj, {
left: 50 - npw + '%',
top: 50 - nph + '%'
});
}
if (dc.offsetTop < 0 || dc.offsetTop > 0 || dc.offsetLeft < 0 || dc.offsetLeft > 0){
var cs = xOffset(dc.accDCObj);
cs.top = dc.accDCObj.offsetTop;
cs.top += dc.offsetTop;
cs.left += dc.offsetLeft;
css(dc.accDCObj, cs);
}
return wheel[dc.indexVal] = dc;
},

setShadow = function(dc){
var dc = wheel[dc.indexVal];
css(dc.accDCObj, {
'box-shadow': dc.shadow.horizontal + ' ' + dc.shadow.vertical + ' ' + dc.shadow.blur + ' ' + dc.shadow.color,
'-webkit-box-shadow': dc.shadow.horizontal + ' ' + dc.shadow.vertical + ' ' + dc.shadow.blur + ' ' + dc.shadow.color,
'-moz-box-shadow': dc.shadow.horizontal + ' ' + dc.shadow.vertical + ' ' + dc.shadow.blur + ' ' + dc.shadow.color
});
return wheel[dc.indexVal] = dc;
},

setDrag = function(dc){
var dc = wheel[dc.indexVal];
if ((!dc.loading && !dc.loaded) || dc.fn.isDragSet) return dc;
dc.fn.isDragSet = true;
var opts = {},
save = {};
if (dc.drag.handle) opts.handle = pL(dc.drag.handle).get(0);
if (css(dc.accDCObj, 'position') == 'relative') opts.relative = true;
if (dc.drag.minDistance && dc.drag.minDistance > 0)
opts.distance = dc.drag.minDistance;
dc.drag.confineToN = null;
pL(dc.accDCObj)

.drag('init', function(ev, dd){
dc.fn.isDragging = true;
var position = css(this, 'position');
if (position == 'fixed')
css(this, {
top: dd.offsetY,
left: dd.offsetX,
right: '',
bottom: ''
});
else if (position == 'relative'){
var po = xOffset(this.parentNode),
co = xOffset(this);
css(this, {
top: co.top - po.top,
left: co.left - po.left
});
} else css(this, xOffset(this));
if (typeof dc.drag.confineTo === 'string')
dc.drag.confineToN = $A.query(dc.drag.confineTo)[0];
else if (dc.drag.confineTo && dc.drag.confineTo.nodeName)
dc.drag.confineToN = dc.drag.confineTo;
if (dc.drag.confineToN && dc.drag.confineToN.nodeName){
save.nFixed = false;
var npos = css(dc.drag.confineToN, 'position');
if (css(this, 'position') == 'relative'){
dc.drag.confineToN = this.parentNode;
dd.limit = {
top: 0,
left: 0
};
} else if (npos == 'fixed'){
save.nFixed = true;
dd.limit = {
top: dc.drag.confineToN.offsetTop,
left: xOffset(dc.drag.confineToN).left
};
} else
dd.limit = xOffset(dc.drag.confineToN);
dd.limit.bottom = dd.limit.top + xHeight(dc.drag.confineToN);
dd.limit.right = dd.limit.left + xWidth(dc.drag.confineToN);
}
if (dc.drag.init && typeof dc.drag.init === 'function')
dc.drag.init.apply(this, [ev, dd, dc]);
})

.drag('start', function(ev, dd){
dc.onDragStart.apply(this, [ev, dd, dc]);
})

.drag(function(ev, dd){
if (save.y != dd.offsetY || save.x != dd.offsetX){
var position = css(this, 'position');
if (dc.drag.override && typeof dc.drag.override === 'function')
dc.drag.override.apply(this, [ev, dd, dc]);

else if (dc.drag.confineToN && dc.drag.confineToN.nodeName){
var n = {
top: dd.offsetY,
left: dd.offsetX
},
height = xHeight(this),
width = xWidth(this);
if (n.top >= dd.limit.top && (n.top + height) <= dd.limit.bottom)
xTop(this, n.top);
if (n.left >= dd.limit.left && (n.left + width) <= dd.limit.right)
xLeft(this, n.left);

} else if (typeof dc.drag.maxX === 'number' || typeof dc.drag.maxY === 'number'){
if (typeof dc.drag.maxX === 'number' && ((dd.originalX < dd.offsetX && (dd.offsetX - dd.originalX) <= dc.drag.maxX) || (dd.originalX > dd.offsetX && (dd.originalX - dd.offsetX) <= dc.drag.maxX)))
xLeft(this, dd.offsetX);
if (typeof dc.drag.maxY === 'number' && ((dd.originalY < dd.offsetY && (dd.offsetY - dd.originalY) <= dc.drag.maxY) || (dd.originalY > dd.offsetY && (dd.originalY - dd.offsetY) <= dc.drag.maxY)))
xTop(this, dd.offsetY);

}else{
xTop(this, dd.offsetY);
xLeft(this, dd.offsetX);
}

dc.onDrag.apply(this, [ev, dd, dc]);
save.y = dd.offsetY;
save.x = dd.offsetX;
}
})

.drag('end', function(ev, dd){
dc.fn.isDragging = false;
dc.drag.y = dd.offsetY;
dc.drag.x = dd.offsetX;
dc.onDragEnd.apply(this, [ev, dd, dc]);
}, opts);

if (dc.dropTarget){
pL(dc.dropTarget)

.drop('init', function(ev, dd){
if (dc.fn.isDragging){
if (dc.dropInit && typeof dc.dropInit === 'function')
dc.dropInit.apply(this, [ev, dd, dc]);
}
})

.drop('start', function(ev, dd){
if (dc.fn.isDragging)
dc.onDropStart.apply(this, [ev, dd, dc]);
})

.drop(function(ev, dd){
if (dc.fn.isDragging)
dc.onDrop.apply(this, [ev, dd, dc]);
})

.drop('end', function(ev, dd){
if (dc.fn.isDragging)
dc.onDropEnd.apply(this, [ev, dd, dc]);
});

pL.drop(dc.drop);
if (dc.accDD.on){
dc.accDD.dropLinks = [];
$A.query(dc.accDD.dropTargets, function(i, v){
dc.accDD.dropLinks.push(createEl('a', {
href: '#'
}, null, dc.accDD.dropClassName, createText(dc.accDD.dropText + ' ' + dc.role)));
});
var da = pL(dc.accDD.dropAnchor).get(0);
if (da) dc.accDD.dropAnchors[0] = da;
dc.accDD.dragLink = createEl('a', {
href: '#'
}, dc.sraCSS, dc.accDD.dragClassName, createText(dc.accDD.dragText + ' ' + dc.role));
pL(dc.containerDiv).append(dc.accDD.dragLink);
$A.bind(dc.accDD.dragLink, {
focus: function(ev){
css(sraCSSClear(this), {
position: 'relative',
zIndex: 1000
}, dc.accDD.dragLinkStyle);
},
blur: function(ev){
css(this, dc.sraCSS);
},
click: function(ev){
if (dc.accDD.isDragging){
dc.accDD.isDragging = false;
pL.each(dc.accDD.dropLinks, function(i, v){
pL(v).remove();
});
pL(dc.accDD.dragLink).html(dc.accDD.dragText + '&nbsp;' + dc.role);
} else {
dc.accDD.isDragging = true;
pL.each(dc.accDD.dropLinks, function(i, v){
css(v, dc.sraCSS);
insertBefore(dc.accDD.dropAnchors[i], v);
$A.bind(v, {
focus: function(ev){
var pos = xOffset(dc.accDD.dropAnchors[i]),
rel = 'absolute';
var position = css(dc.accDD.dropAnchors[i], 'position');
if (position == 'fixed'){
pos.top = dc.accDD.dropAnchors[i].offsetTop;
rel = 'fixed';
} else if (position == 'relative'){
pos.top = xOffset(dc.accDD.dropAnchors[i]).top - xOffset(dc.accDD.dropAnchors[i].parentNode).top;
pos.left = xOffset(dc.accDD.dropAnchors[i]).left - xOffset(dc.accDD.dropAnchors[i].parentNode).left;
rel = 'relative';
}
css(sraCSSClear(this), {
position: rel,
zIndex: 1000,
top: pos.top,
left: pos.left
}, dc.accDD.dropLinkStyle);
},
blur: function(ev){
css(this, dc.sraCSS);
},
click: function(ev){
dc.accDD.isDragging = false;
pL(dc.accDD.dragLink).html(dc.accDD.dragText + '&nbsp;' + dc.role);
pL.each(dc.accDD.dropLinks, function(e, g){
pL(g).remove();
});
dc.accDD.fireDrop.apply(dc.accDD.dropTargets[i], [ev, dc]);
$A.setFocus(dc.accDD.dropTargets[i]);
ev.preventDefault();
}
});
});
pL(dc.accDD.dragLink).html(dc.accDD.actionText + '&nbsp;' + dc.role);
dc.accDD.fireDrag.apply(dc.accDCObj, [ev, dc]);
}
ev.preventDefault();
}
});
}
}
return wheel[dc.indexVal] = dc;
},

unsetDrag = function(dc, uDrop){
var dc = wheel[dc.indexVal];
if (!dc.closing && !dc.loaded) return dc;
if (dc.drag.handle)
$A.unbind(dc.drag.handle, 'draginit dragstart dragend drag');
else
$A.unbind(dc.accDCObj, 'draginit dragstart dragend drag');
if (dc.dropTarget){
if (uDrop)
$A.unbind(dc.dropTarget, 'dropinit dropstart dropend drop');
if (dc.accDD.on){
pL.each(dc.accDD.dropLinks, function(i, v){
pL(v).remove();
});
pL(dc.accDD.dragLink).remove();
}
}
dc.fn.isDragSet = false;
return wheel[dc.indexVal] = dc;
},

autoStart = [],

setBindings = function(dc){
dc.fn.toggleFocus = dc.fn.containsFocus = false;
dc.bind = dc.binders || dc.bind;
if (inArray('focus', dc.bind.split(' ')) >= 0) dc.fn.containsFocus = true;
dc.fn.triggerB = dc.trigger;
dc.fn.bindB = dc.bind;
$A.query(dc.trigger, function(){
if (this.nodeName.toLowerCase() == 'a' && !this.href) setAttr(this, 'href', '#');
pL(this).bind(dc.bind, function(ev){
dc.triggerObj = this;
dc.open();
ev.preventDefault();
});
if ((dc.isTab && (dc.tabRole || dc.tabState)) || (dc.isToggle && (dc.toggleRole || dc.toggleState))){
var ss = createEl('span', null, sraCSS);
pL(this).append(ss);
pL(this).data('sra', ss);
dc.fn.sraCSSObj = ss;
}
if (dc.isTab)
pL(ss).html(dc.loaded ? ('<span>&nbsp;' + dc.tabRole + '&nbsp;' + dc.tabState + '</span>') : ('<span>&nbsp;' + dc.tabRole + '</span>'));
else if (dc.isToggle)
pL(ss).html(dc.loaded ? ('<span>&nbsp;' + dc.toggleRole + '&nbsp;' + dc.toggleState + '</span>') : ('<span>&nbsp;' + dc.toggleRole + '</span>'));
});
return dc;
},

AccDCInit = function(dc){
dc = setBindings(dc);
dc.sraCSS = sraCSS;
dc.sraCSSClear = sraCSSClear;
var f = function(){};
f.prototype = dc;
return window[(window.AccDCNamespace ? window.AccDCNamespace : '$A')].reg[dc.id] = $A.reg[dc.id] = new f();
},

svs = ['runJSOnceBefore', 'runOnceBefore', 'runJSBefore', 'runBefore', 'runDuring', 'runJSOnceAfter', 'runOnceAfter', 'runJSAfter', 'runAfter', 'runBeforeClose', 'runAfterClose'];

for (var a = 0; a < accDCObjects.length; a++){
var dc = {
id: '',

fn: {},

trigger: '',
setTrigger: function(dc){
var dc = dc || this;
if (!dc.trigger || !dc.bind){
if ($A.fn.debug)
alert('Error: Both of the dc.trigger and dc.bind properties must be set before this function can be used. View the Setup section in the WhatSock.com Core API documentation for additional details.');
return dc;
}
return setTrigger(dc);
},
unsetTrigger: function(dc){
var dc = dc || this;
if (!dc.fn.triggerB || !dc.fn.bindB) return dc;
return unsetTrigger(dc);
},
targetObj: null,

role: '',
accStart: 'Start',
accEnd: 'End',
accClose: 'Close',
ariaLevel: 2,
showHiddenClose: true,
displayHiddenClose: true,
showHiddenBounds: true,
source: '',
bind: '',
displayInline: false,

allowCascade: false,
reverseJSOrder: false,
runJSOnceBefore: [ ],
runOnceBefore: function(dc){ },
runJSBefore: [ ],
runBefore: function(dc){ },
runDuring: function(dc){ },
runJSOnceAfter: [ ],
runOnceAfter: function(dc){ },
runJSAfter: [ ],
runAfter: function(dc){ },
runBeforeClose: function(dc){ },
runAfterClose: function(dc){ },

allowMultiple: false,
allowReopen: false,
isToggle: false,
toggleRole: '',
toggleState: '',
forceFocus: false,
returnFocus: true,
isStatic: '',
prepend: false,
append: false,
isTab: false,
tabRole: 'Tab',
tabState: 'Selected',
autoStart: false,
announce: false,
lock: false,
mode: 0,

hSource: function(source, dc){
var dc = dc || this;
pL(dc.containerDiv).html(source);
return dc;
},
hLoadData: '',
hLoad: function(responseText, textStatus, XMLHttpRequest, dc){ },
hGetData: { },
hGetType: '',
hGet: function(data, textStatus, dc){ },
hJSONData: { },
hJSON: function(data, textStatus, dc){ },
hScript: function(data, textStatus, dc){ },
hPostData: { },
hPostType: '',
hPost: function(data, textStatus, dc){ },
ajaxOptions: {
beforeSend: function(XMLHttpRequest){
dc.hBeforeSend(this, XMLHttpRequest, dc);
},
success: function(source, textStatus, XMLHttpRequest){
dc.hSuccess(this, source, textStatus, XMLHttpRequest, dc);
dc.hSource(dc.content);
parseRemaining(dc);
},
complete: function(XMLHttpRequest, textStatus){
dc.hComplete(this, XMLHttpRequest, textStatus, dc);
},
error: function (XMLHttpRequest, textStatus, errorThrown){
dc.hError(this, XMLHttpRequest, textStatus, errorThrown, dc);
}
},
hBeforeSend: function(options, XMLHttpRequest, dc){ },
hSuccess: function(options, data, textStatus, XMLHttpRequest, dc){
dc.content = data;
},
hComplete: function(options, XMLHttpRequest, textStatus, dc){ },
hError: function(options, XMLHttpRequest, textStatus, errorThrown, dc){ },

open: function(dc){
var dc = dc || this;
if (dc.fn.toggleFocus)
dc.fn.toggleFocus = false;
else
loadAccDCObj(dc);
return dc;
},
close: function(dc){
var dc = dc || this;
return closeAccDCObj(dc);
},

isDraggable: false,
drag: {
handle: null,
maxX: null,
maxY: null,
persist: false,
x: null,
y: null,
confineTo: null,
init: null,
override: null
},
onDragStart: function(ev, dd, dc){ },
onDragEnd: function(ev, dd, dc){ },
onDrag: function(ev, dd, dc){ },
dropTarget: null,
dropInit: null,
drop: {},
onDropStart: function(ev, dd, dc){ },
onDrop: function(ev, dd, dc){ },
onDropEnd: function(ev, dd, dc){ },
setDrag: function(dc){
var dc = dc || this;
if (dc.dropTarget && dc.accDD.on){
dc.accDD.dropTargets = [];
dc.accDD.dropAnchors = [];
$A.query(dc.dropTarget, function(){
dc.accDD.dropAnchors.push(this);
dc.accDD.dropTargets.push(this);
});
}
return setDrag(dc);
},
unsetDrag: function(dc, uDrop){
if (dc && typeof dc === 'boolean'){
uDrop = dc;
dc = this;
} else var dc = dc || this;
unsetDrag(dc, uDrop);
return dc;
},
accDD: {
on: false,
dragText: 'Drag',
dropText: 'Drop',
dropAnchor: null,
dropAnchors: [],
dropTargets: [],
actionText: 'Dragging',
isDragging: false,
dragClassName: '',
dropClassName: '',
dragLinkStyle: {},
dropLinkStyle: {},
duration: 500,
fireDrag: function(ev, dc){
var os = xOffset(this);
dc.accDD.dragDD = {
drag: this,
proxy: this,
drop: dc.accDD.dropTargets,
available: dc.accDD.dropTargets,
update: function(dc){
dc.accDD.dropTargets = [];
dc.accDD.dropAnchors = [];
$A.query(dc.dropTarget, function(){
dc.accDD.dropAnchors.push(this);
dc.accDD.dropTargets.push(this);
});
dc.accDD.dropLinks = [];
pL.each(dc.accDD.dropTargets, function(i, v){
dc.accDD.dropLinks.push(createEl('a', {
href: '#'
}, null, dc.accDD.dropClassName, dc.accDD.dropText + '&nbsp;' + dc.role));
});
var da = pL(dc.accDD.dropAnchor).get(0);
if (da) dc.accDD.dropAnchors[0] = da;
return dc.accDD.dragDD.drop = dc.accDD.dragDD.available = dc.accDD.dropTargets;
},
startX: os.left + (xWidth(this) / 2),
startY: os.top + (xHeight(this) / 2),
deltaX: 0,
deltaY: 0,
originalX: os.left,
originalY: os.top,
offsetX: 0,
offsetY: 0
};
dc.accDD.dragDD.target = pL(dc.drag.handle).get(0) || this;
var position = css(this, 'position');
if (position == 'fixed')
dc.accDD.dragDD.originalY = this.offsetTop;
else if (position == 'relative'){
dc.accDD.dragDD.originalY = xOffset(this).top - xOffset(this.parentNode).top;
dc.accDD.dragDD.originalX = xOffset(this).left - xOffset(this.parentNode).left;
}
},
fireDrop: function(ev, dc){
$A.announce(dc.accDD.actionText);
dc.onDragStart.apply(dc.accDD.dragDD.target, [ev, dc.accDD.dragDD, dc]);
var os = xOffset(this);
dc.accDD.dropDD = {
target: this,
drag: dc.accDD.dragDD.drag,
proxy: dc.accDD.dragDD.proxy,
drop: dc.accDD.dragDD.drop,
available: dc.accDD.dragDD.available,
update: function(dc){
return dc.accDD.dropDD.drop = dc.accDD.dropDD.available = dc.accDD.dragDD.update(dc);
},
startX: dc.accDD.dragDD.startX,
startY: dc.accDD.dragDD.startY,
originalX: dc.accDD.dragDD.originalX,
originalY: dc.accDD.dragDD.originalY,
deltaX: 0,
deltaY: 0,
offsetX: os.left,
offsetY: os.top
};
var position = css(this, 'position');
if (position == 'fixed')
dc.accDD.dropDD.offsetY = this.offsetTop;
else if (position == 'relative'){
dc.accDD.dropDD.offsetY = xOffset(this).top - xOffset(this.parentNode).top;
dc.accDD.dropDD.offsetX = xOffset(this).left - xOffset(this.parentNode).left;
}
function update(){
var position = css(dc.accDD.dragDD.drag, 'position'),
os = xOffset(dc.accDD.dragDD.drag);
dc.accDD.dragDD.offsetY = os.top;
dc.accDD.dragDD.offsetX = os.left;
if (position == 'fixed')
dc.accDD.dragDD.offsetY = dc.accDD.dragDD.drag.offsetTop;
else if (position == 'relative'){
dc.accDD.dragDD.offsetY = xOffset(dc.accDD.dragDD.drag).top - xOffset(dc.accDD.dragDD.drag.parentNode).top;
dc.accDD.dragDD.offsetX = xOffset(dc.accDD.dragDD.drag).left - xOffset(dc.accDD.dragDD.drag.parentNode).left;
}
}
transition(dc.accDD.dragDD.drag, {
top: dc.accDD.dropDD.offsetY,
left: dc.accDD.dropDD.offsetX
}, {
duration: dc.accDD.duration,
step: function(){
update();
dc.onDrag.apply(dc.accDD.dragDD.target, [ev, dc.accDD.dragDD, dc]);
},
complete: function(){
update();
if (dc.accDD.dragDD.originalY <= dc.accDD.dragDD.offsetY)
dc.accDD.dragDD.deltaY = dc.accDD.dropDD.deltaY = dc.accDD.dragDD.originalY - dc.accDD.dragDD.offsetY;
else if (dc.accDD.dragDD.originalY >= dc.accDD.dragDD.offsetY)
dc.accDD.dragDD.deltaY = dc.accDD.dropDD.deltaY = 0 - (dc.accDD.dragDD.offsetY - dc.accDD.dragDD.originalY);
if (dc.accDD.dragDD.originalX <= dc.accDD.dragDD.offsetX)
dc.accDD.dragDD.deltaX = dc.accDD.dropDD.deltaX = dc.accDD.dragDD.originalX - dc.accDD.dragDD.offsetX;
else if (dc.accDD.dragDD.originalX >= dc.accDD.dragDD.offsetX)
dc.accDD.dragDD.deltaX = dc.accDD.dropDD.deltaX = 0 - (dc.accDD.dragDD.offsetX - dc.accDD.dragDD.originalX);
dc.onDropStart.apply(dc.accDD.dropDD.target, [ev, dc.accDD.dropDD, dc]);
dc.onDrop.apply(dc.accDD.dropDD.target, [ev, dc.accDD.dropDD, dc]);
dc.onDropEnd.apply(dc.accDD.dropDD.target, [ev, dc.accDD.dropDD, dc]);
dc.onDragEnd.apply(dc.accDD.dragDD.target, [ev, dc.accDD.dragDD, dc]);
}
});
}
},

mouseOver: function(ev, dc){ },
mouseOut: function(ev, dc){ },
resize: function(ev, dc){ },
scroll: function(ev, dc){ },
click: function(ev, dc){ },
dblClick: function(ev, dc){ },
mouseDown: function(ev, dc){ },
mouseUp: function(ev, dc){ },
mouseMove: function(ev, dc){ },
mouseEnter: function(ev, dc){ },
mouseLeave: function(ev, dc){ },
keyDown: function(ev, dc){ },
keyPress: function(ev, dc){ },
keyUp: function(ev, dc){ },
error: function(ev, dc){ },
focusIn: function(ev, dc){ },
focusOut: function(ev, dc){ },
tabOut: function(ev, dc){ },
timeoutVal: 0,
timeout: function(dc){ },

className: '',
closeClassName: 'accDCCloseCls',
cssObj: { },
importCSS: '',
css: function(prop, val, mergeCSS, dc){
var dc = dc || this;
if (typeof prop === 'string' && val){
if (mergeCSS)
dc.cssObj[prop] = val;
css(dc.accDCObj, prop, val);
return dc;
} else if (prop && typeof prop === 'object'){
if (val && typeof val === 'boolean')
pL.extend(dc.cssObj, prop);
css(dc.accDCObj, prop);
return dc;
} else if (prop && typeof prop === 'string')
return css(dc.accDCObj, prop);
},

children: [],
parent: null,

autoPosition: 0,
offsetTop: 0,
offsetLeft: 0,
offsetParent: null,
posAnchor: null,
setPosition: function(obj, posVal, save, dc){
if (typeof obj === 'number'){
dc = save;
save = posVal;
posVal = obj;
}
var dc = dc || this;
if (save){
dc.posAnchor = obj || dc.posAnchor;
dc.autoPosition = posVal || dc.autoPosition;
}
calcPosition(dc, obj, posVal);
return dc;
},

applyFix: function(val, dc){
var dc = dc || this;
if (val)
dc.autoFix = val;
setAutoFix(dc);
if (dc.autoFix > 0)
sizeAutoFix(dc);
return dc;
},

shadow: {
horizontal: '0px',
vertical: '0px',
blur: '0px',
color: ''
},
setShadow: function(dc, shadow){
if (arguments.length === 1 && !('id' in dc)){
shadow = dc;
dc = this;
}
if (shadow)
pL.extend(dc.shadow, shadow);
return setShadow(dc);
},

AccDCInit: function(){
return this;
}

},

aO = accDCObjects[a],
gImport = gImport || {},
gO = {},
iO = {};

if (aO.mode == 6) var ajaxOptions = dc.ajaxOptions;

if (typeof aO.allowCascade !== 'boolean')
aO.allowCascade = gImport.allowCascade;
if (typeof aO.allowCascade !== 'boolean')
aO.allowCascade = $A.fn.globalDC.allowCascade || dc.allowCascade;

if (aO.allowCascade){
for (var s = 0; s < svs.length; s++){
gO[svs[s]] = $A.fn.globalDC[svs[s]];
iO[svs[s]] = gImport[svs[s]];
}
}

if (!pL.isEmptyObject($A.fn.globalDC)) pL.extend(true, dc, $A.fn.globalDC);

if (!pL.isEmptyObject(gImport)) pL.extend(true, dc, gImport);

pL.extend(true, dc, aO);

if (aO.mode == 6 && ajaxOptions) pL.extend(dc.ajaxOptions, ajaxOptions);

if (dc.allowCascade){
for (var s = 0; s < svs.length; s++){
$A.fn.globalDC[svs[s]] = gO[svs[s]];
}
dc.fn.proto = iO;
}

if (dc.id && dc.role){
ids.push(dc.id);
if (dc.autoStart) autoStart.push(dc.id);
dc.indexVal = wheel.length;
wheel[dc.indexVal] = AccDCInit(dc);

if (parentDC){
var chk = -1,
p = $A.reg[parentDC.id],
c = $A.reg[wheel[dc.indexVal].id];
for (var i = 0; i < p.children.length; i++){
if (c.id === p.children[i].id)
chk = i;
}
if (chk >= 0)
p.children.slice(chk, 1, c);
else
p.children.push(c);
c.parent = p;
var t = c;
while(t.parent) t = t.parent;
c.top = t;
} else
wheel[dc.indexVal].top = wheel[dc.indexVal];

} else if ($A.fn.debug)
alert('Error: To ensure both proper functionality and accessibility, every AccDC Dynamic Content Object must have a unique ID and an informative ROLE. View the Setup and Automatic Accessibility Framework sections in the WhatSock.com Core API documentation for additional details.');

}

for (var a = 0; a < wheel.length; a++)
wheel[a].siblings = wheel;

for (var s = 0; s < autoStart.length; s++){
var dc = $A.reg[autoStart[s]];
var t = pL(dc.trigger).get(0);
dc.triggerObj = t ? t : null;
dc.open();
}

};

if (window.InitAccDC && window.InitAccDC.length){
pL.ajaxSetup({async: false});
for (var i = 0; i < window.InitAccDC.length; i++)
$A.getScript(window.InitAccDC[i]);
pL.ajaxSetup({async: true});
}

})($);