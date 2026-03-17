import { Outlet } from "react-router-dom";
import Header from "./components/Header/Header";
import { TimerProvider } from "./components/Timer/TimerContext";

function App() {
    return (
        <>
            <TimerProvider>
                <Header />
                <main
                    style={{
                        maxWidth: "1200px",
                        margin: "0 auto",
                        padding: "40px 24px 48px",
                        width: "100%",
                    }}
                >
                    <Outlet />
                </main>
            </TimerProvider>
        </>
    );
}
export default App;
