import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import DashboardPage from "./DashboardPage";
import CreateConnectorPage from "./CreateConnectorPage";
import WelcomePage from "../WelcomePage";
import useAppContext from "../../../hooks/useAppContext";
import { NetworkContextProvider } from "../../../context/NetworkContext";
import ConnectorEditPage from "./ConnectorEditPage";
import NetworkHeader from "../../network/NetworkHeader";
import CloneConnectorPage from "./CloneConnectorPage";
import ContributorContainer from "../../network/ContributorContainer";
import WorkspaceCreatePage from "../WorkspaceCreatePage";
import WorkspaceEditPage from "../WorkspaceEditPage";

type Props = {};

const NetworkStack = (props: Props) => {
  const { user } = useAppContext();
  return (
    <>
      <NetworkHeader />
      {!user ? (
        <div
          style={{
            minHeight: "calc(100vh - 80px)",
            background: "#0b0d17",
            padding: "40px 20px",
          }}
        >
          <WelcomePage />
        </div>
      ) : (
        <NetworkContextProvider>
          <ContributorContainer>
            <Routes>
              <Route path="/" element={<DashboardPage />}></Route>
              <Route path="/workspaces/new" element={<WorkspaceCreatePage />} />
              <Route
                path="/workspaces/manage"
                element={<WorkspaceEditPage />}
              />
              <Route
                path="/connector"
                element={<Navigate to="/" replace />}
              ></Route>
              <Route
                path="/connector/__new__"
                element={<CreateConnectorPage />}
              ></Route>
              <Route
                path="/clone/:key"
                element={<CloneConnectorPage />}
              ></Route>
              <Route
                path="/connector/:id"
                element={<ConnectorEditPage />}
              ></Route>
              <Route
                path="/connector/:id/*"
                element={<ConnectorEditPage />}
              ></Route>
              <Route path="*" element={<Navigate to="/" replace />}></Route>
            </Routes>
          </ContributorContainer>
        </NetworkContextProvider>
      )}
    </>
  );
};

export default NetworkStack;
