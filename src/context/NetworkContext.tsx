//import NexusClient from "grindery-nexus-client";
import axios from "axios";
import React, { createContext, useEffect, useReducer } from "react";
import { useGrinderyLogin } from "use-grindery-login";
import Snackbar from "../components/network/Snackbar";
import { CDS_EDITOR_API_ENDPOINT, isLocalOrStaging } from "../constants";
import useWorkspaceContext from "../hooks/useWorkspaceContext";

type StateProps = {
  connectors: any[];
  connectorsLoading: boolean;
  blockchains: any[];
  contributor: {
    connecting?: boolean;
    loading: boolean;
    id?: string;
    username?: string;
    avatar?: string;
    url?: string;
    error?: string;
  };
  snackbar: {
    opened: boolean;
    message: string;
    severity: string;
    onClose: () => void;
    duration?: number;
  };
};

type ContextProps = {
  state: StateProps;
  refreshConnectors: (cds?: any) => Promise<{ success: boolean }>;
  cloneConnector: (cds: any) => Promise<string>;
  connectContributor: (code: string) => void;
  deleteConnector: (key: string) => void;
  moveConnector: (
    connectorKey: string,
    workspaceKey: string,
    workspacetitle: string
  ) => void;
};

type NetworkContextProps = {
  children: React.ReactNode;
};

const defaultContext = {
  state: {
    connectors: [],
    connectorsLoading: true,
    blockchains: [],
    contributor: {
      loading: true,
    },
    snackbar: {
      opened: false,
      message: "",
      severity: "",
      onClose: () => {},
    },
  },
  refreshConnectors: async () => {
    return { success: false };
  },
  cloneConnector: async () => {
    return "";
  },
  connectContributor: () => {},
  deleteConnector: () => {},
  moveConnector: async () => {},
};

export const NetworkContext = createContext<ContextProps>(defaultContext);

