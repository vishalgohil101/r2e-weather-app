import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { store, persistor } from "./app/store";
import { PersistGate } from "redux-persist/integration/react";
import { CustomThemeProvider } from "./context/ThemeContext";

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <CustomThemeProvider>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </CustomThemeProvider>
);
