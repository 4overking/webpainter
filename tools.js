//*******Disclamer*******//
/*
 Инструменты всегда работают с активным файлом и активным слоем
 */


/*********************FLOOD FILL TOOL********************************************/
var Fill = new ITool();
Fill.Name = "FillBucket";
Fill.OnCanvasMouseKeyUp = function (e) {
   // var fillColor = {R: 255, G: 125, B: 0, O: 255};
    var fillColor = Application.Helpers.hexToRgb(Application.ForegroundColor);
        fillColor.O = 255;
    var sensitivity = 100;
    var ctx = Application.ActiveLayerContext;
    var width = Application.ActiveFile.width;
    var height = Application.ActiveFile.height;
    var imageData = ctx.getImageData(0, 0, width, height);
    var stack = [];
    stack.Add = function (pxl)
    {
        this.push(pxl);
    };
    var pixel = [Application.State.EndXY[0], Application.State.EndXY[1]];
    var masterColor = new color(getNoPixel(pixel[0], pixel[1]));
    //if same color return
    if (equalToFC(pixel[0], pixel[1]))
    {
        return;
    }
    stack.Add(pixel);

    while (stack.length > 0)
    {
        var pixel = stack.pop();
        if (pixel[0] < 0 || pixel[0] >= width)
            continue;
        if (pixel[1] < 0 || pixel[1] >= height)
            continue;
        var point = getNoPixel(pixel[0], pixel[1]);
        var pointColor = new color(getNoPixel(pixel[0], pixel[1]));

        if (equalToMC(pixel[0], pixel[1]))

        {
            imageData.data[point] = fillColor.R;
            imageData.data[point + 1] = fillColor.G;
            imageData.data[point + 2] = fillColor.B;
            imageData.data[point + 3] = fillColor.O;

            stack.Add([
                pixel[0] - 1,
                pixel[1]
            ]);
            stack.Add([
                pixel[0] + 1,
                pixel[1]
            ]);
            stack.Add([
                pixel[0],
                pixel[1] - 1
            ]);
            stack.Add([
                pixel[0],
                pixel[1] + 1
            ]);
            stack.Add([
                pixel[0] - 1,
                pixel[1] - 1
            ]);
            stack.Add([
                pixel[0] + 1,
                pixel[1] + 1
            ]);
            stack.Add([
                pixel[0] + 1,
                pixel[1] - 1
            ]);
            stack.Add([
                pixel[0] - 1,
                pixel[1] + 1
            ]);
        }
    }
    function getNoPixel(x, y) {
        return ((x * 4) + (width * y * 4) + 4);
    }
    function color(pos) {
        this.R = imageData.data[pos];
        this.G = imageData.data[pos + 1];
        this.B = imageData.data[pos + 2];
        this.O = imageData.data[pos + 3];
    }
    function equalToMC(X, Y)
    {
        var testColor = new color(getNoPixel(X, Y));
        if (
                masterColor.R - sensitivity <= testColor.R && testColor.R <= masterColor.R + sensitivity &&
                masterColor.G - sensitivity <= testColor.G && testColor.G <= masterColor.G + sensitivity &&
                masterColor.B - sensitivity <= testColor.B && testColor.B <= masterColor.B + sensitivity &&
                masterColor.O - sensitivity <= testColor.O && testColor.O <= masterColor.O + sensitivity
                )
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    function equalToFC(X, Y)
    {
        var testColor = new color(getNoPixel(X, Y));
        if (fillColor.R === testColor.R &&
                fillColor.G === testColor.G &&
                fillColor.B === testColor.B &&
                fillColor.O === testColor.O)
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    ctx.putImageData(imageData, 0, 0);
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
    this.points.push({
        x: (Application.State.ShiftPressed) ? this.points[this.points.length - 1].x : e.offsetX,
        y: (Application.State.CtrlPressed) ? this.points[this.points.length - 1].y : e.offsetY
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
    this.points.push({x: e.offsetX, y: e.offsetY});
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
Gradient.OnCanvasMouseKeyDown = function (e) {
    this.Start = {x: e.offsetX, y: e.offsetY};

}
Gradient.OnCanvasMouseKeyUp = function (e) {
    var End = {x: e.offsetX, y: e.offsetY};
    var grd = Application.ActiveLayerContext.createLinearGradient(this.Start.x, this.Start.y, End.x, End.y);
    grd.addColorStop(0, Application.ForegroundColor);
    grd.addColorStop(1, Application.BackgroundColor);
    Application.ActiveLayerContext.fillStyle = grd;
    Application.ActiveLayerContext.fillRect(0, 0, Application.ActiveLayer.width, Application.ActiveLayer.height);
    this.Start = null;
Application.ActiveFile.History.level++;
}

