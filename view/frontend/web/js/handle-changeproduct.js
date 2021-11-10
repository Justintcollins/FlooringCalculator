var productId = document.getElementById("mage_productId").getAttribute("data-mage-product-id");
var finalPackagePrice = document.getElementById("mage_productContainerPrice").getAttribute("data-mage-product-container-price");
var packageContainerId = document.getElementById("mage_packageContainerId").getAttribute("data-mage-package-container-id");
var packageContainerQty = document.getElementById("mage_packageContainerQty").getAttribute("data-mage-package-container-qty");
var getIdBySku = document.getElementById("mage_getIdBySku").getAttribute("data-mage-getIdBySku");
var prodSku = document.getElementById("mage_prodSku").getAttribute("data-mage-prodSku");
var isConfigurableProduct = document.getElementById("mage_isConfigurableProduct").getAttribute("data-mage-isConfigurableProduct");
var optionsArray = document.getElementById("mage_optionsArray").getAttribute("data-mage-optionsArray");
var hasPackageContainer = document.getElementById("mage_hasPackageContainer").getAttribute("data-mage-hasPackageContainer");
optionsArray = JSON.parse(optionsArray);
getIdBySku = JSON.parse(getIdBySku);


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
        (packageContainerQty > 0) ? replaceProductIdInAddtocartForm() : false;
    } else {
        //do nothing
    }
}

function replaceProductIdInAddtocartForm()
{
    var fullActionUrl = getActionUrl();
    var fullActionUrlParts = fullActionUrl.split("/");
    //replace id with new id
    fullActionUrlParts[fullActionUrlParts.length -2] = packageContainerId;
    var newActionUrl = fullActionUrlParts.join("/");
    // re-build action url, by swaping sqft price product with the fk value from attribute packageContainerId
    document.getElementById("product_addtocart_form").action = newActionUrl;
    // replace input[name=item]
    document.querySelector('#product_addtocart_form > input[name=item]').value = packageContainerId;
    // replace input[name=product]
    document.querySelector('#product_addtocart_form > input[name=product]').value = packageContainerId;
}

// Initialize
var _productHasContainer = document.getElementById("sqft-hasContainer").getAttribute("data-mage-has-container");
if (_productHasContainer) {
    changeProduct();
} else {
    // Don't Change
}

if (isConfigurableProduct == 'true') {
    setInterval(function () {
        var skuParts=[];
        document.querySelectorAll(".swatch-option").forEach(function (e) {
            if (e.ariaChecked=="true") {
                skuParts.push(e.ariaLabel);
            }
        });
        skuPart="";
        skuParts.forEach((sp)=>{skuPart=skuPart+"-"+sp})
        var fullSku = prodSku+skuPart;
        if (Object.keys(getIdBySku).includes(fullSku)) {
            packageContainerId = getIdBySku[fullSku];
            replaceProductIdInAddtocartForm();
        }
    }, 3000);
} else {
    
}

if (hasPackageContainer == 'true') {
    var i = 0;
    optionsArray.forEach((item => {
        i++;
        var optionTypeId = item.optionTypeId;
        var optionId = item.optionId;
        document.querySelector("form#product_addtocart_form select")[i].value = optionTypeId;
        document.querySelector("form#product_addtocart_form select").name = "options["+optionId+"]";
        document.querySelector("form#product_addtocart_form select").setAttribute('data-selector',"options["+optionId+"]");
    }));
}
