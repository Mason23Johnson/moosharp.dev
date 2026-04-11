function startDragSession(e, element) {
    let offsetX = 0;
    let offsetY = 0;

    e.preventDefault();

    const rect = element.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    const dragElement = (moveEvent) => {
        moveEvent.preventDefault();

        const left = moveEvent.clientX - offsetX;
        const top = moveEvent.clientY - offsetY;

        element.style.left = `${left}px`;
        element.style.top = `${top}px`;
        element.style.position = "fixed";
    };

    const stopDrag = () => {
        document.removeEventListener("mousemove", dragElement);
        document.removeEventListener("mouseup", stopDrag);
    };

    document.addEventListener("mousemove", dragElement);
    document.addEventListener("mouseup", stopDrag);
}

window.enableDrag = (element) => {
    const header = element.querySelector(".window-header") || element;
    header.onmousedown = (e) => startDragSession(e, element);
};

window.beginDrag = (e, element) => {
    if (!element) return;
    startDragSession(e, element);
};
