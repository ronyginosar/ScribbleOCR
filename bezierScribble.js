// reference: https://openprocessing.org/sketch/1794772
// // random between vertex and curve vertex?

let scribbleSpacing, max_data_points, k, iters;

function drawSingleLetterCandidate() {
  noFill();
  stroke("#282828");
  strokeWeight(10);

  iters = 2; // min is 2
  max_data_points = 10;
  data_spread = 2; // higher is narrower (smaller letter)

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

