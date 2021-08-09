class Sketch extends Engine {
  preload() {
    this._brushes_num = 2500;
    this._duration = 900;
    this._recording = false;
    this._border = 0.15;
    this._planes = 3;
    this._biases = [{ bias: 0.7, value: 0 }, { bias: 0.95, value: 1 }, { bias: 1, value: 2 }];
    this._palette_debug = false;
  }

  setup() {
    // used in non random palette choosing
    this._current_palette = 0;
    // shuffle palette array if not recording or in debug mode
    if (!this._recording && !this._palette_debug) shuffle_array(palettes);
    // used in time calculation
    this._frame_offset = 0;
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
      if ((this.frameCount - this._frame_offset) < this._duration) {
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
    const scl = random(0.5, 2);
    const max_life = random(200, 400);
    const palette = this.generate_palette();
    const g = random(0.7, 0.8); // small variance in G  gravitational constant) as well

    for (let i = 0; i < this._brushes_num; i++) {
      // take one of the biased random values from the list
      // the particles are now on "planes" that overlay each other and work in different ways
      const random_selector = random();
      const plane_seed = this._biases.filter(b => b.bias >= random_selector)[0].value;
      this.particles.push(new Particle(size, this._simplex, palette, scl, max_life, plane_seed, g));
    }

    // reset the background
    this.background("#fbf1e3");
  }

  showParticles() {
    this.ctx.save();

    // move to fit the border
    this.ctx.save();
    this.ctx.translate(this._border_displacement, this._border_displacement);

    // draw each particle
    this.particles.forEach(b => {
      b.move();
      b.show(this.ctx);
      if (b.dead) {
        b.reset(this.frameCount - this._frame_offset);
      }
    });
    this.ctx.restore();

    // frame settings
    const frame_size = 10;
    const extra = frame_size / 2;
    this.ctx.strokeStyle = "#322f2b";
    this.ctx.lineWidth = frame_size;

    // draw the actual frame
    this.ctx.beginPath();
    this.ctx.rect(this._border_displacement - extra, this._border_displacement - extra, this._inner_size + 2 * extra, this._inner_size + 2 * extra);
    this.ctx.stroke();

    this.ctx.restore();
  }


  generate_palette() {
    let picked; // currently picked palette
    // select the new palette and increase the count
    picked = palettes[this._current_palette];
    console.log({ index: this._current_palette, palette: picked });
    this._current_palette = (this._current_palette + 1) % palettes.length;

    // shuffle the palette before returning it
    shuffle_array(picked);
    return picked;
  }

  mousedown() {
    // click has no effect while recording
    if (this._recording) return;

    this._frame_offset = this.frameCount;
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

const shuffle_array = a => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
};