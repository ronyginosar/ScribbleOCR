// from: https://editor.p5js.org/boxheadroom/sketches/qRmnvrWjo
// using Tesseract.js OCR
//https://tesseract.projectnaptha.com/

// notes:
// this is actualy not a good ocr for handwritting, not in eng and not in heb - which makes it great for us
// מה יקרה אם אתן תמונות של אותיות מפוסטרים?
// האם זה נותן אחוזי ודאות? האם טפשר רף ודאות מסויים לייצא?

// add export to png with char name and timestamp
// visually interesting to add data? tech-y?

// better tesseract.js code in p5?

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



let lng = "heb";
let CHAR_WHITELIST = "אבגדהוזחטיכלמנסעפצקרשתףםךן";

function preload() {
  // init Tesseract
  // worker = Tesseract.createWorker(lng);
}

function setup() {
  if (PRMODE) {
    pixelDensity(10);
  }
  
  textFont("IBM Plex Sans Hebrew"); // from google fonts
  
  // ui
  // btnGenerate = createButton("Generate");
  // btnOcr = createButton("OCR");
  // btnReset = createButton("RESET");
  btnMic = createButton("Mic ON/OFF");
  btnExport = createButton("Export");

  // btnOcr.mousePressed(() => { runOCR(); });   // when we press the button - recognize the canvas drawing
  // btnReset.mousePressed(() => { reset(); });
  // btnGenerate.mousePressed(() => { generate(); });
  // btnMic.mousePressed(() => { soundController.toggleMic(); });

  btnExport.mousePressed(() => { 
    saveCanvas('scribble.png'); 
  });
  
  // TEMP
  // https://js6450.github.io/sound-p5-part1.html
  // The getLevel() function will return a number between 0 (silence) and 1 (maximum volume microphone can detect)
  mic = new p5.AudioIn();
  fft = new p5.FFT();
  amp = new p5.Amplitude();
  // peakDetect = new p5.PeakDetect();
  // Parameters

// freq1
// Number: lowFrequency - defaults to 20Hz
// freq2
// Number: highFrequency - defaults to 20000 Hz
// threshold
// Number: Threshold for detecting a beat between 0 and 1 scaled logarithmically where 0.1 is 1/2 the loudness of 1.0. Defaults to 0.35.
// framesPerPeak
// Number: Defaults to 20.

// https://editor.p5js.org/MGOBRIAL/sketches/zxLypkBKZ
  // [freq1], [freq2], [threshold], [framesPerPeak]
  let freq1 = 2; // low frequency
  let freq2 = 20; // high frequency
  let threshold = 0; // threshold for detecting a beat
  let framesPerPeak = 2; // number of frames to wait before detecting another peak
  peakDetect = new p5.PeakDetect(freq1,freq2,threshold,framesPerPeak);

  
  btnMic.mousePressed(() => {   
    
    if (micEnabled) {
      // btnMic.html("Mic OFF");
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
  });



  canvas = createCanvas(300, 300);
  // soundVisualizerCanvas = createGraphics(300, 300);

  reset();

  // soundController = new SoundController();
  
  // init Tesseract
  // worker
  //   .load()
  //   .then(() => worker.loadLanguage(lng))
  //   .then(() => worker.initialize(lng))
  //   .then(() =>
  //     worker.setParameters({
  //       tessedit_char_whitelist: CHAR_WHITELIST,
  //       tessedit_pageseg_mode: Tesseract.PSM.SINGLE_CHAR  

  //     })
  //   );
  // console.log(worker); // TODO
}

function draw() {
  reset();
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


    // var peaks = peakDetect.update(spectrum);
    // can't give spectrum to peakDetect.update, seems it needs the fft object
    // The update method is run in the draw loop.
// Accepts an FFT object. You must call .analyze() on the FFT object prior to updating the peakDetect because it relies on a completed FFT analysis.
    peakDetect.update(fft);

//     // if (peakDetect.isDetected) drawSingleLetterCandidateWave(waveform, amp);
    var ellipseWidth = 10;
    if ( peakDetect.isDetected ) {
      console.log("Peak detected!");
      ellipseWidth = 50;
      drawSingleLetterCandidate(waveform);
    } else {
      ellipseWidth = 1;
    }
  
    ellipse(width/2, height/2, ellipseWidth, ellipseWidth);

    // future look into onPeak
// onPeak accepts two arguments: a function to call when a peak is detected. The value of the peak, between 0.0 and 1.0, is passed to the callback.


  }





}

function doubleClicked() {
  // temp PRMODE
  // drawSingleLetterCandidate(10);
  // drawSingleLetterCandidate(0);
  // reset();
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

function runOCR(){
  worker.recognize(canvas.elt).then((arg) => 
    {
    // print this as visual data
    console.log(arg, arg.data, arg.data.text);
    
    if(arg.data.text.trim() === "")
    {
      // no bb produced when there is no detection
      console.log("Nothing detected");//, 
      // arg.data.symbols[0].confidence);
    
      // print this with drawtext function:
      dataText = "לא זוהה";
      drawDatatext();
    } 
    else 
    {
      // idea - draw bb??
      console.log(arg.data.text , arg.data.symbols[0].confidence);
      dataText = arg.data.text;
      drawDatatext();
    }
  
    });
}

function drawDatatext(){    
  push();
  noStroke();
  textSize(22);
  fill("black");
  textAlign(RIGHT);
  text(dataText,width-30, height-30);
  // ADD %
  pop();
}

function generate()
{
  reset();
  strokeWeight(10);
  drawSingleLetterCandidate();
  runOCR();
}



