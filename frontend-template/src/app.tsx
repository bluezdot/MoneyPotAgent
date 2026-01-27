import Landing from "./pages/landing"
import { Route, Routes } from "react-router"
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'

// Create a client
const queryClient = new QueryClient()

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Routes>
                <Route path="/" element={<Landing />} />
            </Routes>
        </QueryClientProvider>
    )
}

export default App
