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
    resetTerminal();
    setupIntroText(page);
    typeNextIntroLine();
    blinkCursor();
    showTerminalToast();
};

// Sets intro text based on page
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
            "• Modern full-stack systems with C#, JS, CSS, HTML, Python, Java and EF Core.",
            "• Salesforce Apex Classes, Triggers, and Lightning Web Components.",
            "• Fully responsive Blazor web apps.",
            "• Linux and NAS server management and hosting.",
            "• Networking and security expertise inluding firewalls, VPNs, VLANS, and more.",
            "• Indie games using Godot (with C# scripting).",
            "• Freelance contracts and custom backend tools.",
            "• YouTube content under the alias MooSharp.",
            "",
            "This is only the beginning of my frontend specialties. I can make your website look however you'd like.",
            "",
            ">> SYSTEM: Ready...",
            ">> Type '/help' for help"
        ];
    } else {
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
function updateTerminal() 
{
    const terminal = document.getElementById("terminalText");
    if (!terminal) return;

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
function handleCommand(command) 
{
    const cmd = command.toLowerCase();

    switch (cmd) 
    {
        case "/help":
            terminalContent += "\n/help: List commands\n/home: Go Home\n/about: About Me\n/projects: View Projects\n/contact: Contact Me\n/arcade: Moochine Arcade\n";
            break;
        case "/home":
            window.location.href = "/";
            break;
        case "/about":
            window.location.href = "/terminal/about";
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
            if (command.trim() !== "") 
            {
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

// DEV access interruption
window.triggerDevAccess = () => {
    isDevInterrupt = true;

    if (typingInterval) clearInterval(typingInterval);
    if (nextLineTimeout) clearTimeout(nextLineTimeout);

    disableUserTyping();
    terminalContent += "\n> moosharp.exe interrupted\n> Access Granted [DEV MODE]\n";
    updateTerminal();

    localStorage.setItem("access", "granted");

    let countdown = 3;
    let interval = setInterval(() => {
        terminalContent += countdown + "...\n";
        updateTerminal();
        countdown--;
        if (countdown < 0) {
            clearInterval(interval);
            window.location.href = "/home";
        }
    }, 1000);
};

// Loading fake EXE (optional for booting up PC)
function startLoadingExe() {
    if (isDevInterrupt) return;

    terminalContent += "\n> Executing: moosharp_home.exe\n";
    terminalContent += "> Allocating memory blocks...\n";
    updateTerminal();

    setTimeout(() => {
        if (isDevInterrupt) return;
        terminalContent += "> System boot complete. Launching UI...\n";
        updateTerminal();

        setTimeout(() => {
            if (isDevInterrupt) return;
            terminalContent += "> Coming soon...\n";
            updateTerminal();

            setTimeout(() => {
                if (isDevInterrupt) return;
                document.getElementById('bootScreen').style.display = 'none';
                document.getElementById('pcScreen').style.display = 'flex';
            }, 1000);
        }, 1000);
    }, 1000);
}

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

