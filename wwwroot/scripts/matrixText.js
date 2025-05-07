// Glitch-style banner typing effect
<canvas id="matrixCanvas"></canvas>

window.startTypingBanner = () => {
    const titleElement = document.getElementById("bannerTitle");
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*";
    const finalText = "Welcome to MooSharp.dev";
    let index = 0;

    const interval = setInterval(() => {
        let displayText = finalText.split("").map((char, i) => {
            if (i < index) return finalText[i];
            if (char === " ") return " ";
            return letters[Math.floor(Math.random() * letters.length)];
        }).join("");

        titleElement.innerText = displayText;

        index++;
        if (index > finalText.length) {
            clearInterval(interval);
            titleElement.innerText = finalText;
        }
    }, 45);
};

// Matrix hover glitch effect
document.addEventListener("DOMContentLoaded", () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    const elements = document.querySelectorAll(".matrix-text");

    elements.forEach((element) => {
        const originalText = element.innerText;
        let frame = 0;
        let interval;

        element.addEventListener("mouseenter", () => {
            clearInterval(interval);
            frame = 0;

            interval = setInterval(() => {
                element.innerText = originalText.split("").map((char, i) => {
                    if (char === " ") return " ";
                    if (i < frame) return originalText[i];
                    return letters[Math.floor(Math.random() * letters.length)];
                }).join("");

                frame++;
                if (frame > originalText.length) {
                    clearInterval(interval);
                    element.innerText = originalText;
                }
            }, 25);
        });

        element.addEventListener("mouseleave", () => {
            clearInterval(interval);
            element.innerText = originalText;
        });
    });
});
