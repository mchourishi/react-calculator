import React, { Component } from 'react';

//This class is for scaling the display value on calculator. If number is a big digit scale it to smaller text else back to normal.
class AutoScalingText extends React.Component {
    state = {
      scale: 1
    };
    
    componentDidUpdate() {
      const { scale } = this.state
      
      const node = this.node
      const parentNode = node.parentNode
      
      const availableWidth = parentNode.offsetWidth;

      const actualWidth = node.offsetWidth;
      const actualScale = availableWidth / actualWidth;
      
      console.log(availableWidth , actualWidth);
      if (scale === actualScale)
        return
      
      if (actualScale < 1) {
        this.setState({ scale: actualScale })
      } else if (scale < 1) {
        this.setState({ scale: 1 })
      }
    }
    
    render() {
      const { scale } = this.state
      
      return (
        <div
          style={{ transform: `scale(${scale},${scale})` }}
          ref={node => this.node = node}
        >{this.props.children}</div>
      )
    }
  }
class Calculator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: null, // This is for saving the previous value after we input an operator
            displayValue: 0,
            waitingforOperand: false,
            operator: null
        };

    }

    //When a digit is pressed
    inputDigit(digit) {
        const { displayValue, waitingforOperand } = this.state;

        //We append the digit to the initial value(state) to show more than one numbers pressed.
        //We are also not displaying any 0s in the front of the string.
        if (waitingforOperand) {
            this.setState({
                displayValue: String(digit),
                waitingforOperand: false
            })
        } else
            this.setState({
                displayValue: (displayValue === 0) ? String(digit) : displayValue + String(digit),
                waitingforOperand: false
            })
    }

    //When a dot is pressed
    inputDot() {
        const { displayValue, waitingforOperand } = this.state;
        if (waitingforOperand) {
            this.setState({
                displayValue: '.',
                waitingforOperand: false
            });
        } else {
            if (displayValue.indexOf('.') === -1) { //Coz we cant have more than one decimal pts 
                this.setState({
                    displayValue: displayValue + '.',
                    waitingforOperand: false
                });
            }
        }
    }

    //When togglesign(+/-) is clicked

    toggleSign() {
        let { displayValue } = this.state;
        console.log(displayValue);
        //If theres already a minus remove it else add it.
        if (displayValue.charAt(0) === '-') {
            displayValue = displayValue.substr(1);
        } else {
            displayValue = '-' + displayValue;
        }
        this.setState({
            displayValue: displayValue
        });
    }

    //When the Percent button is pressed simply divide the number by 100 and display
    inputPercent() {
        let { displayValue } = this.state;
        displayValue = parseFloat(displayValue / 100);
        this.setState({
            displayValue: displayValue
        });
    }

    performOperation(nextOperator) {
        const { displayValue, operator, value } = this.state;
        const inputValue = parseFloat(displayValue);
        const operations = {
            '/': (prevValue, nextValue) => prevValue / nextValue,
            '+': (prevValue, nextValue) => prevValue + nextValue,
            '-': (prevValue, nextValue) => prevValue - nextValue,
            '*': (prevValue, nextValue) => prevValue * nextValue,
            '=': (prevValue, nextValue) => nextValue,
        };

        if (value == null) {
            this.setState({ value: inputValue })
        } else if (operator) {
            //If theres an operator, we need to save the previous typed number.
            const currentValue = value || 0;
            const newValue = operations[operator](currentValue, inputValue);
            this.setState({
                value: newValue,
                displayValue: newValue
            });

        }


        this.setState({
            waitingforOperand: true,
            operator: nextOperator
        });


    }

    clearDisplay() {
        this.setState({ displayValue: 0 })
    }
    render() {

        const displayValue = this.state.displayValue;
        return (
            <div className="calculator">
                {/* <pre>{JSON.stringify(this.state)}</pre> */}
                <div className="calculator-display">
                        <AutoScalingText>{displayValue}</AutoScalingText>               
                </div>
                <div className="calculator-keypad">
                    <div className="input-keys">
                        <div className="function-keys">
                            <button className="calculator-key key-clear" onClick={() => this.clearDisplay()}>AC</button>
                            <button className="calculator-key key-sign" onClick={() => this.toggleSign()}>&#177;</button>
                            <button className="calculator-key key-percent" onClick={() => this.inputPercent()}>%</button>
                        </div>
                        <div className="digit-keys">
                            <button className="calculator-key key-0" onClick={() => this.inputDigit(0)}>0</button>
                            <button className="calculator-key key-dot" onClick={() => this.inputDot()}>&#183;</button>
                            <button className="calculator-key key-1" onClick={() => this.inputDigit(1)}>1</button>
                            <button className="calculator-key key-2" onClick={() => this.inputDigit(2)}>2</button>
                            <button className="calculator-key key-3" onClick={() => this.inputDigit(3)}>3</button>
                            <button className="calculator-key key-4" onClick={() => this.inputDigit(4)}>4</button>
                            <button className="calculator-key key-5" onClick={() => this.inputDigit(5)}>5</button>
                            <button className="calculator-key key-6" onClick={() => this.inputDigit(6)}>6</button>
                            <button className="calculator-key key-7" onClick={() => this.inputDigit(7)}>7</button>
                            <button className="calculator-key key-8" onClick={() => this.inputDigit(8)}>8</button>
                            <button className="calculator-key key-9" onClick={() => this.inputDigit(9)}>9</button>
                        </div>
                    </div>
                    <div className="operator-keys">
                        <button className="calculator-key key-divide" onClick={() => this.performOperation('/')}>/</button>
                        <button className="calculator-key key-multiply" onClick={() => this.performOperation('*')}>*</button>
                        <button className="calculator-key key-subtract" onClick={() => this.performOperation('-')}>-</button>
                        <button className="calculator-key key-add" onClick={() => this.performOperation('+')}>+</button>
                        <button className="calculator-key key-equals" onClick={() => this.performOperation('=')}>=</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Calculator;