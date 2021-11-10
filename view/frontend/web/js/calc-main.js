var _moreProcessing = document.getElementById("mage_productMoreProcessing").getAttribute("data-mage-more-processing");
var _packageContainerId = document.getElementById("mage_packageContainerId").getAttribute("data-mage-package-container-id");
var _packageContainerQty = document.getElementById("mage_packageContainerQty").getAttribute("data-mage-package-container-qty");
var _packageContainerPrice = document.getElementById("mage_productContainerPrice").getAttribute("data-mage-product-container-price");
var _productName = document.getElementById("mage_productName").getAttribute("data-mage-product-name");
var _productHasContainer = document.getElementById("sqft-hasContainer").getAttribute("data-mage-has-container");
var _productSqftUnitPrice = document.getElementById("mage_sqft-unit-price").getAttribute("data-mage-package-container-sqft-unit-price");
var _productProductId = document.getElementById("mage_productId").getAttribute("data-mage-product-id");

if (_moreProcessing == 'true') {
    if (_packageContainerQty < 1) {
        _packageContainerQty = extractNumbersFromProductName(_productName,"max");
    }
    if (_productSqftUnitPrice < 1) {
        _productSqftUnitPrice = extractNumbersFromProductName(_productName,"min");
    }
    var total = (_packageContainerQty * _productSqftUnitPrice).toFixed(2)
    if (total == _packageContainerPrice) {
        //good
    } else {
        //not good
    }
}

var preData = {};

preData.isPlankProduct = _productHasContainer;
preData.productName = _productName;
preData.packageContainerId = _packageContainerId;
preData.packageContainerQty = parseFloat(_packageContainerQty);
preData._productPrice = parseFloat(_productSqftUnitPrice);
preData.sqftPrice = parseFloat(_productSqftUnitPrice);
preData.sqftInBox = parseFloat(_packageContainerQty);
preData.boxPrice = parseFloat(_packageContainerPrice);

var sqftFL = {
    formBody: document.querySelector("#c_formBody"),
    resultBody: document.querySelector("#c_sqftResultBody"),
    mState: [],
    history: {
        exists: true,
        lastAddedElement: "lxw",
        lastSubmitBy: null,
        resultData: [],
        mState: [],
        position: null,
    },
    forcedQtyChange: {
        triggered: false,
        covers: null,
        cases: null,
        estimatedCost: null,
        notEnoughMsgTriggered: false,
    },
    resultData: {
        exists: true,
        percentToggled: false,
        percent10: {
            calculatedSqft: null,
            covers: null,
            estimatedCost: null,
            cases: null,
            qty: 1,
        },
        calculatedSqft: null,
        covers: null,
        estimatedCost: null,
        cases: null,
    },
    index: 0, // incremented for every new mState object {see newIndex()}.
    filePath: {},
    local_storage: {
        enabled: true,
    }
};

function minInArr(arr)
{
    var smallest = arr[0];
    for (var i=1; i<arr.length; i++) {
        if (parseInt(arr[i],10) < smallest) {
            smallest = arr[i];
        }
    }
    return smallest;
}

function maxInArr(arr)
{
    var smallest = arr[0];
    for (var i=1; i<arr.length; i++) {
        if (parseInt(arr[i],10) > smallest) {
            smallest = arr[i];
        }
    }
    return smallest;
}

function extractNumbersFromProductName(str,minMax)
{
    digits = ["1","2","3","4","5","6","7","8","9","0","."];
    var i = 0; var lock = false; var miss = 0;
    str_builder = "";
    arr = [];
    while (i < str.length) {
        if (digits.includes(str[i])) {
            str_builder = str_builder + str[i];
            lock = true;
        } else {
            miss = miss +1;
            if (lock) {
                if (miss >= 1) {
                    miss = 0;
                    lock = false
                    arr.push(Number(str_builder));
                    str_builder = "";
                }
            }
        }
        i++;
    }
    return (minMax == 'max') ? maxInArr(arr) : minInArr(arr);
}
//trims empty mState objects that accumulate on deletion
function mStateTrim()
{
    newArr = sqftFL.mState.filter((a) => a);
    sqftFL.mState = newArr;
}

function countState()
{
    // -1 for empty item at index 0;
    return sqftFL.mState.length;
}

// function newIndex(){
//     sqftFL.index = sqftFL.index +1;
//     return sqftFL.index;
// }

//As mState objects get deleted, the Selector index c_lxw_<index> will increase sqftFL.index keeps track of the current number
function newIndex()
{
    if (sqftFL.mState.length > 0) {
        sqftFL.index = getLast_mState().index + 1;
    } else {
        // sqftFL.index = sqftFL.mState[sqftFL.mState.length].index + 1;
        sqftFL.index = 1
    }
    return sqftFL.index;
}

