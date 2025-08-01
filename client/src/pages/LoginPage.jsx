import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext'
import { toast } from 'react-toastify' // Add this import

const LoginPage = () => {
    const [currState, setCurrState] = useState("Sign up")
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [bio, setBio] = useState("")
    const [isDataSubmitted, setIsDataSubmitted] = useState(false)

    const { login } = useContext(AuthContext)

    const onSubmitHandler = (event) => {
        event.preventDefault()

        // If it's Sign up mode and bio not shown yet, then just show it
        if (currState === "Sign up" && !isDataSubmitted) {
            setIsDataSubmitted(true)
            return
        }

        // If in Sign up mode and any of the fields are missing, prevent submission
        if (currState === "Sign up" && (!fullName || !email || !password || !bio)) {
            toast.error("Please fill all the details")
            return
        }

        // If in Login mode and email or password are missing, prevent submission
        if (currState === "Login" && (!email || !password)) {
            toast.error("Please enter email and password")
            return
        }

        // Now proceed to login/signup
        login(currState === "Sign up" ? 'signup' : 'login', {
            fullName, email, password, bio
        })
    }

    // Helper function to reset form when switching modes
    const handleModeSwitch = (newMode) => {
        setCurrState(newMode)
        setIsDataSubmitted(false)
        // Reset form fields when switching modes
        setFullName("")
        setEmail("")
        setPassword("")
        setBio("")
    }

    return (
        <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>
            {/* Left side - Logo */}
            <img
                src={assets.logo_big}
                alt=''
                className='w-32 sm:w-48 md:w-56'
            />

            {/* Right side - Form */}
            <form onSubmit={onSubmitHandler} className='border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg'>
                <h2 className='font-medium text-2xl flex justify-between items-center'>
                    {currState}
                    {isDataSubmitted && (
                        <img
                            onClick={() => setIsDataSubmitted(false)}
                            src={assets.arrow_icon}
                            alt='Back'
                            className='w-5 cursor-pointer'
                        />
                    )}
                </h2>

                {/* Sign up - First step: Basic info */}
                {currState === "Sign up" && !isDataSubmitted && (
                    <>
                        <input
                            onChange={(e) => setFullName(e.target.value)}
                            value={fullName}
                            type='text'
                            className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                            placeholder='Full Name'
                            required
                        />
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            type='email'
                            placeholder='Email Address'
                            required
                            className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                        />
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            type='password'
                            placeholder='Password'
                            required
                            className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                        />
                    </>
                )}

                {/* Sign up - Second step: Bio */}
                {currState === "Sign up" && isDataSubmitted && (
                    <textarea
                        onChange={(e) => setBio(e.target.value)}
                        value={bio}
                        rows={4}
                        className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                        placeholder='Provide a short bio...'
                        required
                    ></textarea>
                )}

                {/* Login form */}
                {currState === "Login" && (
                    <>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            type='email'
                            placeholder='Email Address'
                            required
                            className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                        />
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            type='password'
                            placeholder='Password'
                            required
                            className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                        />
                    </>
                )}

                <button
                    type='submit'
                    className='py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer hover:from-purple-500 hover:to-violet-700 transition-colors'
                >
                    {currState === "Sign up"
                        ? (isDataSubmitted ? "Create Account" : "Next Step")
                        : "Login Now"
                    }
                </button>

                <div className='flex items-center gap-2 text-sm text-gray-500'>
                    <input type='checkbox' />
                    <p>Agree to the terms of use & privacy policy.</p>
                </div>

                <div className='flex flex-col gap-2'>
                    {currState === "Sign up" ? (
                        <p className='text-sm text-gray-600'>
                            Already have an account?
                            <span
                                onClick={() => handleModeSwitch("Login")}
                                className='font-medium text-violet-500 cursor-pointer hover:text-violet-400'
                            > Login here</span>
                        </p>
                    ) : (
                        <p className='text-sm text-gray-600'>
                            Create an account
                            <span
                                onClick={() => handleModeSwitch("Sign up")}
                                className='font-medium text-violet-500 cursor-pointer hover:text-violet-400'
                            > Click here</span>
                        </p>
                    )}
                </div>
            </form>
        </div>
    )
}

export default LoginPage