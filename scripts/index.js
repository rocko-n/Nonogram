/**
 * Array of arrays - map for nonogramConstructor
 * @type {*[]}
 */
var mapArr;
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
    $('#tooltip').hide();
    $('.editor').hide();
    mapArr = nonoPlus;
    $('.main').html(nonogramConstractor());
    edit = false;
});
$('#edit').click(function () {
    $('#tooltip').hide();
    $('.main').html('');
    $('.editor').show();
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
    $('.editor').hide();
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