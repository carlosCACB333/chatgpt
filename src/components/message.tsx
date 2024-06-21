import Markdown from "react-markdown";
import { Message } from "../store/chat";
import { CodeBlock } from "./code-block";

interface Props {
  message: Message;
}
export const MessageItem = ({ message }: Props) => {
  return (
    <article className={message.role}>
      <Markdown
        components={{
          code: CodeBlock,
        }}
      >
        {message.content}
      </Markdown>
    </article>
  );
};
