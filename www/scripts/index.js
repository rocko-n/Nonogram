/**
 * Array of arrays - map for nonogramConstructor
 * @type {*[]}
 */
var mapArr;
/**
 * Win counter
 * @type {Number}
 */
var winCounter;
/**
 * Edit state
 * @type {Boolean}
 */
var edit;
/**
 * Mouse left button hold
 * @type {boolean}
 */
var mouseHoldLeft = false;
/**
 * Mouse right button hold
 * @type {boolean}
 */
var mouseHoldRight = false;
var offMouseEvents = false;
/**
 *
 * @type {Element|HTMLElement}
 */
var buttonDiv = document.getElementById('nav');
/**
 *
 * @type {jQuery}
 */
var field = $('ul.main');
$('#start').click(function () {
    offMouseEvents = false;
    $('#tooltip').fadeOut(300);
    $('#canvas').hide();
    $('.canvas').hide();
    $('.editor').fadeOut(300, function() {
        mapArr = nonoPlus;
        $('.main').html(nonogramConstractor());
        edit = false;
    });
});
$('#edit').click(function () {
    $('.canvas').hide();
    $('#tooltip').fadeOut(300);
    $('#canvas').hide();
    $('.main').html('');
    $('.editor').fadeIn(500);
});
$('#build').click(function () {
    var x = $('#x-count').val();
    var y = $('#y-count').val();
    if ( !/^[1-5][0-9]$/.test(x) || !/^[1-5][0-9]$/.test(y) ) {
        alert('Wrong data');
        return;
    };
    edit = true;
    offMouseEvents = false;
    $('.main').html(nonogramConstractor('edit', +x, +y));
});
$('#play').click(function () {
    if ( !edit ) {
        alert('Please, build field first.');
        return;
    };
    $('.editor').fadeOut(300, function() {
        edit = false;
        convertEditField();
        $('.main').html(nonogramConstractor());
        if ( winCounter === 0 ) {
            $('#tooltip').html('Noting to play')
                .css(getOffsetRect(buttonDiv, buttonDiv.offsetHeight))
                .show();
            $('.main').html('');
        };
    });
});
$('#image').click(function () {
    $('#tooltip').fadeOut(300);
    $('.main').html('');
    $('.editor').hide();
    $('.canvas').fadeIn(500);
});
$('#buildcan').click(function () {
    $('#canvas').fadeIn(500);
    getCanvasPx().then(function(res) {
        console.log(res.field.data);
        getMapArrFromCanvas(res, $('#monochrome').val());
        console.log(JSON.stringify(mapArr));
        $('.main').html(nonogramConstractor('canvas'));
    });
});
/**Play/Edit module*/
$('body').contextmenu(function (event) {
    event.preventDefault();
});
field.on('click', 'li.nav', function (event) {
    if ( !offMouseEvents ) {
        $(event.currentTarget).toggleClass('crossed');
    };
});
field.on('mousedown', 'li:not(.nav)',function (event) {
    event.preventDefault();
    if ( !offMouseEvents ) {
        if ( event.which == 1 ) {
            mouseHoldLeft = true;
        } else if ( event.which == 3 ) {
            mouseHoldRight = true;
        };
        if ( ($(event.currentTarget).hasClass('white') || $(event.currentTarget).hasClass('black')) && mouseHoldLeft ) {
            $(event.currentTarget).toggleClass('white black');
            if ( !edit ) {
                winCheck(event);
            };
        } else if ( ($(event.currentTarget).hasClass('white') || $(event.currentTarget).hasClass('silver')) && mouseHoldRight && !edit ) {
            $(event.currentTarget).toggleClass('white silver');
        };
    };
});
$('body').on('mouseup', function (event) {
    mouseHoldLeft = false;
    mouseHoldRight = false;
});
field.on('mouseover', 'li:not(.nav)',function (event) {
    if ( !offMouseEvents ) {
        if ( ($(event.currentTarget).hasClass('white') || $(event.currentTarget).hasClass('black')) && mouseHoldLeft ) {
            $(event.currentTarget).toggleClass('white black');
            if ( !edit ) {
                winCheck(event);
            };
        } else if ( ($(event.currentTarget).hasClass('white') || $(event.currentTarget).hasClass('silver')) && mouseHoldRight && !edit ) {
            $(event.currentTarget).toggleClass('white silver');
        };
    };
});