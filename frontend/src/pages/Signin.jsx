import React from 'react'
import Heading from '../components/Heading'
import SubHeading from '../components/SubHeading'
import InputBox from '../components/InputBox'
import Button from '../components/Button'
import BottomWarning from '../components/BottomWarning'

const Signin = () => {
  return (
    <div className='bg-slate-300 flex justify-center h-screen'>
        <div className='flex flex-col justify-center'>
            <div className='rounded-lg bg-white w-80 p-2 text-center'>
                <Heading label="Sign in" />
                <SubHeading label="Enter your credentials to Signin"/>
                <InputBox label="Username" placeholder="abcd@gmail.com"/>
                <InputBox placeholder="123456" label={"Password"} />
                <Button label={"Submit"}/>
                <BottomWarning label={"Don't have an account?"} buttontext={"Signup"} to={"/signup"}/>
            </div>
        </div>
    </div>
  )
}

export default Signin