/* global Application */

//*******Disclamer*******//
/*
 Инструменты всегда работают с активным файлом и активным слоем
 */


/*********************FLOOD FILL TOOL********************************************/
var Fill = new ITool();
Fill.Name = "FillBucket";
Fill.OnCanvasMouseKeyUp = function () {
    var context = Application.ActiveLayerContext;
    var W = Application.ActiveFile.width;
    var H = Application.ActiveFile.height;
    var x = Application.State.EndXY[0], y = Application.State.EndXY[1];
    var color_to = Application.Helpers.hexToRgb(Application.ForegroundColor);

    color_to.O = 255;
    var sensitivity = 10;
    var img = context.getImageData(0, 0, W, H);
    var imgData = img.data;
    var k = ((y * (img.width * 4)) + (x * 4));
    var dx = [0, -1, +1, 0];
    var dy = [-1, 0, 0, +1];
    var color_from = {
        R: imgData[k + 0],
        G: imgData[k + 1],
        B: imgData[k + 2],
        O: imgData[k + 3]
    }
    if (color_from.R == color_to.R &&
            color_from.G == color_to.G &&
            color_from.B == color_to.B &&
            color_from.O == color_to.O)
        return false;
    var stack = [];
    stack.push(x);
    stack.push(y);
    while (stack.length > 0) {
        var curPointY = stack.pop();
        var curPointX = stack.pop();
        for (var i = 0; i < 4; i++) {
            var nextPointX = curPointX + dx[i];
            var nextPointY = curPointY + dy[i];
            if (nextPointX < 0 || nextPointY < 0 || nextPointX >= W || nextPointY >= H)
                continue;
            var k = (nextPointY * W + nextPointX) * 4;
            if (Math.abs(imgData[k + 0] - color_from.R) <= sensitivity &&
                    Math.abs(imgData[k + 1] - color_from.G) <= sensitivity &&
                    Math.abs(imgData[k + 2] - color_from.B) <= sensitivity &&
                    Math.abs(imgData[k + 3] - color_from.O) <= sensitivity) {
                imgData[k + 0] = color_to.R;
                imgData[k + 1] = color_to.G;
                imgData[k + 2] = color_to.B;
                imgData[k + 3] = color_to.O;

                stack.push(nextPointX);
                stack.push(nextPointY);
            }
        }
    }
    context.putImageData(img, 0, 0);
    Application.ActiveFile.History.level++;
};


/*********************PENCIL TOOL********************************************/
var Line = new ITool();
Line.Name = "Pencil";
Line.OnMousemoveCanvasMouseKeyDown = function (e) {
    function midPointBtw(p1, p2) {
        return {
            x: p1.x + (p2.x - p1.x) / 2,
            y: p1.y + (p2.y - p1.y) / 2
        };
    }
    var x = Application.State.MoveXY[0];
    var y = Application.State.MoveXY[1];
    this.points.push({
        x: (Application.State.ShiftPressed) ? this.points[this.points.length - 1].x : x,
        y: (Application.State.CtrlPressed) ? this.points[this.points.length - 1].y : y
    });
    var p1 = this.points[0];
    var p2 = this.points[1];
    Application.ActiveLayerContext.beginPath();
    Application.ActiveLayerContext.moveTo(p1.x, p1.y);

    for (var i = 1, len = this.points.length; i < len; i++) {
        var midPoint = midPointBtw(p1, p2);

        Application.ActiveLayerContext.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
        p1 = this.points[i];
        p2 = this.points[i + 1];

    }
    Application.ActiveLayerContext.lineTo(p1.x, p1.y);
    Application.ActiveLayerContext.stroke();
}
Line.OnCanvasMouseKeyDown = function (e) {
    this.points = [];
    Application.ActiveLayerContext.strokeStyle = Application.ForegroundColor;
    Application.ActiveFile.style.cursor = "default";
    var x = Application.State.StatXY[0];
    var y = Application.State.StatXY[1];
    this.points.push({x: x, y: y});
    Application.ActiveLayerContext.lineWidth = 1;
    Application.ActiveLayerContext.lineJoin = Application.ActiveLayerContext.lineCap = 'round';

}
Line.OnCanvasMouseKeyUp = function (e) {
    this.points.length = 0;
    Application.ActiveFile.History.level++;
};

