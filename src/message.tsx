import { Message } from "./hooks/use-chat";

interface Props {
  message: Message;
}
export const MessageItem = ({ message }: Props) => {
  return (
    <article className={message.role}>
      <p>{message.content}</p>
    </article>
  );
};
