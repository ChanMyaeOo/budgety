// BUDGET CONTROLLER
let budgetController = (function(){
    // Some code
})();


// UI CONTROLLER
let UIController = (function(){
    //some code
})();


// GLOBAL APP CONTROLLER
let controller = (function(budgetCtrl, UICtrl){

    
    let ctrlAddItem = function(){

        // 1. Get input field values

        // 2. Add to budget controller

        // 3. Add to UI

        // 4. Calculate budget

        // 5. Update UI

        console.log('It works.');
    }
    document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(event){
        if(event.keyCode === 13 || event.which === 13){
            ctrlAddItem();
        }
        
    });
})(budgetController, UIController);