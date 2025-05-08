let typingInterval = null;
let nextLineTimeout = null;
let isDevInterrupt = false;
let terminalContent = "";
let isUserTyping = false;
let typedInput = "";
let introText = [];
let currentLineIndex = 0;
let currentCharIndex = 0;
let currentPage = "index";

// Starts typing
window.startTerminalTyping = (page) => {
    const waitForTerminal = () => {
        const terminal = document.getElementById("terminalText");
        if (!terminal) {
            console.warn("Waiting for #terminalText...");
            return requestAnimationFrame(waitForTerminal);
        }

        resetTerminal();
        setupIntroText(page);
        typeNextIntroLine();
        blinkCursor();
    };

    waitForTerminal();
};

// Sets intro text based on page
function setupIntroText(page) {
    console.log("Setting up intro text for page:", page);
    if (page === "about") {
        console.log("doing about page");
        introText = [
            "",
            "",
            ">> Loading About.exe...",
            ">> SYSTEM: Initializing LambdaMOO VM...",
            ">> USER CONNECTING.",
            ">> STATUS: Connected to Backend. Preparing Full Stack...",
            "",
            "Welcome to MooSharp — the digital headquarters of Mason Johnson, a 20 year old full stack developer with a backend core.",
            "",
            "My nickname “Moo” traces back to the early 1990s when my father programmed using LambdaMOO.",
            "Programming is in my blood with DNA tracing back 30 years.",
            "",
            "Today, MooSharp represents everything I build:",
            "• Modern backend systems with C#, .NET, and EF Core",
            "• Fully responsive Blazor web apps",
            "• Indie games using Godot (with C# scripting)",
            "• Freelance contracts and custom backend tools",
            "• YouTube content under the alias MooSharp",
            "",
            "This page may look like a retro 90s executable, but under the hood, it's powered by modern functionalities.",
            "This is only the beginning of my frontend specialties. I can make your website look however you'd like.",
            "",
            ">> SYSTEM: Ready...",
            ">> Type '/help' for help"
        ];
    } else {
        console.log("doing index page");
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
}

// Types next line
function typeNextIntroLine() {
    if (isDevInterrupt || currentLineIndex >= introText.length) {
        enableUserTyping();
        return;
    }

    let line = introText[currentLineIndex];
    typingInterval = setInterval(() => {
        if (isDevInterrupt) {
            clearInterval(typingInterval);
            return;
        }
        if (currentCharIndex < line.length) {
            terminalContent += line[currentCharIndex];
            updateTerminal();
            currentCharIndex++;
        } else {
            clearInterval(typingInterval);
            terminalContent += "\n";
            updateTerminal();
            currentLineIndex++;
            currentCharIndex = 0;
            if (!isDevInterrupt) {
                nextLineTimeout = setTimeout(typeNextIntroLine, 500);
            }
        }
    }, 55);
}

// Updates terminal display
function updateTerminal() {
    const terminal = document.getElementById("terminalText");
    if (!terminal) {
        console.warn("terminalText element not found");
        return;
    }
    console.log("Updating terminal with content:", terminalContent);
    terminal.innerHTML = terminalContent + '<span id="blinkingCursor">_</span>';
}



// Enables user typing
function enableUserTyping() {
    isUserTyping = true;
    document.addEventListener("keydown", handleTyping);
}

// Disables user typing
function disableUserTyping() {
    isUserTyping = false;
    document.removeEventListener("keydown", handleTyping);
}

// Handles key typing
function handleTyping(event) {
    if (!isUserTyping) return;

    if (event.key === "Enter") {
        terminalContent += "\n";
        handleCommand(typedInput.trim());
        typedInput = "";
    } else if (event.key === "Backspace") {
        typedInput = typedInput.slice(0, -1);
        terminalContent = terminalContent.slice(0, -1);
    } else if (event.key.length === 1) {
        typedInput += event.key;
        terminalContent += event.key;
    }

    updateTerminal();
}

// Handles terminal commands
function handleCommand(command) {
    const cmd = command.toLowerCase();

    switch (cmd) {
        case "/help":
            terminalContent += "\n/help: List commands\n/home: Go Home\n/about: About Me\n/projects: View Projects\n/contact: Contact Me\n/modern: Modern mode";
            break;
        case "/home":
            window.location.href = "/terminal";
            break;
        case "/about":
            window.location.href = "/terminal/about";
            break;
        case "/projects":
            window.location.href = "/terminal/projects";
            break;
        case "/contact":
            window.location.href = "/terminal/contact";
            break;
        case "/modern":
            window.location.href = "/";
            break;
        default:
            if (command.trim() !== "") {
                terminalContent += `\nUnknown command: ${command}\n`;
            }
            break;
    }
    updateTerminal();
}


// Blinks cursor
function blinkCursor() {
    setInterval(() => 
    {
        const cursor = document.getElementById("blinkingCursor");
        if (!cursor) return; // Make sure cursor exists

        if (cursor.style.visibility === "visible") 
        {
            cursor.style.visibility = "hidden";
        } 
        else 
        {
            cursor.style.visibility = "visible";
        }
    }, 500);
}

// Skips intro typing
window.completeTerminalIntro = () => {
    if (typingInterval) clearInterval(typingInterval);
    if (nextLineTimeout) clearTimeout(nextLineTimeout);

    terminalContent = introText.join("\n") + "\n";
    updateTerminal();
    enableUserTyping();
};

// Listens for Enter to skip
window.addKeypressListener = (dotNetHelper) => {
    document.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            dotNetHelper.invokeMethodAsync("CompleteTyping");
        }
    });
};

// Navigates pages
window.navigateTo = (url) => {
    window.location.href = url;
};

function resetTerminal() {
    // Stop any ongoing typing
    if (typingInterval) clearInterval(typingInterval);
    if (nextLineTimeout) clearTimeout(nextLineTimeout);

    // Reset all state
    isDevInterrupt = false;
    isUserTyping = false;
    typedInput = "";
    terminalContent = "";
    introText = [];
    currentLineIndex = 0;
    currentCharIndex = 0;

    // Clear display
    const terminal = document.getElementById("terminalText");
    if (terminal) terminal.innerText = "";
}

