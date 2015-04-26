document.onkeydown = keyMapperDown;
document.onkeyup = keyMapperUp;

function keyMapperDown(event)
{
    event = event || window.event;
    event.preventDefault();
    event.stopPropagation();
    /***************Handle Application.State.Buttons*******************/
    if(event.ctrlKey)
        Application.State.CtrlPressed = true;
    if(event.altKey)
        Application.State.AltPressed = true;
    if(event.keyCode == 32)
        Application.State.SpacePressed = true;
    if(event.keyCode == 16)
        Application.State.ShiftPressed = true;
    /************************END**************************************/
    
    if (event.keyCode == 89 && event.ctrlKey)
        //Ctrl+Y
        Application.History.Redo();
    if (event.keyCode == 90 && event.ctrlKey)
        //Ctrl+z
        Application.History.Undo();
    if (event.keyCode == 67 && event.altKey)
    {
        Application.NewLayer();
        Application.TestDraw(2);

    }

 //   console.log(event.keyCode);
}

function keyMapperUp (event)
{
    event = event || window.event;
        /***************Handle Application.State.Buttons*******************/
    if(event.keyCode == 17)
        Application.State.CtrlPressed = false;
    if(event.keyCode == 18)
        Application.State.AltPressed = false;
    if(event.keyCode == 32)
        Application.State.SpacePressed = false;
    if(event.keyCode == 16)
        Application.State.ShiftPressed = false;
    /************************END**************************************/
    
}

