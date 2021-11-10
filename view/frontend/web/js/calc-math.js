/*
    ,-.-.     |    |
    | | |,---.|--- |---.
    | | |,---||    |   |
    | ' '`---^`---'`   |
*/

function casesCover()
{
    var covers = getCasesNeeded() * preData.sqftInBox;
    return covers;
}

function casesCover10Percent()
{
    var covers = getCasesNeeded10Percent() * preData.sqftInBox;
    return covers;
}

function getCasesNeeded()
{
    var sqft = 0;
    sqft = sqftFL.resultData.calculatedSqft;
    var cases = parseInt(sqft / preData.sqftInBox);
    var remainder = parseFloat(sqft % preData.sqftInBox);
    if (remainder > 0) {
        cases = cases + 1;
    }
    return cases;
}

function getCasesNeeded10Percent()
{
    var sqft = 0;
    sqft = sqftFL.resultData.percent10.calculatedSqft;
    var cases = parseInt(sqft / preData.sqftInBox);
    var remainder = parseFloat(sqft % preData.sqftInBox);
    if (remainder > 0) {
        cases = cases + 1;
    }
    return parseInt(cases);
}

function calculatedSqft()
{
    var totalSqft = 0;
    var totalInches = 0;
    var widthInches = 0;
    for (var key in sqftFL.mState) {
        if (sqftFL.mState[key].type == "area") {
            totalSqft = totalSqft + parseInt(sqftFL.mState[key].area);
        } else if (sqftFL.mState[key].type == "lxw") {
            widthInches = parseFloat(sqftFL.mState[key]._width.inch / 12).toFixed(2);
            lengthInches = parseFloat(sqftFL.mState[key]._length.inch / 12).toFixed(2);
            currentWidthFeet = Number(parseInt(sqftFL.mState[key]._width.feet));
            currentLengthFeet = Number(parseInt(sqftFL.mState[key]._length.feet));
            currentWidthInchesAsFeet = Number(parseFloat(widthInches).toFixed(2));
            currentLengthInchesAsFeet = Number(parseFloat(lengthInches).toFixed(2));
            var  currentWidthFeet = Number(currentWidthFeet + currentWidthInchesAsFeet);
            var  currentLengthFeet = Number(currentLengthFeet + currentLengthInchesAsFeet);
            var rowTotalSqft = Number(currentWidthFeet * currentLengthFeet);
            totalSqft = Number(totalSqft + rowTotalSqft);
        }
    }
    return parseInt(Number(totalSqft));
}

function calculatedSqftHistory()
{
    var totalSqft = 0;
    var mStateLastInHistory = sqftFL.history.mState[sqftFL.history.mState.length -1]
    for (var key in mStateLastInHistory) {
        if (mStateLastInHistory[key].type == "area") {
            totalSqft = totalSqft + parseInt(mStateLastInHistory[key].area);
        } else if (mStateLastInHistory[key].type == "lxw") {
            totalSqft = totalSqft + parseInt(mStateLastInHistory[key]._width.feet *mStateLastInHistory[key]._length.feet)
        }
    }
    return parseInt(totalSqft);
}

function calculatedSqft10Percent()
{
    return parseFloat(calculatedSqft()* 1.10).toFixed(2);
}

function estimateCosts()
{
    return parseFloat(sqftFL.resultData.cases * preData.boxPrice).toFixed(2);
}

function estimateCosts10Percent()
{
    return parseFloat((sqftFL.resultData.percent10.cases * preData.boxPrice)).toFixed(2);
}

function handle10percent()
{
    sqftFL.resultData.percent10.calculatedSqft  = parseInt(calculatedSqft10Percent());
    sqftFL.resultData.percent10.covers = parseInt(casesCover10Percent(sqftFL.resultData.percent10.cases));
    sqftFL.resultData.percent10.cases = parseInt(getCasesNeeded10Percent());
    sqftFL.resultData.percent10.estimatedCost = estimateCosts10Percent();
}

function updateQty()
{
    sqftFL.resultData.percent10.qty = parseInt(sqftFL.resultData.percent10.cases);
    sqftFL.resultData.qty = parseInt(sqftFL.resultData.cases);
    if (sqftFL.resultData.percentToggled) {
        document.querySelector("#qty").value = sqftFL.resultData.percent10.qty;
    } else {
        document.querySelector("#qty").value = sqftFL.resultData.qty
    }
}
function updateResultData()
{
    sqftFL.resultData.calculatedSqft  = parseInt(calculatedSqft());
    sqftFL.resultData.covers = parseInt(casesCover());
    sqftFL.resultData.cases = parseInt(getCasesNeeded(casesCover()));
    sqftFL.resultData.estimatedCost = estimateCosts();
    handle10percent(); //depends on result data  first
    updateQty();
}


function updateResultDataFromForcedQtyChange(qty)
{
    sqftFL.forcedQtyChange.triggered = true;
    forcedQtychangeEstimatedCost(qty);
    forcedQtychangeEstimatedCases(qty);
    forcedQtychangeEstimatedCovers(qty);
    compareCalculatedAreaWithForcedQtyCovers();
}

function forcedQtychangeEstimatedCost(qty)
{
    sqftFL.forcedQtyChange.estimatedCost = parseFloat(qty * preData.boxPrice).toFixed(2);
}

function forcedQtychangeEstimatedCases(qty)
{
    sqftFL.forcedQtyChange.cases = parseInt(qty);
}

function forcedQtychangeEstimatedCovers(qty)
{
    sqftFL.forcedQtyChange.covers = parseInt(qty * preData.sqftInBox);
}

function compareCalculatedAreaWithForcedQtyCovers()
{
    if (parseInt(sqftFL.forcedQtyChange.covers) < parseInt(sqftFL.resultData.calculatedSqft)) {
        sqftFL.forcedQtyChange.notEnoughMsgTriggered = true;
        return true;
    } else {
        sqftFL.forcedQtyChange.notEnoughMsgTriggered = true;
        return false;
    }
}
