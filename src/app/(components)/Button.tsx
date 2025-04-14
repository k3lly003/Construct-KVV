import React from 'react'


interface ButtonProp{
    text: string;
    // handleButton: () => void;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Button = ({text, 
                //   handleButton
                }: ButtonProp
                ) => {
  return (
    <div>
      <button 
        //  onClick={handleButton} 
         className='border text-2xl p-3 rounded-xl bg-amber-400 text-amber-50 cursor-pointer'
      >{text}</button>
    </div>
  )
}

export default Button