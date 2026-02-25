import { Outlet } from "react-router-dom";
import Header from "./components/Header/Header";
import { TimerProvider } from "./components/Timer/TimerContext";

function App() {
    return (
        <>
            <TimerProvider>
                <Header />
                <main>
                    <Outlet />
                </main>
            </TimerProvider>
        </>
    );
}
export default App;
