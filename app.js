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
        },

        budget: 0,

        percentage: -1
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

        calculateBudget: function(type){
            // Calculate total incomes and expences
            let sum = 0;
            data.allItems[type].forEach(function(cur){
                sum += cur.value;
            });

            data.totals[type] = sum;

            // Calculate budget
            data.budget = data.totals['inc'] - data.totals['exp'];

            // Calculate percentage based on income and expences
            if(data.totals['inc'] > 0){
                data.percentage = Math.round((data.totals['exp'] / data.totals['inc']) * 100);
            }
            else{
                percentage = -1;
            }
            

            // Formula for percentage
            // inc = 200; exp = 100; percent = 50%; percentage = 100/200 = 0.5 * 100 = 50%
        },

        getBudget: function(){
            return{
                budget: data.budget,
                totalInc: data.totals['inc'],
                totalExp: data.totals['exp'],
                percentage: data.percentage
            }
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
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expencesContainer: '.expenses__list'
    }

   return{
       getInput: function(){
            return{
                type: document.querySelector(DOMstrings.inputType).value,   // either inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            }
       },
       getDOMstrings: function(){
           return DOMstrings;
       },

       addListItem: function(obj, type){
            let html, newHtml, element;

            // Create string for HTML placeholder text
            if(type === 'inc'){
                element = DOMstrings.incomeContainer;
                html =  '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            else if(type === 'exp'){
                element = DOMstrings.expencesContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            
            // Replace placeholder text
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            // Add DOM manipulation
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
       },

       clearInputFields: function(){
           let inputFields, fieldsArr;
           inputFields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);
           fieldsArr = Array.prototype.slice.call(inputFields);
           fieldsArr.forEach(function(current, index, array){
                current.value = "";
           });
           fieldsArr[0].focus();
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
    
   
    let updateBudget = function(type){
        // 1. Calculate budget
        budgetCtrl.calculateBudget(type);

        // Get Budget
        let budget = budgetCtrl.getBudget();
        // 2. Update UI    

        console.log(budget);
    }
    
    let ctrlAddItem = function(){
        let input, newItem;

        // 1. Get input field values
        input = UICtrl.getInput();

        if(input.description !== "" && !isNaN(input.value) && input.value > 0){
            // 2. Add item to budget controller
            newItem = budgetCtrl.newItem(input.type, input.description, input.value);

            // 3. Add list item to UI
            UICtrl.addListItem(newItem, input.type);

            // Clear input fields
            UICtrl.clearInputFields();

            // Calculate budget
            updateBudget(input.type);
        }
    }

    return{
        init: function(){
            return setUpEventListener();
        }
    }
    
})(budgetController, UIController);

controller.init();