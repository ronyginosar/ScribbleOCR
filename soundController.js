// let drawVisualizerRange = 100;

class SoundController {
  constructor() {
    this.mic = new p5.AudioIn();
    this.amp = new p5.Amplitude();
    this.level = 0;
    this.visualY = [];
    this.enabled = false;
  }

  toggleMic() {
    if (!this.enabled) {
      this.mic.start();
      this.amp.setInput(this.mic);
      this.enabled = true;
      console.log("Mic started");
    } else {
      this.mic.stop();
      this.enabled = false;
      console.log("Mic stopped");
    }
  }

  // update() {
  //   if (!this.enabled) return;
  //   this.level = this.amp.getLevel();
  //   this.visualY.push(this.level);
  //   if (this.visualY.length > width) this.visualY.shift();
  // }

  getMode() {
    if (!this.enabled) return "curve";
    if (this.level > 0.15) return "dotted";
    else if (this.level > 0.05) return "chaotic";
    else return "curve";
  }

  update() {
    if (!this.enabled) return;
    // // console.log("Updating sound controller...");
    // let raw = this.amp.getLevel();
    // this.level = lerp(this.level, raw, 0.1); // Smooth the volume
  
    // this.visualY.push(this.level);
    // if (this.visualY.length > 300) {
    //   this.visualY.shift();
    // }

    let raw = this.amp.getLevel();
    this.level = lerp(this.level, raw, 0.1);
  
    this.visualY.push(this.level);
    if (this.visualY.length > 300) {  // fixed length buffer
      this.visualY.shift();
    }

    console.log(this.level);

  }
  
  drawVisualizer(graphicsCanvas) {
    // graphicsCanvas.background(0, 0); // ensures old trails are erased
    // graphicsCanvas.background(backgroundcolor);

    graphicsCanvas.stroke("green");
    graphicsCanvas.strokeWeight(1);
    graphicsCanvas.noFill();    
    graphicsCanvas.beginShape();
  
    for (let i = 0; i < this.visualY.length; i += 2) {
      let x = map(i, 0, this.visualY.length, 0, graphicsCanvas.width);
      let y = map(this.visualY[i], 0, 0.3, graphicsCanvas.height - 10, graphicsCanvas.height - 80);
      graphicsCanvas.vertex(x, y);
    }
  
    graphicsCanvas.endShape();
  }
}