function getLastElement()
{
    return sqftFL.mState[sqftFL.mState.length -1].type;
    
}


function newState(e, init=false)
{
    watchMeasurementLabels();
    if (init === "true") { // if data exists in mState
        var index = newIndex();// The Selector index used in (ex. c_lxw_<index>) will increment as new mState objects are added. Since the mState objects get saved in history for undo/redo functionality, the most recent sqftFL.mState[key].index count is stored in sqftFL.index.
        var input = sqftFL.history.lastAddedElement;
        state =  {
            index: index,
            type: input,
            inputSelector: "",
            labelSelector: "",
            labelText: "Measurement",
            lxwId: 'c_lxw-'+index,
            areaId: 'c_area-'+index,
            area: "",
            // _length: "",
            // _width: "",
            _length: {
                feet: "",
                inch: "",
            },
            _width: {
                feet: "",
                inch: "",
            },
            exists: true,
        };
        sqftFL.mState[index] = state;
        sqftFL.mState[index].selector = '#c_'+sqftFL.mState[index].type+'-'+index;
        sqftFL.mState[index].labelSelector = '#c_'+sqftFL.mState[index].type+'-'+index+'[data-label-index] label [data-label-text]',
        buildForm();
        return;
    } else {
        var index = newIndex();
        var input = getInputType(e);
        state =  {
            index: index,
            type: input,
            inputSelector: "",
            labelSelector: "",
            labelText: "Measurement",
            lxwId: 'c_lxw-'+index,
            areaId: 'c_area-'+index,
            area: "",
            // _length: "",
            // _width: "",
            _length: {
                feet: "",
                inch: "",
            },
            _width: {
                feet: "",
                inch: "",
            },
            exists: true,
        };
    
        addLastElement(input);
        sqftFL.mState[index] = state;
        sqftFL.mState[index].selector = '#c_'+sqftFL.mState[index].type+'-'+index;
        sqftFL.mState[index].labelSelector = '#c_'+sqftFL.mState[index].type+'-'+index+'[data-label-index] label [data-label-text]',
        buildForm();
        autoFocus();
        return;
    }
}

function getInputType(e)
{
    //retrieves the last element from history (length,width,or area)
    var input = e.getAttribute("data-input-name");
    if (input == "addLast") {
        input = sqftFL.history.lastAddedElement;
    }
    return input;
}

function addLastElement(inputType)
{
    sqftFL.history.lastAddedElement = inputType;
}

function buildPriceView()
{
    if (preData.sqftPrice == 0) {
        preData.sqftPrice =  Number(preData.boxPrice / preData.sqftInBox).toFixed(2);
    }

    var priceViewHtml = `<div class="j_ j_row" style="height:.8em"><div class="j_ j_col-6"></div><div class="j_ j_col-6" style="font-size:.5em;font-weight:400">Covers ${preData.sqftInBox} sq. ft.</div></div><div id="c_priceView" class="j_ j_row"><div class="j_ j_col-6"><div class="j_ ">\$${preData.sqftPrice}<span style="font-size:.5em;font-weight:400"> /sq. ft.</span></div></div><div class="j_  j_col-6 " style="border-left:solid 1px grey"><div class="j_ ">&nbsp;\$${preData.boxPrice}<span style="font-size:.5em;font-weight:400"> /case</span></div></div></div>`;
    
    // document.querySelector("#customPriceArea").innerHTML = priceViewHtml;
    document.querySelector("#maincontent > div.columns > div > div.product-info-main .price").innerHTML = priceViewHtml;
    var priceViewElem = document.getElementById("c_priceView");
    (Number(preData.boxPrice) > 100) ? priceViewElem.classList.add("smaller-price-view") : false;
}

