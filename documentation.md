# Required
Products **must** have attributes `Package Container ID` and `Package Container QTY`.
These attributes **must** be written on the plank or sq. ft. unit price product.

`Package Container ID`: points to the boxed package container item.

 `Package Container QTY`: is how many sq. ft. comes in the boxed package container item.
 
 -------------------------

Important Variables to Know.
 -------------------------

The `m` in `mState` means measurement.

`sqftFL.mState`: is the current state *(by pressing undo and redo, the current state changes).*
 
 -------------------------
 
 `resultData`: is the resulting calculated data of the current mState *(current state)*, so 
(press undo and the current state changes, and the sqftFL.resultData will change with it, by **position**).
 
 -------------------------
 
 `history.position`: is the Head/pointer of the undo/redo functionality. It points to history.mState.
 
`sqftFL.history.mState[sqftFL.history.position]` is the same as sqftFL.mState
 
 -------------------------
 
 `sqftFL.index`: is used for the dynamic Id's of the user generated area and LxW input fields.
 
 ------------------------- 
 
 # Mftf
 **Must set the page to test in CalculationAccuracyData.xml**
` <data key="productPage">test-page</data>`
 