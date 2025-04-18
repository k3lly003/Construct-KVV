import React from 'react'


interface ButtonProp{
    text: string;
    texSize: string;
    hoverBg: string;
    borderCol: string;
    bgCol: string;
    textCol: string;
    border: string;
    padding: string;
    round: string;
    handleButton: () => void;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Button = ({text, texSize, hoverBg, borderCol, bgCol, textCol, border,padding, round, handleButton}: ButtonProp) => {
  return (
    <div>
      <button 
        onClick={handleButton} 
        className={`${border} ${padding} ${bgCol} ${textCol} cursor-pointer mt-3 w-full ${borderCol} ${round} py-2 text-sm font-semibold ${hoverBg} transition-colors ${texSize}`}
      >{text}</button>
    </div>
  )
}

export default Button