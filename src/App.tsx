import { Outlet } from "react-router-dom";
import Header from "./components/Header/Header";
import { TimerProvider } from "./components/Timer/TimerContext";

function App() {
    return (
        <>
            <TimerProvider>
                <Header />
                <main style={{ padding: "40px 360px 48px 360px" }}>
                    <Outlet />
                </main>
            </TimerProvider>
        </>
    );
}
export default App;
