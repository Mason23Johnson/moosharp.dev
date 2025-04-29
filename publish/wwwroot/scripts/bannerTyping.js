window.startTypingBanner = () => {
    const titleElement = document.getElementById("bannerTitle");
    const text = "Welcome to MooSharp.dev";
    let currentText = "";
    let index = 0;

    const interval = setInterval(() => {
        if (index < text.length) {
            currentText += text[index]; 
            titleElement.innerText = currentText;
            index++;
        } else {
            clearInterval(interval);
        }
    }, 100); // Typing speed
}
