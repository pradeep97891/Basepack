import { AppRoute } from "@/routes/index.route";
import { DocumentHead } from "@/components/DocumentHead/DocumentHead";
import ThemeManager from "@/components/ThemeManager/ThemeManager";
import { ErrorBoundary } from "react-error-boundary";
import ServerError from "./pages/Unauth/ServerError/ServerError";

function App() {
  return (
    <ErrorBoundary fallback={<ServerError />}>
      <ThemeManager>
        <AppRoute />
        <DocumentHead />
      </ThemeManager>
    </ErrorBoundary>
  );
}

export default App;
