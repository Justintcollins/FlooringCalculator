var productId = document.getElementById("mage_productId").getAttribute("data-mage-product-id");
var packageContainerId = document.getElementById("mage_packageContainerId").getAttribute("data-mage-package-container-id");
var packageContainerQty = document.getElementById("mage_packageContainerQty").getAttribute("data-mage-package-container-qty");

function getProductIdFromAddtocartForm()
{
    return document.querySelector('#product_addtocart_form > input[name=product]').value;
}

function getActionUrl()
{
    return document.getElementById("product_addtocart_form").action;
}

function changeProduct()
{
    if (packageContainerId.length > 0) {
        replaceProductIdInAddtocartForm();
    } else {
        //do nothing
    }
}

function replaceProductIdInAddtocartForm()
{
    // replace action url
    var fullActionUrl = getActionUrl();
    var baseActionUrl = fullActionUrl.substr(0,fullActionUrl.length -2);
    
    // re-build action url, by swaping sqft price product with the fk value from attribute packageContainerId
    document.getElementById("product_addtocart_form").action = baseActionUrl + packageContainerId + "/";
    // replace input[name=item]
    document.querySelector('#product_addtocart_form > input[name=item]').value = packageContainerId;
    // replace input[name=product]
    document.querySelector('#product_addtocart_form > input[name=product]').value = packageContainerId;
    if (document.querySelector('#product_addtocart_form > input[name=item]').value != packageContainerId) {
        document.querySelector('#testing-bool-action-url-changed').value = true;
    }
}

// Initialize
var _productHasContainer = document.getElementById("sqft-hasContainer").getAttribute("data-mage-has-container");
if (_productHasContainer) {
    changeProduct();
} else {
    // Don't Change
}