function buildForm()
{
    
    var mStateCount = countState();
    // check for empty state to display empty form
    if (mStateCount == null || mStateCount < 1) {
        mStateCount = 1;
        newState("no_event","true")
    }
    var html = "";
    i = 1;
    count = 1;
    for (var i in sqftFL.mState) {
        if (typeof sqftFL.mState[i].type !== 'undefined') {
            if (sqftFL.mState[i].type == "lxw") {
                html += `<div id="${sqftFL.mState[i].lxwId}" class="j_ j_row" data-label-index="${sqftFL.mState[i].index}"><label class="j_"><b contenteditable="true"><span data-label-text="${sqftFL.mState[i].index}">${sqftFL.mState[i].labelText}</span> ${count}</b></label>
                <div class="j_ j_row">
                    <div class="j_ j_col-5 j_d-flex j_justify-content-center j_small j_m-0">Length</div>
                    <div class="j_ j_col-5 j_d-flex j_justify-content-center j_small j_m-0">Width</div>
                </div>
                <div class="j_ j_col-3 j_mb-3" data-sqfl-col="1">
                 <!--<label>Length</label>--!>
                 <div class="j_ j_input-group">
                    <input type="tel" pattern="\d*"  class="j_ j_form-control j_sqftCalc" min="1" max="99999" pattern="\d*" value="${sqftFL.mState[i]._length.feet}"  onChange="onInputChange(this)" data-rm-index="${sqftFL.mState[i].index}" data-input-name="length" data-submit-by="onChangeLength" data-sqfl-input="feet" data-sqfl-parent-id="${sqftFL.mState[i].lxwId}" placeholder="12'" onClick="clearValidationUIWarnings(this);"/>
                    <div class="j_ j_input-group-text" data-sqfl-label="ft"><span class="j_ " data-sqfl-labelspan="ft">ft.</span></div>
                 </div>
                </div>

              
            
                <div class="j_ j_col-2 j_mb-3" data-sqfl-col="2">
                 <!--<label>Length</label>--!>
                 <div class="j_ j_input-group">
                    <input type="tel" pattern="\d*"  class="j_ j_form-control j_sqftCalc  j_d-xs-px-0"  min="1" max="99999" pattern="\d*" value="${sqftFL.mState[i]._length.inch}"  onChange="onInputChange(this)" data-rm-index=${sqftFL.mState[i].index} data-input-name="length" data-submit-by="onChangeLength" data-sqfl-input="inch" data-sqfl-parent-id="${sqftFL.mState[i].lxwId}" placeholder='0"' onClick="clearValidationUIWarnings(this);"/>
                    <div class="j_ j_input-group-text" data-sqfl-label="in"><span class="j_ " data-sqfl-labelspan="in">in.</span></div>
                 </div>
                </div>
              
              
                <div class="j_ j_col-3 j_mb-3" data-sqfl-col="3">
                 <!--<label>Width</label>--!>
                 <div class="j_ j_input-group">
                    <input type="tel" pattern="\d*"  class="j_ j_form-control j_sqftCalc" min="1" max="99999" pattern="\d*" value="${sqftFL.mState[i]._width.feet}" data-rm-index="${sqftFL.mState[i].index}" data-input-name="width" onChange="onInputChange(this)" data-submit-by="onChangeWidth" data-sqfl-input="feet" data-sqfl-parent-id="${sqftFL.mState[i].lxwId}" placeholder="12'" onClick="clearValidationUIWarnings(this);"/>
                    <div class="j_ j_input-group-text" data-sqfl-label="ft"><span class="j_ " data-sqfl-labelspan="ft">ft.</span></div>
                 </div>
                </div>
              
            
                <div class="j_ j_col-2 j_mb-3" data-sqfl-col="4">
                 <!--<label>Width</label>--!>
                 <div class="j_ j_input-group">
                    <input type="tel" pattern="\d*"  class="j_ j_form-control j_sqftCalc j_d-xs-px-0" min="1" max="99999" pattern="\d*" value="${sqftFL.mState[i]._width.inch}" data-rm-index="${sqftFL.mState[i].index}" data-input-name="width" onChange="onInputChange(this)" data-submit-by="onChangeWidth" data-sqfl-input="inch" data-sqfl-parent-id="${sqftFL.mState[i].lxwId}" placeholder='0"' onClick="clearValidationUIWarnings(this);"/>
                    <div class="j_ j_input-group-text" data-sqfl-label="in"><span class="j_ " data-sqfl-labelspan="in">in.</span></div>
                 </div>
                </div>

                  <div class="j_ j_col  j_m-auto" style="mawidth:>
                     <div data-sqfl-icon="remove" onClick="rmMeasurement(this)" data-rm-index="${sqftFL.mState[i].index}" data-rm-domElementId="${sqftFL.mState[i].lxwId}">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ff0000" class="j_ bi bi-x-lg" viewBox="0 0 16 16">
                   <path d="M1.293 1.293a1 1 0 0 1 1.414 0L8 6.586l5.293-5.293a1 1 0 1 1 1.414 1.414L9.414 8l5.293 5.293a1 1 0 0 1-1.414 1.414L8 9.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L6.586 8 1.293 2.707a1 1 0 0 1 0-1.414z"></path>
                </svg>
                     </div>
                  </div>
                </div>`;
            } else if (sqftFL.mState[i].type == "area") {
                html += `<div id="${sqftFL.mState[i].areaId}" class="j_ j_row" data-label-index="${sqftFL.mState[i].index}">
                <label><b contenteditable="true"><span data-label-text="${sqftFL.mState[i].index}">${sqftFL.mState[i].labelText}</span> ${count}</b></label>
                <div class="j_ j_col-5 j_mb-3">
                <label>Area</label>
                <div class="j_ j_input-group">
                <input type="tel" pattern="\d*" class="j_ j_form-control j_sqftCalc" min="1" max="99999" pattern="\d*" data-rm-index="${sqftFL.mState[i].index}" value="${sqftFL.mState[i].area}" onChange="onInputChange(this)" data-input-name="area" data-submit-by="onChangeArea" data-sqfl-input="area" data-sqfl-parent-id="${sqftFL.mState[i].areaId}" placeholder="485'" onClick="clearValidationUIWarnings(this);"/>
                <div class="j_ j_input-group-text" data-sqfl-label="sqft"><span class="j_ " data-sqfl-labelspan="sqft">sq. ft.</span></div>
                </div>
                </div>
                <div class="j_ j_col j_m-auto">
                 <div data-sqfl-icon="remove" onClick="rmMeasurement(this)" data-rm-index=${sqftFL.mState[i].index} data-rm-domElementId="${sqftFL.mState[i].areaId}">
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ff0000" class="j_ bi bi-x-lg" viewBox="0 0 16 16">
                   <path d="M1.293 1.293a1 1 0 0 1 1.414 0L8 6.586l5.293-5.293a1 1 0 1 1 1.414 1.414L9.414 8l5.293 5.293a1 1 0 0 1-1.414 1.414L8 9.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L6.586 8 1.293 2.707a1 1 0 0 1 0-1.414z"></path>
                </svg>
                </div>
                <div id="c_mode-area-container-end"></div>
                </div>
                </div>`;
            }
        }
        count++;
    }
    sqftFL.formBody.innerHTML = html;
}