/***************************GRADIENT TOOL********************************************/
var Gradient = new ITool();
Gradient.Name = "Gradient";
Gradient.OnCanvasMouseKeyUp = function (e) {
    var Start = {x: Application.State.StatXY[0], y: Application.State.StatXY[1]};
    var End = {x: Application.State.EndXY[0], y: Application.State.EndXY[1]};
    var grd = Application.ActiveLayerContext.createLinearGradient(Start.x, Start.y, End.x, End.y);
    grd.addColorStop(0, Application.ForegroundColor);
    grd.addColorStop(1, Application.BackgroundColor);
    Application.ActiveLayerContext.fillStyle = grd;
    Application.ActiveLayerContext.fillRect(0, 0, Application.ActiveLayer.width, Application.ActiveLayer.height);
    this.Start = null;
    Application.ActiveFile.History.level++;
}

/*****************************HAND TOOL******************************************************/
var Hand = new ITool();
Hand.Name = "Hand";
Hand.OnCanvasMouseKeyDown = Hand.OnWorkSpaceMouseKeyDown = function (e)
{
}
Hand.OnMousemoveCanvasMouseKeyDown = Hand.OnMousemoveWorkSpaceMouseKeyDown = function (e)
{
    var startPos = {x: Application.State.StatXY[0], y: Application.State.StatXY[1]};
    var newPos = {x: Application.State.MoveXY[0], y: Application.State.MoveXY[1]};
    var X = startPos.x - newPos.x;
    var Y = startPos.y - newPos.y;
    window.scrollBy(X, Y);
}
Hand.OnCanvasMouseKeyUp = Hand.OnWorkSpaceMouseKeyUp = function (e) {
    this.startPos = null;
}


/***************************ZOOM TOOL **********************************/
var Zoom = new ITool();
Zoom.Name = "Zoom";
Zoom.ZoomVal = 100;
Zoom.OnCanvasMouseKeyUp = function () {
    this.ZoomVal;
    var recalc = 50, scroll; //range 50 - 1000
    if (recalc != undefined) {
        //zoom-in or zoom-out
        if (recalc == 1 || recalc == -1) {
            var step = 100;
            if (this.ZoomVal <= 100 && recalc < 0)
                step = 10;
            if (this.ZoomVal < 100 && recalc > 0)
                step = 10;
            if (recalc * step + this.ZoomVal > 0) {
                this.ZoomVal = this.ZoomVal + recalc * step;
                if (this.ZoomVal > 100 && this.ZoomVal < 200)
                    this.ZoomVal = 100;
            }
        }
        //zoom using exact value
        else
            this.ZoomVal = parseInt(recalc);
        CON.calc_preview_auto();
    }
    document.getElementById("zoom_nr").innerHTML = ZOOM;
    document.getElementById("zoom_range").value = ZOOM;

    //change scale and repaint
    document.getElementById('canvas_back').style.width = round(WIDTH * ZOOM / 100) + "px";
    document.getElementById('canvas_back').style.height = round(HEIGHT * ZOOM / 100) + "px";
    for (var i in LAYERS) {
        document.getElementById(LAYERS[i].name).style.width = round(WIDTH * ZOOM / 100) + "px";
        document.getElementById(LAYERS[i].name).style.height = round(HEIGHT * ZOOM / 100) + "px";
    }
    document.getElementById('canvas_front').style.width = round(WIDTH * ZOOM / 100) + "px";
    document.getElementById('canvas_front').style.height = round(HEIGHT * ZOOM / 100) + "px";

    //check main resize corners
    if (ZOOM != 100) {
        document.getElementById('resize-w').style.display = "none";
        document.getElementById('resize-h').style.display = "none";
        document.getElementById('resize-wh').style.display = "none";
    }
    else {
        document.getElementById('resize-w').style.display = "block";
        document.getElementById('resize-h').style.display = "block";
        document.getElementById('resize-wh').style.display = "block";
    }

    if (scroll != undefined)
        CON.scroll_window();
    DRAW.redraw_preview();
};
/***************************COLOR PROBE TOOL **********************************/
var ColorProbe = new ITool();
ColorProbe.Name = "ColorProbe";
ColorProbe.detect = function () {
    var x = Application.State.EndXY[0];
    var y = Application.State.EndXY[1];
    var W = Application.ActiveFile.width;
    var H = Application.ActiveFile.height;
    var img = Application.ActiveLayerContext.getImageData(0, 0, W, H);
    var imgData = img.data;
    var k = ((y * (img.width * 4)) + (x * 4));
    return{
        R: imgData[k + 0],
        G: imgData[k + 1],
        B: imgData[k + 2],
        O: imgData[k + 3]
    };

}
ColorProbe.OnCanvasMouseKeyUp = function ()
{
    var color = this.detect();
    document.getElementById("colorSlectorFirst").style.backgroundColor = Application.ForegroundColor =
            document.getElementById("colorFirst").value = Application.Helpers.rgbToHex(color.R, color.G, color.B);
}
ColorProbe.OnCanvasMouse3KeyUp = function ()
{
    var color = this.detect();
    document.getElementById("colorSlectorSecond").style.backgroundColor = Application.BackgroundColor =
            document.getElementById("colorSecond").value = Application.Helpers.rgbToHex(color.R, color.G, color.B);
}


