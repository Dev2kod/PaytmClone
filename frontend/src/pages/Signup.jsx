import {React,useState} from 'react'
import Heading from '../components/Heading'
import SubHeading from '../components/SubHeading'
import InputBox from '../components/InputBox'
import Button from '../components/Button'
import BottomWarning from '../components/BottomWarning'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Signup = () => {
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPass] = useState("");
  const navigate = useNavigate();

  return (
        <div className='bg-slate-300 flex justify-center h-screen'>
            <div className='flex flex-col justify-center'>
                <div className='rounded-lg bg-white w-80 p-2 text-center'>
                    <Heading label="Sign up" />
                    <SubHeading label="Enter your information to Sigunup"/>
                    <InputBox onChange={e=>{setFirstName(e.target.value)}} label=" First Name" placeholder="Leo"/>
                    <InputBox onChange={e=>{setLastName(e.target.value)}} label="Lastname" placeholder="Messi"/>
                    <InputBox onChange={e=>{setUsername(e.target.value)}} label="Username" placeholder="abcd@gmail.com"/>
                    <InputBox onChange={e=>{setPass(e.target.value)}} placeholder="123456" label={"Password"} />
                    <Button onClick={async()=>{
                       try{ console.log("Clicked signup");
                        const response = await axios.post("http://localhost:3000/api/v1/user/signup", {
                            firstname,
                            lastname,
                            username,
                            password
                        });
                        console.log("Response received:", response);  // Debugging log
                        if (response.data.token) {
                        localStorage.setItem("token", response.data.token);
                        console.log("Token stored:", response.data.token);
                        navigate("/dashboard");} 
                        else {
                        console.error("No token received");}
                       } 
                    catch (error) {
                        console.error("Signup failed:", error.response?.data || error.message);
                        alert(error.response?.data?.msg || "Signup failed. Please try again.");
                    }       
                    }} label={"Submit"}/>
                    <BottomWarning label={"Already have an account ?"} buttontext={"Signin"} to={"/signin"}/>
                </div>
            </div>
        </div>
    )
}

export default Signup