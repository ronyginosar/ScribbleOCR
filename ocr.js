//
// 
//  TO RE IMPLEMENT and ORGANIZE
//
//
//


// from : https://editor.p5js.org/boxheadroom/sketches/qRmnvrWjo
// using Tesseract.js OCR
//https://tesseract.projectnaptha.com/


// SEE tesseract ideas
// https://editor.p5js.org/emmettdj/sketches/GSuLHgKzP
// https://editor.p5js.org/emmettdj/sketches/rjCNBm6SK
// https://editor.p5js.org/emmettdj/sketches/jYXaH25pv


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



// let lng = "heb";
// let CHAR_WHITELIST = "אבגדהוזחטיכלמנסעפצקרשתףםךן";


let lng = "heb";
// let CHAR_WHITELIST = "ABCDEFGHIJKLMNOPQRSTUVWXYZ ";
let CHAR_BLACKLIST = "";
let CHAR_WHITELIST = "אבגדהוזחטיכלמנסעפצקרשתףםךן";
// to do both: 
// lng = ['eng', 'heb'];
// but need to prioritize one if so 
// lng="eng";
// let CHAR_WHITELIST="ABCDEFGHIJKLMNOPQRSTUVWXYZ"+
//     "abcdefghijklmnopqrstuvwxyz";
// ADD? yid	Yiddish?



function initWorker() {
  worker
    .load()
    .then(() => worker.loadLanguage(lng))
    .then(() => worker.initialize(lng))
    .then(() =>
      worker.setParameters({
        tessedit_char_whitelist: CHAR_WHITELIST,
        tessedit_pageseg_mode: Tesseract.PSM.SINGLE_CHAR,
        // tessedit_char_blacklist: CHAR_BLACKLIST,
      })
    );
}

function scan(img, callback) {
  worker.recognize(img).then((arg) => {
    // console.log(arg.data.text);
    callback(arg.data.text);
  });
}


///

// function preload() {
//   // init Tesseract
//   // worker = Tesseract.createWorker(lng);
// }



// function setup() {
//   if (PRMODE) {
//     pixelDensity(10);
//   }
  
//   textFont("IBM Plex Sans Hebrew"); // from google fonts
  
//   // ui
//   // btnGenerate = createButton("Generate");
//   // btnOcr = createButton("OCR");
//   // btnReset = createButton("RESET");
//   btnMic = createButton("Mic ON/OFF");
//   btnExport = createButton("Export");

//   // btnOcr.mousePressed(() => { runOCR(); });   // when we press the button - recognize the canvas drawing
//   // btnReset.mousePressed(() => { reset(); });
//   // btnGenerate.mousePressed(() => { generate(); });
//   // btnMic.mousePressed(() => { soundController.toggleMic(); });

//   btnExport.mousePressed(() => { 
//     saveCanvas('scribble.png'); 
//   });
  
//   // TEMP
//   // https://js6450.github.io/sound-p5-part1.html
//   // The getLevel() function will return a number between 0 (silence) and 1 (maximum volume microphone can detect)
//   mic = new p5.AudioIn();
//   fft = new p5.FFT();
//   amp = new p5.Amplitude();
//   // peakDetect = new p5.PeakDetect();
//   // Parameters

// // freq1
// // Number: lowFrequency - defaults to 20Hz
// // freq2
// // Number: highFrequency - defaults to 20000 Hz
// // threshold
// // Number: Threshold for detecting a beat between 0 and 1 scaled logarithmically where 0.1 is 1/2 the loudness of 1.0. Defaults to 0.35.
// // framesPerPeak
// // Number: Defaults to 20.

// // https://editor.p5js.org/MGOBRIAL/sketches/zxLypkBKZ
//   // [freq1], [freq2], [threshold], [framesPerPeak]
//   // frequency range in Hz (e.g., 100, 1000 for voice)
//   let freq1 = 1; // low frequency
//   let freq2 = 200; // high frequency
//   let threshold = 0; // threshold for detecting a beat, between 0 and 1 (usually start with 0.15)
//   let framesPerPeak = 2; // number of frames to wait before detecting another peak (helps avoid double-detects)
//   peakDetect = new p5.PeakDetect(freq1,freq2,threshold,framesPerPeak);

  
//   btnMic.mousePressed(() => {   
    
//     if (micEnabled) {
//       // btnMic.html("Mic OFF");
//       console.log("Mic OFF");
//       mic.stop();

//     }
//     else {
//       console.log("Mic ON");
//       mic.start();

//       fft.setInput(mic); //  set the input source for the FFT object to the mic
//       amp.setInput(mic);

//     }
//     micEnabled = !micEnabled;
//   });



//   canvas = createCanvas(300, 300);
//   // soundVisualizerCanvas = createGraphics(300, 300);

//   reset();

//   // soundController = new SoundController();
  
//   // init Tesseract
//   // worker
//   //   .load()
//   //   .then(() => worker.loadLanguage(lng))
//   //   .then(() => worker.initialize(lng))
//   //   .then(() =>
//   //     worker.setParameters({
//   //       tessedit_char_whitelist: CHAR_WHITELIST,
//   //       tessedit_pageseg_mode: Tesseract.PSM.SINGLE_CHAR  

//   //     })
//   //   );
//   // console.log(worker); // TODO
// }