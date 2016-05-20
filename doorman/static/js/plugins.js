// place any jQuery/helper plugins in here, instead of separate, slower script files.

$(function() {

    $(".tagsinput").tagsinput({

        tagClass: "label label-default",
        trimValue: true

    });


    $('.tagsinput').on('itemAdded', function(event) {

        var data = JSON.stringify([]);

        if ($(this).val() != null)
            data = JSON.stringify($(this).val());

        $.ajax({
            url: $(this).data('uri'),
            contentType: "application/json",
            data: data,
            dataType: "json",
            type: "POST"
        }).done(function (data, textStatus, jqXHR) {
            console.log(jqXHR.status);
        })

    });


    $('.tagsinput').on('itemRemoved', function(event) {

        var data = JSON.stringify([]);

        if ($(this).val() != null)
            data = JSON.stringify($(this).val());

        $.ajax({
            url: $(this).data('uri'),
            contentType: "application/json",
            data: data,
            dataType: "json",
            type: "POST"
        }).done(function (data, textStatus, jqXHR) {
            console.log(jqXHR.status);
        })

    });


    $('.glyphicon-trash').on('click', function(event) {

        var tr = $(this).parents('tr');

        $.ajax({
            url: $(this).data('uri'),
            contentType: "application/json",
            type: "DELETE"
        }).done(function (data, textStatus, jqXHR) {
            $(tr).remove();
            console.log(jqXHR.status);
        })

    })

    $('body').scrollspy({
        target: '.bs-docs-sidebar',
        offset: 70
    })

    $('#sidebar').affix({
        offset: {
            top: 0
        }
    })

})