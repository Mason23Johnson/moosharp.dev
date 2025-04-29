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

window.startOuterUI = () => {
    startRotatingWelcome();
    if (window.startCheatCodeListener) {
        DotNet.invokeMethodAsync('MooSharpFrontend', 'StartCheatCodeListener');
    }
};

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

window.unlockDevMode = () => {
    const welcomeBase = document.getElementById("welcomeBase");
    isDevUnlocked = true;
    clearInterval(rotationInterval);
    welcomeBase.innerHTML = "WELCOME DEV";
    setTimeout(() => {
        window.startLoadingExe();
    }, 1500); // Short delay after dev unlocked
};

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
