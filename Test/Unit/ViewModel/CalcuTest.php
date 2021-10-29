<?php
/**
 * Copyright © Online Supply. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Ecommerce121\FlooringCalculator\Test\Unit\ViewModel;

use Ecommerce121\FlooringCalculator\ViewModel\CalculatorLogic;
use PHPUnit\Framework\TestCase;

class CalcuTest extends TestCase
{

    protected function setUp(): void
    {
        $objectManager = new \Magento\Framework\TestFramework\Unit\Helper\ObjectManager($this);
        // we want this to be a real Magento 2 object
        // complete with all it's dependencies
        // so we use the object manager to get it
        $registry = $objectManager->getObject('Magento\Framework\Registry');
        $category = $objectManager->getObject('Magento\Catalog\Model\Category');
       
        $this->object = new CalculatorLogic($registry, $category);
    }

    public function testCalculatorLogicInstance(): void
    {
        $this->assertEquals(true, method_exists($this->object, 'getProductCatagory'));
        $this->assertEquals(class_parents(CalculatorLogic::class), class_parents($this->object));
    }
}
