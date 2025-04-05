import './App.css'
import React, {useEffect, useState} from "react";

type UserCredentials = {
    username: string,
    password: string
}

const baseOptions: RequestInit = {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
    },
    credentials: "include"
}

async function registerUser(credentials: UserCredentials) {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
            ...baseOptions,
            method: "POST",
            body: JSON.stringify(credentials)
        })

        return await response.json();

    } catch (error: unknown) {
        if (error instanceof Error) {
            return error.message
        }
    }
}

async function loginUser(credentials: UserCredentials) {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
            ...baseOptions,
            method: "POST",
            body: JSON.stringify(credentials)
        })

        return await response.json();

    } catch (error: unknown) {
        if (error instanceof Error) {
            return error.message
        }
    }
}

function useFetch() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<null | string>(null);

    useEffect(() => {
        (async function fetchData() {
            setLoading(true);
            setError(null);

            //todo: add env var !
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/user-details`, {
                    ...baseOptions,
                });

                if (!response.ok) {
                    const message = `An error has occurred: ${response.status}`;
                    setError(message);
                    setLoading(false);
                }

                const data = await response.json();
                setData(data);
                setLoading(false);
            } catch (error: unknown) {
                const message = `An error has occurred: ${(error as Error).message}`;
                setError(message);
                setLoading(false);
            }
        })();
    }, []);

    return {data, loading, error};
}

function App() {
    const [isSignUpForm, setIsSignUpForm] = useState(false);

    const handleFormTypeChange = () => {
        setIsSignUpForm(!isSignUpForm);
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const userCredentials = Object.fromEntries(formData) as UserCredentials;

        if (isSignUpForm) {
            await registerUser(userCredentials)
        } else {
            await loginUser(userCredentials)
        }
    }

    return (
        <div className="min-h-screen bg-zinc-100 p-8 flex justify-center items-center">
            <div className="max-w-lg mx-auto mb-8 overflow-hidden bg-white rounded-lg shadow-lg">
                <div className="p-8">
                    <h2 className="mb-6 text-2xl font-bold text-gray-900">{isSignUpForm ? "Sign up" : "Sign in"}</h2>
                    <Form onSubmit={handleSubmit} onFormTypeChange={handleFormTypeChange}
                          isSignUpForm={isSignUpForm}/>
                </div>
            </div>
        </div>
    )
}

export default App

interface FormProps {
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
    onFormTypeChange: () => void
    isSignUpForm: boolean
}

function Form({
                  onSubmit,
                  onFormTypeChange,
                  isSignUpForm
              }: FormProps) {

    return (
        <>
            <form onSubmit={onSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email"
                           className="block w-full px-3 py-2 mt-1 text-gray-700 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"/>
                </div>
                <div>
                    <label
                        className="block text-sm font-medium text-gray-700">Password</label>
                    <input type="password"
                           className="block w-full px-3 py-2 mt-1 text-gray-700 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"/>
                </div>
                <button type="submit"
                        className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    {isSignUpForm ? "Sign up" : "Sign in"}
                </button>
            </form>
            {!isSignUpForm ?
                <>
                    <p className="mt-4 text-center">Do not have an account ?</p>
                    <button onClick={onFormTypeChange}
                            className="block underline text-blue-500 mx-auto cursor-pointer">Register
                        here
                    </button>
                </>

                :

                <>
                    <p className="mt-4 text-center">Have an account ?</p>
                    <button onClick={onFormTypeChange}
                            className="block underline text-blue-500 mx-auto cursor-pointer">Login
                        here
                    </button>
                </>
            }
        </>
    )
}
