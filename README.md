# Magento 2 Custom Template Checkout Address

This Extension is used make template for address on checkout page (shipping address and payment address)

## Features:

### Frontend
- Show custom format address checkout page

### Backend
- Set custom format under menu Stores >> Configuration >> Customers - Customers Configuration Under tabs Checkout address templates

## Introduction installation:

### Install Magento 2 Hide Price Not Login
- Download file
- Unzip the file
- Create a folder [root]/app/code/Dangs/TemplateCheckoutAddress
- Copy to folder

### Enable Extension

```
php bin/magento module:enable Dangs_TemplateCheckoutAddress
php bin/magento setup:upgrade
php bin/magento cache:clean
php bin/magento setup:static-content:deploy
```


## Screenshot
![ScreenShot](https://github.com/dsasmita/magento2-template-checkout-address/blob/master/screen-shot/configuration.png)
![ScreenShot](https://github.com/dsasmita/magento2-template-checkout-address/blob/master/screen-shot/checkout-shipping.png)
![ScreenShot](https://github.com/dsasmita/magento2-template-checkout-address/blob/master/screen-shot/checkout-payment.png)

## Donation
If you find this extension help you,  feel free to donate
:)

[![](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](http://bit.ly/2nFWFZI)
