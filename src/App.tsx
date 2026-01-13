import { Outlet } from "react-router-dom";

function App() {
    return (
        <>
            <header>헤더</header>

            <Outlet />

            <footer>푸터</footer>
        </>
    );
}
export default App;