function buildResult()
{
    if (sqftFL.resultData.percentToggled) {
        
        var htmlResult1 = `<div id="j_estimate" class="j_ j_border j_border-secondary j_p-3 j_mb-4">
                            <div class="j_ j_row ">
                                <div class="j_ j_col-6"><h2 class="j_ j_my-0 j_d-flex j_justify-content-center" id="j_est-cases">${sqftFL.resultData.percent10.cases} Cases</h2><span class="j_ j_d-flex j_justify-content-center j_mb-2" id="j_est-casesSqft">Covers ${sqftFL.resultData.percent10.covers} sq. ft.</span></div>
                                <div class="j_ j_col-6"><h2 class="j_ j_my-0 j_d-flex j_justify-content-center" id="j_est-price">\$${sqftFL.resultData.percent10.estimatedCost}</h2><span class="j_ j_d-flex j_justify-content-center j_mb-2">Estimated Total</span></div>
                            </div>
                            <div class="j_ j_row j_d-flex j_justify-content-center j_border j_border-start-0 j_border-end-0 j_border-muted" id="j_est-area">Your Calculated Area is ${sqftFL.resultData.percent10.calculatedSqft} sq.ft</div>
                            <div class="j_ j_row">
                            <div class="j_ j_col-12 j_form-check j_form-switch j_d-flex j_justify-content-center j_mt-1">
              <input class="j_ j_form-check-input" type="checkbox" id="toggle10Percent" style="width:25px;height:1em;" onclick="toggle10Percent()" checked>
              <label class="j_ j_form-check-label" for="toggle10Percent" >Add an additonal 10% in case of potential waste</label>
            </div>
                </div>
                        </div>`;
        sqftFL.resultBody.innerHTML = htmlResult1;
    } else {
        var htmlResult2 = `<div id="j_estimate" class="j_ j_border j_border-secondary j_p-3 j_mb-4">
                            <div class="j_ j_row ">
                                <div class="j_ j_col-6"><h2 class="j_ j_my-0 j_d-flex j_justify-content-center" id="j_est-cases">${sqftFL.resultData.cases} Cases</h2><span class="j_ j_d-flex j_justify-content-center j_mb-2" id="j_est-casesSqft">Covers ${sqftFL.resultData.covers} sq. ft.</span></div>
                                <div class="j_ j_col-6"><h2 class="j_ j_my-0 j_d-flex j_justify-content-center" id="j_est-price">\$${sqftFL.resultData.estimatedCost}</h2><span class="j_ j_d-flex j_justify-content-center j_mb-2">Estimated Total</span></div>
                            </div>
                            <div class="j_ j_row j_d-flex j_justify-content-center j_border j_border-start-0 j_border-end-0 j_border-muted" id="j_est-area">Your Calculated Area is ${sqftFL.resultData.calculatedSqft} sq.ft</div>
                            <div class="j_ j_row">
                            <div class="j_ j_col-12 j_form-check j_form-switch j_d-flex j_justify-content-center j_mt-1">
              <input class="j_ j_form-check-input" type="checkbox" id="toggle10Percent" style="width:25px;height:1em;" onclick="toggle10Percent()">
              <label class="j_ j_form-check-label" for="toggle10Percent">Add an additonal 10% in case of potential waste</label>
            </div>
                </div>
                    </div>`;
        sqftFL.resultBody.innerHTML = htmlResult2;
    }
}

