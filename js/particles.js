class Particle {
  constructor(size, noise, palette, scl, max_life, plane, g) {
    this._size = size;
    this._noise = noise;
    this._palette = [...palette];
    this._scl = scl;
    this._max_life = max_life;
    this._plane_seed = plane;

    this._noise_scl = 0.004 * scl; // used to calculate movement
    this._seed_scl = 0.001 * scl; // used in seeding
    this._time_scl = 0.03; // used in seeding
    this._max_force = 2;
    this._max_acc = 2;
    this._max_vel = 1.5;
    this._min_r = 3;
    this._max_r = 8;
    this._G = g;

    this.reset();
  }

  reset(frameCount = 0) {
    //  particles can be drawn ABOVE and AROUND the top to add drip effect there too
    const px = this._size * random(-0.05, 1.05);
    const py = this._size * random(-0.1, 1);
    const t = frameCount / 60 * this._time_scl;

    this._gravity = new Vector(0, this._G);
    this._position = new Vector(px, py);
    this._acceleration = new Vector(0, 0);
    this._seed = this._noise_scl * random(-1, 1) * 5;

    // pre calculation
    const nx = this._seed_scl * this._position.x;
    const ny = this._seed_scl * this._position.y;

    // noise calculation
    //  all the noise variables are uncorrelated to each other but still
    //  similar for close particles
    const n1 = (this._generateNoise(nx, ny, t + 10000, this._plane_seed) + 1) / 2;
    const n2 = (this._generateNoise(nx, ny, t + 20000, this._plane_seed) + 1) / 2;
    const n3 = (this._generateNoise(nx, ny, t + 30000, this._plane_seed) + 1) / 2;
    const n4 = (this._generateNoise(nx, ny, t + 40000, this._plane_seed) + 1) / 2;

    // particle mass and radius
    this._r = Math.floor(n1 * (this._max_r - this._min_r)) + this._min_r;
    this._mass = Math.pow(this._r / this._max_r, 3) * 2; // approximation
    // particle starting life and life life
    this._start_life = n2 * this._max_life;
    this._life = 0;
    // current color in the palette
    this._palette_index = Math.floor(n3 * this._palette.length);
    // initial speed
    const theta = n4 * Math.PI * 12;
    this._velocity = new Vector.fromAngle2D(theta).setMag(this._max_vel);

    // of course the particle is alive
    this._dead = false;

    // preload to avoid the waterfall effect
    if (frameCount == 0) {
      this._delay = this._start_life * random(0.1, 1.5);
    }
  }

  move() {
    if (this._dead) return;
    if (this._delay > 0) {
      this._delay--;
      return;
    }

    // pre calculate noise positions
    const nx = this._position.x * this._noise_scl;
    const ny = this._position.y * this._noise_scl;
    // use noise generation function to calculate the force vector
    let n;
    n = this._generateNoise(nx, ny, this._seed, this._plane_seed);
    const theta = n * Math.PI * 2;
    n = (this._generateNoise(nx, ny, this._seed, this._plane_seed) + 1) / 2;
    const rho = n * this._max_force;
    // simple physics simulation
    this._force = new Vector.fromAngle2D(theta).setMag(rho);
    this._force.add(this._gravity); // add gravity
    this._force.mult(this._mass); // 2nd newton law
    this._acceleration.add(this._force);
    this._acceleration.limit(this._max_acc);
    this._velocity.add(this._acceleration);
    this._velocity.limit(this._max_vel);
    this._position.add(this._velocity);
    // age the particle
    this._life += this._velocity.mag();

    // check if the particle is too old or outside the canvas
    if (
      this._position.y > this._size ||
      this._life > this._start_life
    ) {
      this._dead = true;
    }
  }

  show(ctx) {
    if (this._dead) return;
    if (this._delay > 0) {
      this._delay--;
      return;
    }
    if (this._position.y < 0 ||
      this._position.x < 0 ||
      this._position.x > this._size)
      return; // some particles are added above the top and around the sides

    // pre calculate "brush width"
    const eased_life = this._ease(1 - this._life / this._start_life);
    const line_width = eased_life * this._r;
    // pre calculate and round coordinates for better performances
    const px = Math.floor(this._position.x);
    const py = Math.floor(this._position.y);

    ctx.save();
    ctx.translate(px, py);
    ctx.fillStyle = this._palette[this._palette_index];
    ctx.beginPath();
    ctx.arc(0, 0, Math.floor(line_width), 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();
  }

  _generateNoise(x = 0, y = 0, z = 0, w = 0) {
    return this._noise.noise4D(x, y, z, w);
  }

  _ease(x) {
    return x === 1 ? 1 : 1 - Math.pow(2, -10 * x); // exponential easing
  }

  get dead() {
    return this._dead;
  }
}