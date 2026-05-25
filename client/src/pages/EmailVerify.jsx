import React, { useContext, useEffect } from 'react'
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { AppContent } from '../context/AppContext';
import { toast } from 'react-toastify';

const EmailVerify = () => {
    axios.defaults.withCredentials = true;

    const navigate = useNavigate();
    const inputRefs = React.useRef([]);

    const { backendUrl, isLoggedIn, userData, getUserData } = useContext(AppContent);

    const handleInput = (e, index) => {
        if(e.target.value.length > 0 && index < inputRefs.current.length - 1){
            inputRefs.current[index+1].focus();
        }
    }

    const handleKeyDown = (e, index) => {
        //1. BackSpace Logic
        if(e.key === 'Backspace' && e.target.value === '' && index > 0)
        {
            inputRefs.current[index - 1].focus();
        }

        // 2. Left Arrow key logic
        if(e.key === 'ArrowLeft' && index > 0)
        {
            inputRefs.current[index - 1].focus();
            setTimeout(() => inputRefs.current[index - 1].select(), 0);
        }

        // 3. Right Arrow key logic
        if(e.key === 'ArrowRight' && index < inputRefs.current.length - 1)
        {
            inputRefs.current[index + 1].focus();
            setTimeout(() => inputRefs.current[index + 1].select(), 0);
        }
    }

    const handlePaste = (e) => {
        e.preventDefault();

        const paste = e.clipboardData.getData('text');
        const pasteArray = paste.slice(0,6).split('');

        pasteArray.forEach((char, index) => {
            if(inputRefs.current[index])
            {
                inputRefs.current[index].value = char;
            }
        });

        // focus logic for input field
        const targetIndex = pasteArray.length;

        if(targetIndex >= inputRefs.current.length)
        {
            inputRefs.current[inputRefs.current.length - 1].focus();
        }else if(inputRefs.current[targetIndex])
        {
            inputRefs.current[targetIndex].focus();
        }
    }

    const onSubmitHandler = async (e) => {
        try{
            e.preventDefault();

            const otpArray = inputRefs.current.map(e => e.value);
            const otp = otpArray.join('');

            const {data} = await axios.post(backendUrl + '/api/auth/verify-account', {otp});

            if(data.success)
            {
                toast.success(data.message)
                getUserData()
                navigate('/')
            }
            else 
            {
                toast.error(data.message);
            }
        }catch(error)
        {
            toast.error(error.message);
        }
    }

    useEffect(()=>{
        isLoggedIn && userData && userData.isAccountVerified && navigate('/')
    },[isLoggedIn, userData]);
    return (
        <div onPaste={handlePaste} className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400">
            <img onClick={()=>navigate('/')} src={assets.logo} alt="" className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"/>
            <form onSubmit={onSubmitHandler} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
                <h1 className="text-white text-2xl font-semibold text-center mb-4">Email Verify OTP</h1>
                <p className="text-center mb-6 text-indigo-300">Enter the 6-digit code sent to your email id.</p>
                <div className="flex justify-between mb-8">
                    {Array(6).fill(0).map((_, index)=>(
                        <input type="text" maxLength='1' key={index} required className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md"
                        ref={e => inputRefs.current[index] = e}
                        onInput={(e) => handleInput(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}/>
                    ))}
                </div>
                <button className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full">Verify Email</button>
            </form>
        </div>
    )
}

export default EmailVerify;