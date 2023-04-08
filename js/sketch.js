class Sketch extends Engine {
  preload() {
    this._brushes_num = 1000;
    this._border = 0.15;
    this._biases = [
      { bias: 0.7, value: 0 },
      { bias: 0.95, value: 1 },
      { bias: 1, value: 2 },
    ];
    this._duration = 1800;
    this._recording = false;
    this._auto_save = false;
    this._palette_debug = false;
    // download button
    const download_button = document.querySelector("#download");
    download_button.addEventListener("click", () =>
      this.saveAsImage("Random-Pollock")
    );
  }

  setup() {
    // used in non random palette choosing
    this._current_palette = 0;
    // shuffle palette array if not recording or in debug mode
    if (!this._recording && !this._palette_debug) shuffle_array(palettes);
    // used in time calculation
    this._frame_offset = 0;
    // noise setup
    this._simplex = new SimplexNoise();
    // create the particles
    this.createParticles();
    // setup capturer
    if (this._recording) this.startRecording();
  }

  draw() {
    // start capturer
    this.showParticles();

    // handle recording
    if (this._recording) {
      if (this.frameCount - this._frame_offset < this._duration) {
        // periodically show updates
        const percent =
          ((this.frameCount - this._frame_offset) / this._duration) * 100;
        if (percent % 5 == 0)
          console.log(
            `%c Recording currently at ${Math.floor(percent)}%`,
            "color: green"
          );
      } else {
        this.stopRecording();
        this.saveRecording();
        this._recording = false;
      }
    }
    // auto save frames if flag is set
    if (
      this._auto_save &&
      this.frameCount - this._frame_offset == this._duration
    ) {
      this._frame_offset = this.frameCount;
      this.saveAsImage(`random-pollock-${Math.floor(new Date() / 1000)}`);
      this.createParticles();
    }
  }

  createParticles() {
    // setup particles
    this.particles = [];
    const size = this.width;
    const scl = random(0.5, 2);
    const max_life = random(200, 400);
    const palette = this.generate_palette();
    const g = random(0.7, 0.8); // small variance in G (gravitational constant) as well

    for (let i = 0; i < this._brushes_num; i++) {
      // take one of the biased random values from the list
      // the particles are now on "planes" that overlay each other and work in different ways
      const random_selector = random();
      const plane_seed = this._biases.filter(
        (b) => b.bias >= random_selector
      )[0].value;
      this.particles.push(
        new Particle(size, this._simplex, palette, scl, max_life, plane_seed, g)
      );
    }

    // reset the background
    this.background("#fbf1e3");
  }

  showParticles() {
    this.ctx.save();

    // move to fit the border
    this.ctx.translate(this.width / 2, this.height / 2);
    this.ctx.scale(1 - this._border, 1 - this._border);
    this.ctx.translate(-this.width / 2, -this.height / 2);

    // draw each particle
    this.particles.forEach((b) => {
      b.move();
      b.show(this.ctx);
      if (b.dead) {
        b.reset(this.frameCount - this._frame_offset);
      }
    });

    // frame settings
    const frame_size = 10;
    this.ctx.strokeStyle = "#322f2b";
    this.ctx.lineWidth = frame_size;

    // draw the actual frame
    this.ctx.strokeRect(0, 0, this.width, this.height);

    this.ctx.restore();
  }

  generate_palette() {
    // select the new palette and increase the count
    const picked = palettes[this._current_palette];
    if (this._palette_debug || this._recording)
      console.log({
        index: this._current_palette,
        palette: picked,
        total_palettes: palettes.length,
      });

    this._current_palette = (this._current_palette + 1) % palettes.length;

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
  else if (a != undefined && b != undefined)
    return Math.floor(Math.random() * (b - a)) + a;
};

const random_from_array = (arr) => {
  return arr[random_int(arr.length)];
};

const shuffle_array = (a) => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
};
