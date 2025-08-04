let backgroundcolor = 220;
let worker;
let canvas;
let inp;
let dataText;
let soundVisualizerCanvas;
// let soundController; // our central sound input manager

// TEMP this should be separate 
var mic;
let micEnabled = false;
let ampAmplification = 1000;
var fft;
let amp;

let PRMODE = false; // for debug


function setup() {
  if (PRMODE) {
    pixelDensity(10);
  }
    
  // ui
  btnMic = createButton("Mic ON/OFF");
  btnExport = createButton("Export");

  btnExport.mousePressed(() => { 
    saveCanvas('scribble.png'); 
  });
  
  // TEMP
  // https://js6450.github.io/sound-p5-part1.html
  // The getLevel() function will return a number between 0 (silence) and 1 (maximum volume microphone can detect)
  mic = new p5.AudioIn();
  fft = new p5.FFT();
  amp = new p5.Amplitude();

  // https://editor.p5js.org/MGOBRIAL/sketches/zxLypkBKZ
  // [freq1], [freq2], [threshold], [framesPerPeak]
  // frequency range in Hz (e.g., 100, 1000 for voice)
  let freq1 = 1; // low frequency
  let freq2 = 200; // high frequency
  let threshold = 0; // threshold for detecting a beat, between 0 and 1 (usually start with 0.15, is logarithmic)
  let framesPerPeak = 2; // number of frames to wait before detecting another peak (helps avoid double-detects)
  peakDetect = new p5.PeakDetect(freq1,freq2,threshold,framesPerPeak);

  // toggle mic on/off
  btnMic.mousePressed(toggleMic);
  canvas = createCanvas(300, 300);
  reset();
}

function draw() {
  // reset();
  frameRate(5); // 10 fps
  // cont. 'draw' of data
  // todo return to this, see
  // https://p5js.org/examples/advanced-canvas-rendering-create-graphics/
  // https://editor.p5js.org/Lark/sketches/XZP9GFYqs

  // if (soundController) {
    // soundController.update(); 
  //   soundController.drawVisualizer(soundVisualizerCanvas); // draw new visual
  //   image(soundVisualizerCanvas, 0, 0); // draw ON TOP of main canvas
  // }

  // drawSingleLetterCandidate();

  if (micEnabled && !PRMODE) {

    // p5.Amplitude object keeps track of the volume of a sound, and we can get this number, that ranges between 0 and 1, using the getLevel() function
    var level = mic.getLevel();
    // console.log("Mic level: " + level.toPrecision(2));
    // console.log("AMP : " + amp.getLevel()); // same as direct mic
    
    // TEMP
    // todo value if mic is enabled
    // ellipse(width / 2, height / 2, level * 5000, level * 5000);


    //FFT (Fast Fourier Transform) is an analysis algorithm that isolates individual audio frequencies within a waveform. The p5.FFT object can return two types of data in arrays via two different functions: waveform() and analyze()
    // waveform(): Returns an array of amplitude values (between -1.0 and 1.0) along the time domain (a sample of time)
    // analyze(): Returns an array of amplitude values (between 0 and 255) across the frequency spectrum.
    var waveform = fft.waveform(); 
    // console.log("Waveform: " + waveform);
    // console.log("Waveform: " + waveform.length);
    // var spectrum = fft.analyze();
    fft.analyze();

    // let us amplify the amplitude data
    // drawSingleLetterCandidate(level*ampAmplification);
    // drawSingleLetterCandidateWave(waveform, amp);

    // background(0, 30);
        // fill(255);

    // drawWaveform(waveform);

    // // constantly draw the scribble, according to draw frame rate
    // drawSingleLetterCandidate(waveform);


    // TODO urgent for debug at night:
    // 1. allow internal music mode, not mic

//     let bass = fft.getEnergy(20, 250);       // low
// let mids = fft.getEnergy(250, 2000);     // voice
// let highs = fft.getEnergy(2000, 10000);  // sibilance / noise
// console.log(`Bass: ${bass}  Mids: ${mids}  Highs: ${highs}`);



    // var peaks = peakDetect.update(spectrum);
    // can't give spectrum to peakDetect.update, seems it needs the fft object
    // The update method is run in the draw loop.
    // Accepts an FFT object. You must call .analyze() on the FFT object prior to updating the peakDetect because it relies on a completed FFT analysis.
    peakDetect.update(fft);


    var ellipseWidth = 10;
    if ( peakDetect.isDetected ) {
      // future decide better band of frequency...
      reset();
      let energy = fft.getEnergy(peakDetect.f1, peakDetect.f2);
      console.log('Current energy:', energy);
      console.log('energy:', peakDetect.energy, 'cutoff:', peakDetect.cutoff, 'detected:', peakDetect.isDetected);

      ellipseWidth = 50;
      // TODO amp for circle
      drawSingleLetterCandidate(waveform);
    } else {
      ellipseWidth = 10;
      
    }
  
    // ellipse(width/2, height/2, ellipseWidth, ellipseWidth);

    // future look into onPeak
// onPeak accepts two arguments: a function to call when a peak is detected. The value of the peak, between 0.0 and 1.0, is passed to the callback.

    
  }





}

function doubleClicked() {
  if (PRMODE) {
    canvas.background(backgroundcolor);
    drawSingleLetterPR();
    noLoop();
  }
  else {
    console.log("Double clicked, not in PRMODE");
  }
}

function reset() {
  canvas.background(backgroundcolor);
}

function toggleMic() {
  console.log("Toggling mic");
    // toggle mic on/off 
    if (micEnabled) {
        console.log("Mic OFF");
        mic.stop();
  
      }
      else {
        console.log("Mic ON");
        mic.start();
  
        fft.setInput(mic); //  set the input source for the FFT object to the mic
        amp.setInput(mic);
  
      }
      micEnabled = !micEnabled;
}