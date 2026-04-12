let typingInterval = null;
let nextLineTimeout = null;
let blinkInterval = null;
let isDevInterrupt = false;
let terminalContent = "";
let isUserTyping = false;
let typedInput = "";
let introText = [];
let currentLineIndex = 0;
let currentCharIndex = 0;
let skipHelper = null;

window.startTerminalTyping = (page) => {
    resetTerminal();
    setupIntroText(page);
    typeNextIntroLine();
    blinkCursor();
    showTerminalToast(page);
};

function setupIntroText(page) {
    if (page === "about") {
        introText = [
            "",
            "",
            ">> Loading About.exe...",
            ">> SYSTEM: Initializing LambdaMOO VM...",
            ">> USER CONNECTING.",
            ">> STATUS: Connected to Backend. Preparing Full Stack...",
            "",
            "Welcome to MooSharp, the coded embodiment of Mason Johnson, a 21 year old Salesforce and full-stack developer.",
            "",
            "Today, MooSharp represents everything I build:",
            "- Modern full-stack systems with C#, JS, CSS, HTML, Python, Java and EF Core.",
            "- Salesforce Apex Classes, Triggers, and Lightning Web Components.",
            "- Fully responsive Blazor web apps.",
            "- Linux and NAS server management and hosting.",
            "- Networking and security expertise including firewalls, VPNs, VLANS, and more.",
            "- Indie games using Godot (with C# scripting).",
            "- Freelance contracts and custom backend tools.",
            "",
            "This is only the beginning of my frontend specialties. I can make your website look however you'd like.",
            "",
            ">> SYSTEM: Ready...",
            ">> Type '/help' for help"
        ];
        return;
    }

    introText = [
        ">> CONNECTING TO moosharp.dev...",
        ">> AUTHORIZING USER...",
        ">> ACCESS GRANTED.",
        ">> INITIALIZING TERMINAL...",
        ">> SUCCESSFULLY EXECUTED.",
        "",
        ">> TYPE '/help' FOR COMMANDS"
    ];
}

function typeNextIntroLine() {
    if (isDevInterrupt || currentLineIndex >= introText.length) {
        enableUserTyping();
        return;
    }

    const line = introText[currentLineIndex];
    typingInterval = setInterval(() => {
        if (isDevInterrupt) {
            clearInterval(typingInterval);
            return;
        }

        if (currentCharIndex < line.length) {
            terminalContent += line[currentCharIndex];
            currentCharIndex++;
            updateTerminal();
            return;
        }

        clearInterval(typingInterval);
        terminalContent += "\n";
        currentLineIndex++;
        currentCharIndex = 0;
        updateTerminal();
        nextLineTimeout = setTimeout(typeNextIntroLine, 500);
    }, 55);
}

function updateTerminal() {
    const terminal = document.getElementById("terminalText");
    if (!terminal) return;

    const liveInput = isUserTyping ? typedInput : "";
    terminal.innerHTML = terminalContent + liveInput + '<span id="blinkingCursor">_</span>';
}

function enableUserTyping() {
    isUserTyping = true;
    setTerminalInputEnabled(true);
    focusTerminalInput();
    updateTerminal();
}

function disableUserTyping() {
    isUserTyping = false;
    setTerminalInputEnabled(false);
    updateTerminal();
}

window.initTerminalInput = () => {
    const input = document.getElementById("terminalCommandInput");
    if (!input || input.dataset.bound === "true") return;

    input.dataset.bound = "true";
    input.disabled = true;

    input.addEventListener("input", (event) => {
        if (!isUserTyping) return;
        typedInput = event.target.value;
        updateTerminal();
    });

    input.addEventListener("keydown", (event) => {
        if (event.key !== "Enter") return;
        event.preventDefault();
        submitTypedInput();
    });
};

function submitTypedInput() {
    if (!isUserTyping) return;

    const command = typedInput.trim();
    terminalContent += typedInput + "\n";
    typedInput = "";
    syncTerminalInput();
    handleCommand(command);
    updateTerminal();
    focusTerminalInput();
}

