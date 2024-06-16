import { useRef } from "react";
import "./App.css";
import { useChat } from "./hooks/use-chat";
import { MessageItem } from "./message";

function App() {
  const { handleSubmit, messages, isLoaded, isTyping, loadStatus } = useChat();
  const container = useRef<HTMLDivElement>(null);
  container.current?.scrollTo(0, container.current.scrollHeight);

  return (
    <main>
      <section ref={container}>
        {messages.map((message) => (
          <MessageItem key={message.id} message={message} />
        ))}
      </section>
      <form onSubmit={handleSubmit}>
        <input
          type="search"
          placeholder="¿Qué quieres saber?"
          disabled={!isLoaded || isTyping}
        />
        <small>{loadStatus}</small>
      </form>
    </main>
  );
}

export default App;
