//$(document).on("contextmenu ", contextMenu);
document.onmousedown = mouseDownKey;
document.onmouseup = mouseUpKey;
document.onmousemove = mouseMove;
document.onwheel = mouseScroll;

function mouseDownKey(event) {
    event = event || window.event;
    var target = (event.toElement == undefined) ?  event.target:event.toElement;
	event.preventDefault();
	event.stopPropagation();
    var WG = Application.WorkGround;
    var tool = Application.ActiveTool;
    Application.State.EndXY = [];
    Application.State.MoveXY = [];
    var x = (event.offsetX == undefined) ? event.layerX : event.offsetX;
    var y = (event.offsetY == undefined )? event.layerY : event.offsetY;
    Application.State.StatXY = [x, y];
    switch (event.which) {
        case 1 :
            if (target === WG)
                tool.OnWorkSpaceMouseKeyDown(event);
            else if (target.className === "layer")
                tool.OnCanvasMouseKeyDown(event);
            Application.State.LeftPressed = true;
            break;
        case 2 :
            if (target === WG)
                tool.OnWorkSpaceMouse2KeyDown(event);
            else if (target.className === "layer")
                tool.OnCanvasMouseKey2Down(event);

            Application.State.ThirdPressed = true;
            break;
        case 3 :
            if (target === WG)
                tool.OnWorkSpaceMouse3KeyDown(event);
            else if (target.className === "layer")
                tool.OnCanvasMouse3KeyDown(event);

            Application.State.RightPressed = true;
            break;
    }
    //event.which==1,2,3 левая, средняя, правая
}
function mouseUpKey(event) {
    event = event || window.event;
	event.preventDefault();
	event.stopPropagation();
    var target = (event.toElement == undefined) ?  event.target:event.toElement;
    var WG = Application.WorkGround;
    var tool = Application.ActiveTool;
    var x = event.offsetX == undefined ? event.layerX : event.offsetX;
    var y = event.offsetY == undefined ? event.layerY : event.offsetY;
    Application.State.EndXY = [x, y];
    
    switch (event.which) {
        case 1 :
            if (target === WG)
                tool.OnWorkSpaceMouseKeyUp(event);
            else if (target.className === "layer")
                tool.OnCanvasMouseKeyUp(event);

            Application.State.LeftPressed = false;
            break;
        case 2 :
            if (target === WG)
                tool.OnWorkSpaceMouse2KeyUp(event);
            else if (target.className === "layer")
                tool.OnCanvasMouse2KeyUp(event);

            Application.State.ThirdPressed = false;
            break;
        case 3 :
            if (target === WG)
                tool.OnWorkSpaceMouse3KeyUp(event);
            else if (target.className === "layer")
                tool.OnCanvasMouse3KeyUp(event);

            Application.State.RightPressed = false;
            break;
    }

}
function mouseMove(event) {
    event = event || window.event;
    var target = (event.toElement == undefined) ?  event.target:event.toElement;
    var WG = Application.WorkGround;
    var tool = Application.ActiveTool;
    var x = event.offsetX == undefined ? event.layerX : event.offsetX;
    var y = event.offsetY == undefined ? event.layerY : event.offsetY;
    
    if (Application.State.LeftPressed) {
        if (target === WG)
            tool.OnMousemoveWorkSpaceMouseKeyDown(event);
        else if (target.className === "layer")
            tool.OnMousemoveCanvasMouseKeyDown(event);
        Application.State.MoveXY = [x, y];
    }
    else if (Application.State.ThirdPressed) {
        if (target === WG)
            tool.OnMousemoveWorkSpaceMouseKey2Down(event);
        else if (target.className === "layer")
            tool.OnMousemoveCanvasMouseKey2Down(event);
        Application.State.MoveXY = [x, y];
    }
    else if (Application.State.RightPressed) {
        if (target === WG)
            tool.OnMousemoveWorkSpaceMouseKey3Down(event);
        else if (target.className === "layer")
            tool.OnMousemoveCanvasMouseKey3Down(event);
        Application.State.MoveXY = [x, y];  
    }
}
function mouseScroll(event) {
    event = event || window.event;
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

