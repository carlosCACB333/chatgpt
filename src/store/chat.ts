import { CreateMLCEngine, MLCEngine } from "@mlc-ai/web-llm";
import { create } from "zustand";
export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
}

interface Store {
  model: string | null;
  engine: MLCEngine | null;
  chats: Message[];
  isLoaded: boolean;
  isLoading: boolean;
  isTyping: boolean;
  status: {
    text: string;
    progress: number;
  };
  onInit: (model: string) => Promise<void>;
  onPredict: (text: string) => Promise<void>;
  clearChats: () => void;
}

export const useChat = create<Store>((set, get) => {
  const onInit: Store["onInit"] = async (model) => {
    console.log("Initiating model", model);
    set({
      model,
      isLoaded: false,
      isLoading: true,
      status: {
        text: "Cargando...",
        progress: 0,
      },
    });

    try {
      const engine = await CreateMLCEngine(model, {
        initProgressCallback: (progress) => {
          set({
            status: {
              text: progress.text,
              progress: progress.progress,
            },
          });
        },
      });

      set({
        engine,
        isLoaded: true,
        isLoading: false,
      });
    } catch (error) {
      console.error(error);
      set({
        isLoaded: false,
        isLoading: false,
        status: {
          text: "Error al cargar el modelo",
          progress: 0,
        },
      });
    }
  };
  const onPredict: Store["onPredict"] = async (text) => {
    try {
      const engine = get().engine;

      if (!engine || !text) return;

      const withUserMsgs: Message[] = [
        ...get().chats,
        { id: String(Date.now()), content: text, role: "user" },
      ];

      set({
        chats: withUserMsgs,
        isTyping: true,
      });

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
        set({
          chats: withAssistantMsgs,
        });
      }
      set({
        isTyping: false,
      });
    } catch (error) {
      console.error(error);
      set({
        isTyping: false,
        status: {
          text: "Ocurrió un error al predecir",
          progress: 0,
        },
      });
    }
  };

  const clearChats = () => {
    set({
      chats: [],
    });
  };

  return {
    engine: null,
    isLoaded: false,
    status: {
      text: "Selecciona un modelo...",
      progress: 0,
    },
    model: null,
    chats: [],
    isTyping: false,
    onInit,
    onPredict,
    isLoading: false,
    clearChats,
  };
});
