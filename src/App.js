import React from 'react';
import { useState } from 'react';
import {Button} from './components/Button.js'
import {Screen} from './components/Screen.js'
import './App.css';
import {evaluate} from 'mathjs'

function App() {
  const [operandos, setOperandos] = useState([0])
  const [operadores, setOperadores] = useState([])
  const [screenContent, setScreenContent] = useState('0')
  const [cantDec, setCantDec] = useState(0)


  const agregarOperando = (value) => {
    setOperandos((operandos) => [...operandos, value])
  }

  const updateScreen = (value) => {
    let newScreen = (" " + screenContent).slice(1)
    newScreen = newScreen.concat(value)
    setScreenContent(newScreen)
  }
  const calcular = (operation) => {
    let lastElem = operation.split(' ').slice(-1)[0]
    let res
    if(!isOp(lastElem)){
      res = evaluate(operation) 
    }else{ //si lo ultimo ingresado es un operador se quita
      operation = operation.slice(0,-lastElem.length).trim()    
      res = evaluate(operation)
    }
    if(!esDecimal(res)){ //si NO es decimal se muestra solo la parte entera
      res = Math.floor(res)
    }
    return  res
  }

  const esDecimal= (n) =>{
    return ( n - Math.floor(n) ) > 0
  }

  const procesarNumero = (value, tempCantDec) => {
    let operandosCopy = [].concat(operandos)
    let lastOp = operandosCopy.pop()
    let newOp
    if (esDecimal(lastOp) || lastOp === 0 || tempCantDec === 1){
      newOp = (lastOp + value / (10 ** tempCantDec))
    }else{
      newOp = lastOp * 10 + value
    }
    operandosCopy.push(newOp)
    setOperandos(operandosCopy) 
    return newOp
  }

  const handleNumberClick = (value, lastChar) =>{
    let newValue = value
    let screenCopy = (''.concat(screenContent))
    let tempCantDec = cantDec
    const lastCharIsNum = !isNaN(lastChar)
    if(!lastCharIsNum){ //ultimo ingresado OPERADOR(+,-,*,/) Or '.'
      if(lastChar === '.'){
        newValue = procesarNumero(newValue, tempCantDec)
        updateScreen(value)
      }else{
        newValue = ' '.concat(newValue)
        agregarOperando(value)
        updateScreen(newValue)
        console.log('new value:',newValue);
      }
    }else{ //Ultimo ingresado Numero
      if(screenCopy.trim() === '0'){
        let strNew = newValue.toString()
        setScreenContent(strNew)
        setOperandos([newValue])
      }else{
        let lastOp = operandos.slice(-1)[0]
        if (esDecimal(lastOp) || tempCantDec >= 1 ) {
          setCantDec((cantDec) => cantDec + 1)
          tempCantDec += 1
        }
        let newOp = procesarNumero(value, tempCantDec)
        newOp = newOp.toFixed(tempCantDec)
        //newValue=newOp.toString()
        let newScreen = screenCopy//(" "+ screenContent).slice(1)
        let lastNum = newScreen.split(" ").slice(-1)[0]
        newScreen = newScreen.slice(0,-lastNum.length).trim()
        newScreen += " "+newValue
        setScreenContent(newScreen)
      }
      //setScreenContent(screenContent.)
      
    }
    
  }

  const handleOpClick = (value, lastChar) =>{
    let copyScr = (" " + screenContent).slice(1)
      if (isNaN(lastChar)){ //puede ser +,-,/,*,.
        
        copyScr = copyScr.substring(0,copyScr.length-1)
        copyScr = copyScr.concat(value)
        setScreenContent(copyScr)
        setOperadores([...operadores.slice(0, -1), value])
      }else{
        copyScr = copyScr.concat(' ').concat(value.toString())
        setCantDec(0)
        setOperadores([...operadores,value])
        setScreenContent(copyScr)
      }
  }

  const contarDec = (n) =>{
    //tenemos un n con n decimales por ejemplo: 1.123
    if(n === Math.floor(n)){
      return 0
    }else{
      return n.toString().split('.')[1].length
    }
  }


  const handleClick = (value) =>{
    //casos:
    //Clear,
    //numeros: si ya hay un numero añadirlo y modificar el operando
    // si no habia un numero crear un operando nuevo
    //operadores: si habia un numero añadirlo a la pantalla sino cambiar el operador actual 
    console.log('nuevo click:');
    const lastChar = (" " + screenContent).slice(1).slice(-1)
    const lastNum = ('' + screenContent).split(" ").slice(-1)[0]
    let tempCantDec = cantDec
    if (value === 'Clear'){
      setScreenContent('0')
      setOperandos([0])
      setOperadores([])
    }else if (!isNaN(value)) { //apreto un NUMERO
      handleNumberClick(value, lastChar)
    }else if(value === '='){
      let res = 0
      if((''+screenContent).includes('/ 0')){
        alert('No se puede dividir por cero')
      }else{
        res = calcular((" " + screenContent).slice(1))
      }
      if(esDecimal(res)){
        tempCantDec = contarDec(res)
      }
      //res = res.toFixed(tempCantDec)
      setOperandos([].concat(res))
      setScreenContent(res)
      setOperadores([])
      setCantDec(tempCantDec)
    }else if(value === '.'){
      if (lastChar !== '.' && cantDec == 0 && !esDecimal(lastNum)){
        setCantDec(1)
        updateScreen(value)
      }
    }else {//caso operador
      handleOpClick(value, lastChar)
      //updateScreen(value)
    }
    console.log('  -operadores',operadores);
    console.log('  -numeros:',operandos);
    console.log('  -pantalla: <'+screenContent+">");
  }

  return (
    <div className='App'>
      <h1>Calculadora</h1>
      <div className='calc-container'>
        {/* <div className='print-screen'>
          {screenText}
        </div> */}
        <Screen 
          screenText={screenContent}
          />
        {/*botones 4 x 4*/}
        <div className='fila-container'>
          <Button
            text={1}
            onClick={handleClick}
          />
          <Button
            text={2}
            onClick={handleClick}
          />
          <Button
            text={3}
            onClick={handleClick}
          />
          <Button
            text='+'
            onClick={handleClick}
          />  
        </div>
        <div className='fila-container'>
          <Button
            text={4}
            onClick={handleClick}
          />
          <Button
            text={5}
            onClick={handleClick}
          />
          <Button
            text={6}
            onClick={handleClick}
          />
          <Button
            text='-'
            onClick={handleClick}
          />
        </div>
        <div className='fila-container'>
          <Button
            text={7}
            onClick={handleClick}
          />
          <Button
            text={8}
            onClick={handleClick}
          />
          <Button
            text={9}
            onClick={handleClick}
          />
          <Button
            text='*'
            onClick={handleClick}
          />
        </div>
        <div className='fila-container'>
          <Button
            text='='
            onClick={handleClick}
          />
          <Button
            text={0}
            onClick={handleClick}
          />
          <Button
            text='.'
            onClick={handleClick}
          />
          <Button
            text='/'
            onClick={handleClick}
          />
        </div>
        <div className='clear-button-container'>
          <Button
            text = 'Clear'
            onClick = {handleClick}
          />  
        </div>
      </div>
    </div>
  );
}

export const isOp = value => {
  return isNaN(value) && (value !== '.') && (value !== '=')
}
export default App;
