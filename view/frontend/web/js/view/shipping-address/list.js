/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 * 
 */

define([
    'underscore',
    'ko',
    'mageUtils',
    'uiComponent',
    'uiLayout',
    'Magento_Customer/js/model/address-list',
    'Magento_Customer/js/customer-data'
], function (_, ko, utils, Component, layout, addressList, customerData) {
    'use strict';

    var addressTemplate = window.checkoutConfig.address_template_checkout;
    console.log(addressTemplate);
    var countryData = customerData.get('directory-data');

    var defaultRendererTemplate = {
        parent: '${ $.$data.parentName }',
        name: '${ $.$data.name }',
        component: 'Magento_Checkout/js/view/shipping-address/address-renderer/default'
    };

    return Component.extend({
        defaults: {
            template: 'Magento_Checkout/shipping-address/list',
            visible: addressList().length > 0,
            rendererTemplates: []
        },

        /** @inheritdoc */
        initialize: function () {
            this._super()
                .initChildren();

            addressList.subscribe(function (changes) {
                    var self = this;

                    changes.forEach(function (change) {
                        if (change.status === 'added') {
                            self.createRendererComponent(change.value, change.index);
                        }
                    });
                },
                this,
                'arrayChange'
            );

            return this;
        },

        /** @inheritdoc */
        initConfig: function () {
            this._super();
            // the list of child components that are responsible for address rendering
            this.rendererComponents = [];

            return this;
        },

        /** @inheritdoc */
        initChildren: function () {
            _.each(addressList(), this.createRendererComponent, this);

            return this;
        },

        /**
         * Create new component that will render given address in the address list
         *
         * @param {Object} address
         * @param {*} index
         */
        createRendererComponent: function (address, index) {
            var rendererTemplate, templateData, rendererComponent, renderAdress;

            renderAdress = addressTemplate.html;

            // prefix
            if (address.prefix !== undefined) {
                renderAdress = renderAdress.replace('{{prefix}}', address.prefix);
            }else{
                var string = renderAdress,
                    expr = /{{depend_prefix}}/;
                var check = string.search(expr);

                if(check === 1){
                    var array_prefix = renderAdress.match(/{{depend_prefix}}(.*?){{\/depend_prefix}}/g).map(function(val){
                       return val.replace(/{{\/?depend_prefix}}/g,'');
                    });
                    for (i = 0; i < array_prefix.length; i++) { 
                        renderAdress = renderAdress.replace(array_prefix[i], "");
                    }
                }else{
                    renderAdress = renderAdress.replace('{{prefix}}', '');
                }
            }
            renderAdress = renderAdress.replace('{{depend_prefix}}', "");
            renderAdress = renderAdress.replace('{{/depend_prefix}}', "");
            
            // firstname
            if (address.firstname !== undefined) {
                renderAdress = renderAdress.replace('{{firstname}}', address.firstname);
            }else{

                var string = renderAdress,
                    expr = /{{depend_firstname}}/;
                var check = string.search(expr);

                if(check === 1){
                    var array_firstname = renderAdress.match(/{{depend_firstname}}(.*?){{\/depend_firstname}}/g).map(function(val){
                       return val.replace(/{{\/?depend_firstname}}/g,'');
                    });
                    for (i = 0; i < array_firstname.length; i++) { 
                        renderAdress = renderAdress.replace(array_firstname[i], "");
                    }
                }else{
                    renderAdress = renderAdress.replace('{{firstname}}', '');
                }
            }
            renderAdress = renderAdress.replace('{{depend_firstname}}', "");
            renderAdress = renderAdress.replace('{{/depend_firstname}}', "");

            // middlename
            if (address.middlename !== undefined) {
                renderAdress = renderAdress.replace('{{middlename}}', address.middlename);
            }else{

                var string = renderAdress,
                    expr = /{{depend_middlename}}/;
                var check = string.search(expr);

                if(check === 1){
                    var array_middlename = renderAdress.match(/{{depend_middlename}}(.*?){{\/depend_middlename}}/g).map(function(val){
                       return val.replace(/{{\/?depend_middlename}}/g,'');
                    });
                    for (i = 0; i < array_middlename.length; i++) { 
                        renderAdress = renderAdress.replace(array_middlename[i], "");
                    }
                }else{
                    renderAdress = renderAdress.replace('{{middlename}}', '');
                }
            }
            renderAdress = renderAdress.replace('{{depend_middlename}}', "");
            renderAdress = renderAdress.replace('{{/depend_middlename}}', "");

            // lastname
            if (address.lastname !== undefined) {
                renderAdress = renderAdress.replace('{{lastname}}', address.lastname);
            }else{

                var string = renderAdress,
                    expr = /{{depend_lastname}}/;
                var check = string.search(expr);

                if(check === 1){
                    var array_lastname = renderAdress.match(/{{depend_lastname}}(.*?){{\/depend_lastname}}/g).map(function(val){
                       return val.replace(/{{\/?depend_lastname}}/g,'');
                    });
                    for (i = 0; i < array_lastname.length; i++) { 
                        renderAdress = renderAdress.replace(array_lastname[i], "");
                    }
                }else{
                    renderAdress = renderAdress.replace('{{lastname}}', '');
                }
            }
            renderAdress = renderAdress.replace('{{depend_lastname}}', "");
            renderAdress = renderAdress.replace('{{/depend_lastname}}', "");

            // suffix
            if (address.suffix !== undefined) {
                renderAdress = renderAdress.replace('{{suffix}}', address.suffix);
            }else{

                var string = renderAdress,
                    expr = /{{depend_suffix}}/;
                var check = string.search(expr);

                if(check === 1){
                    var array_suffix = renderAdress.match(/{{depend_suffix}}(.*?){{\/depend_suffix}}/g).map(function(val){
                       return val.replace(/{{\/?depend_suffix}}/g,'');
                    });
                    for (i = 0; i < array_suffix.length; i++) { 
                        renderAdress = renderAdress.replace(array_suffix[i], "");
                    }
                }else{
                    renderAdress = renderAdress.replace('{{suffix}}', '');
                }
            }
            renderAdress = renderAdress.replace('{{depend_suffix}}', "");
            renderAdress = renderAdress.replace('{{/depend_suffix}}', "");

            // company
            if (address.company !== undefined) {
                renderAdress = renderAdress.replace('{{company}}', address.company);
            }else{

                var string = renderAdress,
                    expr = /{{depend_company}}/;
                var check = string.search(expr);

                if(check === 1){
                    var array_company = renderAdress.match(/{{depend_company}}(.*?){{\/depend_company}}/g).map(function(val){
                       return val.replace(/{{\/?depend_company}}/g,'');
                    });
                    for (i = 0; i < array_company.length; i++) { 
                        renderAdress = renderAdress.replace(array_company[i], "");
                    }
                }else{
                    renderAdress = renderAdress.replace('{{company}}', '');
                }
            }
            renderAdress = renderAdress.replace('{{depend_company}}', "");
            renderAdress = renderAdress.replace('{{/depend_company}}', "");

            // street
            if (address.street !== undefined) {
                renderAdress = renderAdress.replace('{{street}}', address.street.join(', '));
            }else{

                var string = renderAdress,
                    expr = /{{depend_street}}/;
                var check = string.search(expr);

                if(check === 1){
                    var array_street = renderAdress.match(/{{depend_street}}(.*?){{\/depend_street}}/g).map(function(val){
                       return val.replace(/{{\/?depend_street}}/g,'');
                    });
                    for (i = 0; i < array_street.length; i++) { 
                        renderAdress = renderAdress.replace(array_street[i], "");
                    }
                }else{
                    renderAdress = renderAdress.replace('{{street}}', '');
                }
            }
            renderAdress = renderAdress.replace('{{depend_street}}', "");
            renderAdress = renderAdress.replace('{{/depend_street}}', "");

            // city
            if (address.city !== undefined) {
                renderAdress = renderAdress.replace('{{city}}', address.city);
            }else{

                var string = renderAdress,
                    expr = /{{depend_city}}/;
                var check = string.search(expr);

                if(check === 1){
                    var array_city = renderAdress.match(/{{depend_city}}(.*?){{\/depend_city}}/g).map(function(val){
                       return val.replace(/{{\/?depend_city}}/g,'');
                    });
                    for (i = 0; i < array_city.length; i++) { 
                        renderAdress = renderAdress.replace(array_city[i], "");
                    }
                }else{
                    renderAdress = renderAdress.replace('{{city}}', '');
                }
            }
            renderAdress = renderAdress.replace('{{depend_city}}', "");
            renderAdress = renderAdress.replace('{{/depend_city}}', "");

            // region
            if (address.region !== undefined) {
                renderAdress = renderAdress.replace('{{region}}', address.region);
            }else{

                var string = renderAdress,
                    expr = /{{depend_region}}/;
                var check = string.search(expr);

                if(check === 1){
                    var array_region = renderAdress.match(/{{depend_region}}(.*?){{\/depend_region}}/g).map(function(val){
                       return val.replace(/{{\/?depend_region}}/g,'');
                    });
                    for (i = 0; i < array_region.length; i++) { 
                        renderAdress = renderAdress.replace(array_region[i], "");
                    }
                }else{
                    renderAdress = renderAdress.replace('{{region}}', '');
                }
            }
            renderAdress = renderAdress.replace('{{depend_region}}', "");
            renderAdress = renderAdress.replace('{{/depend_region}}', "");

            // postcode
            if (address.postcode !== undefined) {
                renderAdress = renderAdress.replace('{{postcode}}', address.postcode);
            }else{

                var string = renderAdress,
                    expr = /{{depend_postcode}}/;
                var check = string.search(expr);

                if(check === 1){
                    var array_postcode = renderAdress.match(/{{depend_postcode}}(.*?){{\/depend_postcode}}/g).map(function(val){
                       return val.replace(/{{\/?depend_postcode}}/g,'');
                    });
                    for (i = 0; i < array_postcode.length; i++) { 
                        renderAdress = renderAdress.replace(array_postcode[i], "");
                    }
                }else{
                    renderAdress = renderAdress.replace('{{postcode}}', '');
                }
            }
            renderAdress = renderAdress.replace('{{depend_postcode}}', "");
            renderAdress = renderAdress.replace('{{/depend_postcode}}', "");

            // country
            var country = this.getCountryName(address.countryId);
            if (address.countryId !== undefined) {
                renderAdress = renderAdress.replace('{{country}}', country);
            }else{
                var string = renderAdress,
                    expr = /{{depend_country}}/;
                var check = string.search(expr);

                if(check === 1){
                    var array_country = renderAdress.match(/{{depend_country}}(.*?){{\/depend_country}}/g).map(function(val){
                       return val.replace(/{{\/?depend_country}}/g,'');
                    });
                    for (i = 0; i < array_country.length; i++) { 
                        renderAdress = renderAdress.replace(array_country[i], "");
                    }
                }else{
                    renderAdress = renderAdress.replace('{{country}}', '');
                }
            }
            renderAdress = renderAdress.replace('{{depend_country}}', "");
            renderAdress = renderAdress.replace('{{/depend_country}}', "");

            // telephone
            if (address.telephone !== undefined) {
                renderAdress = renderAdress.replace(/{{telephone}}/g, address.telephone);
            }else{

                var string = renderAdress,
                    expr = /{{depend_telephone}}/;
                var check = string.search(expr);

                if(check === 1){
                    var array_telephone = renderAdress.match(/{{depend_telephone}}(.*?){{\/depend_telephone}}/g).map(function(val){
                       return val.replace(/{{\/?depend_telephone}}/g,'');
                    });
                    for (i = 0; i < array_telephone.length; i++) { 
                        renderAdress = renderAdress.replace(array_telephone[i], "");
                    }
                }else{
                    renderAdress = renderAdress.replace('{{telephone}}', '');
                }
            }
            renderAdress = renderAdress.replace('{{depend_telephone}}', "");
            renderAdress = renderAdress.replace('{{/depend_telephone}}', "");

            // fax
            if (address.fax !== undefined) {
                renderAdress = renderAdress.replace('{{fax}}', address.fax);
            }else{

                var string = renderAdress,
                    expr = /{{depend_telephone}}/;
                var check = string.search(expr);

                if(check === 1){
                    var array_fax = renderAdress.match(/{{depend_fax}}(.*?){{\/depend_fax}}/g).map(function(val){
                       return val.replace(/{{\/?depend_fax}}/g,'');
                    });
                    for (i = 0; i < array_fax.length; i++) { 
                        renderAdress = renderAdress.replace(array_fax[i], "");
                    }
                }else{
                    renderAdress = renderAdress.replace('{{fax}}', '');
                }
            }
            renderAdress = renderAdress.replace('{{depend_fax}}', "");
            renderAdress = renderAdress.replace('{{/depend_fax}}', "");

            // vat_id
            if (address.vat_id !== undefined) {
                renderAdress = renderAdress.replace('{{vat_id}}', address.vat_id);
            }else{

                var string = renderAdress,
                    expr = /{{depend_vat_id}}/;
                var check = string.search(expr);

                if(check === 1){
                    var array_vat_id = renderAdress.match(/{{depend_vat_id}}(.*?){{\/depend_vat_id}}/g).map(function(val){
                       return val.replace(/{{\/?depend_vat_id}}/g,'');
                    });
                    for (i = 0; i < array_vat_id.length; i++) { 
                        renderAdress = renderAdress.replace(array_vat_id[i], "");
                    }
                }else{
                    renderAdress = renderAdress.replace('{{vat_id}}', '');
                }
            }
            renderAdress = renderAdress.replace('{{depend_vat_id}}', "");
            renderAdress = renderAdress.replace('{{/depend_vat_id}}', "");

            if (index in this.rendererComponents) {
                this.rendererComponents[index].address(address);
                this.rendererComponents[index].html(renderAdress);
            } else {
                // rendererTemplates are provided via layout
                rendererTemplate = address.getType() != undefined && this.rendererTemplates[address.getType()] != undefined ? //eslint-disable-line
                    utils.extend({}, defaultRendererTemplate, this.rendererTemplates[address.getType()]) :
                    defaultRendererTemplate;
                templateData = {
                    parentName: this.name,
                    name: index
                };
                rendererComponent = utils.template(rendererTemplate, templateData);
                utils.extend(rendererComponent, {
                    address: ko.observable(address),
                    html: ko.observable(renderAdress)
                });
                layout([rendererComponent]);
                this.rendererComponents[index] = rendererComponent;
            }
        },

        /**
         * @param {*} countryId
         * @return {String}
         */

        getCountryName: function (countryId) {
            return countryData()[countryId] != undefined ? countryData()[countryId].name : ''; //eslint-disable-line
        }
    });
});
