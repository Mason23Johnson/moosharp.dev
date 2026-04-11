window.hologramLab = (() => {
    function init(stageId, rigId) {
        const stage = document.getElementById(stageId);
        const rig = document.getElementById(rigId);
        if (!stage || !rig) return;

        if (typeof stage._holoCleanup === "function") {
            stage._holoCleanup();
        }

        let rect = stage.getBoundingClientRect();
        let dragging = false;
        let restX = -8;
        let restY = -42;
        let targetX = restX;
        let targetY = restY;
        let currentX = targetX;
        let currentY = targetY;
        let dragStartX = 0;
        let dragStartY = 0;
        let dragBaseX = targetX;
        let dragBaseY = targetY;
        let frameId = 0;

        const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
        const wrapHugeAngle = (value) => {
            if (Math.abs(value) < 100000) {
                return value;
            }

            return value % 360;
        };

        const updateRect = () => {
            rect = stage.getBoundingClientRect();
        };

        const setTargetFromDrag = (clientX, clientY) => {
            const deltaX = clientX - dragStartX;
            const deltaY = clientY - dragStartY;

            targetY = dragBaseY + ((deltaX / rect.width) * 220);
            targetX = clamp(dragBaseX - ((deltaY / rect.height) * 96), -54, 34);
        };

        const onPointerDown = (event) => {
            dragging = true;
            updateRect();
            stage.setPointerCapture?.(event.pointerId);

            dragStartX = event.clientX;
            dragStartY = event.clientY;
            dragBaseX = currentX;
            dragBaseY = currentY;
            targetX = currentX;
            targetY = currentY;
        };

        const onPointerMove = (event) => {
            if (!dragging) {
                return;
            }

            updateRect();
            setTargetFromDrag(event.clientX, event.clientY);
        };

        const onPointerUp = (event) => {
            dragging = false;
            stage.releasePointerCapture?.(event.pointerId);
            restX = wrapHugeAngle(targetX);
            restY = wrapHugeAngle(targetY);
            targetX = restX;
            targetY = restY;
            currentX = wrapHugeAngle(currentX);
            currentY = wrapHugeAngle(currentY);
        };

        const onPointerLeave = () => {
            if (!dragging) {
                return;
            }

            dragging = false;
            restX = wrapHugeAngle(targetX);
            restY = wrapHugeAngle(targetY);
            targetX = restX;
            targetY = restY;
            currentX = wrapHugeAngle(currentX);
            currentY = wrapHugeAngle(currentY);
        };

        const tick = (time) => {
            if (!dragging) {
                const idleY = restY + Math.sin(time * 0.0008) * 6;
                const idleX = restX + Math.cos(time * 0.0011) * 2.6;
                targetY += (idleY - targetY) * 0.035;
                targetX += (idleX - targetX) * 0.035;
            }

            currentY += (targetY - currentY) * 0.12;
            currentX += (targetX - currentX) * 0.12;

            rig.style.setProperty("--holo-rx", `${currentX.toFixed(2)}deg`);
            rig.style.setProperty("--holo-ry", `${currentY.toFixed(2)}deg`);

            frameId = window.requestAnimationFrame(tick);
        };

        stage.addEventListener("pointerdown", onPointerDown);
        stage.addEventListener("pointermove", onPointerMove);
        stage.addEventListener("pointerup", onPointerUp);
        stage.addEventListener("pointercancel", onPointerUp);
        stage.addEventListener("pointerleave", onPointerLeave);
        window.addEventListener("resize", updateRect);

        frameId = window.requestAnimationFrame(tick);

        stage._holoCleanup = () => {
            window.cancelAnimationFrame(frameId);
            stage.removeEventListener("pointerdown", onPointerDown);
            stage.removeEventListener("pointermove", onPointerMove);
            stage.removeEventListener("pointerup", onPointerUp);
            stage.removeEventListener("pointercancel", onPointerUp);
            stage.removeEventListener("pointerleave", onPointerLeave);
            window.removeEventListener("resize", updateRect);
        };
    }

    return { init };
})();
