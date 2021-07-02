class Brush {
  constructor(size, noise, palette, scl = 1, max_life = 100, min_life = 20) {
    this._size = size;
    this._noise = noise;
    this._palette = [...palette];
    this._scl = scl;
    this._max_life = max_life;
    this._min_life = min_life;

    this._noise_scl = 0.015 * scl; // relative to movement
    this._seed_scl = 0.005 * scl; // used in seeding
    this._max_force = 1;
    this._max_acc = 4 * scl;
    this._max_vel = 2;

    this.reset();
  }

  reset() {
    this._dead = false;

    const px = Math.random() * this._size;
    const py = Math.random() * this._size;

    this._position = new Vector(px, py);
    this._velocity = new Vector(0, 0);
    this._acceleration = new Vector(0, 0);
    this._seed = this._noise_scl * random(-1, 1) * 5;

    const nx = this._position.x * this._seed_scl;
    const ny = this._position.y * this._seed_scl;
    const n1 = (this._noise.noise3D(nx, ny, 0) + 1) / 2;
    const n2 = (this._noise.noise3D(nx, ny, 1000) + 1) / 2;
    const n3 = (this._noise.noise3D(nx, ny, 2000) + 1) / 2;

    this._r = Math.floor(n1 * 4) + 4;
    this._start_life = n2 * (this._max_life - this._min_life) + this._min_life;
    this._life = 0;
    this._palette_index = Math.floor(n3 * this._palette.length);
  }

  move() {
    if (this._dead) return;

    const nx = this._position.x * this._noise_scl;
    const ny = this._position.y * this._noise_scl;

    let n;
    n = (this._noise.noise3D(nx, ny, this._seed) + 1) / 2;
    const theta = n * Math.PI * 50;
    n = (this._noise.noise3D(nx, ny, this._seed) + 1) / 2;
    const rho = n * this._max_force;
    // simple physics simulation
    this._force = new Vector.fromAngle2D(theta).setMag(rho);
    this._acceleration.add(this._force);
    this._acceleration.limit(this._max_acc);
    this._velocity.add(this._acceleration);
    this._velocity.limit(this._max_vel);
    this._position.add(this._velocity);
    this._life += this._velocity.mag();

    if (
      this._position.x < 0 ||
      this._position.x > this._size ||
      this._position.y < 0 ||
      this._position.y > this._size ||
      this._life > this._start_life
    ) {
      this._dead = true;
    }
  }

  show(ctx) {
    if (this._dead) return;
    // pre calculate "brush width"
    const eased_life = ease(1 - this._life / this._start_life);
    const line_width = eased_life * this._r;

    ctx.save();
    ctx.translate(Math.floor(this._position.x), Math.floor(this._position.y));
    ctx.fillStyle = this._palette[this._palette_index];
    ctx.beginPath();
    ctx.arc(0, 0, Math.floor(line_width), 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();
  }

  get dead() {
    return this._dead;
  }
}