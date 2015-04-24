//*******Disclamer*******//
/*
 Инструменты всегда работают с активным файлом и активным слоем
 */
var fill = new ITool();
fill.Name = "FillBucket";
fill.OnCanvasMouseKeyUp = function (e) {
    console.log
    // console.log(Application.State.StatXY);
    var fillColor = {R: 255, G: 125, B: 0, O: 255};
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
            // Закрашиваем
            imageData.data[point] = fillColor.R;
            imageData.data[point + 1] = fillColor.G;
            imageData.data[point + 2] = fillColor.B;
            imageData.data[point + 3] = fillColor.O;

            // Ставим соседей в стек на проверку
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
            //
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
}


var Line = new ITool();
Line.Name = "Line";

Line.OnMousemoveCanvasMouseKeyDown = function (e) {


    Application.ActiveLayerContext.moveTo(this.X, this.Y);
    Application.ActiveLayerContext.lineTo(e.offsetX, e.offsetY);
        Application.ActiveLayerContext.lineJoin = 'round';
    Application.ActiveLayerContext.stroke();
    
    /*Application.ActiveLayerContext.beginPath();
    Application.ActiveLayerContext.moveTo(this.X, this.Y);
    Application.ActiveLayerContext.lineTo(e.offsetX, e.offsetY);
    Application.ActiveLayerContext.stroke();*/
    this.X = e.offsetX;
    this.Y = e.offsetY;
}
Line.OnCanvasMouseKeyDown = function (e) {
    this.X = e.offsetX;
    this.Y = e.offsetY;
    Application.ActiveLayerContext.beginPath();
        Application.ActiveFile.style.cursor = "default";
    Application.ActiveLayerContext.lineWidth = 15;  

}
Line.OnCanvasMouseKeyUp = function (e) {
  Application.ActiveLayerContext.closePath();
}