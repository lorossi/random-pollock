class Brush {
  constructor(size, noise, frame_count, palette, scl = 1, random = false) {
    this._size = size;
    this._noise = noise;
    this._random = random;

    this._noise_scl = 0.001 * scl; // relative to movement
    this._time_scl = 0.005 * scl; // used in seeding
    this._seed_scl = 0.0025 * scl; // used in seeding
    this._max_acc = 3 * scl;
    this._max_vel = 2;
    this._palette = [...palette];
    this._palette_index = Math.floor(Math.random() * this._palette.length);
    this.reset(frame_count);
  }

  reset(frame_count) {
    this._dead = false;

    const px = Math.random() * this._size;
    const py = Math.random() * this._size;

    this._position = new Vector(px, py);
    this._velocity = new Vector(0, 0);
    this._acceleration = new Vector(0, 0);

    let n;
    if (this._random) {
      n = Math.random();
    } else {
      const nx = this._position.x * this._seed_scl;
      const ny = this._position.y * this._seed_scl;
      const t = frame_count * this._time_scl;
      n = (this._noise.noise3D(nx, ny, t) + 1) / 2;
    }

    this._seed = n * 100;
    this._r = Math.floor(n * 8);
    this._max_life = n * 120 + 120;
    this._life = 0;

    this._palette_index = Math.floor(n * this._palette.length);
  }

  move() {
    if (this._dead) return;

    const nx = this._position.x * this._noise_scl;
    const ny = this._position.y * this._noise_scl;

    let n;
    n = (this._noise.noise3D(nx, ny, this._seed) + 1) / 2;
    const theta = n * Math.PI * 20;
    n = (this._noise.noise3D(nx, ny, this._seed + 10000) + 1) / 2;
    const rho = n * this._max_acc;
    // simple physics simulation
    this._acceleration = new Vector.fromAngle2D(theta).setMag(rho);
    this._velocity.add(this._acceleration);
    this._velocity.limit(this._max_vel);
    this._position.add(this._velocity);
    this._life += this._velocity.mag();

    if (
      this._position.x < 0 ||
      this._position.x > this._size ||
      this._position.y < 0 ||
      this._position.y > this._size ||
      this._life > this._max_life
    ) {
      this._dead = true;
    }
  }

  show(ctx) {
    if (this._dead) return;
    // pre calculate "brush width"
    const line_width = ease(1 - this._life / this._max_life) * this._r;

    ctx.save();
    ctx.translate(this._position.x, this._position.y);
    ctx.fillStyle = this._palette[this._palette_index];
    ctx.beginPath();
    ctx.arc(0, 0, line_width, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();
  }

  get dead() {
    return this._dead;
  }
}