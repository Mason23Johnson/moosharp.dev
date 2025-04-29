window.startCheatCodeListener = (dotNetHelper) => {
    function isMobileDevice() {
        return /Mobi|Android|iPhone/i.test(navigator.userAgent);
    }

    if (isMobileDevice()) {
        console.log("Mobile device detected: Using tap and shake!");

        let mobileSequence = ["left", "right", "bottom", "top", "bottom", "left", "bottom", "top", "bottom", "right"];
        let currentIndex = 0;

        document.getElementById("zone-left").addEventListener("click", () => checkTap("left"));
        document.getElementById("zone-top").addEventListener("click", () => checkTap("top"));
        document.getElementById("zone-right").addEventListener("click", () => checkTap("right"));
        document.getElementById("zone-bottom").addEventListener("click", () => checkTap("bottom"));

        function checkTap(direction) {
            if (direction === mobileSequence[currentIndex]) {
                currentIndex++;
                if (currentIndex === mobileSequence.length) {
                    console.log("Tap sequence correct! Now shake to confirm...");
                    startShakeDetection(dotNetHelper);
                }
            } else {
                console.log("Wrong tap. Resetting sequence.");
                currentIndex = 0;
            }
        }

        function startShakeDetection(dotNetHelper) {
            let lastShakeTime = 0;
            window.addEventListener("devicemotion", (event) => {
                const acceleration = event.accelerationIncludingGravity;
                const threshold = 15; // Shake sensitivity

                if (acceleration) {
                    const totalForce = Math.abs(acceleration.x) + Math.abs(acceleration.y) + Math.abs(acceleration.z);
                    if (totalForce > threshold) {
                        const now = Date.now();
                        if (now - lastShakeTime > 1000) { // Prevent multiple shakes
                            lastShakeTime = now;
                            console.log("Shake detected!");
                            dotNetHelper.invokeMethodAsync("UnlockSecret");
                        }
                    }
                }
            });
        }

    } else {
        console.log("Desktop detected: Using arrow keys.");

        let cheatSequence = [
            "ArrowLeft", "ArrowRight", "ArrowDown", "ArrowUp",
            "ArrowDown", "ArrowLeft", "ArrowDown", "ArrowUp",
            "ArrowDown", "ArrowRight"
        ];
        let currentCheatIndex = 0;

        document.addEventListener("keydown", (e) => {
            if (e.key === cheatSequence[currentCheatIndex]) {
                currentCheatIndex++;
                if (currentCheatIndex === cheatSequence.length) {
                    dotNetHelper.invokeMethodAsync("UnlockSecret");
                    currentCheatIndex = 0;
                }
            } else {
                currentCheatIndex = 0;
            }
        });
    }
};
