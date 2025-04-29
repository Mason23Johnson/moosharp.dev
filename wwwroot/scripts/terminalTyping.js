let typingInterval = null;
let nextLineTimeout = null;
let isDevInterrupt = false;

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

let introText = 
[
    ">> CONNECTING TO moosharp.dev...",
    ">> AUTHORIZING USER...",
    ">> ACCESS GRANTED.",
    ">> INITIALIZING TERMINAL...",
    ">> SUCCESSFULLY EXECUTED.",
    "", // new line for gap
    ">> TYPE '/help' FOR COMMANDS"
];

let currentLineIndex = 0;
let currentCharIndex = 0;

let terminalContent = "";
let isUserTyping = false;
let typedInput = "";

window.startTerminalTyping = () => 
{
    typeNextIntroLine();
    blinkCursor();
};

function typeNextIntroLine() {
    if (isDevInterrupt || currentLineIndex >= introText.length) return;

    let line = introText[currentLineIndex];
    typingInterval = setInterval(() => {
        if (isDevInterrupt) {
            clearInterval(typingInterval);
            typingInterval = null;
            return;
        }

        if (currentCharIndex < line.length) {
            terminalContent += line[currentCharIndex];
            updateTerminal();
            currentCharIndex++;
        } else {
            clearInterval(typingInterval);
            typingInterval = null;
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

function updateTerminal() 
{
    document.getElementById("terminalText").innerText = terminalContent;
}

function enableUserTyping() 
{
    isUserTyping = true;
    document.addEventListener("keydown", handleTyping);
}

function handleTyping(event) 
{
    if (!isUserTyping) return;

    if (event.key === "Enter") 
	{
        terminalContent += "\n";
        handleCommand(typedInput.trim());
        typedInput = "";
    } 
	else if (event.key === "Backspace") 
	{
        typedInput = typedInput.slice(0, -1);
        terminalContent = terminalContent.slice(0, -1);
    } else if (event.key.length === 1) 
	{
        typedInput += event.key;
        terminalContent += event.key;
    }
    updateTerminal();
}

function handleCommand(command) 
{
    if (command.toLowerCase() === "/help") {
        terminalContent += "\n/help: List commands\n/home: Go Home\n/projects: View Projects\n/contact: Contact Me\n";
    } 
    else if (command.toLowerCase() === "/home") {
        window.location.href = "/home";
    }
    else if (command.toLowerCase() === "/projects") {
        window.location.href = "/projects";
    }
    else if (command.toLowerCase() === "/contact") {
        window.location.href = "/contact";
    }
    else if (command.trim() !== "") {
        terminalContent += `\nUnknown command: ${command}\n`;
    }
    updateTerminal();
}

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

function blinkCursor() 
{
    setInterval(() => 
	{
        const cursor = document.getElementById("blinkingCursor");
        if (cursor.style.visibility === "visible") {
            cursor.style.visibility = "hidden";
        } else {
            cursor.style.visibility = "visible";
        }
    }, 500);

window.displayAccessGranted = () => 
    {
        disableUserTyping();
        terminalContent += "\n>> ACCESS GRANTED. Welcome, Dev.\n";
        terminalContent += ">> SYSTEM ELEVATION COMPLETE.\n";
         updateTerminal();
        
        localStorage.setItem("access", "granted");
        
         let countdown = 3;
        
         const countdownInterval = setInterval(() => 
        {
            terminalContent += `>> Redirecting in ${countdown}...\n`;
            updateTerminal();
            countdown--;
        
            if (countdown < 0) 
            {
                clearInterval(countdownInterval);
                window.location.href = "/home";
            }
        }, 1000);
    };
	
	function disableUserTyping() 
	{
		isUserTyping = false;
		document.removeEventListener("keydown", handleTyping);
	}	
}

window.addKeypressListener = (dotNetHelper) => {
    document.addEventListener("keydown", () => {
        dotNetHelper.invokeMethodAsync("CompleteTyping");
    });
};