/*********************RECTANGLE TOOL*************************/
var Rectangle = new ITool();
Rectangle.Name = "Rectangle";
Rectangle.OnCanvasMouseKeyDown = function () {
    var width = Application.ActiveFile.width;
    var height = Application.ActiveFile.height;
    this.data = Application.ActiveLayerContext.getImageData(0, 0, width, height);
};
Rectangle.OnMousemoveCanvasMouseKeyDown = function () {
    if (this.data)
    {
        Application.ActiveLayerContext.putImageData(this.data, 0, 0);
    }
    Application.ActiveLayerContext.beginPath();
    Application.ActiveLayerContext.lineWidth = 1;//config
    Application.ActiveLayerContext.strokeStyle = Application.ForegroundColor;
    if (Application.State.AltPressed)
    {
        var x_start = Application.State.StatXY[0] - (Application.State.MoveXY[0] - Application.State.StatXY[0]);
        var y_start = Application.State.StatXY[1] - (Application.State.MoveXY[1] - Application.State.StatXY[1]);
        var width = Application.State.MoveXY[0] - x_start;
        var height = Application.State.MoveXY[1] - y_start;
    }
    else
    {
        var x_start = Application.State.StatXY[0];
        var y_start = Application.State.StatXY[1];
        var width = Application.State.MoveXY[0] - x_start;
        var height = Application.State.MoveXY[1] - y_start;
    }
    if (Application.State.ShiftPressed)
    {
        height = width;
    }
    Application.ActiveLayerContext.beginPath();
    Application.ActiveLayerContext.rect(x_start, y_start, width, height);
    Application.ActiveLayerContext.stroke();

};
Rectangle.OnCanvasMouseKeyUp = function ()
{
    this.data = null;
    Application.ActiveFile.History.level++;
};

/****************CIRCLE TOOL ******************************/

var Circle = new ITool();
Circle.Name = "Circle";

Circle.OnCanvasMouseKeyDown = function () {
    var width = Application.ActiveFile.width;
    var height = Application.ActiveFile.height;
    this.data = Application.ActiveLayerContext.getImageData(0, 0, width, height);
};
Circle.OnMousemoveCanvasMouseKeyDown = function () {
    if (this.data)
    {
        Application.ActiveLayerContext.putImageData(this.data, 0, 0);
    }
    Application.ActiveLayerContext.beginPath();
    Application.ActiveLayerContext.lineWidth = 1;//config
    Application.ActiveLayerContext.strokeStyle = Application.ForegroundColor;
    var x_start = Application.State.StatXY[0];
    var y_start = Application.State.StatXY[1];
    var width = Application.State.MoveXY[0] - x_start;
    var height = Application.State.MoveXY[1] - y_start;
    var centerX, centerY;
    var radius, w_ratio, h_ratio;
    Application.ActiveLayerContext.save();

    if (Application.State.ShiftPressed) {
        if (width > height)
            height = width;
        else
            width = height;
    }
    if (Application.State.AltPressed)
    {
        centerX = Application.State.StatXY[0];
        centerY = Application.State.StatXY[1];
    }
    else
    {
        centerX = Application.State.StatXY[0] + width / 2;
        centerY = Application.State.StatXY[1] + height / 2;
    }
    if (Math.abs(width) > Math.abs(height))
    {
        radius = Math.abs(height / 2);
        h_ratio = 1;
        w_ratio = width / height;
        Application.ActiveLayerContext.translate(Application.ActiveLayerContext.width / w_ratio, Application.ActiveLayerContext.height / w_ratio);
    }
    else
    {
        radius = Math.abs(width / 2);
        w_ratio = 1;
        h_ratio = height / width;
    }
    if (Application.State.ShiftPressed) {
        w_ratio = h_ratio = 1;
    }

    Application.ActiveLayerContext.scale(w_ratio, h_ratio);
    Application.ActiveLayerContext.beginPath();
    Application.ActiveLayerContext.arc(centerX / w_ratio, centerY / h_ratio, radius, 0, 2 * Math.PI, false);
    Application.ActiveLayerContext.restore();
    Application.ActiveLayerContext.stroke();

};
Circle.OnCanvasMouseKeyUp = function () {
    this.data = null;
    Application.ActiveFile.History.level++;
};


/****************ERASER TOOL ******************************/

var Eraser = new ITool();
Eraser.Name = "Eraser";
