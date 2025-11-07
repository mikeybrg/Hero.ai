// api/generate-game.js
// Template-based game generator (no external API needed)

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    // safe body parse
    let body = "";
    for await (const chunk of req) body += chunk;
    const data = JSON.parse(body || "{}");
    const prompt = (data.prompt || "").toLowerCase().trim();
const type = (data.type || "").toLowerCase();
const theme = (data.theme || "").toLowerCase();
const difficulty = (data.difficulty || "").toLowerCase();
let chosen = null;

if (type.includes("pong")) {
    chosen = templates.pong;
}
else if (type.includes("snake")) {
    chosen = templates.snake;
}
else if (type.includes("flappy")) {
    chosen = templates.flappy;
}
else if (type.includes("space shooter")) {
    chosen = templates.shooter;
}
else {
    chosen = templates.pong; // default fallback
}

    if (!prompt) {
      return res.status(400).json({ error: "Missing prompt" });
    }

    // Simple keyword matching to pick a template
    const templates = {
      pong: pongTemplate(),
      snake: snakeTemplate(),
      flappy: flappyTemplate(),
      shooter: shooterTemplate()
    };

    // choose template by keyword
    let chosen = null;
    if (prompt.includes("pong") || prompt.includes("ping") || prompt.includes("table")) chosen = templates.pong;
    else if (prompt.includes("snake")) chosen = templates.snake;
    else if (prompt.includes("flappy") || prompt.includes("bird")) chosen = templates.flappy;
    else if (prompt.includes("space") || prompt.includes("shooter") || prompt.includes("alien")) chosen = templates.shooter;
    else {
      // default: Pong
      chosen = templates.pong;
    }

    return res.status(200).json({ gameCode: chosen });
  } catch (err) {
    console.error("API ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

// ----------------- TEMPLATES -----------------

function pongTemplate() {
  // Simple HTML/JS Pong (uses canvas). This returns code as a string that the frontend eval() will run.
  return `
/* Pong template - runnable JS */
(function(){
  // remove existing game loop if any
  if (window._heroGameLoop) {
    cancelAnimationFrame(window._heroGameLoop);
    window._heroGameLoop = null;
  }

  const canvas = document.getElementById("gameCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  canvas.width = 800;
  canvas.height = 450;

  // state
  let upPressed = false, downPressed = false;
  document.onkeydown = (e) => { if (e.key === "ArrowUp") upPressed = true; if (e.key === "ArrowDown") downPressed = true; };
  document.onkeyup = (e) => { if (e.key === "ArrowUp") upPressed = false; if (e.key === "ArrowDown") downPressed = false; };

  const paddle = { x: 20, y: 200, w: 12, h: 80, speed: 6 };
  const ai = { x: canvas.width - 32, y: 200, w: 12, h: 80 };
  const ball = { x: canvas.width/2, y: canvas.height/2, r: 8, vx: 5*(Math.random()>0.5?1:-1), vy: 3*(Math.random()>0.5?1:-1) };
  let score = { player: 0, ai: 0 };

  function draw() {
    // background
    ctx.fillStyle = "#000";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    // net
    ctx.fillStyle = "#333";
    for (let i=10;i<canvas.height;i+=30) ctx.fillRect(canvas.width/2-1, i, 2, 20);

    // paddles
    ctx.fillStyle = "#fff";
    ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);
    ctx.fillRect(ai.x, ai.y, ai.w, ai.h);

    // ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI*2);
    ctx.fill();

    // scores
    ctx.font = "28px monospace";
    ctx.fillText(score.player, canvas.width/2 - 60, 40);
    ctx.fillText(score.ai, canvas.width/2 + 40, 40);
  }

  function update() {
    // player
    if (upPressed) paddle.y -= paddle.speed;
    if (downPressed) paddle.y += paddle.speed;
    paddle.y = Math.max(0, Math.min(canvas.height - paddle.h, paddle.y));

    // simple AI
    if (ball.y < ai.y + ai.h/2) ai.y -= 3;
    else ai.y += 3;
    ai.y = Math.max(0, Math.min(canvas.height - ai.h, ai.y));

    // move ball
    ball.x += ball.vx;
    ball.y += ball.vy;

    // top/bottom
    if (ball.y - ball.r < 0 || ball.y + ball.r > canvas.height) ball.vy *= -1;

    // paddle collision
    if (ball.x - ball.r < paddle.x + paddle.w && ball.y > paddle.y && ball.y < paddle.y + paddle.h) {
      ball.vx = Math.abs(ball.vx) + 0.5;
      ball.vx *= -1;
      // add spin depending on where it hit
      const diff = ball.y - (paddle.y + paddle.h/2);
      ball.vy += diff * 0.05;
    }
    // ai collision
    if (ball.x + ball.r > ai.x && ball.y > ai.y && ball.y < ai.y + ai.h) {
      ball.vx = -Math.abs(ball.vx) - 0.5;
      const diff = ball.y - (ai.y + ai.h/2);
      ball.vy += diff * 0.05;
    }

    // scores
    if (ball.x < 0) { score.ai++; resetBall(); }
    if (ball.x > canvas.width) { score.player++; resetBall(); }
  }

  function resetBall() {
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    ball.vx = 5 * (Math.random()>0.5?1:-1);
    ball.vy = 3 * (Math.random()>0.5?1:-1);
  }

  function loop() {
    update();
    draw();
    window._heroGameLoop = requestAnimationFrame(loop);
  }

  resetBall();
  loop();
})();
  `;
}

function snakeTemplate() {
  return `
/* Snake template - runnable JS */
(function(){
  if (window._heroGameLoop) { cancelAnimationFrame(window._heroGameLoop); window._heroGameLoop=null;}
  const canvas = document.getElementById("gameCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  canvas.width = 600; canvas.height = 600;
  const scale = 20;
  let dir = {x:1,y:0};
  let snake = [{x:10,y:10}];
  let food = spawn();
  let speed = 8, frame=0;

  document.addEventListener("keydown",(e)=>{
    if (e.key==='ArrowUp' && dir.y!==1) dir={x:0,y:-1};
    if (e.key==='ArrowDown' && dir.y!==-1) dir={x:0,y:1};
    if (e.key==='ArrowLeft' && dir.x!==1) dir={x:-1,y:0};
    if (e.key==='ArrowRight' && dir.x!==-1) dir={x:1,y:0};
  });

  function spawn(){ return {x: Math.floor(Math.random()* (canvas.width/scale)), y: Math.floor(Math.random()* (canvas.height/scale))}; }
  function update() {
    frame++;
    if (frame % (60/speed) !== 0) return;
    const head = {x:snake[0].x+dir.x, y:snake[0].y+dir.y};
    if (head.x<0||head.y<0||head.x>=canvas.width/scale||head.y>=canvas.height/scale || snake.some(s=>s.x===head.x&&s.y===head.y)) {
      // reset
      snake=[{x:10,y:10}]; dir={x:1,y:0}; food=spawn(); speed=8;
      return;
    }
    snake.unshift(head);
    if (head.x===food.x && head.y===food.y) { food=spawn(); speed+=0.5; } else snake.pop();
  }

  function draw(){
    ctx.fillStyle="#000"; ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle="#0f0"; for (let s of snake) ctx.fillRect(s.x*scale,s.y*scale,scale-2,scale-2);
    ctx.fillStyle="#f00"; ctx.fillRect(food.x*scale,food.y*scale,scale-2,scale-2);
  }

  function loop(){ update(); draw(); window._heroGameLoop = requestAnimationFrame(loop); }
  loop();
})();
  `;
}

function flappyTemplate() {
  return `
/* Flappy template - runnable JS */
(function(){
  if (window._heroGameLoop) { cancelAnimationFrame(window._heroGameLoop); window._heroGameLoop=null;}
  const canvas = document.getElementById("gameCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  canvas.width=480; canvas.height=640;

  let bird = {x:100, y:300, vy:0};
  const gravity = 0.6;
  const jump = -10;
  let pipes = [];
  let frame = 0;

  function spawnPipe(){
    const gap = 140;
    const top = Math.random() * (canvas.height - gap - 120) + 40;
    pipes.push({x:canvas.width, top});
  }

  document.addEventListener("keydown", (e)=> { if (e.key===' '||e.key==='ArrowUp') bird.vy = jump; });

  function update(){
    bird.vy += gravity; bird.y += bird.vy;
    if (frame % 90 === 0) spawnPipe();
    pipes.forEach(p=> p.x -= 3);
    pipes = pipes.filter(p => p.x + 60 > 0);
    if (bird.y > canvas.height || bird.y < 0) reset();
    for (const p of pipes) {
      if (bird.x + 20 > p.x && bird.x < p.x + 60) {
        if (bird.y < p.top || bird.y > p.top + 140) reset();
      }
    }
    frame++;
  }

  function reset(){ bird={x:100,y:300,vy:0}; pipes=[]; frame=0; }

  function draw(){
    ctx.fillStyle="#70c5ce"; ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle="#ff0"; ctx.fillRect(bird.x, bird.y, 20, 20);
    ctx.fillStyle="#0a0"; for (const p of pipes) { ctx.fillRect(p.x,0,60,p.top); ctx.fillRect(p.x,p.top+140,60,canvas.height - p.top - 140); }
  }

  function loop(){ update(); draw(); window._heroGameLoop = requestAnimationFrame(loop); }
  loop();
})();
  `;
}

function shooterTemplate() {
  return `
/* Space Shooter template - runnable JS */
(function(){
  if (window._heroGameLoop) { cancelAnimationFrame(window._heroGameLoop); window._heroGameLoop=null;}
  const canvas = document.getElementById("gameCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  canvas.width=800; canvas.height=500;

  const player = {x: 380, y: 430, w:40, h:20, bullets:[]};
  let enemies = [];
  for (let i=0;i<6;i++) enemies.push({x:50+i*110, y:30, w:40, h:20});
  document.addEventListener("keydown", (e)=>{ if (e.key==='ArrowLeft') player.x -= 30; if (e.key==='ArrowRight') player.x += 30; if (e.key===' ') player.bullets.push({x:player.x+player.w/2,y:player.y}); });
  function update(){
    player.x = Math.max(0, Math.min(canvas.width-player.w, player.x));
    for (let b of player.bullets) b.y -= 8;
    player.bullets = player.bullets.filter(b=>b.y>0);
    for (let e of enemies) {
      e.y += 0.1;
    }
    enemies = enemies.filter(e=>e.y < canvas.height);
    if (Math.random() < 0.02) enemies.push({x: Math.random()*(canvas.width-40), y: -20, w:40, h:20});
    // collisions
    for (let b of player.bullets) for (let e of enemies) {
      if (b.x > e.x && b.x < e.x+e.w && b.y > e.y && b.y < e.y+e.h) { e.y = 9999; b.y = -9999; }
    }
  }
  function draw(){
    ctx.fillStyle="#000"; ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle="#0f0"; ctx.fillRect(player.x,player.y,player.w,player.h);
    ctx.fillStyle="#f00"; for (let e of enemies) ctx.fillRect(e.x,e.y,e.w,e.h);
    ctx.fillStyle="#ff0"; for (let b of player.bullets) ctx.fillRect(b.x,b.y,4,8);
  }
  function loop(){ update(); draw(); window._heroGameLoop = requestAnimationFrame(loop); }
  loop();
})();
  `;
}
