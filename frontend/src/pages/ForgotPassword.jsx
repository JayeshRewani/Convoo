import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react'
import { forgetPassword } from '../lib/api';
import toast from 'react-hot-toast';
import { Slack,ChevronLeft } from 'lucide-react';
import { Link } from 'react-router';

function ForgotPassword() {

    const [email,setEmail] = useState("");

    const queryClient = useQueryClient()

    const {mutate:sendEmail,isPending,error} = useMutation({
        mutationFn: forgetPassword,
        onSuccess : () => {
            toast.success(`Password Reset Link Send SuccessFully to ${email}`),
            queryClient.invalidateQueries({queryKey:["authUser"]})
        },

        onError : () => {
            toast.error(error.response.data.message ||  error.message)
        }

    });

    const handleForgetPassword = (e) => {
        e.preventDefault();
        sendEmail({email})
    }

  return (
  <div className='h-screen flex items-center justify-center p-4 sm:p-6 md:p-8' data-theme='forest'>
      <div className='border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden'>

        {/* SignUp Left Side */}
        <div className='w-full lg:w-1/2 p-4 sm:p-8 flex flex-col'>
            {/* Logo */}
            <div className='mb-4 flex items-center justify-start gap-2'>
              <Slack className="size-9 text-primary"/>
              <span className='text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider'>
                Convoo
              </span>
            </div>

            
            {/* Error Part */}
            { error && (
              <div className='alert alert-error mb-4'>
                <span>{error.response?.data?.message || error.message}</span>
              </div>
            )}
            
            <div className='w-full'>
                <form onSubmit={handleForgetPassword}>
                  <div className='space-y-4'>

                    <div>
                      <h2 className='text-xl font-semibold'>Forget Password</h2>
                    </div>
                    <div className='space-y-3'>
                        {/* Email */}
                        <div className='form-control w-full'>
                            <label className='label'>
                              <span className='label-text'>Email</span>
                            </label>
                            <input 
                            type="email" 
                            placeholder='tulsidaskhan@gmail.com'
                            className='input input-bordered w-full'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            />
                        </div>
                        
                    </div>

                    <button className='btn btn-primary w-full' type='submit'>
                      { isPending ? (
                        <>
                        <span className='loading loading-spinner loading-xs'></span>
                        Loading
                        </>
                      ) : ("Send")}
                    </button>

                    <Link to="/login" className='btn w-full btn-outline bg-transparent'>
                    <button type='button'>
                     <span className='flex items-center'><ChevronLeft />Back</span>
                    </button>
                    </Link>

                  </div>

                </form>
            </div>

        </div>
        {/* SignUp Right Side */}
        <div className='hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center'>
            <div className='max-w-md'>
                {/* Illustration */}
                <div className='relative aspect-square max-w-xs mx-auto'>
                   <img src="/forget-password.png" alt="Language Connection Illustration" />
                </div>
            </div>
        </div>

      </div>
    </div>
  )
}

export default ForgotPassword