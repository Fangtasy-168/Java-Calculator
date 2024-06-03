import React from 'react'
import { useState, useEffect, useRef } from 'react'

const validInputs = [
    { set: 'display', inputType: 'operator', input: '/', key: '/', id: 'divide' },
    { set: 'display', inputType: 'operator', input: '*', key: '*', id: 'multiply' },
    { set: 'display', inputType: 'operator', input: '-', key: '-', id: 'minus' },
    { set: 'display', inputType: 'operator', input: '+', key: '+', id: 'plus' },
    { set: 'display', inputType: 'interger', input: '7', key: '7', id: 'seven' },
    { set: 'display', inputType: 'interger', input: '8', key: '8', id: 'eight' },
    { set: 'display', inputType: 'interger', input: '9', key: '9', id: 'nine' },
    { set: 'display', inputType: 'interger', input: '4', key: '4', id: 'four' },
    { set: 'display', inputType: 'interger', input: '5', key: '5', id: 'five' },
    { set: 'display', inputType: 'interger', input: '6', key: '6', id: 'six' },
    { set: 'display', inputType: 'interger', input: '1', key: '1', id: 'one' },
    { set: 'display', inputType: 'interger', input: '2', key: '2', id: 'two' },
    { set: 'display', inputType: 'interger', input: '3', key: '3', id: 'three' },
    { set: 'display', inputType: 'interger', input: '0', key: '0', id: 'zero' },
    { set: 'display', inputType: 'interger', input: '.', key: '.', id: '.' },
    { set: 'display', inputType: 'special', input: 'Enter', key: 'Enter', id: 'enter' },
    { set: 'display', inputType: 'special', input: 'Delete', key: 'CE', id: 'delete' },
    { set: 'hidden', inputType: 'special', input: 'Backspace', key: 'Backspace', id: 'backspace' },
    { set: 'hidden', inputType: 'special', input: 'Escape', key: 'Escape', id: 'Escape' }
]

