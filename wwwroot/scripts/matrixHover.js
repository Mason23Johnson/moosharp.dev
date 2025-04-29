document.addEventListener("DOMContentLoaded", () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const elements = document.querySelectorAll(".matrix-hover");

    elements.forEach((element) => {
        let originalText = element.innerText;
        let interval = null;

        element.addEventListener("mouseenter", () => {
            let iteration = 0;
            clearInterval(interval); // Always clear any old glitch

            interval = setInterval(() => {
                element.innerText = originalText.split("")
                    .map((letter, index) => {
                        if (letter === " ") return " "; // Keep spaces
                        if (index < iteration) return letter; // Lock in correct letters
                        return letters[Math.floor(Math.random() * letters.length)];
                    })
                    .join("");

                if (iteration >= originalText.length) {
                    clearInterval(interval);
                }

                iteration += 1/3; // How fast correct letters lock in
            }, 30); // Speed of glitch refresh
        });

        element.addEventListener("mouseleave", () => {
            clearInterval(interval);
            element.innerText = originalText; // Instantly reset text cleanly
        });
    });
});
