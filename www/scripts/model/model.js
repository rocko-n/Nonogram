define({
    winCounter: 0,
    mapArr: [],
    edit: false,
    canvasEdit: false,
    mouseHoldLeft: false,
    mouseHoldRight: false,
    offMouseEvents: false,
    nonoPlus: [[1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1],
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
        [1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1]],

    nonogramConstractor: function (key, x, y) {
        var winCounter = 0;
        var vNav = [];
        var hNav = [];
        var hNavMax = 0;
        var vNavMax = 0;
        var html = "";
        var vMax = y;
        var hMax = x;
        if (key !== 'edit' && key !== 'canvas') {
            vMax = this.mapArr.length;
            hMax = this.mapArr[0].length;
            /**Building navDigits for horizontal columns*/
            this.mapArr.forEach(function (unit, i) {
                hNav[i] = [];
                var navDidgit = 0;
                var colection = false;
                unit.forEach(function (raw, j) {
                    if (raw !== 0) {
                        winCounter += 1;
                        navDidgit += 1;
                        colection = true;
                        if (j === unit.length - 1) {
                            hNav[i].push(navDidgit);
                            if (hNav[i].length > hNavMax) {
                                hNavMax = hNav[i].length;
                            }
                        }
                    } else if (raw === 0 && colection) {
                        hNav[i].push(navDidgit);
                        navDidgit = 0;
                        colection = false;
                        if (hNav[i].length > hNavMax) {
                            hNavMax = hNav[i].length;
                        }
                    }
                });
            });
            /**Building navDigits for vertical columns*/
            for (i = 0; i < hMax; i++) {
                vNav[i] = [];
                var navDidgit = 0;
                var colection = false;
                for (j = 0; j < vMax; j++) {
                    if (this.mapArr[j][i] !== 0) {
                        navDidgit += 1;
                        colection = true;
                        if (j === vMax - 1) {
                            vNav[i].push(navDidgit);
                            if (vNav[i].length > vNavMax) {
                                vNavMax = vNav[i].length;
                            }
                        }
                    } else if (this.mapArr[j][i] === 0 && colection) {
                        vNav[i].push(navDidgit);
                        navDidgit = 0;
                        colection = false;
                        if (vNav[i].length > vNavMax) {
                            vNavMax = vNav[i].length;
                        }
                    }
                }
            }
        }
        /**Set width for mainParrent ul*/
        $('.main').css({
            width: (hMax + hNavMax) * 17 + 'px'
        });
        /**Building field*/
        for (var i = 0; i < vMax + vNavMax; i++) {
            if (i < vNavMax) {
                html += '<li><ul>';
            } else if ((i - vNavMax + 1) % 5 === 0 && i !== vMax + vNavMax - 1 && i >= vNavMax) {
                html += '<li><ul class="fifth"  data-v="' + (i - vNavMax) + '">';
            } else {
                html += '<li><ul  data-v="' + (i - vNavMax) + '">';
            }
            for (var j = 0; j < hMax + hNavMax; j++) {
                if (i < vNavMax) {
                    if (j < hNavMax) {
                        html += '<li class="hidden column"></li>';
                    } else if ((j + 1 - hNavMax) % 5 === 0 && j !== hMax + hNavMax - 1 && j >= hNavMax) {
                        html += '<li class="nav fifth column">' +  ( (vNavMax - i - 1)>=vNav[j - hNavMax].length?'':vNav[j - hNavMax][i - vNavMax + vNav[j - hNavMax].length] ) + '</li>';
                    } else {
                        html += '<li class="nav column">' + ( (vNavMax - i - 1)>=vNav[j - hNavMax].length?'':vNav[j - hNavMax][i - vNavMax + vNav[j - hNavMax].length] ) + '</li>';
                    }
                } else if (j < hNavMax) {
                    html += '<li class="nav column">' + ( (hNavMax - j - 1)>=hNav[i - vNavMax].length?'':hNav[i - vNavMax][j - hNavMax + hNav[i - vNavMax].length] ) + '</li>';
                } else if ((j + 1 - hNavMax) % 5 === 0 && j !== hMax + hNavMax - 1 && j >= hNavMax) {
                    if (key === 'canvas') {
                        if (this.mapArr[i - vNavMax][j - hNavMax] === 1) {
                            html += '<li class="black fifth column" data-h="' + (j - hNavMax) + '"></li>';
                        } else {
                            html += '<li class="white fifth column" data-h="' + (j - hNavMax) + '"></li>';
                        }
                    } else {
                        html += '<li class="white fifth column field" data-h="' + (j - hNavMax) + '"></li>';
                    }
                } else {
                    if (key === 'canvas') {
                        if (this.mapArr[i - vNavMax][j - hNavMax]) {
                            html += '<li class="black column" data-h="' + (j - hNavMax) + '"></li>';
                        } else {
                            html += '<li class="white column" data-h="' + (j - hNavMax) + '"></li>';
                        }
                    } else {
                        html += '<li class="white column field" data-h="' + (j - hNavMax) + '"></li>';
                    }
                }
            }
            html += '</ul></li>';
        }
        this.winCounter = winCounter;
        return html;
    },

    winCheck: function (event) {
        var curTarget = $(event.currentTarget);
        if (curTarget.hasClass('black') && this.mapArr[curTarget.closest('ul').attr('data-v')][curTarget.attr('data-h')]) {
            this.winCounter--;
            console.log(this.winCounter);
        } else if (curTarget.hasClass('white') && !this.mapArr[curTarget.closest('ul').attr('data-v')][curTarget.attr('data-h')]) {
            this.winCounter--;
            console.log(this.winCounter);
        } else {
            this.winCounter++;
            console.log(this.winCounter);
        }
        /**Win check*/
        if (this.winCounter === 0) {
            return "winner";
        }
    },

    convertEditField: function (jqObject) {
        this.mapArr = [];
        mapArr = this.mapArr;
        jqObject.each(function (index) {
            mapArr.push([]);
            $(this).children().each(function() {
                if ($(this).hasClass('black')) {
                    mapArr[index].push(1);
                } else {
                    mapArr[index].push(0);
                }
            });
        });
    },

    getMapArrFromCanvas: function (data) {
        this.mapArr = [];
        for (var i = 0; i < data.height; i++) {
            this.mapArr.push([]);
            for (var j = 0; j < data.width*4; j +=4) {
                var average = (data.field.data[4*i*data.width + j] + data.field.data[4*i*data.width + j + 1] + data.field.data[4*i*data.width + j + 1]) / 3;
                var result = average>data.monoRate?0:1;
                this.mapArr[i].push(result);
            }
        }
    }
});