function forceQtyChangeResultBuild()
{
    //check if qty is enough Again
    if (parseInt(sqftFL.forcedQtyChange.covers) < parseInt(sqftFL.resultData.calculatedSqft)) {
        sqftFL.forcedQtyChange.notEnoughMsgTriggered = true;
    } else {
        sqftFL.forcedQtyChange.notEnoughMsgTriggered = false;
    }
        var notEnoughQtyMsg = (sqftFL.forcedQtyChange.notEnoughMsgTriggered) ? '<div style="color:red" class="j_ j_row j_d-flex j_justify-content-center">The quantity you have selected will not be enough!</div>' : '';
        var htmlResult = "";
        htmlResultForcedQty = `<div id="j_estimate" class="j_ j_border j_border-secondary j_p-3 j_mb-4">
                            <div class="j_ j_row j_col-12">
                                <div class="j_ j_col-6"><h2 class="j_ j_my-0 j_d-flex j_justify-content-center" id="j_est-cases">${sqftFL.forcedQtyChange.cases} Cases</h2><span class="j_ j_d-flex j_justify-content-center j_mb-2" id="j_est-casesSqft">Covers ${sqftFL.forcedQtyChange.covers} sq. ft.</span></div>
                                <div class="j_ j_col-6"><h2 class="j_ j_my-0 j_d-flex j_justify-content-center" id="j_est-price">\$${sqftFL.forcedQtyChange.estimatedCost}</h2><span class="j_ j_d-flex j_justify-content-center j_mb-2">Estimated Total</span></div>
                            </div>
                            <div class="j_ j_row j_d-flex j_justify-content-center j_border j_border-start-0 j_border-end-0 j_border-muted" id="j_est-area">${notEnoughQtyMsg}Your Calculated Area is ${sqftFL.resultData.calculatedSqft} sq.ft</div>
                            <div class="j_ j_row">
                            <div class="j_ j_col-12 j_form-check j_form-switch j_d-flex j_justify-content-center j_mt-1">
              <input class="j_ j_form-check-input" type="checkbox" id="toggle10Percent" style="width:25px;height:1em;" onclick="toggle10Percent()" ${shouldToggle10PercentBeDisabled()}>
              <label class="j_ j_form-check-label" for="toggle10Percent">Add an additonal 10% in case of potential waste</label>
            </div>
                </div>
                        </div>`;
        sqftFL.resultBody.innerHTML = htmlResultForcedQty;
}

function rmItem(index)
{
    newArray = [];
    for (var key in sqftFL.mState) {
        if (sqftFL.mState[key].index) {
            if (sqftFL.mState[key].index != index) {
                newArray.push(sqftFL.mState[key]);
            }
        }
    }
    sqftFL.mState = newArray;
}

function rmMeasurement(e)
{
    mStateTrim();
    var index = e.getAttribute("data-rm-index");
    var id = e.getAttribute("data-rm-domElementId");
    document.getElementById(id).remove();
    rmItem(index);
    if (ifAnyMeasurementsExists()) {
        syncData();
    } else {
        resetView();
    }
}

function ifAnyMeasurementsExists()
{
    mStateTrim();
    if (sqftFL.mState.length > 0) {
        return true;
    } else {
        return false;
    }
}

function resetView()
{
    sqftFL.resultBody.innerHTML = "";
    newState(false, init="true");
}

