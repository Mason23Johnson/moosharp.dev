window.snakeGame = (() => {
    const cfg = {
        tile: 24,
        cols: 24,
        rows: 24,
        colors: {
            bg1: "#071018",
            snake: "#87d8ff",
            snakeHead: "#ffffff",
            food: "#25ffb5",
            grid: "rgba(26,163,255,.07)"
        }
    };

    let canvas, ctx;
    let snake, dir, nextDir, food, score, best, alive, paused, started;
    let accTime = 0;
    let stepMs;
    const q = [];
    let touchStartX = 0;
    let touchStartY = 0;

    function init() {
        canvas = document.getElementById("snakeCanvas");
        ctx = canvas.getContext("2d");

        best = parseInt(localStorage.getItem("snake_best") || "0", 10);
        document.getElementById("snakeBest").textContent = best;

        document.addEventListener("keydown", onKey);
        canvas.addEventListener("touchstart", onTouchStart, { passive: false });
        canvas.addEventListener("touchend", onTouchEnd, { passive: false });
        document.getElementById("btnStart").addEventListener("click", start);
        document.getElementById("btnPause").addEventListener("click", togglePause);
        document.getElementById("btnRestart").addEventListener("click", reset);
        document.getElementById("snakeSpeed").addEventListener("change", onSpeed);

        stepMs = toStepMs(getSpeedSel());
        reset(false);
        requestAnimationFrame(loop);
    }

    function start() {
        if (!started) {
            started = true;
            paused = false;
            document.getElementById("btnPause").textContent = "Pause";
            draw();
        }
    }

    function reset(shouldStart = true) {
        const cx = Math.floor(cfg.cols / 2);
        const cy = Math.floor(cfg.rows / 2);

        snake = [
            { x: cx, y: cy },
            { x: cx - 1, y: cy },
            { x: cx - 2, y: cy }
        ];

        dir = { x: 1, y: 0 };
        nextDir = { x: 1, y: 0 };
        q.length = 0;

        score = 0;
        alive = true;
        paused = false;
        started = shouldStart;
        accTime = 0;

        document.getElementById("snakeScore").textContent = "0";
        document.getElementById("btnPause").textContent = "Pause";
        spawnFood();
        draw();
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
        if (k === "p") {
            togglePause();
            return;
        }
        if (k === "r") {
            reset();
            return;
        }

        if (k === "arrowup" || k === "w") {
            e.preventDefault();
            queueDir(0, -1);
        }
        else if (k === "arrowdown" || k === "s") {
            e.preventDefault();
            queueDir(0, 1);
        }
        else if (k === "arrowleft" || k === "a") {
            e.preventDefault();
            queueDir(-1, 0);
        }
        else if (k === "arrowright" || k === "d") {
            e.preventDefault();
            queueDir(1, 0);
        }
    }

    function onTouchStart(e) {
        if (!e.changedTouches.length) return;
        const touch = e.changedTouches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        e.preventDefault();
    }

    function onTouchEnd(e) {
        if (!e.changedTouches.length) return;

        const touch = e.changedTouches[0];
        const deltaX = touch.clientX - touchStartX;
        const deltaY = touch.clientY - touchStartY;
        const threshold = 24;

        if (Math.abs(deltaX) < threshold && Math.abs(deltaY) < threshold) {
            e.preventDefault();
            return;
        }

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            queueDir(deltaX > 0 ? 1 : -1, 0);
        } else {
            queueDir(0, deltaY > 0 ? 1 : -1);
        }

        if (!started) {
            start();
        }

        e.preventDefault();
    }

    function queueDir(x, y) {
        const last = q.length ? q[q.length - 1] : nextDir;
        if (last.x === -x && last.y === -y) return;
        q.push({ x, y });
    }

    function applyQueuedDir() {
        if (!q.length) return;
        const cand = q.shift();
        if (cand.x === -dir.x && cand.y === -dir.y) return;
        nextDir = cand;
    }

    function togglePause() {
        if (!alive || !started) return;
        paused = !paused;
        document.getElementById("btnPause").textContent = paused ? "Resume" : "Pause";
    }

    function spawnFood() {
        while (true) {
            const x = Math.floor(Math.random() * cfg.cols);
            const y = Math.floor(Math.random() * cfg.rows);
            if (!snake.some((s) => s.x === x && s.y === y)) {
                food = { x, y };
                return;
            }
        }
    }

    function loop(ts) {
        requestAnimationFrame(loop);

        if (!started || paused || !alive) {
            draw();
            return;
        }

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

        const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

        if (head.x < 0 || head.x >= cfg.cols || head.y < 0 || head.y >= cfg.rows) {
            gameOver();
            return;
        }

        if (snake.some((s) => s.x === head.x && s.y === head.y)) {
            gameOver();
            return;
        }

        snake.unshift(head);

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
    }

    function draw() {
        const { tile, cols, rows, colors } = cfg;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = colors.bg1;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = colors.grid;
        ctx.lineWidth = 1;
        for (let i = 1; i < cols; i++) {
            const x = i * tile + 0.5;
            line(x, 0, x, rows * tile);
        }
        for (let j = 1; j < rows; j++) {
            const y = j * tile + 0.5;
            line(0, y, cols * tile, y);
        }

        drawCell(food.x, food.y, colors.food);

        for (let i = snake.length - 1; i >= 0; i--) {
            const s = snake[i];
            const c = i === 0 ? colors.snakeHead : colors.snake;
            drawCell(s.x, s.y, c);
            if (i === 0) drawHeadAccent(s, dir);
        }

        if (!started || paused || !alive) {
            ctx.fillStyle = "rgba(0,0,0,.45)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "#cfe7ff";
            ctx.font = "bold 28px 'Share Tech Mono', monospace";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            const overlayText = !started ? "Press Start to Begin" : (paused ? "Paused" : "Game Over - R to Restart");
            ctx.fillText(overlayText, canvas.width / 2, canvas.height / 2);
        }
    }

    function drawCell(x, y, color) {
        const t = cfg.tile;
        ctx.fillStyle = color;
        ctx.fillRect(x * t + 2, y * t + 2, t - 4, t - 4);
    }

    function drawHeadAccent(head, d) {
        const t = cfg.tile;
        const cx = head.x * t + t / 2;
        const cy = head.y * t + t / 2;
        ctx.fillStyle = "rgba(26,163,255,.35)";
        ctx.beginPath();
        ctx.arc(cx + d.x * 3, cy + d.y * 3, 5, 0, Math.PI * 2);
        ctx.fill();
    }

    function line(x1, y1, x2, y2) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    return { init };
})();
