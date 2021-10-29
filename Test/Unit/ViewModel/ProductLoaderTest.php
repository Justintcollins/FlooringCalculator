<?php
/**
 * Copyright © Online Supply. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Ecommerce121\FlooringCalculator\Test\Unit\ViewModel;

use Ecommerce121\FlooringCalculator\ViewModel\ProductLoader;
use PHPUnit\Framework\TestCase;

class ProductLoaderTest extends TestCase
{

    protected function setUp(): void
    {
        $objectManager = new \Magento\Framework\TestFramework\Unit\Helper\ObjectManager($this);
        // we want this to be a real Magento 2 object
        // complete with all it's dependencies
        // so we use the object manager to get it
        $context = $objectManager->getObject('Magento\Framework\View\Element\Template\Context');
        $productFactory = $objectManager->getObject('Magento\Catalog\Model\ProductFactory');
       
        $this->object = new ProductLoader($context, $productFactory);
    }

    public function testProductLoaderInstance(): void
    {
        $this->assertEquals(true, method_exists($this->object, 'getLoadProduct'));
        $this->assertEquals(class_parents(ProductLoader::class), class_parents($this->object));
    }
}
