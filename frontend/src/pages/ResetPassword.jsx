import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router'
import { resetPassword } from '../lib/api';
import { Slack,Eye,EyeOff } from 'lucide-react';


function ResetPassword() {

    const { token } = useParams();
    const [confirmPassword, setConfirmPassword] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const Navigate = useNavigate()
    
    const {mutate:resetPass,isPending,error} = useMutation({
        mutationFn: resetPassword,
        onSuccess : () => {
            toast.success(`Password Reset SuccessFully`)
            Navigate("/login")
        },

        onError : () => {
            toast.error(error.response.data.message ||  error.message)
        }

    });

    const handleSubmit = (e) => {
      e.preventDefault()

      if(!password || !confirmPassword){
        toast.error('Please Fill Both Fields')
      }

      if(password !== confirmPassword){
        toast.error('Password do not match')
      }
      
      resetPass({token,password})
    }

  return (
      <div className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-2xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
        {/* SignUp Left Side */}
        <div className="w-full p-4 sm:p-8 flex flex-col">
          {/* Logo */}
          <div className="mb-4 flex items-center justify-start gap-2">
            <Slack className="size-9 text-primary" />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
              Convoo
            </span>
          </div>

          {/* Error Part */}
          {error && (
            <div className="alert alert-error mb-4">
              <span>{error.response?.data?.message || error.message}</span>
            </div>
          )}

          <div className="w-full">
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold">Reset Password</h2>
                  <p className="text-sm opacity-70">
                    And Save AnyWhere To Remember
                  </p>
                </div>
                <div className="space-y-3">
                  {/* Password */}
                  <div className="form-control w-full ">
                    <label className="label">
                      <span className="label-text">Password</span>
                    </label>
                    <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="******"
                      className="input input-bordered w-full"
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                    />

                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center justify-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-base-content/40" />
                      ) : (
                        <Eye className="h-5 w-5 text-base-content/40" />
                      )}
                    </button>
                    </div>

                  </div>
                  {/*  */}
                  <div className="form-control w-full ">
                    <label className="label">
                      <span className="label-text">Confirm Password</span>
                    </label>
                    <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="******"
                      className="input input-bordered w-full"
                      value={confirmPassword}
                      onChange={(e) =>
                        setConfirmPassword(e.target.value)
                      }
                    />

                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center justify-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-base-content/40" />
                      ) : (
                        <Eye className="h-5 w-5 text-base-content/40" />
                      )}
                    </button>
                    </div>

                    <p className="text-xs opacity-70 mt-1">
                      Password must be at least 6 character's long
                    </p>
                  </div>
                </div>

                <button className="btn btn-primary w-full" type="submit">
                  {isPending ? (
                    <>
                      <span className="loading loading-spinner loading-xs"></span>
                      Loading
                    </>
                  ) : (
                    "Save Password"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword