// reference: https://openprocessing.org/sketch/1794772
// // random between vertex and curve vertex?

let scribbleSpacing, max_data_points, k, iters;

function drawSingleLetterCandidate(amp) {
  noFill();
  // noLoop();
  stroke("#282828");
  // strokeWeight(1);

  iters = 2; // min is 2
  max_data_points = 10;
  data_spread = 2; // higher is narrower (smaller letter)

  // if (width < height) {
  //   dn = width / iters;
  // } else {
  //   dn = height / iters;
  // }

  scribbleSpacing = min(width, height) / iters;

  for (let i = 0 + scribbleSpacing; i <= width - scribbleSpacing; i += scribbleSpacing) {
    for (let j = 0 + scribbleSpacing; j <= width - scribbleSpacing; j += scribbleSpacing) {
      singleLetterCandidate(i, j, amp);
    }
  }
}

function singleLetterCandidate(i, j, amp) {
  strokeWeight(5);
  beginShape();
  for (let n = 0; n < max_data_points; n++) {
    const x = random(-scribbleSpacing / data_spread, scribbleSpacing / data_spread) + i;
    const y = random(-scribbleSpacing / data_spread, scribbleSpacing / data_spread) + j;

    push();
    strokeWeight(1);
    // TODO emphasis: like dots in fonts?
    stroke("red");
    // When the getLevel() function is called inside the draw() function, it returns the volume of a sound at the given time of each frame
    // circle(x, y, 3);
    fill("red");
    circle(x, y, amp);
    pop();

    // random between vertex and curve vertex?
    // vertex(x, y);
    curveVertex(x, y);
  }
  endShape();
}

