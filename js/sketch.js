class Sketch extends Engine {
  preload() {
    this._brushes_num = 750;
    this._preload_frames = 60;
  }

  setup() {
    // setup capturer
    this._capturer_started = false;
    if (this._recording) {
      this._capturer = new CCapture({ format: "png" });
    }
    // noise setup
    this._simplex = new SimplexNoise();
    // setup particles
    this._brushes = [];
    const scl = random(0.2, 5);

    for (let i = 0; i < this._brushes_num; i++) {
      this._brushes.push(new Brush(this.width, this._simplex, this.frameCount, scl));
    }
    this.background("black");

    // preload to avoid pop-in effect
    for (let i = 0; i < this._preload_frames; i++) {
      this.showParticles();
    }
  }

  draw() {
    this.showParticles();
  }

  showParticles() {
    this.ctx.save();
    this._brushes.forEach(b => {
      b.show(this.ctx);
      b.move();
      if (b.dead) {
        b.reset(this.frameCount);
      }
    });
    this.ctx.restore();
  }

  mousedown() {
    this.setup();
  }
}

const ease = (x) => Math.sin((x * Math.PI) / 2);

const random = (a, b) => {
  if (a == undefined && b == undefined) return random(0, 1);
  else if (b == undefined) return random(0, a);
  else if (a != undefined && b != undefined) return Math.random() * (b - a) + a;
};