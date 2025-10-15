window.enableDrag = (element) => {
    let startX = 0, startY = 0;
    let offsetX = 0, offsetY = 0;

    const header = element.querySelector(".window-header") || element;

    const dragMouseDown = (e) => {
        e.preventDefault();

        const rect = element.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;

        startX = e.clientX;
        startY = e.clientY;

        document.addEventListener("mousemove", dragElement);
        document.addEventListener("mouseup", stopDrag);
    };

    const dragElement = (e) => {
        e.preventDefault();

        const left = e.clientX - offsetX;
        const top = e.clientY - offsetY;

        element.style.left = `${left}px`;
        element.style.top = `${top}px`;
        element.style.position = "fixed"; // force fixed position
    };

    const stopDrag = () => {
        document.removeEventListener("mousemove", dragElement);
        document.removeEventListener("mouseup", stopDrag);
    };

    header.onmousedown = dragMouseDown;
};
