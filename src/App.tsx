import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import GrinderyLoginProvider from "use-grindery-login";
import { ThemeProvider, CircularProgress } from "grindery-ui";
import WorkspaceContextProvider from "./context/WorkspaceContext";
import AppContextProvider from "./context/AppContext";
import AuthPage from "./components/pages/AuthPage";
import NetworkStack from "./components/pages/network/NetworkStack";

function App() {
  return (
    <ThemeProvider>
      <GrinderyLoginProvider
        loader={
          <div
            style={{
              textAlign: "center",
              color: "#ffb930",
              width: "100%",
              margin: "50px 0",
            }}
          >
            <CircularProgress color="inherit" />
          </div>
        }
        disconnectRedirectUrl="https://www.grindery.io/sign-out?sidebar_opened=1"
      >
        <BrowserRouter>
          <WorkspaceContextProvider>
            <AppContextProvider>
              <Routes>
                <Route path="/github/auth" element={<AuthPage />}></Route>
                <Route path="*" element={<NetworkStack />} />
              </Routes>
            </AppContextProvider>
          </WorkspaceContextProvider>
        </BrowserRouter>
      </GrinderyLoginProvider>
    </ThemeProvider>
  );
}

export default App;
