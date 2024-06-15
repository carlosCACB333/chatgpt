import { CreateMLCEngine, MLCEngine } from "@mlc-ai/web-llm";
import { create } from "zustand";

interface Store {
  engine: MLCEngine | null;
  isLoaded: boolean;
  status: {
    text: string;
    progress: number;
  };
}

const model = "stablelm-2-zephyr-1_6b-q4f16_1-MLC";

export const useLlm = create<Store>((set, get) => {
  const init = async () => {
    if (get()?.engine) return;
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
      });
    } catch (error) {
      console.error(error);
      set({
        isLoaded: false,
        status: {
          text: "Error al cargar el modelo",
          progress: 0,
        },
      });
    }
  };

  init();

  return {
    engine: null,
    isLoaded: false,
    status: {
      text: "Cargando...",
      progress: 0,
    },
  };
});