export default function Calculator() {
    const [log, setLog] = useState([])
    const [display, setDisplay] = useState('')
    const [message, setMessage] = useState('')
    let negativeNumber = /^-?(?!00)[0-9]*\.?[0-9]*$/
    let positiveNumber = /^(?!00)[0-9]*\.?[0-9]*$/

    //function to check users Inputs 
    function inputChecker(usersEntry) {
        let validInput = validInputs.find(input => input.input == usersEntry)
        if (validInput) {
            validInput.inputType == 'interger' ? handleInputs(validInput) : validInput.inputType == 'operator' ? handleOperator(validInput) : 'special' ? handleSpecial(validInput) : null
        }
    }

    function handleSpecial(validInput) {
        if (validInput.input == 'Backspace') {

            if (display.length) {
                setDisplay(display.slice(0, display.length - 1))
                console.log(typeof display)
                console.log('one by one')
            } else {
                setDisplay(log[log.length - 1])
                setLog(log.slice(0, log.length - 1))
                console.log('popped')
            }
        }
        else if (validInput.input == 'Delete') {
            setDisplay('')
        }
        else if (validInput.input == 'Enter') {
            if (display != '.' && display != '-' && display) {
                consolidate([...log, display])
            }
            else {
                setMessage('Not A Valid Formula')
                setTimeout(() => {
                    setMessage('')
                }, 500)
            }
        }
        else if (validInput.input == 'Escape') {
            setLog([])
            setDisplay('')
        }
    }

    function handleOperator(validInput) {
        let onScreen = validInputs.find(input => input.input == display)
        let lastLogged = validInputs.find(input => input.input == log[log.length - 1])
        if (log.includes('=')) {
            setLog([display])
            setDisplay(validInput.input)
        }
        else if (validInput.input !== '-') {
            if (display) {
                if (lastLogged && lastLogged.inputType == 'operator' && onScreen && onScreen.inputType == 'operator') {
                    setLog(log.slice(0, log.length - 1))
                    setDisplay(validInput.input)
                    console.log('cancel negative and use op 1 ')
                }
                else if (onScreen && onScreen.inputType == 'operator') {
                    setDisplay(validInput.input)
                    console.log('cycle ops')
                }
                else if (display == '.' || display == '-.') {
                    setMessage('Not A Valid Number')
                    setTimeout(() => {
                        setMessage('')
                    }, 500)
                }
                else {
                    setLog([...log, display])
                    setDisplay(validInput.input)
                    console.log('push num show op')
                }
            }
        }
        else {
            if (display) {
                if (lastLogged && lastLogged.inputType == 'operator' && onScreen && onScreen.inputType == 'operator') {
                    setLog(log.slice(0, log.length - 1))
                    setDisplay(validInput.input)
                    console.log('cancel negative and use op 2')
                }
                else {
                    setLog([...log, display])
                    setDisplay(validInput.input)
                    console.log('push op show minus')
                }
            }
            else {
                handleInputs(validInput)
            }
        }
    }
    useEffect(() => {
        console.log(log)
    }, [log])

    function handleInputs(validInput) {
        let onScreen = validInputs.find(input => input.input == display)
        let lastLogged = validInputs.find(input => input.input == log[log.length - 1])
        if (display.length > 32) {
            setMessage('Digit Limit Exceeded')
            setTimeout(() => {
                setMessage('')
            }, 500)
        }
        else if (log.includes('=')) {
            setLog([])
            setDisplay(validInput.input)
        }
        else if (onScreen && onScreen.inputType == 'operator') {
            if (onScreen.input == '-') {
                if (lastLogged && lastLogged.inputType == 'operator') {
                    setDisplay(display.slice() + validInput.input)
                }
                else {
                    setLog([...log, display])
                    setDisplay(validInput.input)
                }
            }
            else {
                setLog([...log, display])
                setDisplay(validInput.input)
            }
        }
        else if (negativeNumber.test(display + validInput.input)) {
            setDisplay(display.slice() + validInput.input)
        }
        else {
            setMessage('Not A Valid Number')
            setTimeout(() => {
                setMessage('')
            }, 500)
        }
    }

    function consolidate(log) {
        let newlog = log.map((item, index) => {
            return index % 2 ? item : Number(item)
        })

        const priorityOps = ["*", "/"]
        let pemdas = (input) => {
            return priorityOps.includes(input)
        }

        if (negativeNumber.test(display)) {
            while (newlog.length > 1) {
                if (newlog.some(pemdas)) {
                    for (let i = 0; i < priorityOps.length; i++) {
                        let located = newlog.indexOf(priorityOps[i])
                        while (located > 0) {
                            let formula = newlog.splice(located - 1, 3)
                            let result = calculate(formula[0], priorityOps[i], formula[2])
                            newlog.splice(located - 1, 0, result)
                            located = newlog.indexOf(priorityOps[i])
                        }
                    }
                    console.log('multiplication and division')
                }
                else {
                    let formula = newlog.splice(0, 3)
                    let result = calculate(formula[0], formula[1], formula[2])
                    newlog.splice(0, 0, result)
                    console.log('addition & subtraction')
                }
                console.log(newlog)
            }
            console.log("final: " + newlog)
        }
        else {
            setMessage('Invalid')
            setTimeout(() => {
                setMessage('')
            }, 1000)
        }
        setLog([...log, "="])
        setDisplay(newlog)
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

    // Add an event listener to the document
    useEffect(() => {
        function documentKeydown(e) {
            inputChecker(e.key)
        }
        document.addEventListener('keydown', documentKeydown)
        return () => document.removeEventListener('keydown', documentKeydown)
    })

    return (
        <>
            <Display log={log} display={display} message={message} />
            <UserButtons inputChecker={inputChecker} />
            <footer id='signature'>Fangtasy React Calculator</footer>
        </>
    )
}

// Screen Component
function Display({ log, display, message }) {
    if (message) {
        return (
            <div id='screen'>
                <div id='message'>{message}</div>
            </div>
        )
    }
    else {
        return (
            <div id='screen'>
                <div id='log'>{log}{display}</div>
                <div id='preview'>{display}</div>
            </div>
        )
    }
}

//Generates the buttons for user to click
function UserButtons({ inputChecker }) {
    let buttons = []
    validInputs.map((item) => {
        item.set !== 'hidden' ? buttons.push(<div key={item.key} className={item.type + " pads"} id={item.id} onClick={() => inputChecker(item.input)}>{item.key}</div>) : null
    })
    return (
        <div id='touchPad'>
            {buttons}
        </div>
    )
}