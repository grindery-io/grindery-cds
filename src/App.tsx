import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import GrinderyNexusContextProvider from "use-grindery-nexus";
import { ThemeProvider } from "grindery-ui";
import WorkspaceContextProvider from "./context/WorkspaceContext";
import AppContextProvider from "./context/AppContext";
import EarlyAccessModal from "./components/shared/EarlyAccessModal";
import AuthPage from "./components/pages/AuthPage";
import NetworkStack from "./components/pages/network/NetworkStack";

function App() {
  return (
    <ThemeProvider>
      <GrinderyNexusContextProvider>
        <BrowserRouter>
          <WorkspaceContextProvider>
            <AppContextProvider>
              <EarlyAccessModal />
              <Routes>
                <Route path="/github/auth" element={<AuthPage />}></Route>
                <Route path="*" element={<NetworkStack />} />
              </Routes>
            </AppContextProvider>
          </WorkspaceContextProvider>
        </BrowserRouter>
      </GrinderyNexusContextProvider>
    </ThemeProvider>
  );
}

export default App;
