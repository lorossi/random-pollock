class Sketch extends Engine {
  preload() {
    this._brushes_num = 2500;
    this._duration = 900;
    this._recording = false;
    this._border = 0.15;
    this._planes = 3;
    this._biases = [{ bias: 0.7, value: 0 }, { bias: 0.95, value: 1 }, { bias: 1, value: 2 }];
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
    this._preload_frames = 120;
    if (this._recording) {
      this._capturer = new CCapture({ format: "png" });
      // WARNING: slow as heck
      for (let i = 0; i < this._preload_frames; i++) this.showParticles();
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
    const scl = random(0.5, 2);
    const max_life = random(200, 400);
    const palette = this.generate_palette();

    for (let i = 0; i < this._brushes_num; i++) {
      // take one of the biased random values from the list
      // the particles are now on "planes" that overlay each other and work in different ways
      const random_selector = random();
      const plane_seed = this._biases.filter(b => b.bias >= random_selector)[0].value;
      this.particles.push(new Particle(size, this._simplex, palette, scl, max_life, plane_seed));
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
    this.ctx.strokeStyle = "#322f2b";
    this.ctx.lineWidth = frame_size;

    this.ctx.beginPath();
    this.ctx.rect(this._border_displacement - extra, this._border_displacement - extra, this._inner_size + 2 * extra, this._inner_size + 2 * extra);
    this.ctx.stroke();

    this.ctx.restore();
  }


  generate_palette(length = 5, complementary = 2) {
    let values = [];
    let palette = [];

    const dir = random() > 0.5 ? -1 : 1;
    const h1 = random();
    const h2 = wrap(h1 + random(0.15, 0.2) * dir);
    const s = random(0.95, 1);
    const v = random(0.45, 0.5);

    const start = hsl_to_rgb(h1, s, v);
    const end = hsl_to_rgb(h2, s, v);

    values.push(start);

    const span = [end[0] - start[0], end[1] - start[1], end[2] - start[2]];

    for (let i = 0; i < length - 2; i++) {
      let new_color = Array(3);
      for (let j = 0; j < 3; j++) {
        new_color[j] = Math.floor(
          wrap(start[j] + (span[j] * (i + 1)) / length, 0, 255)
        );
      }
      values.push(new_color);
    }
    values.push(end);


    for (let i = 0; i < complementary; i++) {
      const hc = wrap(h1 + random(0.2, 0.4));
      const complementary = hsl_to_rgb(hc, s, v);
      values.push(complementary);
    }


    values.forEach((v) => {
      let color;
      color = "#";

      v.forEach((c) => {
        color += c.toString(16).padStart(2, 0);
      });
      palette.push(color);
    });

    return palette;
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

const wrap = (value, min_val = 0, max_val = 1) => {
  while (value > max_val) value -= max_val - min_val;
  while (value < min_val) value += max_val - min_val;
  return value;
};

function hsl_to_rgb(h, s, l) {
  let r, g, b;

  if (s == 0) {
    r = g = b = l; // achromatic
  } else {
    const hue_to_rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    let p = 2 * l - q;
    r = hue_to_rgb(p, q, h + 1 / 3);
    g = hue_to_rgb(p, q, h);
    b = hue_to_rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}
