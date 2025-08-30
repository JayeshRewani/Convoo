import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { Logout } from '../lib/api';
import toast from "react-hot-toast"

function useLogout() {
    const queryClient = useQueryClient();
    const {mutate: logoutMutation,isPending,error} = useMutation({
        mutationFn:Logout,
        onSuccess : () => {
            toast.success('Logout SuccessFully'),
            queryClient.invalidateQueries({queryKey:["authUser"]})
        }
    });

    return {logoutMutation,isPending,error}
}

export default useLogout