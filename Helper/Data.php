<?php

namespace Dangs\TemplateCheckoutAddress\Helper;

/**
 * Helper Data.
 */
class Data extends \Magento\Framework\App\Helper\AbstractHelper
{

	/**
     * get address template
     *
     * @return string
     */

	public function getAddressHtmlFormat(){
		return $this->scopeConfig->getValue('customer/address_templates_checkout/html', 
						\Magento\Store\Model\ScopeInterface::SCOPE_STORE);
	}
}