//на эти методы навесить обработчики окна и обработчики инструментов
function  ITool() {
    if (window.Tools === undefined) {
        Tools = [];
    }
    Tools.push(this);
    this.OnCanvasMouseKeyUp =
            this.OnWorkSpaceMouseKeyUp =
            this.OnCanvasMouseKeyDown =
            this.OnWorkSpaceMouseKeyDown =
            this.OnCanvasMouse2KeyUp =
            this.OnWorkSpaceMouse2KeyUp =
            this.OnCanvasMouseKey2Down =
            this.OnWorkSpaceMouse2KeyDown =
            this.OnCanvasMouse3KeyUp =
            this.OnWorkSpaceMouse3KeyUp =
            this.OnCanvasMouse3KeyDown =
            this.OnWorkSpaceMouse3KeyDown =
            this.OnMousemoveCanvasMouseKey3Down =
            this.OnMousemoveWorkSpaceMouseKey3Down =
            this.OnMousemoveCanvasMouseKey2Down =
            this.OnMousemoveWorkSpaceMouseKey2Down =
            this.OnMousemoveWorkSpaceMouseKeyDown =
            this.OnMousemoveCanvasMouseKeyDown =
            this.OnMousemoveWorkSpaceMouse2KeyDown =
            this.OnMousemoveCanvasMouse2KeyDown =
            this.OnMousemoveWorkSpaceMouse3KeyDown =
            this.OnMousemoveCanvasMouse3KeyDown
            = function (e) {
                //console.log(event);
            };
    this.Name = "toolNo_" + Tools.length;
}