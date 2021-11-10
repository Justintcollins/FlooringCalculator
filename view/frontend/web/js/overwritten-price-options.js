define([
    'jquery',
    'underscore',
    'mage/template',
    'priceUtils',
    'priceBox',
    'jquery-ui-modules/widget'
], function ($, _, mageTemplate, utils) {

    return function (widget) {
        
        function defaultGetOptionValue(element, optionsConfig) {
            var changes = {},
                optionValue = element.val(),
                optionId = utils.findOptionId(element[0]),
                optionName = element.prop('name'),
                optionType = element.prop('type'),
                optionConfig = optionsConfig[optionId],
                optionHash = optionName;
            switch (optionType) {
                case 'text':
                case 'textarea':
                    changes[optionHash] = optionValue ? optionConfig.prices : {};
                    break;
                case 'radio':
                    if (element.is(':checked')) {
                        changes[optionHash] = optionConfig[optionValue] && optionConfig[optionValue].prices || {};
                    }
                    break;
                case 'select-one':
                        changes[optionHash] = optionConfig[optionValue] && optionConfig[optionValue].prices || {};
                    break;
                case 'select-multiple':
                    _.each(optionConfig, function (row, optionValueCode) {
                        optionHash = optionName + '##' + optionValueCode;
                        changes[optionHash] = _.contains(optionValue, optionValueCode) ? row.prices : {};
                    });
                    break;
                case 'checkbox':
                    optionHash = optionName + '##' + optionValue;
                    changes[optionHash] = element.is(':checked') ? optionConfig[optionValue].prices : {};
                    break;
                case 'file':
                    // Checking for 'disable' property equal to checking DOMNode with id*="change-"
                    changes[optionHash] = optionValue || element.prop('disabled') ? optionConfig.prices : {};
                    break;
            }
            return changes;
        }
            
        $.widget('mage.priceOptions', widget, {
            _onOptionChanged: function () {
                buildPriceView(); //update priceView if view was updated
            },
            _applyOptionNodeFix: function applyOptionNodeFix(options) {
                var config = this.options,
                    format = config.priceFormat,
                    template = config.optionTemplate;
                
                template = mageTemplate(template);
                options.filter('select').each(function (index, element) {
                    var $element = $(element),
                        optionId = utils.findOptionId($element),
                        optionConfig = config.optionConfig && config.optionConfig[optionId];
                    $element.find('option').each(function (idx, option) {
                        var $option,
                            optionValue,
                            toTemplate,
                            prices;
    
                        $option = $(option);
                        optionValue = $option.val();
    
                        if (!optionValue && optionValue !== 0) {
                            return;
                        }
    
                        toTemplate = {
                            data: {
                                label: optionConfig[optionValue] && optionConfig[optionValue].name
                            }
                        };
    
                        prices = optionConfig[optionValue] ? optionConfig[optionValue].prices : null;
    
                        if (prices) {
                            _.each(prices, function (price, type) {
                                var value = +price.amount;
    
                                value += _.reduce(price.adjustments, function (sum, x) { //eslint-disable-line
                                    return sum + x;
                                }, 0);
                                toTemplate.data[type] = {
                                    value: value,
                                    formatted: utils.formatPrice(value, format)
                                };
                            });
    
                            $option.text(template(toTemplate));
                        }
                    });
                });
            },
            /**
             * Widget creating method.
             * Triggered once.
             * @private
             */
            _create: function createPriceOptions()
            {
                var form = this.element;
                /**
                 * Fix index keys to avoid error
                 */
                if (hasPackageContainer == 'true') { // hasPackageContainer assigned in changeProduct.js
                    initOptId = Object.keys(this.options.optionConfig)[0];
                    initialOptTypeIdArray = Object.keys(this.options.optionConfig[1])
                    i = 0;
                    while (i < optionsArray.length) {
                        var initOptTypeId = initialOptTypeIdArray[i];
                        optId = optionsArray[i].optionId;
                        optTypeId = optionsArray[i].optionTypeId;
                        custom_optionsConfig = [];
                        custom_optionsConfig[optId] = {};
                        custom_optionsConfig[optId][optTypeId] = this.options.optionConfig[initOptId][initOptTypeId];
                        i++;
                    }
                    this.options.optionConfig = custom_optionsConfig;
                }
                /**
                 * DONE Fixing index keys to avoid error above
                 */
                options = $(this.options.optionsSelector, form),
                priceBox = $(this.options.priceHolderSelector, $(this.options.optionsSelector).element);
                
                if (priceBox.data('magePriceBox') &&
                    priceBox.priceBox('option') &&
                    priceBox.priceBox('option').priceConfig
                ) {
                    if (priceBox.priceBox('option').priceConfig.optionTemplate) {
                        this._setOption('optionTemplate', priceBox.priceBox('option').priceConfig.optionTemplate);
                    }
                    this._setOption('priceFormat', priceBox.priceBox('option').priceConfig.priceFormat);
                }
    
                this._applyOptionNodeFix(options);
    
                options.on('change', this._onOptionChanged.bind(this));
            }
        }); // END OF WIDGET
        return $.mage.priceOptions;
    }
});
