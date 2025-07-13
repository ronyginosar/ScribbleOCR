// reference: https://openprocessing.org/sketch/1794772
// // random between vertex and curve vertex?

let scribbleSpacing, max_data_points, k, iters;

iters = 2; // min is 2
max_data_points = 10;
data_spread = 2; // higher is narrower (smaller letter)

function drawSingleLetterCandidate() {
  noFill();
  // noLoop();
  stroke("#282828");
  // strokeWeight(1);

  // if (width < height) {
  //   dn = width / iters;
  // } else {
  //   dn = height / iters;
  // }

  scribbleSpacing = min(width, height) / iters;

  for (let i = 0 + scribbleSpacing; i <= width - scribbleSpacing; i += scribbleSpacing) {
    for (let j = 0 + scribbleSpacing; j <= width - scribbleSpacing; j += scribbleSpacing) {
      singleLetterCandidate(i, j);
    }
  }
}

function singleLetterCandidate(i, j) {
  beginShape();
  for (let n = 0; n < max_data_points; n++) {
    const x = random(-scribbleSpacing / data_spread, scribbleSpacing / data_spread) + i;
    const y = random(-scribbleSpacing / data_spread, scribbleSpacing / data_spread) + j;

    push();
    strokeWeight(10);
    stroke("red");
    circle(x, y, 3);
    pop();

    // random between vertex and curve vertex?
    // vertex(x, y);
    curveVertex(x, y);
  }
  endShape();
}

function drawScribbleSound(mode, vol){
  stroke("#282828");
  let spread = map(vol, 0, 0.3, 5, 1);              // narrower if louder
  let weight = map(vol, 0, 0.3, 4, 20);             // thicker if louder
  strokeWeight(weight);

  scribbleSpacing = min(width, height) / iters;

  for (let i = scribbleSpacing; i <= width - scribbleSpacing; i += scribbleSpacing) {
    for (let j = scribbleSpacing; j <= height - scribbleSpacing; j += scribbleSpacing) {
      if (mode === "curve") drawCurveScribble(i, j, spread);
      else if (mode === "dotted") drawDottedScribble(i, j, spread, vol);
      else if (mode === "chaotic") drawChaoticScribble(i, j, spread);
    }
  }
}

function drawCurveScribble(i, j, spread) {
  noFill();
  beginShape();
  for (let n = 0; n < 10; n++) {
    let x = random(-scribbleSpacing / spread, scribbleSpacing / spread) + i;
    let y = random(-scribbleSpacing / spread, scribbleSpacing / spread) + j;
    curveVertex(x, y);
  }
  endShape();
}

function drawDottedScribble(i, j, spread, vol) {
  for (let n = 0; n < 10; n++) {
    let x = random(-scribbleSpacing / spread, scribbleSpacing / spread) + i;
    let y = random(-scribbleSpacing / spread, scribbleSpacing / spread) + j;
    let dotSize = map(vol, 0, 0.3, 3, 10);
    fill(0);
    noStroke();
    circle(x, y, dotSize);
  }
}

function drawChaoticScribble(i, j, spread) {
  noFill();
  beginShape();
  for (let n = 0; n < 10; n++) {
    let x = random(-scribbleSpacing * 2, scribbleSpacing * 2) + i;
    let y = random(-scribbleSpacing * 2, scribbleSpacing * 2) + j;
    vertex(x, y);
  }
  endShape();
}
