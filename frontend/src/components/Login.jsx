import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Login = () => {
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const handleOnSubmit=(e)=>{
        e.preventDefault();
        console.log({email,password});
    }
  return (
    <div className="container">
        <div className="row mt-4">
            <div className="col-md-3"></div>
            <div className="col-md-6">
                <div className="card shadow-md bg-dark rounded">
                    <div className="card-header">
                        <h1 className="text-center text-white">Login Form</h1>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleOnSubmit}>
                            
                            <div className="form-group mt-3">
                                <label htmlFor="" className="form-lable text-white">
                                    Email
                                </label>
                                <input type="email" 
                                value={email}
                                onChange={(e)=>setEmail(e.target.value)}
                                className='form-control' />
                            </div>
                            <div className="form-group mt-3">
                                <label htmlFor="" className="form-lable text-white">
                                    Password
                                </label>
                                <input type="password"
                                 value={password}
                                 onChange={(e)=>setPassword(e.target.value)}
                                 className='form-control' />
                            </div>
                            <div className="form-group mt-3">
                               <button
                               type='submit'
                                className='btn btn-primary text-white'>Submit</button>
                               <Link to="/register" className='mx-3 text-white'>Create New Account ?</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Login