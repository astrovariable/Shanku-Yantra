const canvas = document.getElementById("plotCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas(){

let size = canvas.clientWidth;

canvas.width = size;
canvas.height = size;

drawGrid();

}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();


function drawGrid(){

ctx.clearRect(0,0,canvas.width,canvas.height);

centerX = canvas.width/2;
centerY = canvas.height/2;

radius = canvas.width/2 - 40;

ctx.strokeStyle="#444";
ctx.lineWidth=2;

ctx.beginPath();
ctx.arc(centerX,centerY,radius,0,2*Math.PI);
ctx.stroke();

ctx.fillStyle="black";
ctx.font="14px Arial";

ctx.fillText("N",centerX-5,centerY-radius-10);
ctx.fillText("S",centerX-5,centerY+radius+20);
ctx.fillText("E",centerX+radius+10,centerY+5);
ctx.fillText("W",centerX-radius-20,centerY+5);

ctx.fillStyle="red";
ctx.beginPath();
ctx.arc(centerX,centerY,5,0,2*Math.PI);
ctx.fill();

}


function dayOfYear(date){

let start = new Date(date.getFullYear(),0,0);
let diff = date-start;
return Math.floor(diff/(1000*60*60*24));

}


function solarPosition(lat, lon, date, clockTime){

let N = dayOfYear(date);

let B = 2*Math.PI*(N-81)/364;

let EoT = 9.87*Math.sin(2*B) - 7.53*Math.cos(B) - 1.5*Math.sin(B);

let decl =
23.45*Math.sin(2*Math.PI*(284+N)/365);

decl = decl*Math.PI/180;

let timeOffset = EoT + 4*(lon-82.5);

let solarTime = clockTime*60 + timeOffset;

let hourAngle = solarTime/4 - 180;

let H = hourAngle*Math.PI/180;

let phi = lat*Math.PI/180;

let altitude = Math.asin(
Math.sin(phi)*Math.sin(decl) +
Math.cos(phi)*Math.cos(decl)*Math.cos(H)
);

let azimuth = Math.atan2(
Math.sin(H),
Math.cos(H)*Math.sin(phi) - Math.tan(decl)*Math.cos(phi)
);

azimuth += Math.PI;

return {alt: altitude, az: azimuth};

}


function plotDaily(){

drawGrid();

let lat = parseFloat(latInput.value);
let lon = parseFloat(lonInput.value);
let height = parseFloat(heightInput.value);
let scale = parseFloat(scaleInput.value);

let date = new Date(dateInput.value);

ctx.strokeStyle = colorInput.value;
ctx.lineWidth = parseFloat(widthInput.value);

ctx.beginPath();

for(let t=6*60; t<=18*60; t+=5){

let time = t/60;

let pos = solarPosition(lat,lon,date,time);

if(pos.alt <= 0) continue;

let L = height/Math.tan(pos.alt);

let saz = pos.az + Math.PI;

let x = L*Math.sin(saz);
let y = L*Math.cos(saz);

let px = centerX + x*scale;
let py = centerY - y*scale;

let dist = Math.sqrt((px-centerX)**2+(py-centerY)**2);

if(dist <= radius){
ctx.lineTo(px,py);
}

}

ctx.stroke();

}


function plotAnalemma(){

drawGrid();

let lat = parseFloat(latInput.value);
let lon = parseFloat(lonInput.value);
let height = parseFloat(heightInput.value);
let scale = parseFloat(scaleInput.value);

let timeParts = timeInput.value.split(":");
let clockTime = parseFloat(timeParts[0]) + parseFloat(timeParts[1])/60;

ctx.fillStyle = colorInput.value;

for(let d=1; d<=365; d++){

let date = new Date(2025,0);
date.setDate(d);

let pos = solarPosition(lat,lon,date,clockTime);

if(pos.alt <= 0) continue;

let L = height/Math.tan(pos.alt);

let saz = pos.az + Math.PI;

let x = L*Math.sin(saz);
let y = L*Math.cos(saz);

let px = centerX + x*scale;
let py = centerY - y*scale;

let dist = Math.sqrt((px-centerX)**2+(py-centerY)**2);

if(dist <= radius){

ctx.beginPath();
ctx.arc(px,py,2,0,2*Math.PI);
ctx.fill();

}

}

}


const latInput = document.getElementById("lat");
const lonInput = document.getElementById("lon");
const dateInput = document.getElementById("date");
const timeInput = document.getElementById("time");
const heightInput = document.getElementById("height");
const scaleInput = document.getElementById("scale");
const colorInput = document.getElementById("color");
const widthInput = document.getElementById("width");
