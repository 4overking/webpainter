Application =
        {
            Files: [],
            FilesStack: false,
            Tools: {},
            WorkGround: false,
            ActiveFile: false,
            ActiveLayer: false,
            ActiveLayerContext: false,
            layerCouter: 0,
            Init: function ()
            {

                var workground = document.createElement("div");
                this.FilesStack = document.createElement("div");
                workground.id = "WorkGround";
                this.WorkGround = workground;
                document.body.appendChild(workground);
                this.Tools.TestTool = Tools.drawText;

            },
            hideActiveFileFromWorkground: function ()
            {
                if (this.ActiveFile)
                {
                    var file = this.ActiveFile;
                    file.aLayer = this.ActiveLayer;
                    file.aLayerContext = this.ActiveLayerContext;
                    this.FilesStack.appendChild(file);
                    this.ActiveFile = false;
                    this.ActiveLayer = false;
                    this.ActiveLayerContext = false;
                }
            },
            showFileToWorkGround: function (id)
            {
                if (!this.ActiveFile)
                {
                    var file = this.Files[id];
                    this.WorkGround.appendChild(file);
                    this.ActiveFile = file;
                    this.ActiveLayer = file.aLayer;
                    this.ActiveLayerContext = file.aLayerContext;
                }
            },
            OpenFile: function (image, fileName)
            {
                this.hideActiveFileFromWorkground();
                this.NewFile(image.width, image.height, image, fileName);
            },
            CreateFile: function (width, height)
            {
                this.hideActiveFileFromWorkground();
                this.NewFile(width, height, "white");
            },
            NewFile: function (width, height, bg, name)
            {
                function createBackgroundLayer()
                {
                    var layer = document.createElement("canvas");
                    layer.width = width;
                    layer.height = height
                    layer.style.opacity = 0.1;
                    var bCtx = layer.getContext("2d");
                    var wFill = false;
                    var edge = width / 50;
                    var hFill = (wFill) ? true : false;
                    for (var w = 0; w <= width; w += edge) {
                        var hFill = (wFill) ? true : false;
                        for (var h = 0; h <= height; h += edge)
                        {
                            if (hFill)
                            {
                                bCtx.fillStyle = "black";
                            }
                            else {
                                bCtx.fillStyle = "white";
                            }
                            bCtx.fillRect(w, h, edge, edge);
                            hFill = (hFill) ? false : true;
                        }
                        wFill = (wFill) ? false : true;
                    }
                    return layer;

                }
                ;
                if (!width || !height) {
                    throw "Not Enough Input Arguments";
                    return;
                }
                var file = document.createElement("div");
                file.History = new History();
                file.appendChild(createBackgroundLayer());
                file.layers = [];
                file.style.width = width + "px";
                file.style.height = height + "px";
                file.width = width;
                file.height = height;

                this.Files.push(file);
                this.ActiveFile = file;
                this.WorkGround.appendChild(file);
                this.NewLayer();
                if (name)
                {
                    file.id = name;
                    this.ActiveLayerContext.drawImage(bg, 0, 0);
                }
                else {
                    file.id = this.Helpers.getRandomInt(1, 9999999999999999);
                    if (bg !== "")
                    {
                        this.ActiveLayerContext.fillStyle = bg;
                        this.ActiveLayerContext.fillRect(0, 0, width, height);

                    }
                }

                this.ActiveFile.History.level++;
            },
            NewLayer: function ()
            {
                var height = parseInt(this.ActiveFile.style.height);
                var width = parseInt(this.ActiveFile.style.width);
                var layer = document.createElement("canvas");
                layer.className = "layer";
                layer.width = width;
                layer.height = height;
                //this.ActiveFile.layers.push(layer);//??????
                this.ActiveLayer = layer;
                this.ActiveLayerContext = layer.getContext("2d");
                this.ActiveFile.appendChild(layer);
                layer.id = "layer_" + this.layerCouter;
                this.layerCouter++;
                this.ActiveFile.History.level++;
            },
            LayerAlpha: function (alpha, id) {

                var canvas = (id) ? this.ActiveFile.layers[id] : this.ActiveLayer;
                canvas.style.opacity = alpha / 250;

            },
            MergeLayer: function ()
            {
                var layers = Application.ActiveFile.getElementsByClassName('layer');
                var layerPos = this.Helpers.Find(layers, this.ActiveLayer);
                if (layers.length > 1 && layerPos !== 0)
                {
                    var targerLayer = layers[layerPos - 1];
                    console.log(targerLayer);
                    var targetCtx = targerLayer.getContext("2d");
                    targetCtx.drawImage(this.ActiveLayer, 0, 0, this.ActiveLayer.width, this.ActiveLayer.height);
                    this.moveLayerToHeap(this.ActiveLayer);
                    this.ActiveLayer = targerLayer;
                    this.ActiveLayerContext = targetCtx;
                    this.ActiveFile.History.level++;
                }
            },
            MergeAllLayers: function ()
            {
                var merge = document.createElement("canvas");
                merge.width = this.ActiveFile.width;
                merge.height = this.ActiveFile.height;
                var ctx = merge.getContext("2d");
                var layers = this.ActiveFile.layers;
                for (var i in layers)
                {
                    var alpha = layers[i].style.opacity;
                    //def opacity is not set
                    alpha = alpha || 1;
                    ctx.globalAlpha = alpha;
                    ctx.drawImage(layers[i], 0, 0);

                }
                return merge;
            },
            moveLayerToHeap: function (layer) {

                this.ActiveFile.History.heap.appendChild(layer);
            },
            getLayerFromHeap: function (layer, position)
            {
                //????
            },
            History:
                    {
                        Undo: function ()
                        {
                            var level = Application.ActiveFile.History.level;
                            if (level !== 1) {
                                level--;

                                Application.ActiveFile.History.level = {"length": level};
                                this.UpdateLayer(Application.ActiveFile.History.GetLevel(level));
                            }
                        },
                        Redo: function ()
                        {
                            var currLevel = parseInt(Application.ActiveFile.History.level);
                            var maxHistory = parseInt(Application.ActiveFile.History.length);
                            if (currLevel < maxHistory)
                            {
                                //currLevel = (currLevel !== 0)?currLevel++:0;
                                currLevel++;
                                Application.ActiveFile.History.level = {"length": currLevel};
                                this.UpdateLayer(Application.ActiveFile.History.GetLevel(currLevel));
                            }
                        },
                        UpdateLayer: function (level)
                        {


                            //layers move and merge
                            var stack = level.layerPositions;
                            var find = Application.Helpers.Find;
                            var file = Application.ActiveFile;
                            var fileLayers = file.getElementsByClassName('layer');
                            console.log(level.isNewLayer || level.isNewLayerPosition);
                            for(var i=fileLayers.length;i>0;i--)
                               {
                                   file.History.heap.appendChild(fileLayers[i-1]);
                               }
                               for (var i in stack)
                               {
                                    var newLayer = stack[i];
                                      file.appendChild(newLayer);
                               }
                             /*for (var i in fileLayers)
                            {
                                var layerPosition = find(fileLayers, layer);
                                if (layerPosition < 0)
                                {
                                    //get from heap
                                    //console.log("get from heap");
                                }
                                else if (layerPosition !== parseInt(i))
                                {

                                    //moved layer
                                  //  console.log("moved layer");
                                }
                                else
                                {

                                   // console.log("all OK");//что-то всё Слишком ОК
                                }
                                    Application.ActiveFile.History.heap.appendChild(fileLayers[i]);
                                    Application.ActiveFile.appendChild(layer);
                            }*/
                                                        //СЛОИИИ
                            //проверку на существование слоя и ЕГО УДАЛЕНИЕ!!!!
                            var ctx = level.layer.getContext("2d");
                            var data = level.layerData;
                           ctx.putImageData(data, 0, 0);
                        }

                    },
            Helpers:
                    {
                        Find: function (array, value) {
                            if (array.indexOf) {
                                return array.indexOf(value);
                            }

                            for (var i = 0; i < array.length; i++) {
                                if (array[i] === value)
                                    return i;
                            }

                            return -1;
                        },
                        getRandomInt: function (min, max)
                        {
                            return Math.floor(Math.random() * (max - min + 1)) + min;
                        }

                    },
            TestDraw: function (edge) {
                //var colorStack = ["tomato", "chartreuse", " #4169E0", "gold", "orange", "#00BFFF", "magenta"];
                var colorStack = ["tomato", "chartreuse", " #4169E0", "gold", "orange", "#00BFFF", "magenta",
                    "#B22222", " #FF8C00", "#7CFC00", "#00FF00", " #1E90FF", " #9932CC", "#808080"];
                var colors = colorStack.length;

                edge = edge || 10;
                var wFill = false;
                for (var i = 0; i < 6; i++) {
                    edge *= 2;
                    for (var w = 0; w <= this.ActiveFile.width; w += edge) {
                        var hFill = (wFill) ? true : false;
                        for (var h = 0; h <= this.ActiveFile.height; h += edge)
                        {
                            if (hFill)
                            {
                                this.ActiveLayerContext.fillStyle = colorStack[this.Helpers.getRandomInt(0, colors - 1)];
                                //ctx.fillStyle = colorStack[i];
                                this.ActiveLayerContext.beginPath();
                                this.ActiveLayerContext.arc(w, h, edge / 2, 0, 2 * Math.PI, false);
                                this.ActiveLayerContext.fill();
                            }
                            else {
                                //  this.fillStyle = colorStack[getRandomInt(0, colors-1)];
                                //this.fillRect(w-edge/2, (edge*1.5)+h-edge*2, edge, edge);

                            }
                            hFill = (hFill) ? false : true;
                        }
                        wFill = (wFill) ? false : true;
                    }
                }
                this.ActiveFile.History.level++;
            }
        };