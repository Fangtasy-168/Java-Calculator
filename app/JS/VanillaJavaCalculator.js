//Vanilla Javascript Calculator

/*
Need it to have the order of operations in it maybe something of switch cases or .thenables?
need some kind of regex i guess where inputs are numbers only, event handles won't have any relations to the keydowns..
how to start it... 
lets go with addition first?
*/
let validInputs = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "*", "/", "+", "-", "Backspace", "Enter"]
let validNum = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."]
let validOperators = ["*", "/", "+", "-"]
let reciept = []
let log = document.querySelector("#log")
let pads = document.querySelectorAll(".pad")
let clear = document.querySelector("#clear")
let output = document.querySelector("#showInput")

//--Event Listeners--

//Keyboard input functionality 
document.addEventListener("keydown", (e) => {
    handleKeyDown(e)
})
// clickable buttons
pads.forEach((pad) => {
    pad.addEventListener("click", handleClick)
})

//KeyPress Function
function handleKeyDown(e) {
    verify(e.key)
}
function handleClick() {
    verify(this.getAttribute("value"))
}

//Input Validation and pass through
let outputContext = ""
function verify(input) {
    let negativeNumber = /^-?\d*\.{0,1}\d*$/
    let positiveNumber = /^\d*\.{0,1}\d*$/

    if (validNum.includes(input)) {
        console.log("valid-input")
        if ((output.textContent + input).length < 14) {
            if (positiveNumber.test(outputContext + input)) {
                outputContext += input
                console.log("Enter Positive values")
            } else if (negativeNumber.test(outputContext + input) && validOperators.includes(log.textContent[log.textContent.length - 2]) || log.textContent == "-") {
                outputContext += input
                console.log("Enter negative values")
            }
            else if (validOperators.includes(outputContext)) {
                reciept.push(outputContext)
                outputContext = ""
                outputContext += input
                console.log("push Prev Context Allow Num")
            }
            logger()
        } else {
            output.textContent = "Digit Limit Reached"
            setTimeout(() => {
                logger()
            }, 1000)
        }

    }
    else if (validOperators.includes(input)) {
        console.log("valid-operator")
        if (!validOperators.includes(outputContext)) {
            if (reciept.includes("=")) {
                reciept = [outputContext]
                outputContext = input
                console.log("Continuing with last Calculated Number")
            } else if (outputContext !== "") {
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
                if (reciept.length > 0 && validOperators.includes(log.textContent[log.textContent.length - 2])) {
                    reciept.pop()
                    outputContext = input
                    console.log("Negative canceled & Operator replaced with Minus")
                } else if (log.textContent != "-") {
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
        if (outputContext != "" && outputContext == Number) {
            outputContext = outputContext.slice(0).substring(0, outputContext.length - 1)
        } else if (outputContext == "" && reciept.length > 0) {
            outputContext = reciept[reciept.length - 1]
            reciept.pop()
        } else if (log.textContent.includes("=")) {

        }
        logger()
    } else if (input == "Delete") {
        log.textContent = ""
        output.textContent = ""
        outputContext = ""
        reciept = []
        logger()
    } else if (input == "Enter") {
        if (log.textContent.includes("=")) {
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
    log.textContent = logged + outputContext
    output.textContent = outputContext
}

//Calculation Part 

function consolidate() {
    let tempArray = reciept.map((item, index) => {
        return index % 2 == 0 ? Number(item) : item
    })
    while (tempArray.length > 1 && !tempArray.includes("=")) {
        tempArray.map((item, index) => {
            if (item == "*") {
                let formula = tempArray.splice(index - 1, 3)
                result = formula[0] * formula[2]
                tempArray.splice(index - 1, 0, result)
            }
            console.log(tempArray)
        })
        tempArray.map((item, index) => {
            if (item == "/") {
                let formula = tempArray.splice(index - 1, 3)
                result = formula[0] / formula[2]
                tempArray.splice(index - 1, 0, result)
            }
            console.log(tempArray)
        })
        tempArray.map((item, index) => {
            if (item == "+") {
                let formula = tempArray.splice(index - 1, 3)
                result = formula[0] + formula[2]
                tempArray.splice(index - 1, 0, result)
            }
            console.log(tempArray)
        })
        tempArray.map((item, index) => {
            if (item == "-") {
                let formula = tempArray.splice(index - 1, 3)
                result = formula[0] - formula[2]
                tempArray.splice(index - 1, 0, result)
            }
            console.log(tempArray)
        })
    }
    reciept.push("=")
    outputContext = tempArray[0]
    console.log(tempArray)
}