export const NetworkContextProvider = ({ children }: NetworkContextProps) => {
  const { workspaceToken } = useWorkspaceContext();
  const { token } = useGrinderyLogin();

  const [state, setState] = useReducer(
    (state: StateProps, newState: Partial<StateProps>) => ({
      ...state,
      ...newState,
    }),
    {
      connectors: [],
      connectorsLoading: true,
      blockchains: [],
      contributor: {
        loading: true,
      },
      snackbar: {
        opened: false,
        message: "",
        severity: "",
        onClose: () => {},
      },
    }
  );

  const getConnectors = async (
    userToken: string | undefined,
    workspaceToken: string | null
  ) => {
    setState({ connectorsLoading: true });
    if (!userToken && !workspaceToken) {
      setState({ connectors: [], connectorsLoading: true });
    } else {
      let res;
      try {
        res = await axios.get(
          `${CDS_EDITOR_API_ENDPOINT}/cds?environment=${
            isLocalOrStaging ? "staging" : "production"
          }`,
          {
            headers: {
              Authorization: `Bearer ${workspaceToken || userToken}`,
            },
          }
        );
      } catch (err: any) {
        console.error("getConnectors error", err);
        setState({
          ...state,
          connectorsLoading: false,
          snackbar: {
            opened: true,
            message: err?.message || "Server error, please reload the page.",
            severity: "error",
            duration: 5000,
            onClose: () => {
              setState({
                snackbar: {
                  opened: false,
                  message: "",
                  severity: "error",
                  onClose: () => {},
                },
              });
            },
          },
        });
        return;
      }
      setState({
        connectors: res?.data?.result || [],
        connectorsLoading: false,
      });
    }
  };

  const refreshConnectors = async (cds?: any) => {
    if (cds) {
      setState({
        connectors: [
          ...state.connectors.map((c) => {
            if (c.key !== cds.key) {
              return c;
            } else {
              return cds;
            }
          }),
        ],
      });
      return { success: true };
    } else {
      if (!token?.access_token && !workspaceToken) {
        return { success: false };
      } else {
        let res;
        try {
          res = await axios.get(
            `${CDS_EDITOR_API_ENDPOINT}/cds?environment=${
              isLocalOrStaging ? "staging" : "production"
            }`,
            {
              headers: {
                Authorization: `Bearer ${
                  workspaceToken || token?.access_token
                }`,
              },
            }
          );
        } catch (err) {
          console.error("getConnectors error", err);
          return { success: false };
        }
        setState({
          connectors: res?.data?.result || [],
        });
        return { success: true };
      }
    }
  };

  const getChains = async (userToken: string | undefined) => {
    if (!userToken) {
      setState({ blockchains: [] });
    } else {
      let res;
      try {
        res = await axios.get(
          `${CDS_EDITOR_API_ENDPOINT}/blockchains?environment=${
            isLocalOrStaging ? "staging" : "production"
          }`,
          {
            headers: {
              Authorization: `Bearer ${workspaceToken || userToken}`,
            },
          }
        );
      } catch (err) {
        console.error("getConnectors error", err);
      }
      setState({
        blockchains: res?.data?.result || [],
      });
    }
  };

  const cloneConnector = async (cds: any) => {
    let res;
    try {
      res = await axios.post(
        `${CDS_EDITOR_API_ENDPOINT}/cds/clone`,
        {
          cds: JSON.stringify(cds),
          username: state.contributor?.username || "",
          environment: isLocalOrStaging ? "staging" : "production",
        },
        {
          headers: {
            Authorization: `Bearer ${workspaceToken || token?.access_token}`,
          },
        }
      );
    } catch (err: any) {
      console.error("cloneCDS error", err);
      throw new Error(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          err?.message ||
          "Server error"
      );
    }
    if (res?.data?.key) {
      if (res?.data?.connector) {
        setState({
          connectors: [...state.connectors, res?.data?.connector],
        });
      }

      return res.data.key;
    } else {
      throw new Error("Server error. Please, try again later.");
    }
  };

  const getContributor = async () => {
    let res;
    try {
      res = await axios.get(
        `${CDS_EDITOR_API_ENDPOINT}/contributor?environment=${
          isLocalOrStaging ? "staging" : "production"
        }`,
        {
          headers: {
            Authorization: `Bearer ${workspaceToken || token?.access_token}`,
          },
        }
      );
    } catch (err: any) {
      console.error("getContributor error", err);
      const error =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Server error, please reload the page.";
      setState({
        ...state,
        contributor: {
          ...state.contributor,
          loading: false,
          error: error || "Server error, please reload the page.",
        },
        snackbar: {
          opened: true,
          message: error || "Server error, please reload the page.",
          severity: "error",
          duration: 10000,
          onClose: () => {
            setState({
              snackbar: {
                opened: false,
                message: "",
                severity: "error",
                onClose: () => {},
              },
            });
          },
        },
      });
      return;
    }

    setState({
      contributor: {
        loading: false,
        error: undefined,
        id: res?.data?.id,
        username: res?.data?.username,
        avatar: res?.data?.avatar,
        url: res?.data?.url,
      },
    });
  };

  const connectContributor = async (code: string) => {
    setState({
      contributor: {
        connecting: true,
        loading: false,
      },
    });
    let res;
    try {
      res = await axios.post(
        `${CDS_EDITOR_API_ENDPOINT}/contributor`,
        {
          code,
          environment: isLocalOrStaging ? "staging" : "production",
        },
        {
          headers: {
            Authorization: `Bearer ${workspaceToken || token?.access_token}`,
          },
        }
      );
    } catch (err: any) {
      console.error("connectContributor error", err);
      setState({
        contributor: {
          loading: false,
          connecting: false,
          error:
            err?.response?.data?.error ||
            err?.response?.data?.message ||
            err?.message ||
            "Server error",
        },
      });
      return;
    }

    setState({
      contributor: {
        loading: false,
        error: undefined,
        connecting: false,
        id: res?.data?.id,
        username: res?.data?.username,
        avatar: res?.data?.avatar,
        url: res?.data?.url,
      },
    });
  };

  const deleteConnector = async (key: string) => {
    let res;
    try {
      res = await axios.delete(
        `${CDS_EDITOR_API_ENDPOINT}/cds/${key}?environment=${
          isLocalOrStaging ? "staging" : "production"
        }`,
        {
          headers: {
            Authorization: `Bearer ${workspaceToken || token?.access_token}`,
          },
        }
      );
    } catch (err: any) {
      console.error("deleteConnector error", err);
      throw new Error(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          err?.message ||
          "Server error"
      );
    }
    if (res?.data?.success) {
      refreshConnectors();
    } else {
      throw new Error("Server error. Please, try again later.");
    }
  };

  const moveConnector = async (
    connectorKey: string,
    workspaceKey: string,
    workspaceTitle: string
  ) => {
    const connector = [...state.connectors].find((c) => c.key === connectorKey);
    if (!connector) {
      setState({
        ...state,
        snackbar: {
          opened: true,
          message: "Connector not selected",
          severity: "error",
          duration: 5000,
          onClose: () => {
            setState({
              snackbar: {
                opened: false,
                message: "",
                severity: "error",
                onClose: () => {},
              },
            });
          },
        },
      });
      return;
    }
    const updatedConnector = {
      ...connector,
      workspace: workspaceKey,
    };
    try {
      await axios.patch(
        `${CDS_EDITOR_API_ENDPOINT}/cds`,
        {
          cds: JSON.stringify(updatedConnector),
          environment: isLocalOrStaging ? "staging" : "production",
        },
        {
          headers: {
            Authorization: `Bearer ${workspaceToken || token?.access_token}`,
          },
        }
      );
    } catch (err: any) {
      console.error("moveConnector error => ", err.message);
      setState({
        ...state,
        snackbar: {
          opened: true,
          message: err.message || "Unexpected error",
          severity: "error",
          duration: 5000,
          onClose: () => {
            setState({
              snackbar: {
                opened: false,
                message: "",
                severity: "error",
                onClose: () => {},
              },
            });
          },
        },
      });
      return;
    }
    setState({
      ...state,
      connectors: [...state.connectors.filter((c) => c.key !== connectorKey)],
      snackbar: {
        opened: true,
        message: `Connector moved to ${workspaceTitle} workspace`,
        severity: "success",
        duration: 5000,
        onClose: () => {
          setState({
            snackbar: {
              opened: false,
              message: "",
              severity: "success",
              onClose: () => {},
            },
          });
        },
      },
    });
  };

  useEffect(() => {
    if (workspaceToken || token?.access_token) {
      getContributor();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceToken, token?.access_token]);

  useEffect(() => {
    if (state.contributor.id && (token?.access_token || workspaceToken)) {
      getConnectors(token?.access_token, workspaceToken);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token?.access_token, workspaceToken, state.contributor.id]);

  useEffect(() => {
    getChains(token?.access_token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token?.access_token]);

  return (
    <NetworkContext.Provider
      value={{
        state,
        refreshConnectors,
        cloneConnector,
        connectContributor,
        deleteConnector,
        moveConnector,
      }}
    >
      {children}
      <Snackbar state={{ ...state.snackbar }} />
    </NetworkContext.Provider>
  );
};

export default NetworkContextProvider;
