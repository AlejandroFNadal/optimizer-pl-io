var solver = require('javascript-lp-solver');

let model ={
    "optimize": "profit",
    "opType": "max",
    "constraints" : {
            "tvPlana": {"max": 6000},
            "tvPlana": {"min": 3000},
            "tvLed":{"max":5000},
            "tvLed":{"min":2000},
            "estampado": {"max": 1},
            "montaje": {"max": 1}
        },
        "variables":{
                "tvPlana": {"estampado": 1/7000, "montaje": 1/5200, "profit": 1/1600, "tvPlana": 1},
                "tvLed": {"montaje": 1/6000, "montaje": 1/7000, "profit": 1/3000, "tvLed": 1}
        }
    }

console.log(solver.Solve(model,false,false));
