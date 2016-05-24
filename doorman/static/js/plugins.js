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

    // --------------------------------------------------------------------------------

    var QueryBuilder = $.fn.queryBuilder.constructor;

    var SUPPORTED_OPERATOR_NAMES = [
        'equal',
        'not_equal',
        'begins_with',
        'not_begins_with',
        'contains',
        'not_contains',
        'ends_with',
        'not_ends_with',
        'is_empty',
        'is_not_empty',
        'less',
        'less_or_equal',
        'greater',
        'greater_or_equal',
    ];

    var SUPPORTED_COLUMN_OPERATORS = SUPPORTED_OPERATOR_NAMES.map(function (operator) {
        return 'column_' + operator;
    });

    var SUPPORTED_OPERATORS = SUPPORTED_OPERATOR_NAMES.map(function (operator) {
        return QueryBuilder.OPERATORS[operator];
    });

    var COLUMN_OPERATORS = SUPPORTED_COLUMN_OPERATORS.map(function (operator) {
        return {
            type: operator,
            nb_inputs: 2,
            multiple: true,
            apply_to: ['string'],        // Currently, all column operators are strings
        };
    });

    // Copy existing names
    var CUSTOM_LANG = {};
    SUPPORTED_OPERATOR_NAMES.forEach(function (op) {
        CUSTOM_LANG['column_' + op] = QueryBuilder.regional.en.operators[op];
    });

    // Get existing rules, if any.
    var existingRules;
    try {
        var v = $('#rules-hidden').val();
        if (v) {
            existingRules = JSON.parse(v);
        }
    } catch (e) {
        // Do nothing.
    }

    $('#query-builder').queryBuilder({
        filters: [
            {
                id: 'query_name',
                type: 'string',
                label: 'Query Name',
            },
            {
                id: 'host_identifier',
                type: 'string',
                label: 'Host Identifier',
            },
            {
                id: 'timestamp',
                type: 'integer',
                label: 'Timestamp',
            },
            {
                id: 'column',
                type: 'string',
                label: 'Column',
                operators: SUPPORTED_COLUMN_OPERATORS,
                placeholder: 'value',
            },
        ],

        operators: SUPPORTED_OPERATORS.concat(COLUMN_OPERATORS),

        lang: {
            operators: CUSTOM_LANG,
        },

        plugins: {
            'bt-tooltip-errors': {
                delay: 100,
                placement: 'bottom',
            },
        },

        // Existing rules (if any)
        rules: existingRules,
    });

    // Set the placeholder of the first value for all 'column_*' rules to
    // 'column name'.  A bit hacky, but this seems to be the only way to
    // accomplish this.
    $('#query-builder').on('getRuleInput.queryBuilder.filter', function (evt, rule, name) {
        if (rule.operator.type.match(/^column_/) && name.match(/value_0$/)) {
            var el = $(evt.value);
            $(el).attr('placeholder', 'column name');;
            evt.value = el[0].outerHTML;
        }
    });

    $('#submit-button').on('click', function(e) {
      var $builder = $('#query-builder');

      if (!$builder) {
        return true;
      }

      if (!$builder.queryBuilder('validate')) {
        e.preventDefault();
        return false;
      }

      var rules = JSON.stringify($builder.queryBuilder('getRules'));
      $('#rules-hidden').val(rules);
      return true;
    });

})
