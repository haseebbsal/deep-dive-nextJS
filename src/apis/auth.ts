import {toast } from 'react-toastify';

type Login_SignUp_Data = [string, FormDataEntryValue][]
type LoginSignUpResponseData = {
    message: string,
}

async function loginAPI(data: Login_SignUp_Data) {
    const userData = {
        email: data[0][1],
        password:data[1][1]
    }
    let fetchData = await fetch('/api/auth/login', { method: 'POST', body: JSON.stringify(userData), headers: { 'Content-Type': 'application/json' },credentials:"include" })
    let responseData:LoginSignUpResponseData = await fetchData.json()
    if (responseData.message == 'success') {
        toast.success('Login Successfull', {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",

        });
    }
    else if (responseData.message == 'Failed') {
        toast.error('Error In Logging In', {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
    }
    else if (responseData.message == 'Email Is Not verified') {
        toast.error('Email Is Not verified', {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
    }
    else {
        toast.error('Invalid Email Or Password', {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
    }
    return responseData.message
}


async function signUpAPI(data: Login_SignUp_Data) {
    const userData = {
        name:data[0][1],
        email: data[1][1],
        password: data[2][1]
    }
    let fetchData = await fetch('/api/auth/signup', { method: 'POST', body: JSON.stringify(userData), headers: { 'Content-Type': 'application/json' } })
    let responseData: LoginSignUpResponseData = await fetchData.json()
    if (responseData.message == 'email already exists') {
        toast.error('User With That Email Already Exists', {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
    }
    else if (responseData.message == 'success') {
        toast.success('Email Verification Has Been Sent To You', {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",

        });
        return true
    }
    else {
        toast.error('Error In Signing Up', {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
    }
    return false
}

async function loggingOut() {
    const data = await fetch('/api/auth/logout', { credentials: 'include' })
    return await data.json()
}

export { loginAPI, signUpAPI ,loggingOut}