let rotatingTitles = [
    "USER",
    "PLAYER",
    "FRIEND",
    "PROGRAMMER",
    "FUTURE BOSS",
    "EXPLORER",
    "HACKER"
];
let rotatingIndex = 0;
let rotationInterval = null;
let isDevUnlocked = false;

function startRotatingWelcome() {
    const welcomeBase = document.getElementById("welcomeBase");
    glitchChange(welcomeBase, rotatingTitles[rotatingIndex]);

    rotationInterval = setInterval(() => {
        if (!isDevUnlocked) {
            rotatingIndex = (rotatingIndex + 1) % rotatingTitles.length;
            glitchChange(welcomeBase, rotatingTitles[rotatingIndex]);
        }
    }, 3000);
}

function glitchChange(element, targetText) {
    let iterations = 0;
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let original = targetText.split("");

    const interval = setInterval(() => {
        element.innerHTML = "WELCOME " + original.map((letter, idx) => {
            if (idx < iterations) {
                return original[idx];
            }
            return letters[Math.floor(Math.random() * letters.length)];
        }).join("");

        if (iterations >= original.length) clearInterval(interval);
        iterations += 1/2;
    }, 30);
}

let lastScrollY = window.scrollY;
const nav = document.getElementById('scrollNav');

window.addEventListener('scroll', () => {
    if (!nav) return;
    
    if (window.scrollY > lastScrollY) {
        // scrolling down
        nav.classList.add('hidden-scroll');
    } else {
        // scrolling up
        nav.classList.remove('hidden-scroll');
        nav.classList.add('show-scroll');
    }

    lastScrollY = window.scrollY;
});
