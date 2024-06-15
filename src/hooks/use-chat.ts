import { useState } from "react";
import { useLlm } from "../store/llm";

export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
}

export const useChat = () => {
  const engine = useLlm((state) => state.engine);
  const isLoaded = useLlm((state) => state.isLoaded);
  const loadStatus = useLlm((state) => state.status.text);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!engine) return;
    const input = e.currentTarget.querySelector("input") as HTMLInputElement;
    const message = input.value;
    if (!message) return;

    const withUserMsgs: Message[] = [
      ...messages,
      { id: String(Date.now()), content: message, role: "user" },
    ];

    e.currentTarget.reset();
    setIsTyping(true);
    setMessages(withUserMsgs);
    const id = "assistant_" + String(Date.now());

    const chunks = await engine.chat.completions.create({
      messages: [...withUserMsgs.slice(-5)],
      stream: true,
    });

    let completions = "";
    for await (const chunk of chunks) {
      completions += chunk.choices[0].delta.content || "";

      const withAssistantMsgs: Message[] = [
        ...withUserMsgs,
        { id, content: completions, role: "assistant" },
      ];

      setMessages(withAssistantMsgs);
    }
    setIsTyping(false);
  };
  return {
    engine,
    isLoaded,
    loadStatus,
    messages,
    isTyping,
    handleSubmit,
  };
};
