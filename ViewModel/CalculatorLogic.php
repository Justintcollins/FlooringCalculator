<?php
/**
 * Copyright © OnlineSupply.com All rights reserved.
 * See COPYING.txt for license details.
 */
 
namespace Ecommerce121\FlooringCalculator\ViewModel;

use Magento\Framework\View\Element\Block\ArgumentInterface;
use Magento\Framework\View\Element\Template;

/**
 * Gets current products Categories
 */
class CalculatorLogic extends Template implements ArgumentInterface
{
    /**
     * @param Registry $registry
     * @param Category $categoryModel
     */
    public function __construct(
        \Magento\Framework\Registry $registry,
        \Magento\Catalog\Model\Category $categoryModel
    ) {
        $this->registry = $registry;
        $this->categoryModel = $categoryModel;
    }
    
    /**
     * Gets current products Categories
     *
     * @return Category[]
     */
    public function getProductCatagory()
    {
        $product = $this->registry->registry('current_product');
        $categories = $product->getCategoryIds(); /*will return category ids array*/
        $arr =[];
        foreach ($categories as $category) {
            $cat = $this->categoryModel->load($category);
            $arr[] = $cat->getName();
        }
        return $arr;
    }
    
    /**
     * Gets current products 
     *
     * @return Product Object
     */
    public function getCurrentProduct()
    {
        $product = $this->registry->registry('current_product');
        return $product;
    }
}
