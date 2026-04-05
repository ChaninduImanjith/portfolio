const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');
  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX - 5 + 'px';
    cursor.style.top = e.clientY - 5 + 'px';
    ring.style.left = e.clientX + 'px';
    ring.style.top = e.clientY + 'px';
  });
  document.querySelectorAll('a, button, .skill-chip').forEach(el => {
    el.addEventListener('mouseenter', () => { ring.style.width = '60px'; ring.style.height = '60px'; ring.style.opacity = '0.3'; });
    el.addEventListener('mouseleave', () => { ring.style.width = '36px'; ring.style.height = '36px'; ring.style.opacity = '0.5'; });
  });

  window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 40);
  });

  document.getElementById('hamburger').addEventListener('click', () => {
    document.getElementById('mobileMenu').classList.toggle('open');
  });
  function closeMobile() { document.getElementById('mobileMenu').classList.remove('open'); }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        e.target.style.transitionDelay = (i * 0.07) + 's';
        e.target.classList.add('visible');
        e.target.querySelectorAll('.skill-bar-fill').forEach(bar => { bar.style.width = bar.dataset.width + '%'; });
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  document.querySelectorAll('.skill-bar-fill').forEach(bar => {
    const obs2 = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) { bar.style.width = bar.dataset.width + '%'; obs2.unobserve(bar); }
    }, { threshold: 0.3 });
    obs2.observe(bar);
  });

  document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = this.querySelector('button');
    btn.textContent = 'Sending...';
    btn.style.opacity = '0.7';
    setTimeout(() => {
      btn.textContent = 'Send Message →';
      btn.style.opacity = '1';
      this.reset();
      const status = document.getElementById('formStatus');
      status.classList.add('show');
      setTimeout(() => status.classList.remove('show'), 4000);
    }, 1200);
  });

  const roles = ['DevOps Engineer', 'MLOps Enthusiast','Full-Stack Developer','SE Undergraduate', 'Tech Writer','Problem Solver'];
  let ri = 0, ci = 0, deleting = false;
  const roleEl = document.querySelector('.hero-role');
  function typeRole() {
    const current = roles[ri];
    if (!deleting) {
      roleEl.textContent = current.slice(0, ci + 1); ci++;
      if (ci === current.length) { deleting = true; setTimeout(typeRole, 2000); return; }
    } else {
      roleEl.textContent = current.slice(0, ci - 1); ci--;
      if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
    }
    setTimeout(typeRole, deleting ? 60 : 90);
  }
  setTimeout(typeRole, 1500);

  // ── PARTICLE CANVAS ──
  (function() {
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let W, H;
    const COUNT = 90;
    const particles = [];
    const mouse = { x: -9999, y: -9999 };

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();
    document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

    function rand(a, b) { return a + Math.random() * (b - a); }

    function Particle() {
      this.x  = rand(0, W);
      this.y  = rand(0, H);
      this.vx = rand(-0.22, 0.22);
      this.vy = rand(-0.22, 0.22);
      this.r  = rand(1, 2.4);
      this.alpha = rand(0.12, 0.5);
      var c = Math.random();
      this.color = c < 0.6 ? '230,57,70' : c < 0.8 ? '244,162,97' : '99,179,237';
    }
    Particle.prototype.update = function() {
      var dx = this.x - mouse.x, dy = this.y - mouse.y;
      var dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 120 && dist > 0) {
        var force = (120 - dist) / 120 * 0.7;
        this.vx += (dx / dist) * force;
        this.vy += (dy / dist) * force;
      }
      this.vx *= 0.99; this.vy *= 0.99;
      this.x += this.vx; this.y += this.vy;
      if (this.x < -10) this.x = W + 10;
      if (this.x > W+10) this.x = -10;
      if (this.y < -10) this.y = H + 10;
      if (this.y > H+10) this.y = -10;
    };
    Particle.prototype.draw = function() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(' + this.color + ',' + this.alpha + ')';
      ctx.fill();
    };

    for (var i = 0; i < COUNT; i++) particles.push(new Particle());

    function drawLines() {
      var DIST = 130;
      for (var a = 0; a < particles.length; a++) {
        for (var b = a+1; b < particles.length; b++) {
          var dx = particles[a].x - particles[b].x;
          var dy = particles[a].y - particles[b].y;
          var d  = Math.sqrt(dx*dx + dy*dy);
          if (d < DIST) {
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.strokeStyle = 'rgba(230,57,70,' + (0.09 * (1 - d/DIST)) + ')';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, W, H);
      drawLines();
      particles.forEach(function(p) { p.update(); p.draw(); });
      requestAnimationFrame(animate);
    }
    animate();
  })();
// ── PROFILE PICTURE: TILT ON MOUSE + TOUCH ANIMATION ──
(function() {
  const profileWrap = document.querySelector('.profile-ring-outer');
  if (!profileWrap) return;

  // Mouse tilt
  profileWrap.addEventListener('mousemove', function(e) {
    const rect = profileWrap.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width  / 2);  
    const dy = (e.clientY - cy) / (rect.height / 2);  
    const tiltX =  dy * -14;  
    const tiltY =  dx *  14;
    profileWrap.style.transform =
      'perspective(700px) rotateX(' + tiltX + 'deg) rotateY(' + tiltY + 'deg) scale(1.03)';
  });

  profileWrap.addEventListener('mouseleave', function() {
    profileWrap.style.transform = 'perspective(700px) rotateX(0deg) rotateY(0deg) scale(1)';
  });

  // Touch tap glow effect (mobile)
  profileWrap.addEventListener('touchstart', function() {
    profileWrap.classList.add('touched');
  }, { passive: true });

  profileWrap.addEventListener('touchend', function() {
    setTimeout(function() {
      profileWrap.classList.remove('touched');
    }, 600);
  });

  // Touch tilt (drag on mobile)
  profileWrap.addEventListener('touchmove', function(e) {
    var touch = e.touches[0];
    var rect = profileWrap.getBoundingClientRect();
    var cx = rect.left + rect.width  / 2;
    var cy = rect.top  + rect.height / 2;
    var dx = (touch.clientX - cx) / (rect.width  / 2);
    var dy = (touch.clientY - cy) / (rect.height / 2);
    var tiltX =  dy * -10;
    var tiltY =  dx *  10;
    profileWrap.style.transform =
      'perspective(700px) rotateX(' + tiltX + 'deg) rotateY(' + tiltY + 'deg) scale(1.03)';
  }, { passive: true });
})();

