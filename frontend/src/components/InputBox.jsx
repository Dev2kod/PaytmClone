import React from 'react'

const InputBox = () => {
  return (
    <div className=''>
        
        <div className='text-sm font-medium px-1 text-left py-2'>
        {label}
        </div>
            <input type="text" placeholder={placeholder} />
        
    </div>
  )
}

export default InputBox