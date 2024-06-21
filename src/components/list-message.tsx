import { useRef } from "react";
import { useChat } from "../store/chat";
import { MessageItem } from "./message";

export const ListMessage = () => {
  const messages = useChat((state) => state.chats);
  const clearChats = useChat((state) => state.clearChats);
  const container = useRef<HTMLDivElement>(null);
  container.current?.scrollTo(0, container.current.scrollHeight);

  return (
    <section ref={container}>
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}

      {messages.length > 0 && (
        <button className="outline" onClick={clearChats}>Limpiar mensajes</button>
      )}
    </section>
  );
};
