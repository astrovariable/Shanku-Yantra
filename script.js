const canvas=document.getElementById("plotCanvas")
const ctx=canvas.getContext("2d")

function resizeCanvas(){

let size = canvas.clientWidth

canvas.width = size
canvas.height = size

drawGrid()

}

resizeCanvas()
window.addEventListener("resize",resizeCanvas)

function drawGrid(){

ctx.clearRect(0,0,canvas.width,canvas.height)

let cx=canvas.width/2
let cy=canvas.height/2

let radius=Math.min(cx,cy)-40

ctx.strokeStyle="#444"
ctx.lineWidth=2

ctx.beginPath()
ctx.arc(cx,cy,radius,0,2*Math.PI)
ctx.stroke()

ctx.fillStyle="black"
ctx.font="14px Arial"

ctx.fillText("N",cx-5,cy-radius-10)
ctx.fillText("S",cx-5,cy+radius+20)
ctx.fillText("E",cx+radius+10,cy+5)
ctx.fillText("W",cx-radius-20,cy+5)

ctx.fillStyle="red"

ctx.beginPath()
ctx.arc(cx,cy,5,0,2*Math.PI)
ctx.fill()

window.centerX=cx
window.centerY=cy
window.radius=radius

}

function dayOfYear(date){

let start=new Date(date.getFullYear(),0,0)
let diff=date-start
let oneDay=1000*60*60*24

return Math.floor(diff/oneDay)

}

function solarPosition(lat,lon,date,IST){

let N=dayOfYear(date)

let gamma=2*Math.PI/365*(N-1+(IST-12)/24)

let EoT=229.18*(0.000075
+0.001868*Math.cos(gamma)
-0.032077*Math.sin(gamma)
-0.014615*Math.cos(2*gamma)
-0.040849*Math.sin(2*gamma))

let dec=0.006918
-0.399912*Math.cos(gamma)
+0.070257*Math.sin(gamma)
-0.006758*Math.cos(2*gamma)
+0.000907*Math.sin(2*gamma)
-0.002697*Math.cos(3*gamma)
+0.00148*Math.sin(3*gamma)

let timeOffset=EoT+4*(lon-82.5)

let tst=IST*60+timeOffset

let H=tst/4-180

let h=H*Math.PI/180
let phi=lat*Math.PI/180

let sinAlt=Math.sin(phi)*Math.sin(dec)+
Math.cos(phi)*Math.cos(dec)*Math.cos(h)

let alt=Math.asin(sinAlt)

let cosAz=(Math.sin(dec)-Math.sin(alt)*Math.sin(phi))/
(Math.cos(alt)*Math.cos(phi))

let az=Math.acos(cosAz)

if(H>0) az=2*Math.PI-az

return{alt:alt,az:az}

}

function plotDaily(){

drawGrid()

let lat=parseFloat(latInput.value)
let lon=parseFloat(lonInput.value)
let height=parseFloat(heightInput.value)
let scale=parseFloat(scaleInput.value)

let date=new Date(dateInput.value)

ctx.strokeStyle=colorInput.value
ctx.lineWidth=parseFloat(widthInput.value)

ctx.beginPath()

for(let t=6*60;t<=18*60;t+=5){

let IST=t/60

let pos=solarPosition(lat,lon,date,IST)

if(pos.alt<=0) continue

let L=height/Math.tan(pos.alt)

let saz=pos.az+Math.PI

let x=L*Math.sin(saz)
let y=L*Math.cos(saz)

let px=centerX+x*scale
let py=centerY-y*scale

let dist=Math.sqrt((px-centerX)**2+(py-centerY)**2)

if(dist<=radius){

ctx.lineTo(px,py)

}

}

ctx.stroke()

}

function plotAnalemma(){

drawGrid()

let lat=parseFloat(latInput.value)
let lon=parseFloat(lonInput.value)
let height=parseFloat(heightInput.value)
let scale=parseFloat(scaleInput.value)

let time=timeInput.value.split(":")
let IST=parseFloat(time[0])+parseFloat(time[1])/60

ctx.fillStyle=colorInput.value

for(let N=1;N<=365;N++){

let d=new Date(2026,0)
d.setDate(N)

let pos=solarPosition(lat,lon,d,IST)

if(pos.alt<=0) continue

let L=height/Math.tan(pos.alt)

let saz=pos.az+Math.PI

let x=L*Math.sin(saz)
let y=L*Math.cos(saz)

let px=centerX+x*scale
let py=centerY-y*scale

let dist=Math.sqrt((px-centerX)**2+(py-centerY)**2)

if(dist<=radius){

ctx.beginPath()
ctx.arc(px,py,2,0,2*Math.PI)
ctx.fill()

}

}

}

const latInput=document.getElementById("lat")
const lonInput=document.getElementById("lon")
const dateInput=document.getElementById("date")
const timeInput=document.getElementById("time")
const heightInput=document.getElementById("height")
const scaleInput=document.getElementById("scale")
const colorInput=document.getElementById("color")
const widthInput=document.getElementById("width")

drawGrid()