function onInputChange(e)
{
    var index = e.getAttribute("data-rm-index");
    var input = e.getAttribute("data-input-name");
    var submitBy =  e.getAttribute("data-submit-by");
    sqftFL.history.lastSubmitBy = submitBy;
    var attribute = "";
    var inputType = "";
    if (input == "length") {
        attribute = "_length";
        inputType = e.getAttribute("data-sqfl-input");
    } else if (input == "width") {
        attribute = "_width";
        inputType = e.getAttribute("data-sqfl-input");
    } else if (input == "area") {
        attribute = "area";
        attribute = 'area';
    }
    updateData(index,attribute, e.value, inputType);

    syncData();
}

function shouldToggle10PercentBeDisabled()
{
    return (sqftFL.forcedQtyChange.notEnoughMsgTriggered) ? 'disabled' : "";
}

function updateData(index, attribute, value, nestedAttribute)
{
    // nestedAttribute is feet or inch
    for (var key in sqftFL.mState) {
        if (sqftFL.mState[key].index == index) {
            if (attribute != 'area') { //if this is length or width then add value of feet or inch
                sqftFL.mState[key][attribute][nestedAttribute] = value;
            } else {
                sqftFL.mState[key][attribute] = value; //else add value of area
            }
        }
    }
}

function onQtyChange(e)
{
    updateResultDataFromForcedQtyChange(e.value); // Function in math.js
    forceQtyChangeResultBuild();
}

function getQty()
{
    return document.getElementById('qty').value;
}

function toggle10Percent(reset=false)
{
    if (sqftFL.resultData.percentToggled) {
        sqftFL.resultData.percentToggled = false;
        syncData();
    } else {
        sqftFL.resultData.percentToggled = true;
        syncData();
    }
    if (reset) {
        sqftFL.resultData.percentToggled = false;
    }
    syncData(true,true);
    saveLocalStorageOrCookies(); // force saves, syncData will not if state is the same.
}

function getLast_mState()
{
    return sqftFL.mState[sqftFL.mState.length -1];
}

function getLastHistory_mState()
{
    return sqftFL.history.mState[sqftFL.history.mState.length - 1];
}

function autoFocus()
{

    var last = sqftFL.mState[sqftFL.mState.length -1];
    if (last.type === "area") {
        document.querySelector(`#${last.areaId} [data-sqfl-input]`).focus();
    } else if (last.type === "lxw") {
        document.querySelector(`#${last.lxwId} [data-sqfl-input=feet][data-input-name=length]`).focus();
    }
}

function copyObject(object)
{
    return JSON.parse(JSON.stringify(object));
}

function recordHistory()
{
        var resultDataCopy = JSON.parse(JSON.stringify(sqftFL.resultData));
        var mStateCopy = JSON.parse(JSON.stringify(sqftFL.mState));
        sqftFL.history.resultData.push(resultDataCopy);
        sqftFL.history.mState.push(mStateCopy);
}

function redoIsPossible()
{
    return (sqftFL.history.position < (sqftFL.history.mState.length -1)) ? true : false;
}

function undoIsPossible()
{
    //position starts at 0 because it references the history.mState[index]
    return (sqftFL.history.position > 0) ? true : false;
}

/**
 * Does not incriment by reference
 * param {integer} property - number to increment
 * returns {number} value
 */
function increment(property)
{
    return Number(property + 1);
}

/**
 * Does not decriment by reference
 * param {integer} property - number to decrement
 * returns {number} value
 */
function decrement(property)
{
    return Number(property - 1);
}

function undo()
{
    if (undoIsPossible()) {
        //decrement position
        sqftFL.history.position = decrement(sqftFL.history.position);
        //update mState
        sqftFL.mState = sqftFL.history.mState[sqftFL.history.position];
        // current resultData is now set to sqftFL.history.resultData[position]
        sqftFL.resultData =  sqftFL.history.resultData[sqftFL.history.position];
        syncData(recordingHistory=false);
    }
}

function redo()
{
    if (redoIsPossible()) {
        //increment position
        sqftFL.history.position = increment(sqftFL.history.position);
        //update mState
        sqftFL.mState = sqftFL.history.mState[sqftFL.history.position];
        // current resultData is now set to sqftFL.history.resultData[position]
        sqftFL.resultData =  sqftFL.history.resultData[sqftFL.history.position];
        // syncData(recordingHistory=false);
        syncData(recordingHistory=false);
    }
}
/**
 * check if any 2 or more objects match.
 *
 * @param  {object} any number of objects.
 * @return {bool} returns true if objects are different.
 */
function diffObjects()
{
    var i = 0;
    var isDiff = true;
    while (i < arguments.length) {
        arguments[i] = JSON.stringify(arguments[i]);
        if (i < arguments.length) {
            arguments[i+1] = JSON.stringify(arguments[i+1]);
            if (arguments[i] == arguments[i+1]) {
                isDiff = false;
            }
        }
        i++;
    }
    return isDiff;
}

