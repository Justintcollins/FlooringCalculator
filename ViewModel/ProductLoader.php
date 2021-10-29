<?php
/**
 * Copyright © OnlineSupply.com All rights reserved.
 * See COPYING.txt for license details.
 */
 
namespace Ecommerce121\FlooringCalculator\ViewModel;

use Magento\Framework\View\Element\Template;
use Magento\Framework\View\Element\Block\ArgumentInterface;

/**
 * Loads product by id.
 */
class ProductLoader extends Template implements ArgumentInterface
{
    /**
     * Product Factory Object
     * @var $_productloader
     */
    protected $_productloader;
    /**
     * @param Context $context
     * @param ProductFactory $_productloader
     */
    public function __construct(
        \Magento\Framework\View\Element\Template\Context $context,
        \Magento\Catalog\Model\ProductFactory $_productloader
    ) {
        $this->_productloader = $_productloader;
        parent::__construct($context);
    }
    /**
     * Gets Product by Id
     *
     * @param int $id
     *
     * @return Product Object
     */
    public function getLoadProduct($id)
    {
        return $this->_productloader->create()->load($id);
    }
}
