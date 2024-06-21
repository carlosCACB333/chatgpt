import { useChat } from "../store/chat";

export const Form = () => {
  const onPredict = useChat((state) => state.onPredict);
  const isLoaded = useChat((state) => state.isLoaded);
  const isTyping = useChat((state) => state.isTyping);
  const statusText = useChat((state) => state.status.text);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.querySelector("input") as HTMLInputElement;
    const value = input.value.trim();
    if (!value) return;
    form.reset();
    onPredict(value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="search"
        placeholder="¿Qué quieres saber?"
        disabled={!isLoaded || isTyping}
      />
      <small>{statusText}</small>
    </form>
  );
};
