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
let ampAmplification = 800;
var fft;
let amp;



let lng = "heb";
let CHAR_WHITELIST = "אבגדהוזחטיכלמנסעפצקרשתףםךן";

function preload() {
  // init Tesseract
  // worker = Tesseract.createWorker(lng);
}

function setup() {
  
  textFont("IBM Plex Sans Hebrew"); // from google fonts
  
  // ui
  // btnGenerate = createButton("Generate");
  // btnOcr = createButton("OCR");
  // btnReset = createButton("RESET");
  btnMic = createButton("Mic ON/OFF");

  // btnOcr.mousePressed(() => { runOCR(); });   // when we press the button - recognize the canvas drawing
  // btnReset.mousePressed(() => { reset(); });
  // btnGenerate.mousePressed(() => { generate(); });
  // btnMic.mousePressed(() => { soundController.toggleMic(); });
  
  // TEMP
  // https://js6450.github.io/sound-p5-part1.html
  // The getLevel() function will return a number between 0 (silence) and 1 (maximum volume microphone can detect)
  mic = new p5.AudioIn();
  fft = new p5.FFT();
  amp = new p5.Amplitude();
  amp.setInput(mic);
  btnMic.mousePressed(() => {   
    
    if (micEnabled) {
      // btnMic.html("Mic OFF");
      console.log("Mic OFF");
      mic.stop();
    }
    else {
      console.log("Mic ON");
      mic.start();
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

  if (micEnabled){

    // p5.Amplitude object keeps track of the volume of a sound, and we can get this number, that ranges between 0 and 1, using the getLevel() function
    var level = mic.getLevel();
    console.log("Mic level: " + level.toPrecision(2));
    // console.log("AMP : " + amp.getLevel()); // same as direct mic
    
    // TEMP
    // todo value if mic is enabled
    // ellipse(width / 2, height / 2, level * 5000, level * 5000);


    //FFT (Fast Fourier Transform) is an analysis algorithm that isolates individual audio frequencies within a waveform. The p5.FFT object can return two types of data in arrays via two different functions: waveform() and analyze()
    // waveform(): Returns an array of amplitude values (between -1.0 and 1.0) along the time domain (a sample of time)
    // analyze(): Returns an array of amplitude values (between 0 and 255) across the frequency spectrum.
    var waveform = fft.waveform();
    var spectrum = fft.analyze();

    // let us amplify the amplitude data
    drawSingleLetterCandidate(level*ampAmplification);
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



