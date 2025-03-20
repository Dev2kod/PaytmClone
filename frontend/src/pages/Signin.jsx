import React from 'react'
import Heading from '../components/Heading'
import SubHeading from '../components/SubHeading'

const Signin = () => {
  return (
    <div className='bg-slate-300 flex justify-center h-screen'>
        <div className='flex flex-col justify-center'>
            <div className='rounded-lg bg-white w-80 p-2 text-center'>
                <Heading label="Sign in" />
                <SubHeading label="Enter your credentials to Signin"/>
            </div>
        </div>
    </div>
  )
}

export default Signin