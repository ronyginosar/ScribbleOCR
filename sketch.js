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

let soundController; // our central sound input manager



let lng = "heb";
let CHAR_WHITELIST = "אבגדהוזחטיכלמנסעפצקרשתףםךן";

function preload() {
  // init Tesseract
  worker = Tesseract.createWorker(lng);
}

function setup() {
  
  textFont("IBM Plex Sans Hebrew"); // from google fonts
  
  // ui
  btnGenerate = createButton("Generate");
  btnOcr = createButton("OCR");
  btnReset = createButton("RESET");
  
  btnOcr.mousePressed(() => {
    // when we press the button - recognize the canvas drawing
    runOCR();
  });
  
  btnReset.mousePressed(() => {
    reset();
  });
  
  btnGenerate.mousePressed(() => {
    generate();
    
  });

  // c = createCanvas(windowWidth-30, windowHeight-30);
  canvas = createCanvas(300, 300);
  // canvas.parent("canvas-container");

  soundVisualizerCanvas = createGraphics(300, 300);
  // soundVisualizerCanvas.parent("visualizer-container");

  reset();
  // stroke(0);

  btnMic = createButton("Mic ON/OFF");
  btnMic.mousePressed(() => {
    soundController.toggleMic();
  });

  soundController = new SoundController();
  
  // init Tesseract
  worker
    .load()
    .then(() => worker.loadLanguage(lng))
    .then(() => worker.initialize(lng))
    .then(() =>
      worker.setParameters({
        tessedit_char_whitelist: CHAR_WHITELIST,
        tessedit_pageseg_mode: Tesseract.PSM.SINGLE_CHAR  

      })
    );
  // console.log(worker);


}

function draw() {
  // cont. 'draw' of data
  if (soundController) {
    soundController.update(); 
    soundController.drawVisualizer(soundVisualizerCanvas); // draw new visual
    image(soundVisualizerCanvas, 0, 0); // draw ON TOP of main canvas
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



