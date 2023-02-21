import React, { createContext, useEffect, useReducer, useState } from "react";
import axios from "axios";
import _ from "lodash";
import { useNavigate } from "react-router";
import { CDS_EDITOR_API_ENDPOINT, isLocalOrStaging } from "../constants";
import { useGrinderyNexus } from "use-grindery-nexus";
import useWorkspaceContext from "../hooks/useWorkspaceContext";
import useNetworkContext from "../hooks/useNetworkContext";
import useAppContext from "../hooks/useAppContext";

export const NOT_ALLOWED = `Published connector can't be updated. You can clone the connector and create a new version.`;

type StateProps = {
  id: string;
  cds: any;
  connector: any;
  isSaving: boolean;
  isPublishing: boolean;
  confirm: {
    message: string;
    opened: boolean;
    onClose: () => void;
    onConfirm: () => void;
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
  setState: React.Dispatch<Partial<StateProps>>;
  saveConnector: () => void;
  publishConnector: (comment: string) => void;
  onConnectorSettingsSave: (data: any) => void;
  onOperationSettingsSave: (type: any, operation: any) => void;
  onOperationDelete: (type: any, operationKey: string) => void;
  onInputFieldSave: (
    key: string,
    type: any,
    inputKey: string,
    inputData: any
  ) => void;
  onInputFieldDelete: (key: string, type: any, inputKey: string) => void;
  onOutputFieldSave: (
    key: string,
    type: any,
    inputKey: string,
    inputData: any,
    sample: string
  ) => void;
  onOutputFieldDelete: (key: string, type: any, inputKey: string) => void;
};

type ConnectorContextProps = {
  children: React.ReactNode;
  connector: any;
};

const defaultContext = {
  state: {
    id: "",
    cds: null,
    connector: null,
    isSaving: false,
    isPublishing: false,
    confirm: {
      message: "",
      opened: false,
      onClose: () => {},
      onConfirm: () => {},
    },
    snackbar: {
      opened: false,
      message: "",
      severity: "",
      onClose: () => {},
    },
  },
  setState: () => {},
  saveConnector: () => {},
  publishConnector: () => {},
  onConnectorSettingsSave: () => {},
  onOperationSettingsSave: () => {},
  onOperationDelete: () => {},
  onInputFieldSave: () => {},
  onInputFieldDelete: () => {},
  onOutputFieldSave: () => {},
  onOutputFieldDelete: () => {},
};

export const ConnectorContext = createContext<ContextProps>(defaultContext);

export const ConnectorContextProvider = ({
  children,
  connector,
}: ConnectorContextProps) => {
  const { user, userEmail } = useAppContext();
  const { workspaceToken } = useWorkspaceContext();
  const { token } = useGrinderyNexus();
  const { refreshConnectors } = useNetworkContext();
  let navigate = useNavigate();
  const [count, setCount] = useState(0);
  const cds = connector || {};
  const [state, setState] = useReducer(
    (state: StateProps, newState: Partial<StateProps>) => ({
      ...state,
      ...newState,
    }),
    {
      id: cds.key || connector?.id || "",
      cds: cds,
      connector: connector || null,
      isSaving: false,
      isPublishing: false,
      confirm: {
        message: "",
        opened: false,
        onClose: () => {},
        onConfirm: () => {},
      },
      snackbar: {
        opened: false,
        message: "",
        severity: "",
        onClose: () => {},
      },
    }
  );

  const checkStatus = () => {
    if (!state.cds.access || state.cds.access === "Public") {
      setState({
        isSaving: false,
        snackbar: {
          opened: true,
          message: NOT_ALLOWED,
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
      return false;
    }
    return true;
  };

  const showError = (err: any) => {
    setState({
      isSaving: false,
      snackbar: {
        opened: true,
        message: `Saving failed. ${
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Please, try again later"
        }.`,
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
  };

  const showSuccess = (message: string) => {
    setState({
      snackbar: {
        opened: true,
        message,
        severity: "success",
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

  const saveConnector = async () => {
    if (!checkStatus()) {
      return;
    }

    if (count > 0) {
      setState({
        isSaving: true,
      });

      try {
        await axios.patch(
          `${CDS_EDITOR_API_ENDPOINT}/cds`,
          {
            cds: JSON.stringify(state.cds),
            environment: isLocalOrStaging ? "staging" : "production",
          },
          {
            headers: {
              Authorization: `Bearer ${workspaceToken || token?.access_token}`,
            },
          }
        );
      } catch (err: any) {
        console.error("saveConnector error => ", err.message);
        showError(err);
        return;
      }
      setState({
        isSaving: false,
      });
      showSuccess("Connector saved");
      refreshConnectors(state.cds);
    }
  };

  const publishConnector = async (comment: string) => {
    if (!checkStatus()) {
      return;
    }

    setState({
      isPublishing: true,
    });

    try {
      await axios.post(
        `${CDS_EDITOR_API_ENDPOINT}/cds/publish`,
        {
          email: userEmail || "",
          connector_name: state.cds.name || "",
          connector_key: state.cds.key || "",
          comment: comment,
          environment: isLocalOrStaging ? "staging" : "production",
        },
        {
          headers: {
            Authorization: `Bearer ${workspaceToken || token?.access_token}`,
          },
        }
      );
    } catch (err: any) {
      console.error("publishConnector error => ", err.message);

      setState({
        isPublishing: false,
        snackbar: {
          opened: true,
          message: `Publishing failed. ${
            err?.response?.data?.message ||
            err?.response?.data?.error ||
            err?.message ||
            "Please, try again later"
          }.`,
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
      connector: {
        ...state.connector,
        submitted: true,
      },
      cds: {
        ...state.cds,
        submitted: true,
      },
      isPublishing: false,
      snackbar: {
        opened: true,
        message: `Connector submitted for publishing. It will appear in the app after manual review and approval.`,
        severity: "success",
        duration: 6000,
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
    navigate(`/connector/${state.cds.key}`);
  };

  const onConnectorSettingsSave = (data: any) => {
    if (!checkStatus()) {
      return;
    }

    if (data) {
      setState({
        cds: {
          ...state.cds,
          name: data.name,
          icon: data.icon,
          description: data.description,
          access: data.access,
        },
      });
      showSuccess("Connector saved");
      navigate(`/connector/${state.id}`);
    }
  };

  const onOperationSettingsSave = (type: any, operation: any) => {
    if (!checkStatus()) {
      return;
    }
    if (type) {
      if (operation) {
        const isNewoperation = !(state.cds?.[type] || [])?.find(
          (op: any) => op.key === operation.key
        );
        const operations = isNewoperation
          ? [...(state.cds?.[type] || []), operation]
          : [
              ...((state.cds?.[type] || []).map((op: any) => {
                if (op.key === operation.key) {
                  return operation;
                } else {
                  return op;
                }
              }) || []),
            ];
        setState({
          cds: { ...state.cds, [type]: [...operations] },
        });
        navigate(
          `/connector/${state.id}/${type}/${operation.key}/${
            isNewoperation ? "inputFields" : "settings"
          }`
        );
      }
    }
  };

  const onOperationDelete = (type: any, operationKey: string) => {
    if (!checkStatus()) {
      return;
    }
    setState({
      confirm: {
        message: `Are you sure you want to delete this ${
          type === "triggers" ? "trigger" : "action"
        }?`,
        opened: true,
        onClose: () => {
          setState({
            confirm: {
              opened: false,
              message: "",
              onClose: () => {},
              onConfirm: () => {},
            },
          });
        },
        onConfirm: () => {
          if (type) {
            const newCDS = _.cloneDeep(state.cds);
            const index = (newCDS?.[type] || []).findIndex(
              (op: { key: string }) => op.key === operationKey
            );
            newCDS?.[type]?.splice(index, 1);
            setState({
              cds: newCDS,
            });
          }
        },
      },
    });
  };

  const onInputFieldSave = (
    key: string,
    type: any,
    inputKey: string,
    inputData: any
  ) => {
    if (!checkStatus()) {
      return;
    }
    navigate(`/connector/${state.id}/${type}/${key}/inputFields`);
    if (type) {
      setState({
        cds: {
          ...state.cds,
          [type]: [
            ...((state.cds?.[type] || []).map((op: any) => {
              if (op.key === key) {
                return {
                  ...op,
                  operation: {
                    ...op.operation,
                    inputFields: [
                      ...(op.operation?.inputFields?.map((field: any) => {
                        if (field.key === inputKey) {
                          return {
                            ...field,
                            ...inputData,
                          };
                        } else {
                          return field;
                        }
                      }) || []),
                      ...(inputKey === "__new__" ? [{ ...inputData }] : []),
                    ],
                  },
                };
              } else {
                return op;
              }
            }) || []),
          ],
        },
      });
    }
  };

  const onInputFieldDelete = (key: string, type: any, inputKey: string) => {
    if (!checkStatus()) {
      return;
    }

    setState({
      confirm: {
        message: "Are you sure you want to delete the input field?",
        opened: true,
        onClose: () => {
          setState({
            confirm: {
              opened: false,
              message: "",
              onClose: () => {},
              onConfirm: () => {},
            },
          });
        },
        onConfirm: () => {
          if (type) {
            setState({
              cds: {
                ...state.cds,
                [type]: [
                  ...((state.cds?.[type] || [])?.map((op: any) => {
                    if (op.key === key) {
                      return {
                        ...op,
                        operation: {
                          ...op.operation,
                          inputFields: [
                            ...(op.operation?.inputFields?.filter(
                              (field: any) => field.key !== inputKey
                            ) || []),
                          ],
                        },
                      };
                    } else {
                      return op;
                    }
                  }) || []),
                ],
              },
            });
          }
        },
      },
    });
  };

  const onOutputFieldSave = (
    key: string,
    type: any,
    inputKey: string,
    inputData: any,
    sample: string
  ) => {
    if (!checkStatus()) {
      return;
    }

    navigate(`/connector/${state.id}/${type}/${key}/outputFields`);
    if (type) {
      setState({
        cds: {
          ...state.cds,
          [type]: [
            ...((state.cds?.[type] || []).map((op: any) => {
              if (op.key === key) {
                return {
                  ...op,
                  operation: {
                    ...op.operation,
                    outputFields: [
                      ...(op.operation?.outputFields?.map((field: any) => {
                        if (field.key === inputKey) {
                          return {
                            ...field,
                            ...inputData,
                          };
                        } else {
                          return field;
                        }
                      }) || []),
                      ...(inputKey === "__new__" ? [{ ...inputData }] : []),
                    ],
                    sample: {
                      ...op.operation?.sample,
                      [inputKey === "__new__" ? inputData.key : inputKey]:
                        sample,
                    },
                  },
                };
              } else {
                return op;
              }
            }) || []),
          ],
        },
      });
    }
  };

  const onOutputFieldDelete = (key: string, type: any, inputKey: string) => {
    if (!checkStatus()) {
      return;
    }
    setState({
      confirm: {
        message: "Are you sure you want to delete the output field?",
        opened: true,
        onClose: () => {
          setState({
            confirm: {
              opened: false,
              message: "",
              onClose: () => {},
              onConfirm: () => {},
            },
          });
        },
        onConfirm: () => {
          if (type) {
            setState({
              cds: {
                ...state.cds,
                [type]: [
                  ...((state.cds?.[type] || [])?.map((op: any) => {
                    if (op.key === key) {
                      const sample = {
                        ...op.operation?.sample,
                      };
                      delete sample[inputKey];
                      return {
                        ...op,
                        operation: {
                          ...op.operation,
                          outputFields: [
                            ...(op.operation?.outputFields?.filter(
                              (field: any) => field.key !== inputKey
                            ) || []),
                          ],
                          sample: {
                            ...sample,
                          },
                        },
                      };
                    } else {
                      return op;
                    }
                  }) || []),
                ],
              },
            });
          }
        },
      },
    });
  };

  useEffect(() => {
    setCount((count) => count + 1);
    saveConnector();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.cds]);

  if (isLocalOrStaging) {
    console.log("connector state", state);
  }

  return (
    <ConnectorContext.Provider
      value={{
        state,
        setState,
        saveConnector,
        publishConnector,
        onConnectorSettingsSave,
        onOperationSettingsSave,
        onOperationDelete,
        onInputFieldSave,
        onInputFieldDelete,
        onOutputFieldSave,
        onOutputFieldDelete,
      }}
    >
      {children}
    </ConnectorContext.Provider>
  );
};

export default ConnectorContextProvider;
