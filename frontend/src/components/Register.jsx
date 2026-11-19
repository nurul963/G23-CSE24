import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Register = () => {
    const [formData,setFormData]=useState({
        name:"",
        email:"",
        password:""
    });
    const handleOnchage=(e)=>{
        const name=e.target.name;
        const value=e.target.value;
        const newFormdata={...formData,[name]:value};
        setFormData(newFormdata);
    }
    const handleOnSubmit=(e)=>{
        e.preventDefault();
        //api call for register
        console.log(formData);
    }
  return (
    <div className="container">
        <div className="row mt-4">
            <div className="col-md-3"></div>
            <div className="col-md-6">
                <div className="card shadow-md bg-dark rounded">
                    <div className="card-header">
                        <h1 className="text-center text-white">Create Account</h1>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleOnSubmit}>
                            <div className="form-group mt-3">
                                <label className="form-lable text-white ">
                                    Name
                                </label>
                                <input type="text" 
                                name='name'
                                value={formData.name}
                                onChange={handleOnchage}
                                className='form-control' />
                            </div>
                            <div className="form-group mt-3">
                                <label htmlFor="" className="form-lable text-white">
                                    Email
                                </label>
                                <input type="email" 
                                name='email'
                                value={formData.email}
                                onChange={handleOnchage}
                                className='form-control' />
                            </div>
                            <div className="form-group mt-3">
                                <label htmlFor="" className="form-lable text-white">
                                    Password
                                </label>
                                <input type="password" 
                                name='password'
                                value={formData.password}
                                onChange={handleOnchage}
                                className='form-control' />
                            </div>
                            <div className="form-group mt-3">
                               <button 
                               type='submit'
                               className='btn btn-primary 
                               text-white'>Submit</button>
                               <Link to="/login" className='mx-3 text-white'>Already have an account ?</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Register