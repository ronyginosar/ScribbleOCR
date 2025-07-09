// reference: https://openprocessing.org/sketch/1794772
// // random between vertex and curve vertex?

let dn, max_data_points, k, iters;

function drawSingleLetterCandidate() {
  noFill();
  // noLoop();
  stroke("#282828");
  // strokeWeight(1);

  iters = 2; // min is 2
  max_data_points = 10;
  data_spread = 2; // higher is narrower (smaller letter)

  if (width < height) {
    dn = width / iters;
  } else {
    dn = height / iters;
  }

  for (let i = 0 + dn; i <= width - dn; i += dn) {
    for (let j = 0 + dn; j <= width - dn; j += dn) {
      singleLetterCandidate(i, j);
    }
  }
}

function singleLetterCandidate(i, j) {
  beginShape();
  for (let n = 0; n < max_data_points; n++) {
    x = random(-dn / data_spread, dn / data_spread) + i;
    y = random(-dn / data_spread, dn / data_spread) + j;

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

