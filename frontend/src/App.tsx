import './App.css'
import { useEffect, useState } from "react";

const baseOptions: RequestInit = {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
    },
    credentials: "include"
}

const postOptions = {
    method: "POST",
    body: JSON.stringify({ username: "example" })
}

function useFetch() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<null | string>(null);

    useEffect(() => {
        (async function fetchData() {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch("http://localhost:3000/auth/register", {
                    ...baseOptions,
                    ...postOptions
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

    return { data, loading, error };
}
function App() {
   const { data, loading, error } = useFetch();

    return (
        <div className="min-h-screen bg-zinc-100 p-8 flex justify-center items-center">
            <div className="max-w-lg mx-auto mb-8 overflow-hidden bg-white rounded-lg shadow-lg">
                <div className="p-8">
                    <h2 className="mb-6 text-2xl font-bold text-gray-900">Login</h2>
                    <form className="space-y-6">
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
                            Sign in
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default App