/**
 * Checks if last pushed mState object in history is different than current mState object to prevent writing it twice.
 *
 * @param  {callback} will execute if objects are different.
 * @return {bool} returns false if callback is not executed.
 */
function ifHistoryChanges(callbackTrue, callbackFalse)
{
    if (callbackFalse == null) {
        callbackFalse = function () {};
    } // compare saved history object with mState object for edits
    return diffObjects(sqftFL.history.mState[sqftFL.history.position],sqftFL.mState) ? callbackTrue() : callbackFalse();
}
 
function ifResultDataChanges(callback)
{
    // compare saved history object with mState object for edits
    return diffObjects(sqftFL.history.resultData[sqftFL.history.resultData.length -1],sqftFL.resultData) ? callback() : false;
}

function ifHistoryIsNotRepeatingItself(callback)
{
    return diffObjects(getLastHistory_mState(),sqftFL.mState) ? callback() : false;
}

/**
 * Checks if localStorage is accessable
 */
function checkLocalStorage()
{
    var rand = Math.floor(Math.random() * 10000000);
    localStorage.setItem('sqfl_exist', rand);
    var local_storage_check = localStorage.getItem('sqfl_exist');
    return (local_storage_check == rand) ? true : false;
}



function rmLocalStorage()
{
    localStorage.removeItem('sqftFLHistory_');
    localStorage.removeItem('sqftFLresultData_');
    localStorage.removeItem('sqftFLmState');
    localStorage.removeItem('sqfl_exist');
}


 
function setCookie(cname, cvalue, exdays)
{
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname)
{
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function getcookiemState()
{
    var a = getCookie("sqftFLmState");
    var sqftFLmState_ = JSON.parse(a);
    var sqftFLmState = copyObject(sqftFLmState_);
    return sqftFLmState;
}

function getcookieResultData()
{
    var r = getCookie("sqftFLresultData");
    var sqftFLresultData_ = JSON.parse(r);
    var sqftFLresultData = copyObject(sqftFLresultData_);
    return sqftFLresultData;
}

function getcookieHistory()
{
    var h = getCookie("sqftFLHistory");
    var sqftFLHistory_ = JSON.parse(h);
    var sqftFLHistory = copyObject(sqftFLHistory_);
    return sqftFLHistory;
}

function getSavedLocalStorageOrCookies()
{
    
    if (sqftFL.local_storage.enabled) {
        if (localStorage.getItem('sqftFLmState') == null) {
            setInitalizerCookie();
        } else {
            sqftFL.history = JSON.parse(localStorage.getItem('sqftFLHistory_'));
            sqftFL.resultData = JSON.parse(localStorage.getItem('sqftFLresultData_'));
            sqftFL.mState = JSON.parse(localStorage.getItem('sqftFLmState'));
        }
    } else {
        hasCookies();
        //if no cookies are present, then write dummy cookie to prevent error
        sqftFL.history = getcookieHistory();
        sqftFL.resultData = getcookieResultData();
        sqftFL.mState = getcookiemState();
    }
    buildForm();// Build and not sink to bypass error validation since init dummyData is empty and will not validate.
}

function hasCookies()
{
    var cookie_mState = getCookie("sqftFLmState");
    if (cookie_mState == "") {
        setInitalizerCookie();
    }
}
/**
 * If the structure of the mState, resultData, or history
 * is changed, then adjust these by copying the storage data.
 * else, the updated functionality may not work to new users.
 */
function setInitalizerCookie()
{
    var dummyData_mState = [{"index":1,"type":"lxw","lxwId":"c_lxw-1","selector":"#c_lxw-1","labelSelector":"#c_lxw-1[data-label-index] label [data-label-text]", "labelText":"Measurement","areaId":"c_area-1","area":"","_length":{"feet":"","inch":""},"_width":{"feet":"","inch":""},"exists":true}];
    var dummyData_mStateStringify =  JSON.stringify(dummyData_mState);
    
    var dummyData_resultData = {"exists":true,"percentToggled":false,"percent10":{"calculatedSqft":1,"covers":18,"estimatedCost":"56.54","cases":1,"qty":1},"calculatedSqft":1,"covers":18,"estimatedCost":"56.54","cases":1,"qty":1};
    var dummyData_resultDataStringify = JSON.stringify(dummyData_resultData);
    
    var dummyData_history = {"exists":true,"lastAddedElement":"lxw","lastSubmitBy":"onChangeWidth","resultData":[{"exists":true,"percentToggled":false,"percent10":{"calculatedSqft":1,"covers":18,"estimatedCost":"56.54","cases":1,"qty":1},"calculatedSqft":1,"covers":18,"estimatedCost":"56.54","cases":1,"qty":1}],"mState":[[{"index":1,"type":"lxw","lxwId":"c_lxw-1","areaId":"c_area-1","selector":"#c_lxw-1","labelSelector":"#c_lxw-1[data-label-index] label [data-label-text]", "labelText":"Measurement","area":"","_length":{"feet":"","inch":""},"_width":{"feet":"","inch":""},"exists":true}]],"position":0};
    var dummyData_historyStringify = JSON.stringify(dummyData_history);
    if (sqftFL.local_storage.enabled) {
        localStorage.setItem('sqftFLHistory_',dummyData_historyStringify);
        localStorage.setItem('sqftFLresultData_',dummyData_resultDataStringify);
        localStorage.setItem('sqftFLmState',dummyData_mStateStringify);
    } else {
        setCookie("sqftFLmState",dummyData_mStateStringify,7);
        setCookie("sqftFLresultData",dummyData_resultDataStringify,7);
        setCookie("sqftFLHistory",dummyData_historyStringify,7);
    }
}

function saveLocalStorageOrCookies()
{
    var mState_ = JSON.stringify(sqftFL.mState);
    var resultData_ = JSON.stringify(sqftFL.resultData);
    var history_ = JSON.stringify(sqftFL.history);
    if (sqftFL.local_storage.enabled) {
        localStorage.setItem('sqftFLHistory_',history_);
        localStorage.setItem('sqftFLresultData_',resultData_);
        localStorage.setItem('sqftFLmState',mState_);
    } else {
        setCookie("sqftFLmState",mState_,7);
        setCookie("sqftFLresultData",resultData_,7);
        setCookie("sqftFLHistory",history_,7);
    }
}

function hasChanges()
{
    var lastState = sqftFL.history.mState[sqftFL.history.mState.length -1];
    var currentState = sqftFL.mState;
    
    var countAllLastState = 0;
    for (var key in lastState) {
        countAllLastState =
        Number(countAllLastState) +
        Number(lastState[key].area) +
        Number(lastState[key]._length.feet) +
        Number(lastState[key]._length.inch) +
        Number(lastState[key]._width.feet) +
        Number(lastState[key]._width.inch);
    }
    var countAllCurrentState = 0;
    for (var key in currentState) {
        countAllCurrentState =
        Number(countAllCurrentState) +
        Number(currentState[key].area) +
        Number(currentState[key]._length.feet) +
        Number(currentState[key]._length.inch) +
        Number(currentState[key]._width.feet) +
        Number(currentState[key]._width.inch);
    }
    if (countAllCurrentState == countAllLastState) {
        return false;
    } else {
        return true;
    }
}

function watchMeasurementLabels()
{
    mStateTrim();
    // document.querySelectorAll("#c_lxw-1[data-label-index] label")[0].innerHTML
    // for (var key in sqftFL.mState) {
    var key = 0;
    while (key < sqftFL.mState.length) {
        if (document.querySelector(sqftFL.mState[key].labelSelector) != null) {
            var labelInnerText = document.querySelector(sqftFL.mState[key].labelSelector).innerText;
            sqftFL.mState[key].labelText = labelInnerText;
            ifHistoryIsNotRepeatingItself(
                function () {
                    recordHistory();
                    sqftFL.history.position = (sqftFL.history.mState.length -1);
                    saveLocalStorageOrCookies();
                }
            );
        } else {
        }
        key++;
    }

}
    // Function to be executed on page load
document.getElementById('qty').addEventListener("change", function () {onQtyChange(this);});
sqftFL.local_storage.enabled = checkLocalStorage();
newState(false, init="true");
sqftFL.resultData.qty = getQty();
sqftFL.resultData.percent10.qty = getQty();
getSavedLocalStorageOrCookies();

/**
 * In the future, I will develop as a mixin to price.
 * Until then, this is a work around for the original price html
 * overwriting the custom priceView.
 */
setTimeout(function () { buildPriceView(); }, 200);
setTimeout(function () { buildPriceView(); }, 1000);
setTimeout(function () { buildPriceView(); }, 3000);
setTimeout(function () { buildPriceView(); }, 5000);
setTimeout(function () { buildPriceView(); }, 10000);
setTimeout(function () { buildPriceView(); }, 20000);
setTimeout(function () { buildPriceView(); }, 30000);
setTimeout(function () { buildPriceView(); }, 60000);
setTimeout(function () { buildPriceView(); }, 120000);