/**
 * Nonogram constractor (whith key="edit" - editState, without - playState)
 * @param {String} [key]
 * @param {Number} [x]
 * @param {Number} [y]
 * @returns {string}
 */
function nonogramConstractor(key, x, y) {
    winCounter = 0;
    var vNav = [];
    var hNav = [];
    var hNavMax = 0;
    var vNavMax = 0;
    var html = "";
    var vMax = y;
    var hMax = x;
    if ( key !== 'edit' && key !== 'canvas' ) {
        vMax = mapArr.length;
        hMax = mapArr[0].length;
        /**Building navDigits for horizontal columns*/
        mapArr.forEach(function (unit, i) {
            hNav[i] = [];
            var navDidgit = 0;
            var colection = false;
            unit.forEach(function (raw, j) {
                if ( raw != 0 ) {
                    winCounter += 1;
                    navDidgit += 1;
                    colection = true;
                    if ( j == unit.length - 1 ) {
                        hNav[i].push(navDidgit);
                        if ( hNav[i].length > hNavMax ) {
                            hNavMax = hNav[i].length;
                        };
                    };
                } else if ( raw == 0 && colection ) {
                    hNav[i].push(navDidgit);
                    navDidgit = 0;
                    colection = false;
                    if ( hNav[i].length > hNavMax ) {
                        hNavMax = hNav[i].length;
                    };
                };
            });
        });
        /**Building navDigits for vertical columns*/
        for ( i = 0; i < hMax; i++ ) {
            vNav[i] = [];
            var navDidgit = 0;
            var colection = false;
            for ( j = 0; j < vMax; j++ ) {
                if ( mapArr[j][i] != 0 ) {
                    navDidgit += 1;
                    colection = true;
                    if ( j == vMax - 1 ) {
                        vNav[i].push(navDidgit);
                        if ( vNav[i].length > vNavMax ) {
                            vNavMax = vNav[i].length;
                        };
                    };
                } else if ( mapArr[j][i] == 0 && colection ) {
                    vNav[i].push(navDidgit);
                    navDidgit = 0;
                    colection = false;
                    if ( vNav[i].length > vNavMax ) {
                        vNavMax = vNav[i].length;
                    };
                };
            };
        };
    };
    /**Set width for mainParrent ul*/
    $('.main').css({
        width: ( hMax + hNavMax )*17 + 'px'
    });
    /**Building field*/
    for ( var i = 0; i < vMax + vNavMax; i++ ) {
        if ( i < vNavMax ) {
            html += '<li><ul>';
        } else if ( (i - vNavMax + 1) % 5 == 0 && i != vMax + vNavMax - 1 && i >= vNavMax ) {
            html += '<li><ul class="fifth"  data-v="' + (i - vNavMax) + '">';
        } else {
            html += '<li><ul  data-v="' + (i - vNavMax) + '">';
        };
        for ( var j = 0; j < hMax + hNavMax; j++ ) {
            if ( i < vNavMax ) {
                if ( j < hNavMax ) {
                    html += '<li class="hidden column"></li>';
                } else if ( (j + 1 - hNavMax) % 5 == 0 && j != hMax + hNavMax - 1 && j >= hNavMax ) {
                    html += '<li class="nav fifth column">' +  ( (vNavMax - i - 1)>=vNav[j - hNavMax].length?'':vNav[j - hNavMax][i - vNavMax + vNav[j - hNavMax].length] ) + '</li>';
                } else {
                    html += '<li class="nav column">' + ( (vNavMax - i - 1)>=vNav[j - hNavMax].length?'':vNav[j - hNavMax][i - vNavMax + vNav[j - hNavMax].length] ) + '</li>';
                };
            } else if ( j < hNavMax ) {
                html += '<li class="nav column">' + ( (hNavMax - j - 1)>=hNav[i - vNavMax].length?'':hNav[i - vNavMax][j - hNavMax + hNav[i - vNavMax].length] ) + '</li>';
            } else if ( (j + 1 - hNavMax) % 5 == 0 && j != hMax + hNavMax - 1 && j >= hNavMax ) {
                if ( key === 'canvas' ) {
                    if ( mapArr[i - vNavMax][j - hNavMax] === 1 ) {
                        html += '<li class="black fifth column" data-h="' + (j - hNavMax) + '"></li>';
                    } else {
                        html += '<li class="white fifth column" data-h="' + (j - hNavMax) + '"></li>';
                    };
                } else {
                    html += '<li class="white fifth column" data-h="' + (j - hNavMax) + '"></li>';
                };
            } else {
                if ( key === 'canvas' ) {
                    if ( mapArr[i - vNavMax][j - hNavMax] ) {
                        html += '<li class="black column" data-h="' + (j - hNavMax) + '"></li>';
                    } else {
                        html += '<li class="white column" data-h="' + (j - hNavMax) + '"></li>';
                    };
                } else {
                    html += '<li class="white column" data-h="' + (j - hNavMax) + '"></li>';
                };
            };
        };
        html += '</ul></li>';
    };
    return html;
}
/**
 * PlayState - winCheck module
 * @param {Object} event
 */