function handleCommand(command) {
    const cmd = command.toLowerCase();

    switch (cmd) {
        case "/help":
            terminalContent += "\n/help: List commands\n/home: Go Home\n/about: About Me\n/projects: View Projects\n/contact: Contact Me\n/arcade: Moochine Arcade\n";
            break;
        case "/home":
            window.location.href = "/";
            break;
        case "/about":
            window.location.href = "/about";
            break;
        case "/projects":
            window.location.href = "/projects";
            break;
        case "/contact":
            window.location.href = "/contact";
            break;
        case "/arcade":
            terminalContent += "\n>> SYSTEM: Redirecting back to Modern for Moochine Arcade\n";
            terminalContent += ">> SYSTEM: Redirecting to Moochine Arcade...\n";
            updateTerminal();
            setTimeout(() => {
                window.location.href = "/arcade";
            }, 4000);
            break;
        default:
            if (command !== "") {
                terminalContent += `\nUnknown command: ${command}\n`;
            }
            break;
    }
}

function blinkCursor() {
    if (blinkInterval) {
        clearInterval(blinkInterval);
    }

    blinkInterval = setInterval(() => {
        const cursor = document.getElementById("blinkingCursor");
        if (!cursor) return;
        cursor.style.visibility = cursor.style.visibility === "hidden" ? "visible" : "hidden";
    }, 500);
}

window.completeTerminalIntro = () => {
    if (typingInterval) clearInterval(typingInterval);
    if (nextLineTimeout) clearTimeout(nextLineTimeout);

    terminalContent = introText.join("\n") + "\n";
    updateTerminal();
    enableUserTyping();
};

window.addKeypressListener = (dotNetHelper) => {
    skipHelper = dotNetHelper;

    document.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && !isUserTyping) {
            dotNetHelper.invokeMethodAsync("CompleteTyping");
        }
    });

    const terminal = document.querySelector(".terminal-container");
    if (!terminal || terminal.dataset.skipBound === "true") return;

    terminal.dataset.skipBound = "true";
    terminal.addEventListener("click", () => {
        if (!isUserTyping && skipHelper) {
            skipHelper.invokeMethodAsync("CompleteTyping");
        }
    });
};

window.navigateTo = (url) => {
    window.location.href = url;
};

window.triggerDevAccess = () => {
    isDevInterrupt = true;

    if (typingInterval) clearInterval(typingInterval);
    if (nextLineTimeout) clearTimeout(nextLineTimeout);

    disableUserTyping();
    terminalContent += "\n> moosharp.exe interrupted\n> Access Granted [DEV MODE]\n";
    updateTerminal();

    localStorage.setItem("access", "granted");

    let countdown = 3;
    const interval = setInterval(() => {
        terminalContent += countdown + "...\n";
        updateTerminal();
        countdown--;
        if (countdown < 0) {
            clearInterval(interval);
            window.location.href = "/home";
        }
    }, 1000);
};

function showTerminalToast(page) {
    if (page !== "index") return;

    const existing = document.querySelector(".terminal-toast-container");
    if (existing) existing.remove();

    const container = document.createElement("div");
    container.className = "terminal-toast-container";

    const toast = document.createElement("div");
    toast.className = "terminal-toast";
    toast.textContent = "Press Enter or tap anywhere to skip typing";

    container.appendChild(toast);
    document.body.appendChild(container);

    setTimeout(() => {
        container.remove();
    }, 5000);
}

function setTerminalInputEnabled(enabled) {
    const input = document.getElementById("terminalCommandInput");
    if (!input) return;
    input.disabled = !enabled;
}

function syncTerminalInput() {
    const input = document.getElementById("terminalCommandInput");
    if (!input) return;
    input.value = typedInput;
}

function focusTerminalInput() {
    const input = document.getElementById("terminalCommandInput");
    if (!input || input.disabled) return;
    input.focus({ preventScroll: true });
}

function resetTerminal() {
    if (typingInterval) clearInterval(typingInterval);
    if (nextLineTimeout) clearTimeout(nextLineTimeout);

    isDevInterrupt = false;
    isUserTyping = false;
    typedInput = "";
    terminalContent = "";
    introText = [];
    currentLineIndex = 0;
    currentCharIndex = 0;

    const terminal = document.getElementById("terminalText");
    if (terminal) terminal.innerText = "";

    syncTerminalInput();
    setTerminalInputEnabled(false);
}
