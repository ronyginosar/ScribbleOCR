// reference: https://openprocessing.org/sketch/1794772
// // random between vertex and curve vertex?

let scribble_spacing, max_data_points_per_scribble, k, numberOfScribbles;
let waveformAmplification = 100; // how much to amplify the waveform. since we're drawing circles - we get an interesting pattern above value of 3

number_of_scribbles = 4; // min is 2, not exactly "number"...
max_data_points_per_scribble = 10;
data_spread_per_scribble = 2; // higher is narrower (smaller letter)


function drawSingleLetterCandidate(amp) { // TODO rename this, it's not the single... it draws a matrix
  noFill();
  stroke("#282828");
  scribble_spacing = min(width, height) / number_of_scribbles;
  for (let i = 0 + scribble_spacing; i <= width - scribble_spacing; i += scribble_spacing) {
    for (let j = 0 + scribble_spacing; j <= height - scribble_spacing; j += scribble_spacing) {
      // draw single letters around the i,j of the matrix
      singleLetterCandidate(i, j, amp);
    }
  }
}


function drawSingleLetterCandidateWave(waveform) {
    noFill();
    stroke("#282828");
    scribble_spacing = min(width, height) / number_of_scribbles;
    for (let i = 0 + scribble_spacing; i <= width - scribble_spacing; i += scribble_spacing) {
      for (let j = 0 + scribble_spacing; j <= height - scribble_spacing; j += scribble_spacing) {
        // draw single letters around the i,j of the matrix
        singleLetterCandidateFromWaveform(i, j, waveform);
  
      }
    }
  }

function drawControllerPoints(x,y,amp)
{
  push();
  strokeWeight(1);
  // TODO emphasis: like dots in fonts?
  stroke("red");
  // When the getLevel() function is called inside the draw() function, it returns the volume of a sound at the given time of each frame
  // circle(x, y, 3);
  fill("red");
  circle(x, y, amp);
  pop();
}

function singleLetterCandidate(i, j, amp) {
  strokeWeight(5);
  beginShape();
  let scribble_range = scribble_spacing / data_spread_per_scribble;
  for (let n = 0; n < max_data_points_per_scribble; n++) {
    const x = random(-scribble_range, scribble_range) + i;
    const y = random(-scribble_range, scribble_range) + j;

    drawControllerPoints(x,y,amp);

    // random between vertex and curve vertex?
    // vertex(x, y);
    curveVertex(x, y);
  }
  endShape();
}



function drawWaveform(waveform)
{
  let waveformAmplification = 500; // how much to amplify the waveform. since we're drawing circles - we get an interesting pattern above value of 3
  let waveformCircleSize = 3; 
  fill("red");
  noStroke();
  for (var i = 0; i < waveform.length; i++) {
    var x = map(i, 0, waveform.length, 0, width);
    // var y = map(waveform[i]*waveformAmplification, -1, 1, height, 0);
    // Wave Ribbon (Vertical Oscillation Along X)
    let waveformAmplification = 5000;
    var y = height / 2 + sin(x * 0.01) * waveform[i] * waveformAmplification;
    // Noise-Displaced Grid (Organic Texture) Noise displaces the signal — like a fuzzy organism
    // var y = map(noise(i * 0.01, frameCount * 0.01), 0, 1, 100, 200) +
        // waveform[i] * waveformAmplification;

// "math-y", Lissajous-Inspired Curve
        // let a = 3, b = 2; // frequency multipliers
        // let t = map(i, 0, waveform.length, 0, TWO_PI);
        // let x = width / 2 + sin(a * t + waveform[i]*waveformAmplification) * 100;
        // let y = height / 2 + sin(b * t) * 100;


    ellipse(x, y, waveformCircleSize, waveformCircleSize);
  }
}


