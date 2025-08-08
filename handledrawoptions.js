function drawHandles(pts, closed=false) {
    const n = pts.length;
    for (let i = 0; i < n; i++) {
      const iPrev = (i-1+n) % n, iNext = (i+1) % n;
      if (!closed && (i === 0 || i === n-1)) continue; // skip endpoints
  
      const p = pts[i], a = pts[iPrev], b = pts[iNext];
  
      // tangent (prev->next)
      let tx = b.x - a.x, ty = b.y - a.y;
      const tlen = Math.hypot(tx, ty) || 1;
      tx /= tlen; ty /= tlen;
  
      // normal (perp)
      const nx = -ty, ny = tx;
  
      const handleLen = 30;     // tweak
      const normalOffset = 10;  // “outside the line”
  
      const handleIn  = { x: p.x - tx*handleLen, y: p.y - ty*handleLen };
      const handleOut = { x: p.x + tx*handleLen, y: p.y + ty*handleLen };
      const offcurve  = { x: p.x + nx*normalOffset, y: p.y + ny*normalOffset };
  
      // draw like a glyph editor
      stroke(0); line(p.x, p.y, handleIn.x, handleIn.y);
      line(p.x, p.y, handleOut.x, handleOut.y);
      noStroke(); fill(0); circle(p.x, p.y, 6);          // anchor
      fill(100); circle(handleIn.x, handleIn.y, 5);      // handles
      circle(handleOut.x, handleOut.y, 5);
      fill(0); circle(offcurve.x, offcurve.y, 4);        // optional “outside” dot
    }
  }

  
  // OR 
  function drawCRasBezier(pts, closed=false) {
    const n = pts.length;
    if (n < 4) return;
  
    beginShape();
    for (let i = 0; i < n-3; i++) {
      const P0 = pts[i], P1 = pts[i+1], P2 = pts[i+2], P3 = pts[i+3];
  
      if (i === 0) vertex(P1.x, P1.y); // start at P1
  
      const B1 = {
        x: P1.x + (P2.x - P0.x)/6,
        y: P1.y + (P2.y - P0.y)/6
      };
      const B2 = {
        x: P2.x - (P3.x - P1.x)/6,
        y: P2.y - (P3.y - P1.y)/6
      };
  
      // draw the curve
      bezierVertex(B1.x, B1.y, B2.x, B2.y, P2.x, P2.y);
  
      // (optional) visualize glyph handles
      stroke(0,80); line(P1.x, P1.y, B1.x, B1.y);
      line(P2.x, P2.y, B2.x, B2.y);
      noStroke(); fill(0); circle(P1.x, P1.y, 6); circle(P2.x, P2.y, 6);
      fill(100); circle(B1.x, B1.y, 5); circle(B2.x, B2.y, 5);
    }
    endShape();
  }
  