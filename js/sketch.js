class Sketch extends Engine {
  preload() {
    this._brushes_num = 2000;
    this._duration = 900;
    this._recording = false;
    this._random_palette = false;
  }

  setup() {
    // used in non random palette choosing
    this._current_palette = 0;
    // used in time calculation
    this._frameOffset = 0;
    // noise setup
    this._simplex = new SimplexNoise();
    // create the particles
    this.createParticles();
  }

  draw() {
    this.showParticles();
  }

  createParticles() {
    // setup particles
    this.particles = [];
    const scl = random(0.9, 1.1);
    const min_life = random(50, 100);
    const max_life = min_life + random(50, 100);
    const palette = this.generate_palette();
    const noise_angle = Math.random() * Math.PI * 2;
    for (let i = 0; i < this._brushes_num; i++) {
      this.particles.push(new Particle(this.width, this._simplex, palette, scl, min_life, max_life, noise_angle));
    }
    this.background("#fbf1e3");

    // setup capturer
    this._capturer_started = false;
    if (this._recording) {
      this._capturer = new CCapture({ format: "png" });
      // WARNING: slow as heck
      for (let i = 0; i < this._duration; i++) this.showParticles();
    }
  }

  showParticles() {
    const percent = ((this.frameCount - this._frameOffset) % this._duration) / this._duration;

    this.ctx.save();
    this.particles.forEach(b => {
      b.move();
      b.show(this.ctx);
      if (b.dead) {
        b.reset(percent);
      }
    });
    this.ctx.restore();
  }


  generate_palette() {
    if (this._random_palette) return random_from_array(palettes);
    else {
      const picked = palettes[this._current_palette];

      console.log({ index: this._current_palette, palette: picked });

      this._current_palette = (this._current_palette + 1) % palettes.length;
      return picked;
    }
  }

  mousedown() {
    this._frameOffset = this.frameCount;
    this.createParticles();
  }
}

const ease = x => {
  return 1 - Math.pow(1 - x, 4);
};

const random = (a, b) => {
  if (a == undefined && b == undefined) return random(0, 1);
  else if (b == undefined) return random(0, a);
  else if (a != undefined && b != undefined) return Math.random() * (b - a) + a;
};

const random_int = (a, b) => {
  if (a == undefined && b == undefined) return random_int(0, 1);
  else if (b == undefined) return random_int(0, a);
  else if (a != undefined && b != undefined) return Math.floor(Math.random() * (b - a)) + a;
};

const random_from_array = arr => {
  return arr[random_int(arr.length)];
};