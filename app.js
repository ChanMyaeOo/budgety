// BUDGET CONTROLLER
let budgetController = (function(){
    // Some code
})();


// UI CONTROLLER
let UIController = (function(){

    let DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
    }

   return{
       getInput: function(){
            return{
                type: document.querySelector(DOMstrings.inputType).value,   // either inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            }
       },
       getDOMstrings: function(){
           return DOMstrings;
       }
   }
})();


// GLOBAL APP CONTROLLER
let controller = (function(budgetCtrl, UICtrl){

    function setUpEventListener(){
        let DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event){
            if(event.keyCode === 13 || event.which === 13){
                ctrlAddItem();
            }
            
        });    
    }
    
   
    
    let ctrlAddItem = function(){

        // 1. Get input field values
        console.log(UICtrl.getInput());

        // 2. Add to budget controller

        // 3. Add to UI

        // 4. Calculate budget

        // 5. Update UI

        // console.log('It works.');
    }

    return{
        init: function(){
            return setUpEventListener();
        }
    }
    
})(budgetController, UIController);

controller.init();