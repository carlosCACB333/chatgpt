import "./App.css";
import { Form } from "./components/form";
import { Header } from "./components/header";
import { ListMessage } from "./components/list-message";

function App() {
  return (
    <main>
      <Header />
      <ListMessage />
      <Form />
    </main>
  );
}

export default App;
