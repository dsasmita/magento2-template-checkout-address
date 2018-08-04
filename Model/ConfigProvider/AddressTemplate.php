<?php

namespace Dangs\TemplateCheckoutAddress\Model\ConfigProvider;

use Magento\Checkout\Model\ConfigProviderInterface;
use Dangs\TemplateCheckoutAddress\Helper\Data as dangsHelper;

/**
 * Class AddressTemplate
 */
class AddressTemplate implements ConfigProviderInterface
{
    protected $_objectManager;
    
    protected $_dangsHelper;

    public function __construct(
        \Magento\Framework\ObjectManagerInterface $objectManager,
        dangsHelper $dangsHelper
    ) {
        $this->_objectManager = $objectManager;
        $this->_dangsHelper = $dangsHelper;
    }

    /**
     * Retrieve assoc array of checkout configuration
     *
     * @return array
     */
    public function getConfig()
    {

        $htmlFormat = $this->_dangsHelper->getAddressHtmlFormat();
        return [
            'address_template_checkout' => [
                'html' => $htmlFormat
            ],
        ];
    }
}