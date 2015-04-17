//$(document).on("contextmenu ", contextMenu);
document.onmousedown = mouseDownKey;
document.onmouseup = mouseUpKey;
document.onmousemove = mouseMove;
document.onscroll = mouseScroll;

function mouseDownKey(event) {
    event = event || window.event;
    var target = event.toElement;
    var WG = Application.WorkGround;
    var tool = Application.ActiveTool;
    Application.State.EndXY = [];
    Application.State.StatXY = [event.offsetX, event.offsetY];
    switch (event.which) {
        case 1 :
            if (target === WG)
                tool.OnMousemoveWorkSpaceMouseKeyDown(event);
            else if (target.className === "layer")
                tool.OnMousemoveCanvasMouseKeyDown(event);
            //console.log(event.offsetX, event.offsetY);
            Application.State.LeftPressed = true;
            break;
        case 2 :
            if (target === WG)
                tool.OnMousemoveWorkSpaceMouse2KeyDown(event);
            else if (target.className === "layer")
                tool.OnMousemoveCanvasMouseKey2Down(event);

            Application.State.ThirdPressed = true;
            break;
        case 3 :
            if (target === WG)
                tool.OnMousemoveWorkSpaceMouse3KeyDown(event);
            else if (target.className === "layer")
                tool.OnMousemoveCanvasMouse3KeyDown(event);

            Application.State.RightPressed = true;
            break;
    }
    //event.which==1,2,3 левая, средняя, правая
    //console.log(event);
}
function mouseUpKey(event) {
    event = event || window.event;
    var target = event.toElement;
    var WG = Application.WorkGround;
    var tool = Application.ActiveTool;
    Application.State.EndXY = [event.offsetX, event.offsetY];
    switch (event.which) {
        case 1 :
            if (target === WG)
                tool.OnMousemoveWorkSpaceMouseKeyUp(event);
            else if (target.className === "layer")
                tool.OnMousemoveCanvasMouseKeyUp(event);

            Application.State.LeftPressed = false;
            break;
        case 2 :
            if (target === WG)
                tool.OnMousemoveWorkSpaceMouse2KeyUp(event);
            else if (target.className === "layer")
                ctool.OnMousemoveCanvasMouse2KeyUp(event);

            Application.State.ThirdPressed = false;
            break;
        case 3 :
            if (target === WG)
                tool.OnMousemoveWorkSpaceMouse3KeyUp(event);
            else if (target.className === "layer")
                tool.OnMousemoveCanvasMouse3KeyUp(event);

            Application.State.RightPressed = false;
            break;
    }

}
function mouseMove(event) {
    event = event || window.event;
    mouseHelper(event);
    // console.log(event);
}
function mouseScroll(event) {
    event = event || window.event;

    // console.log(event);
}
function mouseHelper(e)
{
    var helper = document.getElementById("mouseHelper") || document.createElement("div");
    helper.id = "mouseHelper";
    document.body.appendChild(helper);
helper.innerHTML = "";
    var state = Application.State;
    /*for (var i in state)
        helper.innerHTML+=i+" - "+state[i]+"<br>";*/
    //helper.innerHTML = "i`m a helper";

    helper.style.top = e.pageY + 13 + "px";
    helper.style.left = e.pageX + 10 + "px";
}

