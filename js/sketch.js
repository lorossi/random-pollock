class Sketch extends Engine {
  preload() {
    this._brushes_num = 2000;
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
    const scl = random(0.5, 2);
    const palette = generate_palette(5);
    for (let i = 0; i < this._brushes_num; i++) {
      this._brushes.push(new Brush(this.width, this._simplex, this.frameCount, palette, scl));
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

const generate_palette = (variation = 0, min_sat = 80, max_light = 50, distance = 15) => {
  const wrap_degrees = (deg) => {
    while (deg < 0) deg += 360;
    while (deg > 360) deg -= 360;
    return deg;
  };

  let palette = [];
  const central_angle = Math.floor(Math.random() * 360);

  for (let i = 0; i < 3; i++) {
    const saturation = ((90 - min_sat) / 2) * i + min_sat + random(-1, 1) * variation;
    const lightness = ((max_light - 46) / 2) * (2 - i) + 46 + random(-1, 1) * variation;
    const angle_distance = distance + random(-1, 1) * variation;
    let angle;

    if (i == 0) {
      angle = central_angle;
      palette.push(`hsl(${angle}, ${saturation}%, ${lightness}%)`);
    } else {
      for (let j = 0; j < 2; j++) {
        const dir = j == 0 ? -1 : 1;
        angle = wrap_degrees(central_angle + dir * angle_distance * i);
        palette.push(`hsl(${angle}, ${saturation}%, ${lightness}%)`);
      }
    }
  }

  const complementary_angle = wrap_degrees(central_angle + 180);
  palette.push(`hsl(${complementary_angle}, ${min_sat}%, ${max_light}%)`);
  // add white
  const r = random();
  if (r < 0.25) palette.push("hsl(0, 100%, 100%)");
  return palette;
};

const ease = x => {
  const c1 = 1.70158;
  const c3 = c1 + 1;

  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};

const random = (a, b) => {
  if (a == undefined && b == undefined) return random(0, 1);
  else if (b == undefined) return random(0, a);
  else if (a != undefined && b != undefined) return Math.random() * (b - a) + a;
};