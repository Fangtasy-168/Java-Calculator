/* Jquery version of the Javascript Calculator*/
let validInputs = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "*", "/", "+", "-", "Backspace", "Enter", "Delete"]
let validNum = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."]
let validOperators = ["*", "/", "+", "-"]
let reciept = []
let log = $("#log")
let pads = $(".pad")
let clear = $("#clear")
let output = $("#display")

// Event Listners
$(document).keydown(handleKeyDown)
pads.click(handleClick)

//functions for the events 
function handleClick(event) {
    verifyInput($(event.target).attr("value"))
}
function handleKeyDown(event) {
    verifyInput(event.key)
}

// Function to only operate with Valid Inputs
let outputContext = ""
function verifyInput(input) {
    console.log(input)
    let negativeNumber = /^-?(?!00)[0-9]*\.{0,1}[0-9]*$/
    let positiveNumber = /^(?!00)[0-9]*\.{0,1}[0-9]*$/
    if (validNum.includes(input) && !reciept.includes("=")) {
        console.log("valid-input")
        if ((output.text() + input).length < 14) {
            if (positiveNumber.test(outputContext + input)) {
                outputContext += input
                console.log("Enter Positive values")
            }
            else if (validOperators.includes(outputContext) && !validOperators.includes(reciept[reciept.length - 1]) && log.text() != "-") {
                reciept.push(outputContext)
                outputContext = ""
                outputContext += input
                console.log("push Prev Context Allow Num")
            } else if (negativeNumber.test(outputContext + input) || log.text() == "-") {
                outputContext += input
                console.log("Enter negative values")
            }
            logger()
        } else {
            output.text("Digit Limit Reached")
            setTimeout(() => {
                logger()
            }, 1000)
        }
    }
    else if (validOperators.includes(input)) {
        console.log("valid-operator")
        if (!validOperators.includes(outputContext) && outputContext !== "") {
            if (reciept.includes("=")) {
                reciept = [outputContext]
                outputContext = input
                console.log("Continuing with last Calculated Number")
            } else {
                reciept.push(outputContext)
                outputContext = input
                console.log("Push prev show Operator")
            }

        }
        else if (validOperators.includes(outputContext)) {
            if (input != "-") {
                if (validOperators.includes(reciept[reciept.length - 1])) {
                    reciept.pop()
                    outputContext = input
                    console.log("cycle the operators if canceling negative")
                } else if (reciept.length > 0) {
                    outputContext = input
                    console.log("cycle with minus?")
                }
            } else if (input == "-") {
                if (reciept.length > 0 && validOperators.includes(log.text()[log.text().length - 2])) {
                    reciept.pop()
                    outputContext = input
                    console.log("Negative canceled & Operator replaced with Minus")
                } else if (log.text() != "-") {
                    reciept.push(outputContext)
                    outputContext = input
                    console.log("Potential Negative Value incoming")
                }
            }
        } else if (input == "-") {
            outputContext = input
            console.log("potential negative Start")
        }
        logger()
    } else if (input == "Backspace") {
        if (outputContext != "" && typeof outputContext == "string") {
            outputContext = outputContext.slice(0).substring(0, outputContext.length - 1)
            console.log("Backspaced")
        } else if (outputContext == "" && reciept.length > 0) {
            outputContext = reciept[reciept.length - 1]
            reciept.pop()
            console.log("deleted previous entry")
        } else if (log.text().includes("=")) {
            console.log("meep")
        }
        logger()
    } else if (input == "Delete") {
        log.text("")
        output.text("0")
        outputContext = ""
        reciept = []
    } else if (input == "Enter") {
        if (log.text().includes("=")) {
            console.log("meep")
        } else if (!validOperators.includes(outputContext)) {
            reciept.push(outputContext)
            consolidate()
            console.log("calculating")
        }
        logger()
    }
}
function logger() {
    let templog = reciept.slice(0)
    let logged = ""
    for (let i = 0; i < reciept.length; i++) {
        logged += String(templog[i])
    }
    log.text(logged + outputContext)
    output.text(outputContext)
}

//Calculation Part 
function consolidate() {
    let tempArray = reciept.map((item, index) => {
        return index % 2 == 0 ? Number(item) : item
    })
    while (tempArray.length > 1 && !tempArray.includes("=")) {
        let priorityOps = ["*", "/"]
        let pemdas = (input) => {
            return priorityOps.includes(input)
        }
        if (tempArray.some(pemdas)) {
            console.log(reciept.some(pemdas))
            for (let i = 0; i < priorityOps.length; i++) {
                tempArray.map((item, index) => {
                    if (item == priorityOps[i]) {
                        let formula = tempArray.splice(index - 1, 3)
                        result = calculate(formula[0], item, formula[2])
                        tempArray.splice(index - 1, 0, result)
                    }
                })
            }
        } else {
            tempArray.map((item, index) => {
                if (index % 2 == 1) {
                    let formula = tempArray.splice(index - 1, 3)
                    result = calculate(formula[0], item, formula[2])
                    tempArray.splice(index - 1, 0, result)
                }
                console.log(tempArray)
            })
        }
    }
    function calculate(a, operator, b) {
        switch (operator) {
            case '*':
                return a * b;
            case '/':
                return a / b;
            case '+':
                return a + b;
            case '-':
                return a - b;
            default:
                return NaN;
        }
    }
    reciept.push("=")
    outputContext = Math.round(tempArray[0] * 1000) / 1000
    console.log(tempArray)
}
