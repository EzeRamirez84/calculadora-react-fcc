import '../stylesheets/Button.css'
import {isOp} from '../App.js'
export function Button({text, onClick}){
  
  return(
    <div
      className={`button-container ${isOp(text) ? 'operator' : ''}`.trimEnd()} 
      onClick={() => onClick(text)}
      >
      {text}
    </div>    
  )
}