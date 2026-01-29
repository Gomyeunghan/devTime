import Tiemr from "@/components/Timer/Timer";
import { TimerProvider } from "@/components/Timer/TimerContext";
import TodoModal from "@/components/TodoModal/TodoModla";

function Home() {
    return (
        <>
            <TimerProvider>
                <Tiemr></Tiemr>
                <TodoModal />
            </TimerProvider>
        </>
    );
}

export default Home;
