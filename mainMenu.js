var mainMenu = {
    file:
            {
                open:function(){$("#openFile").trigger("click")},
                newFile:function(){},
                save:function(){},
                opentRessent:
                        {
                            list:function(){},
                        }
            },
    edit:{
        test:function(){}   
    },
    image:{
        test:function(){}
    },
    layer:{
        newLayer:function (){Application.NewLayer()},
    },
    select:{
        test:function(){}
    },
    filter:{
        test:function(){}
    },
    view:{
        test:function(){}
    },
    help:{
        about:function(){alert("about()")}
    }
};