function winCheck(event) {
    if ( $(event.currentTarget).hasClass('black') && mapArr[$(event.currentTarget).closest('ul').attr('data-v')][$(event.currentTarget).attr('data-h')] ) {
        winCounter--;
        console.log(winCounter);
    } else if ( $(event.currentTarget).hasClass('white') && !mapArr[$(event.currentTarget).closest('ul').attr('data-v')][$(event.currentTarget).attr('data-h')] ) {
        winCounter--;
        console.log(winCounter);
    } else {
        winCounter++;
        console.log(winCounter);
    };
    /**Win check*/
    if ( winCounter === 0 ) {
        /**Win message*/
        $('#tooltip').html('You WIN!<br>Try another Nonogram.<br><button id="next">Next</button>')
            .css(getOffsetRect(buttonDiv, buttonDiv.offsetHeight))
            .show();
        /**Turn off play mouse events*/
        offMouseEvents = true;
    };
}
/**
 * Convert editField to array
 * @returns {Array}
 */
function convertEditField() {
    mapArr = [];
    $('ul').not('.main').each(function(index) {
        mapArr.push([]);
        $(this).children().each(function() {
            if ( $(this).hasClass('black') ) {
                mapArr[index].push(1);
            } else {
                mapArr[index].push(0);
            };
        });
    });
}
/**
 *
 * @param {Element|HTMLElement} elem
 * @param {number} y
 * @returns {{top: number, left: number}}
 */
function getOffsetRect(elem, y) {
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
/**
 * Draw image ang get array of pixels
 * @param {Number} width
 * @param {String} imgName
 * @returns {Promise<T>|Promise}
 */
function getCanvasPx(width, imgName) {
    var canvasField;
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    var img = new Image();
    img.src = "images/" + imgName;
    var prom = new Promise (function(resolve) {
        img.onload = function() {
            canvas.width = width;
            canvas.height = Math.floor(width*img.height/img.width);
            context.drawImage(img, 0, 0, canvas.width, canvas.height);
            canvasField = context.getImageData(0, 0, canvas.width, canvas.height);
            resolve({field: canvasField, width: canvas.width, height: canvas.height});
        };
    });
    return prom;
}
/**
 * Convert image to mapArr
 * @param {Object} data
 * @param {Number} monoRate
 */
function getMapArrFromCanvas(data, monoRate) {
    mapArr = [];
    for ( var i = 0; i < data.height; i++ ) {
        mapArr.push([]);
        for ( var j = 0; j < data.width*4; j +=4 ) {
            var average = (data.field.data[4*i*data.width + j] + data.field.data[4*i*data.width + j + 1] + data.field.data[4*i*data.width + j + 1])/3;
            var result = average>monoRate?0:1;
            mapArr[i].push(result);
        };
    };
}
function nextNonogram() {
    if ( prev !== colectionToPlay.length - 1 ) {
        mapArr = colectionToPlay[prev + 1];
    } else {
        prev = 0;
        mapArr = colectionToPlay[0];
    };

}
/**
 * MapArr for nonogramConstructor
 * @type {*[]}
 */
var nonoTest = [[0, 0, 0, 0],
                [0, 0, 1, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]];
/**
 * MapArr for nonogramConstructor
 * @type {*[]}
 */
var nonoPlus = [[1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1],
                [1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1],
                [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
                [0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
                [1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1],
                [1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1]];
/**
 * MapArr for nonogramConstructor
 * @type {*[]}
 */
var nonoSomething = [[1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0],
                     [1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
                     [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                     [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                     [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                     [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                     [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                     [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                     [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                     [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                     [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                     [0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                     [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                     [1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0],
                     [1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1]];
var colectionToPlay = [nonoTest, nonoPlus, nonoSomething];