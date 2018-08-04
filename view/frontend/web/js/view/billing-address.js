/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define([
    'ko',
    'underscore',
    'Magento_Ui/js/form/form',
    'Magento_Customer/js/model/customer',
    'Magento_Customer/js/model/address-list',
    'Magento_Checkout/js/model/quote',
    'Magento_Checkout/js/action/create-billing-address',
    'Magento_Checkout/js/action/select-billing-address',
    'Magento_Checkout/js/checkout-data',
    'Magento_Checkout/js/model/checkout-data-resolver',
    'Magento_Customer/js/customer-data',
    'Magento_Checkout/js/action/set-billing-address',
    'Magento_Ui/js/model/messageList',
    'mage/translate'
],
function (
    ko,
    _,
    Component,
    customer,
    addressList,
    quote,
    createBillingAddress,
    selectBillingAddress,
    checkoutData,
    checkoutDataResolver,
    customerData,
    setBillingAddressAction,
    globalMessageList,
    $t
) {
    'use strict';

    var addressTemplate = window.checkoutConfig.address_template_checkout;

    var lastSelectedBillingAddress = null,
        newAddressOption = {
            /**
             * Get new address label
             * @returns {String}
             */
            getAddressInline: function () {
                return $t('New Address');
            },
            customerAddressId: null
        },
        countryData = customerData.get('directory-data'),
        addressOptions = addressList().filter(function (address) {
            return address.getType() == 'customer-address'; //eslint-disable-line eqeqeq
        });

    addressOptions.push(newAddressOption);

    var currentBillingAddress = quote.billingAddress;

    return Component.extend({
        defaults: {
            template: 'Magento_Checkout/billing-address'
        },
        currentBillingAddress: currentBillingAddress,
        addressOptions: addressOptions,
        customerHasAddresses: addressOptions.length > 1,
        currentBillingAddressHtml: currentBillingAddress,

        /**
         * Init component
         */
        initialize: function () {
            this._super();
            quote.paymentMethod.subscribe(function () {
                checkoutDataResolver.resolveBillingAddress();
            }, this);
        },

        /**
         * @return {exports.initObservable}
         */
        initObservable: function () {
            
            this._super()
                .observe({
                    selectedAddress: null,
                    isAddressDetailsVisible: quote.billingAddress() != null,
                    isAddressFormVisible: !customer.isLoggedIn() || addressOptions.length === 1,
                    isAddressSameAsShipping: false,
                    saveInAddressBook: 1
                });

            quote.billingAddress.subscribe(function (newAddress) {
                if (quote.isVirtual()) {
                    this.isAddressSameAsShipping(false);
                } else {
                    this.isAddressSameAsShipping(
                        newAddress != null &&
                        newAddress.getCacheKey() == quote.shippingAddress().getCacheKey() //eslint-disable-line eqeqeq
                    );
                }

                if (newAddress != null && newAddress.saveInAddressBook !== undefined) {
                    this.saveInAddressBook(newAddress.saveInAddressBook);
                } else {
                    this.saveInAddressBook(1);
                }
                this.isAddressDetailsVisible(true);
            }, this);

            return this;
        },

        canUseShippingAddress: ko.computed(function () {
            return !quote.isVirtual() && quote.shippingAddress() && quote.shippingAddress().canUseForBilling();
        }),

        /**
         * @param {Object} address
         * @return {*}
         */
        addressOptionsText: function (address) {
            return address.getAddressInline();
        },

        /**
         * @return {Boolean}
         */
        useShippingAddress: function () {
            if (this.isAddressSameAsShipping()) {
                selectBillingAddress(quote.shippingAddress());

                this.updateAddresses();
                this.isAddressDetailsVisible(true);
            } else {
                lastSelectedBillingAddress = quote.billingAddress();
                quote.billingAddress(null);
                this.isAddressDetailsVisible(false);
            }
            checkoutData.setSelectedBillingAddress(null);

            return true;
        },

        /**
         * Update address action
         */
        updateAddress: function () {
            var addressData, newBillingAddress;

            if (this.selectedAddress() && this.selectedAddress() != newAddressOption) { //eslint-disable-line eqeqeq
                selectBillingAddress(this.selectedAddress());
                checkoutData.setSelectedBillingAddress(this.selectedAddress().getKey());
            } else {
                this.source.set('params.invalid', false);
                this.source.trigger(this.dataScopePrefix + '.data.validate');

                if (this.source.get(this.dataScopePrefix + '.custom_attributes')) {
                    this.source.trigger(this.dataScopePrefix + '.custom_attributes.data.validate');
                }

                if (!this.source.get('params.invalid')) {
                    addressData = this.source.get(this.dataScopePrefix);

                    if (customer.isLoggedIn() && !this.customerHasAddresses) { //eslint-disable-line max-depth
                        this.saveInAddressBook(1);
                    }
                    addressData['save_in_address_book'] = this.saveInAddressBook() ? 1 : 0;
                    newBillingAddress = createBillingAddress(addressData);

                    // New address must be selected as a billing address
                    selectBillingAddress(newBillingAddress);
                    checkoutData.setSelectedBillingAddress(newBillingAddress.getKey());
                    checkoutData.setNewCustomerBillingAddress(addressData);
                }
            }
            this.updateAddresses();
        },

        /**
         * Edit address action
         */
        editAddress: function () {
            lastSelectedBillingAddress = quote.billingAddress();
            quote.billingAddress(null);
            this.isAddressDetailsVisible(false);
        },

        /**
         * Cancel address edit action
         */
        cancelAddressEdit: function () {
            this.restoreBillingAddress();

            if (quote.billingAddress()) {
                // restore 'Same As Shipping' checkbox state
                this.isAddressSameAsShipping(
                    quote.billingAddress() != null &&
                        quote.billingAddress().getCacheKey() == quote.shippingAddress().getCacheKey() && //eslint-disable-line
                        !quote.isVirtual()
                );
                this.isAddressDetailsVisible(true);
            }
        },

        /**
         * Restore billing address
         */
        restoreBillingAddress: function () {
            if (lastSelectedBillingAddress != null) {
                selectBillingAddress(lastSelectedBillingAddress);
            }
        },

        /**
         * @param {Object} address
         */
        onAddressChange: function (address) {
            this.isAddressFormVisible(address == newAddressOption); //eslint-disable-line eqeqeq
        },

        /**
         * @param {Number} countryId
         * @return {*}
         */
        getCountryName: function (countryId) {
            return countryData()[countryId] != undefined ? countryData()[countryId].name : ''; //eslint-disable-line
        },

        /**
         * Trigger action to update shipping and billing addresses
         */
        updateAddresses: function () {
            if (window.checkoutConfig.reloadOnBillingAddress ||
                !window.checkoutConfig.displayBillingOnPaymentMethod
            ) {
                setBillingAddressAction(globalMessageList);
            }
        },

        /**
         * Get code
         * @param {Object} parent
         * @returns {String}
         */
        getCode: function (parent) {
            return _.isFunction(parent.getCode) ? parent.getCode() : 'shared';
        },

        formatAddress: function (prefix,firstname,middlename,lastname,suffix,company,street,city,region,postcode,countryId,telephone, fax, vat_id) {
            var renderAdress;

            renderAdress = addressTemplate.html;

            // prefix
            if (prefix !== undefined) {
                renderAdress = renderAdress.replace('{{prefix}}', prefix);
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
            if (firstname !== undefined) {
                renderAdress = renderAdress.replace('{{firstname}}', firstname);
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
            if (middlename !== undefined) {
                renderAdress = renderAdress.replace('{{middlename}}', middlename);
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
            if (lastname !== undefined) {
                renderAdress = renderAdress.replace('{{lastname}}', lastname);
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
            if (suffix !== undefined) {
                renderAdress = renderAdress.replace('{{suffix}}', suffix);
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
            if (company !== undefined) {
                renderAdress = renderAdress.replace('{{company}}', company);
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
            if (street !== undefined) {
                renderAdress = renderAdress.replace('{{street}}', street.join(', '));
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
            if (city !== undefined) {
                renderAdress = renderAdress.replace('{{city}}', city);
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
            if (region !== undefined) {
                renderAdress = renderAdress.replace('{{region}}', region);
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
            if (postcode !== undefined) {
                renderAdress = renderAdress.replace('{{postcode}}', postcode);
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
            var country = this.getCountryName(countryId);
            if (countryId !== undefined) {
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
            if (telephone !== undefined) {
                renderAdress = renderAdress.replace(/{{telephone}}/g, telephone);
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
            if (fax !== undefined) {
                renderAdress = renderAdress.replace('{{fax}}', fax);
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
            if (vat_id !== undefined) {
                renderAdress = renderAdress.replace('{{vat_id}}', vat_id);
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

            return renderAdress;
        }
    });
});
