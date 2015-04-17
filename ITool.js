//на эти методы навесить обработчики окна и обработчики инструментов
function  ITool () {
    this.OnMousemoveCanvasMouseKeyUp =
    this.OnMousemoveWorkSpaceMouseKeyUp =
    this.OnMousemoveCanvasMouseKeyDown =
    this.OnMousemoveWorkSpaceMouseKeyDown =
    
    this.OnMousemoveCanvasMouse2KeyUp =
    this.OnMousemoveWorkSpaceMouse2KeyUp =
    this.OnMousemoveCanvasMouseKey2Down =
    this.OnMousemoveWorkSpaceMouse2KeyDown =
    
    this.OnMousemoveCanvasMouse3KeyUp =
    this.OnMousemoveWorkSpaceMouse3KeyUp =
    this.OnMousemoveCanvasMouse3KeyDown =
    this.OnMousemoveWorkSpaceMouse3KeyDown = function(e){
        //console.log(event);
    };
}