// function locationMapper(waveform) {
//   // Map the x and y coordinates to a new range
//   let mappedX = map(x, 0, width, -1, 1);
//   let mappedY = map(waveform[i], -1, 1, height, 0);
//   return { mappedX, mappedY };
// }


function singleLetterCandidateFromWaveform(i, j, waveform) {
  // TODO still need to solve the scale down, so that we can't draw outside the canvas
  strokeWeight(4);
  beginShape();

  let waveformLength = waveform.length;
  let spacing = floor(waveformLength / max_data_points_per_scribble);

  for (let n = 0; n < max_data_points_per_scribble; n++) {
    let index = n * spacing;
    let amp = waveform[index];

    let carrierFreq = 0.03;
    let angle = i * carrierFreq; // use i as a seed for variety across grid
    // without music, looks a bit like the base of it which is a circle
    let dx = sin(angle + n) * amp * waveformAmplification * scribble_spacing / 2;
    let dy = cos(angle + n) * amp * waveformAmplification * scribble_spacing / 2;

    // let x = i + dx;
    // let y = j + dy;

    let jitterX = random(-scribble_spacing / 4, scribble_spacing / 4);
    let jitterY = random(-scribble_spacing / 4, scribble_spacing / 4);
    let x = i + dx + jitterX;
    let y = j + dy + jitterY;

    // Use a unique seed per scribble for noise variation
  // let noiseSeedX = random(1000);
  // let noiseSeedY = random(1000);

  //   let noiseOffsetX = map(noise(noiseSeedX + n * 0.1), 0, 1, -scribble_spacing / 4, scribble_spacing / 4);
  //   let noiseOffsetY = map(noise(noiseSeedY + n * 0.1), 0, 1, -scribble_spacing / 4, scribble_spacing / 4);

  //   let x = i + dx + noiseOffsetX;
  //   let y = j + dy + noiseOffsetY;

    // optional debug circles:
    push(); fill("red"); noStroke(); circle(x, y, 3); pop();
    // drawControllerPoints(x,y,amp); TODO generalize

    curveVertex(x, y);
  }

  endShape();
}

// TODO come back to this and debug
// function singleLetterCandidateFromWaveform(i, j, waveform) {
//   // noFill();
//   stroke("#282828");
//   strokeWeight(2);
//   beginShape();

//   let waveformLength = waveform.length;
//   let spacing = floor(waveformLength / max_data_points);

//   for (let n = 0; n < max_data_points; n++) {
//     let index = n * spacing;
//     let amp = waveform[index]; // range: -1 to 1

//     // Use amp * scaling + noise-based direction
//     let noiseFactor = noise(i * 0.01, j * 0.01, n * 0.1 + frameCount * 0.01);
//     let dirX = (amp * 0.5 + noiseFactor - 0.5) * scribbleSpacing;
//     let dirY = (amp * 0.5 + noise(i * 0.02, j * 0.02, n * 0.2 + frameCount * 0.01)) * scribbleSpacing;

//     // let x = (  i + dirX * waveformAmplification);
//     // let y = (  j + dirY * waveformAmplification);

// // push();
// translate(width/2,height/2);

//     let x = (  i + dirX * waveformAmplification)/width;
//     let y = (  j + dirY * waveformAmplification)/height;
   

//     // let x = map(
//     //   i + dirX * waveformAmplification,
//     //   i - scribbleSpacing * waveformAmplification,
//     //   i + scribbleSpacing * waveformAmplification,
//     //   0,
//     //   width
//     // );
    
//     // let y = map(
//     //   j + dirY * waveformAmplification,
//     //   j - scribbleSpacing * waveformAmplification,
//     //   j + scribbleSpacing * waveformAmplification,
//     //   0,
//     //   height
//     // );
    



//     push(); 
//     fill("red"); 
//     noStroke(); 
//     circle(x, y, 3);
//     pop();
//     console.log("x: " + x + ", y: " + y);
    

//     curveVertex(x, y);
//   }

//   endShape();
// }
