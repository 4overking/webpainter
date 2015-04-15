$(document).on("keydown", keyMapper);
//$(document).on("contextmenu ", keyMapper);
function keyMapper(event)
{
    event = event || window.event
    event.preventDefault();
    event.stopPropagation();
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

   // console.log(event.keyCode);
}
function contextMenu (event)
{
    event = event || window.event
    event.preventDefault();
    event.stopPropagation();
    console.log("rightClick")
}
var keysMap =
        {
            "AltZ": function () {
            },
            "CtrlZ": function () {
            },
            "Space": function () {
                console.log("space");
            },
        }


