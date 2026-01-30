import RootLayout from "./root-layout";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <RootLayout>
            <div className="min-h-screen flex flex-col">
                <header className="bg-blue-600 text-white p-4">
                    <h1 className="text-2xl font-bold">My App</h1>
                </header>
                <main className="grow p-4">
                    {children}
                </main>
                <footer className="bg-gray-200 text-center p-4">
                    &copy; 2024 My App
                </footer>
            </div>
        </RootLayout>
    )
}