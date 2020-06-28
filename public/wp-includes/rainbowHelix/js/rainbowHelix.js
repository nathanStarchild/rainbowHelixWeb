let radius1, radius2, t, symmetry, incr, stepHeight, tRate;
let waveFactor, inOutFactor, aShift, aShiftDt;
let count = 0;
let skip, nLevels, sw;
let xmag = 0;
let ymag = 0;
let newXmag = 0;
let newYmag = 0;
let bgOn;
let loopFrames = 10*30;
let symSlider, lvlSlider, ioSlider, waveSlider, tSlider, dtSlider; 
let xOffset = 0;
let yOffset = 0;
let xmagOffset = 0;
let ymagOffset = 0;



function lerp(a, b, n) {
    return (1 - n) * a + n * b;
  }

function easeInOutQuad(t) {
    return t<.5 ? 2*t*t : -1+(4-2*t)*t
}

class Easer {
    constructor(val) {
        this.duration = 150;
        this.start = new Date().getTime();
        this.target = val;
        this.startVal = val;
        this.value = val;
    }

    getValue() {
        let nowTime = new Date().getTime();
        let t = (nowTime - this.start) / this.duration;
        if (t>=1) {
            return this.value;
        }
        t = easeInOutQuad(t);
        this.value = lerp(this.startVal, this.target, t);
        return this.value;
    }

    setTarget(target) {
        this.startVal = this.value;
        this.target = target;
        this.start = new Date().getTime();
    }
}

function setup(){
    createCanvas(windowWidth, windowHeight, WEBGL);
    noFill();
    // noCursor();
    count = 0;
    symmetry = 60;
    skip = 100;
    t = skip;
    nLevels = 1;
    tRate = 1/12000.0;
    bgOn = true;
    waveFactor = 0.008;
    inOutFactor = 0.3;
    sw = 1;
    strokeWeight(sw);
    aShift = 0.00001;
    aShiftDt = 2 * PI / loopFrames;
    symSlider = createSlider(1, 360, symmetry, 1);
    symSlider.parent('symmetry');
    lvlSlider = createSlider(1, 100, nLevels, 1);
    lvlSlider.parent('levels');
    ioEaser = new Easer(inOutFactor);
    ioSlider = createSlider(0, 3, inOutFactor, 0.01);
    ioSlider.parent('inOut');
    ioSlider.input(() => ioEaser.setTarget(ioSlider.value()))
    waveEaser = new Easer(waveFactor);
    waveSlider = createSlider(0, 10, waveFactor, 0.01);
    waveSlider.parent('wave');
    waveSlider.input(() => waveEaser.setTarget(waveSlider.value()))
    tEaser = new Easer(1);
    tSlider = createSlider(0, 2, 1, 0.001);
    tSlider.parent('t');
    tSlider.input(() => tEaser.setTarget(tSlider.value()))
    dtSlider = createSlider(0, PI/16, dt, 0.0001);
    dtSlider.parent('dt');
    // , lvlSlider, ioSlider, waveSlider, tSlider, dtSlider;
    

    setTimeout(function() {
        select("#messageRow").hide();
    }, 4700);
    
    recalc();
    background(255, 255, 0, 0);
}

function draw() {
    recalc();
    count = 0;
    // t += tRate;
    aShift += aShiftDt;
    //t = skip/tRate;
    if (bgOn) {
      background(1, 0, 0, 255);
    }
    push();
        // translate(width/2, height/2, 0);
        mouseCamera();
        //movingCamera();
        helixAlgorithm();
    pop();
}


function helixAlgorithm() {
    for (let l = 0; l < nLevels; l++){
      for (let a = 0; a<(2*PI-incr/2.); a += incr){ //variable radii mapped to a sin timer
        // println(cos(a));q
        let aShifted1 = ((a + (aShift*nLevels) + 2 * PI * l));// % (TWO_PI*nLevels* t * waveFactor);
        let aShifted2 = ((a + 2 * PI * l) + aShift) % (TWO_PI*nLevels* t * waveFactor* inOutFactor);
        stroke((a + 2 * PI * l), 255, 255, 200);
        radius1 = map(sin(aShifted1 * (t/nLevels) * waveFactor), -1, 1, 1, 600);
        radius2 = map(sin(aShifted1 * (t/nLevels) * waveFactor * inOutFactor), -1, 1, radius1, 800);
        // radius1 = map(sin(aShifted1 * (t) * waveFactor), -1, 1, 1, 600);
        // radius2 = map(sin(aShifted1 * (t) * waveFactor * inOutFactor), -1, 1, radius1, 800);
        //radius1 = map(sin(t*a/(30*1)), -1, 1, 1, 600);
        //radius2 = map(sin(t*a/(30*6)), -1, 1, radius1, 800); //inner radius at current angle
        let x1 = cos(a) * radius1;
        let y1 = sin(a) * radius1;
        let x2 = cos(a) * radius2;
        let y2 = sin(a) * radius2;
        let z = count * stepHeight - stepHeight*symmetry*nLevels/2;
        push();
        // if (a == pulse && pulseOn) {
        //   strokeWeight(10);
        // }
        line(x1, y1, z, x2, y2, z);
        //x1 = cos(a+ (incr*0.5) ) * radius2;
        //y1 = sin(a+ (incr*0.5) ) * radius2;
        //x2 = cos(a+(incr*0.5) ) * radius1;
        //y2 = sin(a+(incr*0.5) ) * radius1;
        ////line(x1, y1, z, x2, y2, z);
        pop();
        count++;
      }
    }
}

function toNdp(x, n){
    return round(x * Math.pow(10, n))/Math.pow(10, n);
}

function recalc() {
    symmetry = symSlider.value();
    select("#symVal").html(symmetry);
    nLevels = lvlSlider.value();
    select("#lvlVal").html(nLevels);
    inOutFactor = ioEaser.getValue();
    select("#ioVal").html(toNdp(inOutFactor, 2));
    waveFactor = waveEaser.getValue();
    select("#waveVal").html(toNdp(waveFactor, 2));
    t = tEaser.getValue();
    select("#tVal").html(toNdp(t, 2));
    aShiftDt = dtSlider.value();
    select("#dtVal").html(toNdp(aShiftDt, 2));
    incr = 2 * PI / symmetry;
    // println(incr);
    stepHeight = incr * 360 / (TWO_PI * nLevels);
    colorMode(HSB, 2*PI*nLevels, 255, 255, 255);
}


function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
  }

function mouseCamera(){ // move the camera with the mouse
    if (mouseIsPressed) {
        console.log("mouse camera");
        newXmag = (mouseX - xOffset)/float(width) * TWO_PI + xmagOffset;
        newYmag = (mouseY - yOffset)/float(height) * TWO_PI + ymagOffset;
        let diff = xmag-newXmag;
        if (abs(diff) >  0.01) { 
        xmag -= diff/4.0; 
        }
        diff = ymag-newYmag;
        if (abs(diff) >  0.01) { 
        ymag -= diff/4.0; 
        }
    }
    rotateX(-ymag); 
    rotateZ(-xmag);
}

function mousePressed() {
    console.log("mouse Pressed");
    xOffset = mouseX;
    yOffset = mouseY;
    xmagOffset = xmag;
    ymagOffset = ymag;
}
