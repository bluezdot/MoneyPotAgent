import reactLogo from '@/assets/react.svg'
import MainLayout from "../components/layout/main-layout"
import { useCountStore } from "@/stores/count"
import { Button } from "@/components/ui/button"
import { Minus, Plus, RotateCcw } from "lucide-react"

function Home() {
    const { count, increment, decrement, reset } = useCountStore()

    return (
        <MainLayout>
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
                <div className="flex items-center gap-6">
                    <a href="https://vite.dev" target="_blank" rel="noreferrer" className="transition-transform hover:scale-110">
                        <img src="/vite.svg" className="h-24 w-24" alt="Vite logo" />
                    </a>
                    <a href="https://react.dev" target="_blank" rel="noreferrer" className="transition-transform hover:scale-110">
                        <img src={reactLogo} className="h-24 w-24 animate-spin animation-duration-[10s]" alt="React logo" />
                    </a>
                </div>

                <h1 className="text-4xl font-bold bg-linear-to-r from-purple-500 to-cyan-500 bg-clip-text text-transparent">
                    Vite + React
                </h1>

                <div className="flex flex-col items-center gap-6 p-8 rounded-2xl bg-card border shadow-lg">
                    <span className="text-6xl font-bold tabular-nums">{count}</span>

                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="icon" onClick={decrement}>
                            <Minus className="h-4 w-4" />
                        </Button>
                        <Button onClick={increment} size="lg">
                            Increment
                            <Plus className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={reset}>
                            <RotateCcw className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <p className="text-muted-foreground text-sm">
                    Click on the Vite and React logos to learn more
                </p>
            </div>
        </MainLayout>
    )
}

export default Home
