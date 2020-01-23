// BUDGET CONTROLLER
let budgetController = (function(){
    let Expences = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    }

    Expences.prototype.calcPercentage = function(totalIncome){
        if(totalIncome > 0){
            this.percentage = Math.round((this.value / totalIncome) * 100);
        }
        else{
            this.percentage = -1
        }
    }


    Expences.prototype.getPercentages = function(){
        return this.percentage;
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

    let calculateTotal = function(type){
        let sum = 0;
        data.allItems[type].forEach(function(cur){
            sum += cur.value;
        });

        data.totals[type] = sum;
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

        deleteItem: function(type, id){
            let ids, index;
            ids = data.allItems[type].map(function(current){
                return current.id;
            });
            index = ids.indexOf(id);
            if(index !== -1){
                data.allItems[type].splice(index, 1);
            }
        },

        calculateBudget: function(){
            // Calculate total incomes and expences

            calculateTotal('inc');
            calculateTotal('exp');
           

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

        calculatePercentages: function(){
            data.allItems.exp.forEach(function(cur){
                cur.calcPercentage(data.totals.inc);
            });
        },

        getPercentages: function(){
            let allPercs;
            allPercs = data.allItems.exp.map(function(cur){
                return cur.percentage;
            });
            return allPercs;
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
        expencesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expencesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };

    let formatNumber = function(num, type){
        let numSplit, int, dec;
        /* 
            add + or - for inc and exp  ---> + 1000 or - 1000
            format decimal 2 points ---> + 1000.00 or - 1000.00
            seperate , for thousands    --->  + 1,000.00 or - 1,000.00
        */

        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');
        
        int = numSplit[0];
        if(int > 0){
            int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }
        dec = numSplit[1];

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
    };

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
                html =  '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            else if(type === 'exp'){
                element = DOMstrings.expencesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            
            // Replace placeholder text
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

            // Add DOM manipulation
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
       },

       deleteListItem: function(selectorID){
            let el;
            el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
       },

       clearInputFields: function(){
           let inputFields, fieldsArr;
           inputFields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);
           fieldsArr = Array.prototype.slice.call(inputFields);
           fieldsArr.forEach(function(current, index, array){
                current.value = "";
           });
           fieldsArr[0].focus();
       },

       showBudgetLabel: function(obj){
            let type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
            
            if(obj.percentage > 0){
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            }
            else{
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
       },

       displayPercentages: function(percentages){
            let fields = document.querySelectorAll(DOMstrings.expencesPercLabel);

            // Custom ForEach function for NodeList
            let nodeListForEach = function(list, callback){
                for(let i = 0; i < list.length; i++){
                    callback(list[i], i);
                }
            }

            nodeListForEach(fields, function(current, index){
                if(percentages[index] > 0){
                    current.textContent = percentages[index] + '%';
                }
                else{
                    current.textContent = '---';
                }
            });
       },

       displayDate: function(){
            let now, year, month, months;
            now = new Date();
            year = now.getFullYear();
            month = now.getMonth();
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year + ' ';
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

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    }
    
   
    let updateBudget = function(){

        // 1. Calculate budget
        budgetCtrl.calculateBudget();

        // Get Budget
        let budget = budgetCtrl.getBudget();

        // 2. Update UI    
        UICtrl.showBudgetLabel(budget);
    }

    let updatePercentages = function(){
        // Calculate percentage
        budgetCtrl.calculatePercentages();

        // Return Percentage
        let percentages = budgetCtrl.getPercentages();

        // Add to the UI
        UICtrl.displayPercentages(percentages);
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
            updateBudget();

            // Calculate percentage
            updatePercentages();
        }
    }

    let ctrlDeleteItem = function(event){
        let itemID, splitItem, type, ID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;      // DOM traversing
        if(itemID){
            splitItem = itemID.split('-');
            type = splitItem[0];
            ID = parseInt(splitItem[1]);
            // Delete item from data structure
            budgetCtrl.deleteItem(type, ID);

            // Remove item from the UI
            UICtrl.deleteListItem(itemID);

            // Update budget label
            updateBudget();

            // Calculate percentage
            updatePercentages();
        }
        // console.log(type, ID);
       
    }

    return{
        init: function(){
            console.log('Application has started.');
            UICtrl.displayDate();
            UICtrl.showBudgetLabel(
                {
                    budget: 0,
                    totalInc: 0,
                    totalExp: 0,
                    percentage: -1
                }
            );
            return setUpEventListener();
        }
    }
    
})(budgetController, UIController);

controller.init();