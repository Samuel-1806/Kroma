(function(){
var D=document,RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
function setLang(l){D.documentElement.lang=l==='pt'?'pt-BR':'en';
 D.querySelectorAll('.lang button').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.l===l)});
 try{localStorage.setItem('kroma-lang',l)}catch(e){}}
var l=null;try{l=localStorage.getItem('kroma-lang')}catch(e){}
if(!l)l=(navigator.language||'pt').toLowerCase().indexOf('pt')===0?'pt':'en';
setLang(l);
D.querySelectorAll('.lang button').forEach(function(b){b.onclick=function(){setLang(b.dataset.l)}});
// reveal
var rv=D.querySelectorAll('.rv');
if('IntersectionObserver' in window&&!RM){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});rv.forEach(function(e){io.observe(e)})}
else rv.forEach(function(e){e.classList.add('in')});
// progress
var pg=D.getElementById('prog');
function sc(){var h=D.documentElement.scrollHeight-innerHeight;pg.style.width=(h>0?scrollY/h*100:0)+'%'}
addEventListener('scroll',sc,{passive:true});sc();
// audio waves
var cv=D.getElementById('bg'),cx=cv.getContext('2d'),amp=0,W,H,t=0;
function rs(){var d=Math.min(devicePixelRatio||1,2);W=cv.width=innerWidth*d;H=cv.height=innerHeight*d;cx.setTransform(d,0,0,d,0,0);W/=d;H/=d}
rs();addEventListener('resize',rs);
var L=[['245,165,36',.55,.9,60],['255,93,61',.4,1.4,42],['90,200,255',.3,.6,80]];
function draw(){cx.clearRect(0,0,W,H);
 L.forEach(function(o,i){cx.beginPath();cx.lineWidth=2;cx.strokeStyle='rgba('+o[0]+','+(.10+amp*.3)+')';cx.shadowColor='rgba('+o[0]+',.8)';cx.shadowBlur=14;
  for(var x=0;x<=W;x+=8){var k=x/W,env=Math.sin(k*Math.PI),
   y=H*(.3+i*.17)+Math.sin(k*6*o[2]+t*o[1]+i)*o[3]*env*(1+amp*1.6)+Math.sin(k*13+t*1.7)*12*env;
   x?cx.lineTo(x,y):cx.moveTo(x,y)}cx.stroke()});
 amp*=.94;t+=.02;if(!RM)requestAnimationFrame(draw)}
draw();
// pads
var pw=D.getElementById('pads');
if(pw){var F=[261.6,293.7,329.6,392,440,523.3,587.3,659.3,784,880,1046.5,1174.7],ac=null,P=[];
 function tone(f){try{ac=ac||new(window.AudioContext||window.webkitAudioContext)();var o=ac.createOscillator(),g=ac.createGain();
  o.type='triangle';o.frequency.value=f;g.gain.setValueAtTime(.0001,ac.currentTime);g.gain.exponentialRampToValueAtTime(.18,ac.currentTime+.02);
  g.gain.exponentialRampToValueAtTime(.0001,ac.currentTime+.9);o.connect(g);g.connect(ac.destination);o.start();o.stop(ac.currentTime+1)}catch(e){}}
 function hit(i,snd){var p=P[i];p.classList.add('on');amp=Math.min(1,amp+.6);setTimeout(function(){p.classList.remove('on')},snd?260:380);if(snd)tone(F[i])}
 for(var i=0;i<12;i++)(function(i){var b=D.createElement('button');b.className='pad';b.setAttribute('aria-label','Pad '+(i+1));
  b.style.setProperty('--c','hsl('+(24+i*26)+' 95% 58%)');b.onpointerdown=function(){hit(i,true)};pw.appendChild(b);P.push(b)})(i);
 if(!RM)setInterval(function(){hit(Math.floor(Math.random()*12),false)},650);else hit(0,false);}
})();
