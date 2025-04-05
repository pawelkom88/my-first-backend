import './App.css'

function App() {
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
