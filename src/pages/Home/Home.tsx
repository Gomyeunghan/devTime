import Timer from "@/components/Timer/Timer";
import { TimerProvider } from "@/components/Timer/TimerContext";
import TodoModal from "@/components/TodoModal/TodoModal";

function Home() {
    return (
        <TimerProvider>
            <Timer></Timer>
            <TodoModal />
        </TimerProvider>
    );
}

export default Home;
