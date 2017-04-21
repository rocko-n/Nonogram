define({
    start: function (nonogram) {
        $('#tooltip').fadeOut(300);
        $('#canvas').hide();
        $('.canvas').hide();
        $('.editor').hide();
        this.buildField(nonogram);
    },

    edit: function () {
        $('.canvas').hide();
        $('#tooltip').fadeOut(300);
        $('#canvas').hide();
        $('.main').html('');
        $('.editor').fadeIn(500);
    },

    receiveEditInfo: function () {
        var x = $('#x-count').val();
        var y = $('#y-count').val();
        if (!/^[1-5][0-9]$/.test(x) || !/^[1-5][0-9]$/.test(y)) {
            alert('Wrong data');
            return;
        }
        return {x: +x, y: +y};
    },

    editImage: function () {
        $('#tooltip').fadeOut(300);
        $('.main').html('');
        $('.editor').hide();
        $('.canvas').fadeIn(500);
    },

    receiveImageInfo: function () {
        var dwidth = $('#dwidth').val();
        var monoChrome = $('#monochrome').val();
        if (!/^\d{1,3}$/.test(dwidth) || +dwidth < 10 || +dwidth > 150) {
            alert('Wrong field "Desired width"');
            return Promise.reject();
        }
        if (!/^\d{1,3}$/.test(monoChrome) || +monoChrome < 0 || +monoChrome > 255) {
            alert('Wrong field "MonoChromeRate"');
            return Promise.reject();
        }
        $('#canvas').show();
        var prom = this.drawCanvasAndGetPx(+dwidth, $('#imgname').val(), +monoChrome);
        return prom;
    },

    buildField: function (nonogram) {
        $('.main').html(nonogram);
    },

    drawCanvasAndGetPx: function (width, imgName, monoRate) {
        var canvasField;
        var canvas = document.getElementById("canvas");
        var context = canvas.getContext("2d");
        var img = new Image();
        img.src = "images/" + imgName;
        var prom = new Promise(function (resolve) {
            img.onload = function () {
                canvas.width = width;
                canvas.height = Math.floor(width * img.height / img.width);
                context.drawImage(img, 0, 0, canvas.width, canvas.height);
                canvasField = context.getImageData(0, 0, canvas.width, canvas.height);
                resolve({field: canvasField, width: canvas.width, height: canvas.height, monoRate: monoRate});
            };
        });
        return prom;
    },

    winMessager: function () {
        $('#tooltip').html('You WIN!<br>Try another Nonogram.<br><button id="next">Next</button>')
            .css(this.getOffsetRect())
            .show()
            .fadeOut(2000);
    },

    alert: function (msg) {
        alert(msg);
    },

    nothingToPlayMessager: function () {
        $('#tooltip').html('Noting to play')
            .css(this.getOffsetRect())
            .show()
            .fadeOut(2000);
        $('.main').html('');
    },

    toggleClassCross: function (event) {
        $(event.currentTarget).toggleClass('crossed');
    },

    toggleClassWB: function (curTarget) {
        curTarget.toggleClass('white black');
    },

    toggleClassWS: function (curTarget) {
        curTarget.toggleClass('white silver');
    },

    getOffsetRect: function () {
        var elem = document.getElementById('nav');
        var y = elem.offsetHeight;
        var box = elem.getBoundingClientRect();
        var body = document.body;
        var docElem = document.documentElement;
        var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
        var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
        var clientTop = docElem.clientTop || body.clientTop || 0;
        var clientLeft = docElem.clientLeft || body.clientLeft || 0;
        var top  = box.top +  scrollTop - clientTop;
        var left = box.left + scrollLeft - clientLeft;
        return { top: Math.round(top) + y + 5, left: Math.round(left) };
    }
});