// Glitch-style banner typing effect
window.startTypingBanner = () => {
    const titleElement = document.getElementById("bannerTitle");
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const finalText = "Welcome to MooSharp.dev";
    let currentText = "";
    let index = 0;

    const interval = setInterval(() => {
        if (index <= finalText.length) {
            let displayText = finalText.split("")
                .map((char, i) => {
                    if (i < index) return finalText[i];
                    if (char === " ") return " ";
                    return letters[Math.floor(Math.random() * letters.length)];
                })
                .join("");

            titleElement.innerText = displayText;
            index++;
        } else {
            clearInterval(interval);
            titleElement.innerText = finalText;
        }
    }, 50); // Typing/glitch speed
};

// Matrix hover effect
document.addEventListener("DOMContentLoaded", () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const elements = document.querySelectorAll(".matrix-text");

    elements.forEach((element) => {
        const originalText = element.innerText;
        let interval = null;

        element.addEventListener("mouseenter", () => {
            let iteration = 0;
            clearInterval(interval);

            interval = setInterval(() => {
                element.innerText = originalText.split("")
                    .map((char, i) => {
                        if (char === " ") return " ";
                        if (i < iteration) return originalText[i];
                        return letters[Math.floor(Math.random() * letters.length)];
                    })
                    .join("");

                if (iteration >= originalText.length) {
                    clearInterval(interval);
                }

                iteration += 1 / 3;
            }, 30);
        });

        element.addEventListener("mouseleave", () => {
            clearInterval(interval);
            element.innerText = originalText;
        });
    });
});
