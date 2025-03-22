// useProjecstWebSocket.js

import { useEffect } from "react";
import { connectToWebSocket } from "../webSockets";

const useProjectsWebSocket = (setProjects) => {
    useEffect(() => {
        // Подключаемся к WebSocket
        const socket = connectToWebSocket((projects) => {
            // Когда получаем новые проекты, обновляем состояние
            setProjects(projects);
        });

        // Очищаем соединение при размонтировании компонента
        return () => {
            socket.close();
        };
    }, [setProjects]);
};

export default useProjectsWebSocket;