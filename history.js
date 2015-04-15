function History()
{
    var level = 0;
    var stack = [];
    this.heap = document.createElement("div");
    function  Stage(layer, layerData, isNewLayer, layerPositions, isNewLayerPosition) {
        this.id = level;
        this.layer = layer;
        this.layerData = layerData;
        this.isNewLayer = isNewLayer;
        this.layerPositions = layerPositions||[];
        this.isNewLayerPosition = isNewLayerPosition;
    }
    ;
    this.__defineGetter__("level", function () {
        return level;
    });
    this.__defineSetter__("level", function (val) {
        if (typeof (val) == "object")
        {
            val = val.length;
        }
        else {
            if (val <= this.length)//если записываем историю позле отмены
            {
                stack.splice(val, this.length - val + 1);
                this.heap = document.createElement("div");
            }
            var isNewLayer = true;
            for(var i in stack)
            {
                if(stack[i].layer === Application.ActiveLayer)
                    isNewLayer = false;
            }
           var layers = Application.ActiveFile.getElementsByTagName('*');
           var layerPositions = [];
           var isNewLayerPosition = false;
           for(var i = 0; i<layers.length;i++)
           {
                var layer = layers[i];
                if (layer.className!=="layer")
                    continue;
                layerPositions.push(layer);
                var hLebel = stack[stack.length-1];
                if(hLebel!= null)// if not first and exist
                {
                    if (layer!=hLebel.layerPositions[i])
                    {
                        isNewLayerPosition = true;
                    }
                }
           }
            var layerData = Application.ActiveLayerContext.getImageData(0, 0, Application.ActiveLayer.width
                    , Application.ActiveLayer.height);
            stack.push(new Stage(Application.ActiveLayer, layerData, isNewLayer, layerPositions, isNewLayerPosition));
        }
        level = (val >= 0) ? val : 0;
        return val;
        /*var LayerType = Application.ActiveLayer.previousSibling.tagName;
         if (LayerType== "CANVAS"){
         }
         else if (LayerType== "DIV")//для текстовых
         {
         
         }*/
    });
    this.GetLevel = function (val)
    {
       // console.log(stack);
        return stack[val-1];
    };
    this.__defineGetter__("length", function () {
        return stack.length;
    });
    
}