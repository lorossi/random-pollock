class Sketch extends Engine {
  preload() {
    this._brushes_num = 1000;
    this._preload_frames = 180;
    this._palettes = [[
      "#FBA922",
      "#F0584A",
      "#2B5877",
      "#1194A8",
      "#1FC7B7",
      "#FFF",
    ], [
      "#012840",
      "#315955",
      "#788C64",
      "#D1D99A",
      "#BFB063",
      "#FFF",
    ],
    [
      "#2E038C",
      "#0FBF9F",
      "#F2B705",
      "#F2541B",
      "#F25252",
      "#FFF",
    ],
    [
      "#0477BF",
      "#7AB3BF",
      "#F29422",
      "#D90404",
      "#590202",
      "#FFF",
    ],
    [
      "#4024A6",
      "#0468BF",
      "#049DBF",
      "#93A603",
      "#F2B705",
      "#FFF",
    ],
    ];
    this._random = true;
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
    const palette = random_from_array(this._palettes);
    for (let i = 0; i < this._brushes_num; i++) {
      this._brushes.push(new Brush(this.width, this._simplex, this.frameCount, palette, scl, this._random));
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

const random_int = (a, b) => {
  if (a == undefined && b == undefined) return random_int(0, 1);
  else if (b == undefined) return random_int(0, a);
  else if (a != undefined && b != undefined) return Math.floor(Math.random() * (b - a)) + a;
};

const random_from_array = arr => {
  return arr[random_int(arr.length)];
};