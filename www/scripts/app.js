requirejs.config({
    baseUrl: 'scripts/lib',
    paths: {
        model: '../model',
        view: '../view'
    }
});
/* Start the main app logic.*/
requirejs(['jquery', 'model/model', 'view/view'],
    function   ($, model, view) {
        var field = $('ul.main');
        $('#start').click(function () {
            model.offMouseEvents = false;
            model.mapArr = model.nonoPlus;
            view.start(model.nonogramConstractor());
            model.edit = false;
            model.canvasEdit = false;
        });
        $('#edit').click(function () {
            view.edit();
            model.edit = false;
            model.canvasEdit = false;
        });
        $('#build').click(function () {
            var res = view.receiveEditInfo();
            if (res == undefined) {
                return;
            }
            model.edit = true;
            model.offMouseEvents = false;
            view.buildField(model.nonogramConstractor('edit', res.x, res.y));
        });
        $('#play').click(function () {
            if (!model.edit) {
                view.alert('Please, build field first.');
                return;
            }
            model.convertEditField($('ul').not('.main'));
            view.buildField(model.nonogramConstractor());
            model.edit = false;
            if (model.winCounter === 0) {
                view.nothingToPlayMessager();
            }
        });
        $('#image').click(function () {
            view.editImage();
            model.edit = false;
            model.canvasEdit = false;
        });
        $('#buildcan').click(function () {
            view.receiveImageInfo().then(function(res) {
                model.offMouseEvents = true;
                model.getMapArrFromCanvas(res);
                view.buildField(model.nonogramConstractor('canvas', res.width, res.height));
                model.canvasEdit = true;
            });
        });
        $('#playcan').click(function () {
            if (!model.canvasEdit) {
                view.alert('Please, build field first.');
                return;
            }
            view.buildField(model.nonogramConstractor());
            model.offMouseEvents = false;
            model.canvasEdit = false;
        });
        $('body').contextmenu(function (event) {
            event.preventDefault();
        });
        field.on('click', 'li.nav', function (event) {
            if (!model.offMouseEvents) {
                view.toggleClassCross(event);
            }
        });
        field.on('mousedown', 'li.field', function (event) {
            var curTarget = $(event.currentTarget);
            event.preventDefault();
            if (!model.offMouseEvents) {
                if (event.which === 1) {
                    model.mouseHoldLeft = true;
                } else if (event.which === 3) {
                    model.mouseHoldRight = true;
                }
                if ((curTarget.hasClass('white') || curTarget.hasClass('black')) && model.mouseHoldLeft) {
                    view.toggleClassWB(curTarget);
                    if (!model.edit && !model.canvasEdit) {
                        if (model.winCheck(event) === "winner") {
                            view.winMessager();
                            model.offMouseEvents = true;
                        }
                    }
                } else if ((curTarget.hasClass('white') || curTarget.hasClass('silver')) && model.mouseHoldRight && !model.edit) {
                    view.toggleClassWS(curTarget);
                }
            }
        });
        $('body').on('mouseup', function (event) {
            model.mouseHoldLeft = false;
            model.mouseHoldRight = false;
        });
        field.on('mouseover', 'li.field', function (event) {
            if (!model.offMouseEvents) {
                var curTarget = $(event.currentTarget);
                if ((curTarget.hasClass('white') || curTarget.hasClass('black')) && model.mouseHoldLeft) {
                    view.toggleClassWB(curTarget);
                    if (!model.edit && !model.canvasEdit) {
                        if (model.winCheck(event) === "winner") {
                            view.winMessager();
                            model.offMouseEvents = true;
                        }
                    }
                } else if ((curTarget.hasClass('white') || curTarget.hasClass('silver')) && model.mouseHoldRight && !model.edit) {
                    view.toggleClassWS(curTarget);
                }
            }
        });
    });