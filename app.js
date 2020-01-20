// BUDGET CONTROLLER
let budgetController = (function(){
    let Expences = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    }

    let Incomes = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    }

    let data = {
        allItems: {
            exp: [],
            inc: []
        },

        totals: {
            exp: 0,
            inc: 0
        }
    }

    return{
        newItem: function(type, des, val){
            let newItem,id;

            // Create ID for new item
            if(data.allItems[type].length > 0){
                id = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }
            else{
                id = 0;
            }
            
            // Create new item based on 'exp' or 'inc'
            if(type === 'exp'){
                newItem = new Expences(id, des, val);
            }
            else if(type === 'inc'){
                newItem = new Incomes(id, des, val);
            }

            // Push new item to data
            data.allItems[type].push(newItem);

            // Return new item
            return newItem;
        },
        testing: function(){
            return data;
        }
    }
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
        let input, newItem;
        // 1. Get input field values
        input = UICtrl.getInput();

        // 2. Add to budget controller
        newItem = budgetCtrl.newItem(input.type, input.description, input.value);

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