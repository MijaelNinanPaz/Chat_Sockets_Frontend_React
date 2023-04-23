import { useRef, useState } from "react";
import "./App.css";
import io from "socket.io-client";
import { useEffect } from "react";

// const socket = io("http://localhost:4000");
const socket = io("https://chatsocketsbackendexpress.up.railway.app/");

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([])

  const chatContainerRef = useRef(null);

  useEffect(() => {
    const receiveMessage = (message) => {
      setMessages([...messages, message])
    }

    socket.on("message", receiveMessage);

    // Desplazar automáticamente hacia el último mensaje
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;

    return () => {
      socket.off("message", receiveMessage);
    };
  }, [messages]);

  const handleSubmit = e => {
    e.preventDefault();
    socket.emit("message", message);
    const newMessage = {
      body: message,
      from: "Yo"
    }
    setMessages([...messages, newMessage]);
    setMessage("");

    // Desplazar automáticamente hacia el último mensaje
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  };
  return (
    <div className="h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-zinc-900 p-10">
        <ul className="h-80 overflow-y-auto" ref={chatContainerRef}>
          {messages.map((message, index) => (
            <li
              key={index}
              className={`my-2 p-2 table text-sm rounded-md ${
                message.from === "Yo" ? "bg-sky-700 ml-auto" : "bg-black"
              }`}
              >
              <p>{message.from}: {message.body}</p>
            </li>
          ))}
        </ul>
        <input
          type="text"
          onChange={e => setMessage(e.target.value)}
          value={message}
          className="border-2 border-zinc-500 p-2 w-full"
        />
        <button>enviar</button>
        <h1 className="text-xl font-bold my-2">Chat Socket by Mijael</h1>
      </form>
    </div>
  );
}

export default App;
