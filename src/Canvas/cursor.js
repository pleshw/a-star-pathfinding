function getMousePosition(canvas, event){
    var rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
}

function getTouchPosition(canvas, event){
    var rect = canvas.getBoundingClientRect();
    return {
      x: event.touches[0].clientX - rect.left,
      y: event.touches[0].clientY - rect.top
    };
}
