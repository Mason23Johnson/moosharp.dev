window.addKeydownListener = (dotNetHelper) => {
    document.addEventListener("keydown", (e) => {
        if (!isNaN(e.key) && e.key >= "1" && e.key <= "9") {
            e.preventDefault();
            dotNetHelper.invokeMethodAsync("HandleKeyPress", e.key);
        }
    });
};