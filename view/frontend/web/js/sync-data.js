/*                               '||''|.             .
 ....  .... ... .. ...     ....   ||   ||   ....   .||.   ....
||. '   '|.  |   ||  ||  .|   ''  ||    || '' .||   ||   '' .||
. '|..   '|.|    ||  ||  ||       ||    || .|' ||   ||   .|' ||
|'..|'    '|    .||. ||.  '|...' .||...|'  '|..'|'  '|.' '|..'|'
       ..  |
        ''
*/

/**
 * Synchronizes data of mState,resultData,  and mState.history objects
 * Updates cookie storage and updates UI.
 *
 * @param {bool} recordingHistory set to false will disable the recordHistory
 */
function syncData(recordingHistory=true,toggled10Percent=false)
{
    if (!formErrors()) { //Synchronizing data objects.
        updateResultData();
        recordingHistory ? watchMeasurementLabels() : false;
        buildForm();
        buildResult();
        if (recordingHistory) {
            if (toggled10Percent) { //store to localstorage but dont sync.
                saveLocalStorageOrCookies();
            } else if (hasChanges()) { //Update cookie storage with updated changes.
                recordHistory();
                sqftFL.history.position = (sqftFL.history.mState.length -1);
                saveLocalStorageOrCookies();
            } else {
                ifHistoryChanges(
                    function () {
                        recordHistory();
                        sqftFL.history.position = (sqftFL.history.mState.length -1);
                        saveLocalStorageOrCookies();
                    }
                )
                //No changes made to update.
            }

        }
    } // Synchronized!
}

/**
 * Validates inputs and changes UI to inform user of invalid input values.
 *
 * @param  {string} inputValue
 * @return {bool} returns true if string has invalid characters.
 */
function hasInvalidCharacters(inputValue)
{
    var allowedChars = ["0","1","2","3","4","5","6","7","8","9","0",""]; // "" is valid for inches
    var i = 0;
    if (inputValue.length > 0) {
        var inputValueAsChars = inputValue.split("");
        while (i < inputValueAsChars.length) {
            if (!allowedChars.includes(inputValueAsChars[i])) {
                return true;
            }
            i++;
        }
    } else {
        return false;
    }
}

function isEmpty(mStateObjectValue)
{
    if (mStateObjectValue == "" |        mStateObjectValue == null |        mStateObjectValue < 1
    ) {
        return true;
    } else {
        return false;
    }
}

/**
 * Temporily clears user validation warnings when they click on its input.
 */
function clearValidationUIWarnings(e)
{
    e.classList.remove("form-validation-error-triggered");
}

function addValidationErrorTriggerdClass(selector,inchOrFeetOrArea,lengthOrWidthOrArea)
{
    var inputElement = document.querySelector(`${selector} [data-sqfl-input=${inchOrFeetOrArea}][data-input-name=${lengthOrWidthOrArea}]`);
    inputElement.classList.add("form-validation-error-triggered");
}

/**
 * Validates inputs and changes UI to inform user of invalid input values.
 *
 * @return {bool} This returns if true or false if any errors were triggered.
 */
function formErrors()
{
    var errorTriggered = false; // this is the only time errorTriggered will be assigned false.
    mStateTrim();
    for (var key in sqftFL.mState) { //For all items (form rows) in mState object, validate all applicable input values.
        
        var selector = sqftFL.mState[key].selector;
        if (sqftFL.mState[key].type == "lxw") { // Check all length and width inputs
            var lengthOrWidthOrArea = sqftFL.mState[key].type;
            /**
            * Checks for Invalid Characters
            */
            if (typeof sqftFL.mState[key].index != "undefined") {
                 
                if (hasInvalidCharacters(sqftFL.mState[key]._length.feet) || isEmpty(sqftFL.mState[key]._length.feet)) {
                        errorTriggered = true;
                        addValidationErrorTriggerdClass(selector,"feet","length");
                }
                if (hasInvalidCharacters(sqftFL.mState[key]._width.feet) || isEmpty(sqftFL.mState[key]._width.feet)) {
                        errorTriggered = true;
                        addValidationErrorTriggerdClass(selector,"feet","width");
                }
                if (hasInvalidCharacters(sqftFL.mState[key]._width.inch)) {
                        errorTriggered = true;
                        addValidationErrorTriggerdClass(selector,"inch","width");
                }
                if (hasInvalidCharacters(sqftFL.mState[key]._length.inch)) {
                        errorTriggered = true;
                        addValidationErrorTriggerdClass(selector,"inch","length");
                }
                if (isEmpty(sqftFL.mState[key]._width.inch)) { // inch input is assigned 0 if empty, and does not trigger an error.
                    sqftFL.mState[key]._width.inch = 0;
                }
                if (isEmpty(sqftFL.mState[key]._length.inch)) { // inch input is assigned 0 if empty, and does not trigger an error.
                    sqftFL.mState[key]._length.inch = 0;
                }
            }
        } else {
            if (sqftFL.mState[key].type == "area") {
                if (typeof sqftFL.mState[key].index != "undefined") {
                    if (hasInvalidCharacters(sqftFL.mState[key].area) || isEmpty(sqftFL.mState[key].area)) {
                            errorTriggered = true;
                            addValidationErrorTriggerdClass(selector,"area","area");
                    }
                }
            }
        }
    }
    return errorTriggered;
}
