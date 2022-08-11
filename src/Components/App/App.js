import { useReducer } from 'react';
import Wrapper from '../Wrapper/Wrapper';
import { Textfit } from 'react-textfit';
import OperationButton from '../Button/OperationButton';
import DigitButton from '../Button/DigitButton';
import './App.css';
import ButtonBox from '../ButtonBox/ButtonBox';

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit', 
  EVALUATE: 'evaluate',
  PLUS_MINUS: 'plus-minus'
}

function reducer(state, {type, payload}) {
  switch(type) {
      case ACTIONS.ADD_DIGIT:
          if(state.overwrite) {
              return{
                  ...state, 
                  currentOperand: payload.digit,
                  overwrite: false
              }
          }
          if(payload.digit === "0" && state.currentOperand === "0") {
              return state
          }
          if(payload.digit === "." && state.currentOperand.includes(".")) {
              return state
          }
          return {
              ...state,
              currentOperand: `${state.currentOperand || " "}${payload.digit}`,
          }
      case ACTIONS.CHOOSE_OPERATION:
          if (state.currentOperand == null && state.previousOperand == null) {
              return state
          }

          if(state.currentOperand == null){
              return {
                  ...state,
                  operation: payload.operation,
              }
          }

          if(state.previousOperand == null) {
              return {
                  ...state,
                  operation: payload.operation,
                  previousOperand: state.currentOperand,
                  currentOperand: null
              }
          }

          return {
              ...state,
              previousOperand: evaluate(state),
              operation: payload.operation,
              currentOperand: null
          }
      case ACTIONS.CLEAR:
          return{}

      case ACTIONS.DELETE_DIGIT:
          if(state.overwrite) 
              {return {
              ...state,
              overwrite: false,
              currentOperand: null
              }
          }
          if(state.currentOperand == null) return state
          if(state.currentOperand.length === 1) {
              return {
                  ...state, currentOperand: null
              }
          }
          return {
              ...state,
              currentOperand: state.currentOperand.slice(0,-1)
          }
      case ACTIONS.PLUS_MINUS:
          return{
              ...state,
              currentOperand: plus_minus(state)
          }
          

      case ACTIONS.EVALUATE: 
          if(state.operation == null || state.currentOperand == null || state.previousOperand == null) {
              return state
          }

          return{
              ...state,
              overwrite: true,
              previousOperand: null,
              operation: null,
              currentOperand: evaluate(state)
          }

  }
}

function evaluate({currentOperand, previousOperand, operation}) {
  const prev = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)
  if (isNaN(prev) || isNaN(current)) return ""
  let computation= ""
  switch(operation) {
      case "+":
          computation= prev + current
          break
      case "-":
          computation=prev - current
          break
      case "*":
          computation= prev * current
          break
      case "÷":
          computation=prev / current
          break
  }
  
  let rounded = computation.toFixed(3)
  return rounded.toString();
}

function plus_minus({currentOperand}) {
  const current = parseFloat(currentOperand)
  if (isNaN(current)) return ""
  let computation= current * -1
  return computation.toString();
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})

function  formatOperand(operand) {
  if (operand == null) return 
  const [integer, decimal] = operand.split(".")
  if(decimal == null ) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}


function App() {
  const [{ currentOperand, previousOperand, operation}, dispatch] = useReducer(
    reducer,
    {}
)
  return (
    <Wrapper>
      
      <div className="screen" >
                <div className="previous">{formatOperand(previousOperand)} {operation}</div>
                
                <div className="current">{formatOperand(currentOperand)}</div>
                
      </div> 
      <ButtonBox>
            <button className='operation' onClick={()=> dispatch({type: ACTIONS.CLEAR})}>C</button> 
            <button className='operation' onClick={()=> dispatch({type: ACTIONS.DELETE_DIGIT})}>DEL</button>
            <button className='operation' onClick={()=> dispatch({type: ACTIONS.PLUS_MINUS})}>+-</button>
            <OperationButton operation="÷" dispatch={dispatch}/>
            <DigitButton digit="7" dispatch={dispatch}/>
            <DigitButton digit="8" dispatch={dispatch}/>
            <DigitButton digit="9" dispatch={dispatch}/>
            <OperationButton operation="*" dispatch={dispatch}/>
            <DigitButton digit="4" dispatch={dispatch}/>
            <DigitButton digit="5" dispatch={dispatch}/>
            <DigitButton digit="6" dispatch={dispatch}/>
            <OperationButton operation="-" dispatch={dispatch}/>
            <DigitButton digit="1" dispatch={dispatch}/>
            <DigitButton digit="2" dispatch={dispatch}/>
            <DigitButton digit="3" dispatch={dispatch}/>
            <OperationButton operation="+" dispatch={dispatch}/>
            <DigitButton digit="0" dispatch={dispatch}/>
            <DigitButton digit="." dispatch={dispatch}/>
            <button className="two" onClick={()=> dispatch({type: ACTIONS.EVALUATE})}>=</button>
      </ButtonBox>

    </Wrapper>
  )
}

export default App;
