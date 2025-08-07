let backgroundcolor = 220;
let worker;
let canvas;
let inp;
let dataText;
let soundVisualizerCanvas;
// let soundController; // our central sound input manager

// future: put this in soundController
var audio;
let micEnabled = false;
var fft;
let amp;
let audiofile; // for internal audio mode
// end section

let PRMODE = false; // for debug
let INTERNALAUDIOMODE = false; // for debug


// URGENT:
// is the internal audio mode working properly? connect and disconnect inc?

function preload(){
  // if(INTERNALAUDIOMODE) {
  // load anyway to use.... otherwise need a flag and not toggle
    audiofile = loadSound('/assets/Alto_score_simulation-for-rony_5th-movement.wav');
  // }
}


function setup() {
  if (PRMODE) {
    pixelDensity(10);
  }

  canvas = createCanvas(300, 300);
  reset();
    
  // ui
  btnMic = createButton("Mic ON/OFF");
  btnExport = createButton("Export");
  btnInternalAudio = createButton("Internal Audio");

  btnExport.mousePressed(() => { 
    saveCanvas('scribble.png'); 
  });

  // toggle inputs
  btnMic.mousePressed(toggleMic);
  btnInternalAudio.mousePressed(toggleInternalAudio);
  
  // future: put this in soundController
  // https://js6450.github.io/sound-p5-part1.html
  // The getLevel() function will return a number between 0 (silence) and 1 (maximum volume microphone can detect)



  audio = new p5.AudioIn(); // init as mic, later we can switch to audiofile
  fft = new p5.FFT();
  amp = new p5.Amplitude();

  // https://editor.p5js.org/MGOBRIAL/sketches/zxLypkBKZ
  // [freq1], [freq2], [threshold], [framesPerPeak]
  // frequency range in Hz (e.g., 100, 1000 for voice)
  // NOTE: TUNE THIS PER MUSIC
  let freq1 = 10; // low frequency
  let freq2 = 2000; // high frequency
  let threshold = 0; // threshold for detecting a beat, between 0 and 1 (usually start with 0.15, is logarithmic)
  let framesPerPeak = 10; // number of frames to wait before detecting another peak (helps avoid double-detects)
  peakDetect = new p5.PeakDetect(freq1,freq2,threshold,framesPerPeak);

}

function draw() {

  // test
  // if (INTERNALAUDIOMODE) {
    // audio = audiofile;
  // }

  // cont. 'draw' of data
  // todo return to this, see
  // https://p5js.org/examples/advanced-canvas-rendering-create-graphics/
  // https://editor.p5js.org/Lark/sketches/XZP9GFYqs

  // future: return to this
  // if (soundController) {
  //   soundController.update(); 
  //   soundController.drawVisualizer(soundVisualizerCanvas); // draw new visual
  //   image(soundVisualizerCanvas, 0, 0); // draw ON TOP of main canvas
  // }

  if ((micEnabled || INTERNALAUDIOMODE) && !PRMODE) {

    // AMPLITUDE
    // p5.Amplitude object keeps track of the volume of a sound, and we can get this number, that ranges between 0 and 1, using the getLevel() function
    // var audio.getLevel();
    // console.log("Mic level: " + ampLevel.toPrecision(2));
    // console.log("AMP : " + amp.getLevel()); // same as direct mic

    // we "init" twice this ampLevel, it seems they are different objects and need to run one over the other
    if (INTERNALAUDIOMODE) {
      var ampLevel = amp.getLevel(); // get the level of the audio file
    } else {
      var ampLevel = audio.getLevel(); // get the level of the mic input
    }


    //FFT (Fast Fourier Transform) is an analysis algorithm that isolates individual audio frequencies within a waveform. The p5.FFT object can return two types of data in arrays via two different functions: waveform() and analyze()
    // waveform(): Returns an array of amplitude values (between -1.0 and 1.0) along the time domain (a sample of time)
    // analyze(): Returns an array of amplitude values (between 0 and 255) across the frequency spectrum.
    var waveform = fft.waveform(); 
    // console.log("Waveform: " + waveform);
    // console.log("Waveform: " + waveform.length);
    // var spectrum = fft.analyze();
    fft.analyze();

    // let us amplify the amplitude data
    // drawSingleLetterCandidate(ampLevel*ampAmplification);
    // drawSingleLetterCandidateWave(waveform, ampLevel);

    // drawWaveform(waveform);

    // constantly draw the scribble, according to draw frame rate
    // drawSingleLetterCandidate(waveform);



    // PEAK DETECTION

    // for DEBUG
    // let bass = fft.getEnergy(20, 250);       // low
    // let mids = fft.getEnergy(250, 2000);     // voice
    // let highs = fft.getEnergy(2000, 10000);  // sibilance / noise
    // console.log(`Bass: ${bass}  Mids: ${mids}  Highs: ${highs}`);

    // The update method is run in the draw loop.
    // Accepts an FFT object. You must call .analyze() on the FFT object prior to updating the peakDetect because it relies on a completed FFT analysis.
    peakDetect.update(fft);

    // console.log('Current energy:', peakDetect.energy);
    // console.log('Current energy:', fft.getEnergy(peakDetect.f1, peakDetect.f2));
    if ( peakDetect.isDetected ) {
      // future decide better band of frequency...
  
      reset(); // clean canvas upon peak detection
      let energy = fft.getEnergy(peakDetect.f1, peakDetect.f2);
      console.log('Current energy:', energy);
      console.log('energy:', peakDetect.energy, 'cutoff(peak detection threshold):', peakDetect.cutoff, 'detected:', peakDetect.isDetected);

      // console.log("DEBUG draw amp: " + ampLevel);

      // waveform controls the shape, amp controls the size of the control points
      drawLetterCandidates_waveform_n_amp(waveform,ampLevel);
    } 
    // else {
    // }

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
        audio.stop();

        // reset to default?
        // fft.setInput(); 
        // amp.setInput();
  
    }
    else {
      console.log("Mic ON");
      audio.start();

      fft.setInput(audio); //  set the input source for the FFT object to the mic
      amp.setInput(audio);

    }
      micEnabled = !micEnabled;
}

function toggleInternalAudio() {
  console.log("Toggling internal audio mode");
    if (!INTERNALAUDIOMODE) {
      // console.log("BUTTON Using internal audio mode with audio file: " + audiofile);
      audiofile.play();
      fft.setInput(audiofile); //  set the input source for the FFT object to the mic
      amp.setInput(audiofile);
    } else {
      // console.log("BUTTON Stopping internal audio mode");
      // audiofile.stop();
      audiofile.pause(); // to continue from where we left off // future make this a toggle
      
      // reset to default?
      // fft.setInput(); 
      // amp.setInput();

    }
  INTERNALAUDIOMODE = !INTERNALAUDIOMODE;
}