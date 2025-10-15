// CTRL+F: SNAKE_JS
window.snakeGame = (() => {
    const cfg = {
        tile: 24,          // size in px
        cols: 24,          // grid width
        rows: 24,          // grid height
        baseSpeed: 8,      // tiles/sec (overridden by selector)
        colors: {
            bg1: "#071018",
            snake: "#87d8ff",
            snakeHead: "#ffffff",
            food: "#25ffb5",
            wall: "#0d1f33",
            grid: "rgba(26,163,255,.07)"
        }
    };

    // state
    let canvas, ctx;
    let snake, dir, nextDir, food, score, best, alive, paused;
    let accTime = 0, stepMs; // timing
    let rafId = 0;

    // input queue to avoid double-turn bugs
    const q = [];

    function init() {
        canvas = document.getElementById("snakeCanvas");
        ctx = canvas.getContext("2d");

        best = parseInt(localStorage.getItem("snake_best") || "0", 10);
        document.getElementById("snakeBest").textContent = best;

        // controls
        document.addEventListener("keydown", onKey);
        document.getElementById("btnPause").addEventListener("click", togglePause);
        document.getElementById("btnRestart").addEventListener("click", reset);
        document.getElementById("snakeSpeed").addEventListener("change", onSpeed);
        document.querySelectorAll(".snake-pad .pad").forEach(b => {
            b.addEventListener("click", () => setDirByName(b.dataset.dir));
        });

        // speed
        stepMs = toStepMs(getSpeedSel());

        reset();
        loop(0);
    }

    function reset() {
        const cx = Math.floor(cfg.cols / 2);
        const cy = Math.floor(cfg.rows / 2);

        snake = [
            {x: cx,     y: cy},
            {x: cx - 1, y: cy},
            {x: cx - 2, y: cy}
        ];
        dir = {x: 1, y: 0};
        nextDir = {x: 1, y: 0};
        q.length = 0;

        score = 0;
        alive = true;
        paused = false;
        accTime = 0;

        document.getElementById("snakeScore").textContent = "0";
        spawnFood();
        draw(); // immediate paint
    }

    function onSpeed() {
        stepMs = toStepMs(getSpeedSel());
    }
    function getSpeedSel() {
        return parseInt(document.getElementById("snakeSpeed").value, 10);
    }
    function toStepMs(tilesPerSec) {
        return 1000 / tilesPerSec;
    }

    function onKey(e) {
        const k = e.key.toLowerCase();
        if (k === "p") { togglePause(); return; }
        if (k === "r") { reset(); return; }

        // map arrows + wasd
        if (k === "arrowup" || k === "w") queueDir(0,-1);
        else if (k === "arrowdown" || k === "s") queueDir(0,1);
        else if (k === "arrowleft" || k === "a") queueDir(-1,0);
        else if (k === "arrowright" || k === "d") queueDir(1,0);
    }

    function setDirByName(name) {
        if (name === "up") queueDir(0,-1);
        if (name === "down") queueDir(0,1);
        if (name === "left") queueDir(-1,0);
        if (name === "right") queueDir(1,0);
    }

    function queueDir(x,y) {
        // prevent reversing directly
        const last = q.length ? q[q.length - 1] : nextDir;
        if (last.x === -x && last.y === -y) return;
        q.push({x,y});
    }

    function applyQueuedDir() {
        if (!q.length) return;
        const cand = q.shift();
        // prevent immediate reverse against current dir
        if (cand.x === -dir.x && cand.y === -dir.y) return;
        nextDir = cand;
    }

    function togglePause() {
        if (!alive) return;
        paused = !paused;
        document.getElementById("btnPause").textContent = paused ? "Resume" : "Pause";
    }

    function spawnFood() {
        // avoid snake body
        while (true) {
            const x = Math.floor(Math.random() * cfg.cols);
            const y = Math.floor(Math.random() * cfg.rows);
            if (!snake.some(s => s.x === x && s.y === y)) {
                food = {x,y};
                return;
            }
        }
    }

    function loop(ts) {
        rafId = requestAnimationFrame(loop);
        if (paused || !alive) { draw(); return; }

        if (!loop.prev) loop.prev = ts;
        const dt = ts - loop.prev;
        loop.prev = ts;

        accTime += dt;
        while (accTime >= stepMs) {
            step();
            accTime -= stepMs;
        }
        draw();
    }

    function step() {
        applyQueuedDir();
        dir = nextDir;

        const head = {x: snake[0].x + dir.x, y: snake[0].y + dir.y};

        // wall collision (no wrap)
        if (head.x < 0 || head.x >= cfg.cols || head.y < 0 || head.y >= cfg.rows) {
            return gameOver();
        }
        // self collision
        if (snake.some(s => s.x === head.x && s.y === head.y)) {
            return gameOver();
        }

        // move
        snake.unshift(head);

        // eat
        if (head.x === food.x && head.y === food.y) {
            score++;
            document.getElementById("snakeScore").textContent = score;
            if (score > best) {
                best = score;
                localStorage.setItem("snake_best", String(best));
                document.getElementById("snakeBest").textContent = best;
            }
            spawnFood();
        } else {
            snake.pop();
        }
    }

    function gameOver() {
        alive = false;
        // small shake impression by quick redraws
    }

    /* ------- RENDER ------- */
    function draw() {
        const { tile, cols, rows, colors } = cfg;

        // clear
        ctx.clearRect(0,0,canvas.width,canvas.height);

        // board grid
        ctx.fillStyle = colors.bg1;
        ctx.fillRect(0,0,canvas.width,canvas.height);

        ctx.strokeStyle = colors.grid;
        ctx.lineWidth = 1;
        for (let i=1;i<cols;i++){
            const x = i*tile + 0.5;
            line(x, 0, x, rows*tile);
        }
        for (let j=1;j<rows;j++){
            const y = j*tile + 0.5;
            line(0, y, cols*tile, y);
        }

        // food
        drawCell(food.x, food.y, colors.food);

        // snake
        for (let i=snake.length-1;i>=0;i--){
            const s = snake[i];
            const c = i === 0 ? colors.snakeHead : colors.snake;
            drawCell(s.x, s.y, c);
            if (i === 0) drawHeadAccent(s, dir);
        }

        // overlay if paused/dead
        if (paused || !alive) {
            ctx.fillStyle = "rgba(0,0,0,.45)";
            ctx.fillRect(0,0,canvas.width,canvas.height);
            ctx.fillStyle = "#cfe7ff";
            ctx.font = "bold 28px 'Share Tech Mono', monospace";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(paused ? "Paused" : "Game Over — R to Restart", canvas.width/2, canvas.height/2);
        }
    }

    function drawCell(x,y, color) {
        const t=cfg.tile;
        ctx.fillStyle = color;
        ctx.fillRect(x*t+2, y*t+2, t-4, t-4);
    }

    function drawHeadAccent(head, d) {
        const t=cfg.tile;
        const cx = head.x*t + t/2;
        const cy = head.y*t + t/2;
        ctx.fillStyle = "rgba(26,163,255,.35)";
        ctx.beginPath();
        ctx.arc(cx + d.x*3, cy + d.y*3, 5, 0, Math.PI*2);
        ctx.fill();
    }

    function line(x1,y1,x2,y2){ ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke(); }

    return { init };
})();
