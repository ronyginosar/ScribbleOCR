// What you can tune:
// f1, f2: Frequency range (e.g., 100–1000 for voice, or 20–250 for low thumps)
// threshold: Raise if you're getting false positives; lower if you're missing events
// framesPerPeak: Increase to prevent double detections

// Visual Explanation:
// Blue bar shows how much energy is in your selected frequency band
// Red line shows the internal cutoff uses to decide if a peak happened
// Red circle = actual peak detection this frame

let mic, fft, peakDetect;

function setup() {
  createCanvas(400, 300);
  mic = new p5.AudioIn();
  mic.start();

  fft = new p5.FFT();
  fft.setInput(mic);

  // Try tweaking the band and threshold
  peakDetect = new p5.PeakDetect(100, 1000, 0.15, 20); // f1, f2, threshold, framesPerPeak
}

function draw() {
  background(240);

  fft.analyze();
  peakDetect.update(fft);

  // Show energy bar in target frequency range
  let energy = peakDetect.energy;
  let cutoff = peakDetect.cutoff;

  // Draw the energy bar
  fill(100, 100, 255);
  rect(50, height - energy, 50, energy);

  // Draw the cutoff threshold line
  stroke(255, 0, 0);
  line(50, height - cutoff, 100, height - cutoff);

  // If peak is detected, show a flash
  if (peakDetect.isDetected) {
    fill(255, 0, 0, 150);
    ellipse(200, height / 2, 50, 50);
  }

  // Debug print (optional)
  console.log({
    energy: Math.round(energy),
    cutoff: Math.round(cutoff),
    isDetected: peakDetect.isDetected
  });

  // Optional: Draw labels
  noStroke();
  fill(0);
  textSize(12);
  textAlign(LEFT);
  text(`Energy: ${Math.round(energy)}`, 120, height - 40);
  text(`Cutoff: ${Math.round(cutoff)}`, 120, height - 20);
}
