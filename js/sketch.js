class Sketch extends Engine {
  preload() {
    this._brushes_num = 1000;
    this._duration = 900;
    this._recording = false;
    this._random_palette = true;
    this._border = 0.15;
  }

  setup() {
    // used in non random palette choosing
    this._current_palette = 0;
    // used in time calculation
    this._frameOffset = 0;
    // calculate border displacement
    // rounded for better performances
    this._border_displacement = Math.floor(this._border * this.width / 2);
    this._inner_size = Math.floor(this.height * (1 - this._border));
    // noise setup
    this._simplex = new SimplexNoise();
    // create the particles
    this.createParticles();
    // setup capturer
    this._capturer_started = false;
    if (this._recording) {
      this._capturer = new CCapture({ format: "png" });
      // WARNING: slow as heck
      for (let i = 0; i < this._duration; i++) this.showParticles();
    }
  }

  draw() {
    // start capturer
    if (!this._capturer_started && this._recording) {
      this._capturer_started = true;
      this._capturer.start();
      console.log("%c Recording started", "color: green; font-size: 2rem");
    }

    // draw all particles
    this.showParticles();

    // handle recording
    if (this._recording) {
      if ((this.frameCount - this._frameOffset) < this._duration) {
        this._capturer.capture(this._canvas);
      } else {
        this._recording = false;
        this._capturer.stop();
        this._capturer.save();
        console.log("%c Recording ended", "color: red; font-size: 2rem");
      }
    }
  }

  createParticles() {
    // setup particles
    this.particles = [];
    const size = (1 - this._border) * this.width;
    const scl = random(0.9, 1.1);
    const min_life = random(50, 100);
    const max_life = min_life + random(50, 100);
    const palette = this.generate_palette();
    const noise_angle = random(Math.PI); // adds direction to the noise
    for (let i = 0; i < this._brushes_num; i++) {
      this.particles.push(new Particle(size, this._simplex, palette, scl, min_life, max_life, noise_angle));
    }
    this.background("#fbf1e3");
  }

  showParticles() {
    this.ctx.save();
    this.ctx.save();
    this.ctx.translate(this._border_displacement, this._border_displacement);
    this.particles.forEach(b => {
      b.move();
      b.show(this.ctx);
      if (b.dead) {
        b.reset(this.frameCount - this._frameOffset);
      }
    });
    this.ctx.restore();

    const frame_size = 10;
    const extra = frame_size / 2;
    this.ctx.strokeStyle = "#191715";
    this.ctx.fillStyle = "#fbf1e3";
    this.ctx.lineWidth = frame_size;

    this.ctx.beginPath();
    this.ctx.rect(this._border_displacement - extra, this._border_displacement - extra, this._inner_size + 2 * extra, this._inner_size + 2 * extra);
    this.ctx.stroke();

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