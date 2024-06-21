import { MODELS } from "../config/model-list";
import { useChat } from "../store/chat";

export const Header = () => {
  const model = useChat((state) => state.model);
  const onInit = useChat((state) => state.onInit);
  const isLoading = useChat((state) => state.isLoading);

  return (
    <header>
      <nav>
        <ul>
          <li>
            <strong>Chat</strong>
          </li>
        </ul>
        <ul>
          <li>
            <select
              disabled={isLoading}
              value={model || "default"}
              onChange={(e) => {
                console.log(e.target.value);
                onInit(e.target.value);
              }}
            >
              <option value="default" disabled>
                Selecciona un modelo
              </option>
              {MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.id}
                </option>
              ))}
            </select>
          </li>
        </ul>
      </nav>
    </header>
  );
};
