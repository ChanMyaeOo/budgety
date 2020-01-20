let budgetController = (function(){
    let x = 10;
    let add = function(a){
        return x + a;
    }

    return{
        publicTest: function(b){
            return add(b);
        }
    }
})();

let UIController = (function(){
    //some code
})();

let controller = (function(budgetCtrl, UICtrl){
    let z = budgetCtrl.publicTest(25);
    return{
        publicAnother: function(){
            return z;
        }
    }
})(budgetController, UIController);