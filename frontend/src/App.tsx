import './App.css'
import React, { useEffect, useState } from 'react'

type UserCredentials = {
    email: string
    password: string
}

const baseOptions: RequestInit = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    },
    credentials: 'include',
}

async function registerUser(credentials: UserCredentials) {
    try {
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}auth/register`,
            {
                ...baseOptions,
                method: 'POST',
                body: JSON.stringify(credentials),
            }
        )

        return await response.json()
    } catch (error: unknown) {
        if (error instanceof Error) {
            return error.message
        }
    }
}

async function loginUser(credentials: UserCredentials) {
    try {
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}auth/login`,
            {
                ...baseOptions,
                method: 'POST',
                body: JSON.stringify(credentials),
            }
        )

        return await response.json()
    } catch (error: unknown) {
        if (error instanceof Error) {
            return error.message
        }
    }
}

async function logoutUser() {
    try {
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}auth/logout`,
            {
                ...baseOptions,
                method: 'POST',
            }
        )

        return await response.json()
    } catch (error: unknown) {
        if (error instanceof Error) {
            return error.message
        }
    }
}

function useFetch() {
    const [data, setData] = useState<Record<string, string> | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<null | string>(null)

    useEffect(() => {
        ;(async function fetchData() {
            setLoading(true)
            setError(null)

            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}auth/user-details`,
                    {
                        ...baseOptions,
                    }
                )

                if (!response.ok) {
                    const message = `An error has occurred: ${response.status}`
                    setError(message)
                    setLoading(false)
                }

                const data = await response.json()
                setData(data)
                setLoading(false)
            } catch (error: unknown) {
                const message = `An error has occurred: ${(error as Error).message}`
                setError(message)
                setLoading(false)
            }
        })()
    }, [])

    return { data, loading, error }
}

const routes = {
    '/home': () => (
        <ProtectedRoute>
            <Home />
        </ProtectedRoute>
    ),
    '/': () => <Root />,
} as const

function App() {
    const [currentPath, setCurrentPath] = useState(window.location.pathname)

    useEffect(() => {
        const onLocationChange = () => {
            setCurrentPath(window.location.pathname)
        }

        window.addEventListener('popstate', onLocationChange)
        return () => window.removeEventListener('popstate', onLocationChange)
    }, [currentPath])

    const Component = routes[currentPath as keyof typeof routes]

    return Component ? <Component /> : <h1>Access denied</h1>
}

export default App

function Root() {
    const [response, setResponse] = useState<Record<string, string>>({})
    const [isSignUpForm, setIsSignUpForm] = useState(false)

    const handleFormTypeChange = () => {
        setIsSignUpForm(!isSignUpForm)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const formData = new FormData(e.currentTarget)
        const userCredentials = Object.fromEntries(formData) as UserCredentials

        let response

        if (isSignUpForm) {
            response = await registerUser(userCredentials)
        } else {
            response = await loginUser(userCredentials)
        }

        setResponse(response)

        if (!response?.error) {
            window.history.pushState({}, '', '/home')
            window.dispatchEvent(new PopStateEvent('popstate'))
        }
    }

    return (
        <div className="min-h-screen bg-zinc-100 p-8 flex justify-center items-center">
            <div className="min-h-[445px] min-w-[325px] max-w-lg mx-auto mb-8 overflow-hidden bg-white rounded-lg shadow-lg">
                <div className="p-8">
                    <h2 className="mb-6 text-2xl font-bold text-gray-900">
                        {isSignUpForm ? 'Sign up' : 'Sign in'}
                    </h2>
                    <Form
                        onSubmit={handleSubmit}
                        onFormTypeChange={handleFormTypeChange}
                        isSignUpForm={isSignUpForm}
                    >
                        <strong className="block text-red-500 text-center mt-4">
                            {response?.error ? response?.message : ''}
                        </strong>
                    </Form>
                </div>
            </div>
        </div>
    )
}

interface FormProps extends React.PropsWithChildren {
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
    onFormTypeChange: () => void
    isSignUpForm: boolean
}

function Form({
    onSubmit,
    onFormTypeChange,
    isSignUpForm,
    children,
}: FormProps) {
    return (
        <>
            <form onSubmit={onSubmit} className="space-y-6">
                <div>
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        required
                        className="block w-full px-3 py-2 mt-1 text-gray-700 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <div>
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+\-]).{8,12}$"
                        title="Password must be 8-12 characters long, include uppercase, lowercase, a number, and a special character."
                        required
                        className="block w-full px-3 py-2 mt-1 text-gray-700 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    {isSignUpForm ? 'Sign up' : 'Sign in'}
                </button>
            </form>
            {isSignUpForm ? (
                <>
                    <p className="mt-4 text-center">Have an account ?</p>
                    <button
                        type="button"
                        onClick={onFormTypeChange}
                        className="block underline text-blue-500 mx-auto cursor-pointer"
                    >
                        Login here
                    </button>
                </>
            ) : (
                <>
                    <p className="mt-4 text-center">Do not have an account ?</p>
                    <button
                        type="button"
                        onClick={onFormTypeChange}
                        className="block underline text-blue-500 mx-auto cursor-pointer"
                    >
                        Register here
                    </button>
                </>
            )}
            {children}
        </>
    )
}

function Home() {
    const { data, loading, error } = useFetch()

    if (loading) {
        return <div>Loading....</div>
    }

    if (error) {
        return <div>Ups something went wrong....</div>
    }

    const handleLogout = async () => {
        await logoutUser()

        window.history.pushState({}, '', '/')
        window.dispatchEvent(new PopStateEvent('popstate'))
    }

    return (
        <>
            <p>Hi {data?.user}</p>
            <button
                type="button"
                onClick={handleLogout}
                className="block underline text-blue-500 mx-auto cursor-pointer"
            >
                Log out
            </button>
        </>
    )
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { data, loading } = useFetch()

    if (loading) return <div>Loading...</div>

    if (!data) {
        window.history.pushState({}, '', '/login')
        window.dispatchEvent(new PopStateEvent('popstate'))
        return null
    }

    return <>{children}</>
}
