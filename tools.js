//*******Disclamer*******//
/*
 Инструменты всегда работают с активным файлом и активным слоем
 */
function Tool()
{
    this.OnClick = function () {
    };
    this.OnMousemove = function () {
    }
}
var Tools =
        {
            drawText: function (text) {
                console.log(text);
                return true;
            }
            //fillFilm
        } 