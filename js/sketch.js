class Sketch extends Engine {
  preload() {
    this._brushes_num = 2000;
    this._preload_frames = 0;
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
    const scl = random(0.9, 1.1);
    const palette = generate_palette();
    for (let i = 0; i < this._brushes_num; i++) {
      this._brushes.push(new Brush(this.width, this._simplex, palette, scl));
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
        b.reset();
      }
    });
    this.ctx.restore();
  }

  mousedown() {
    this.setup();
  }
}

const generate_palette = () => {
  const palettes = [[
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
  ], [
    "#2E038C",
    "#0FBF9F",
    "#F2B705",
    "#F2541B",
    "#F25252",
    "#FFF",
  ], [
    "#0477BF",
    "#7AB3BF",
    "#F29422",
    "#D90404",
    "#590202",
    "#FFF",
  ], [
    "#4024A6",
    "#0468BF",
    "#049DBF",
    "#93A603",
    "#F2B705",
    "#FFF",
  ], [
    "#40171A",
    "#733444",
    "#667349",
    "#BFAAA3",
    "#F2F2F2",
    "#FFF",
  ], [
    "#339AA6",
    "#F2DC99",
    "#F2B988",
    "#F28B66",
    "#F26A4B",
    "#FFF",
  ], ["#96D2D9",
    "#F28D77",
    "#D9564A",
    "#F25050",
    "#F2C9C9",
    "#FFF",
  ], [
    "#BF506E",
    "#F2BB13",
    "#D99C2B",
    "#D95E32",
    "#BF4E4E",
    "#FFF",
  ], [
    "#02735E",
    "#1ED9B7",
    "#16F2B4",
    "#A0F2C4",
    "#262522",
    "#FFF",
  ],
  ];

  return random_from_array(palettes);
};

const ease = x => {
  return 1 - Math.cos((x * Math.PI) / 2);
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