import React, { useState } from "react";
import styled from "styled-components";
import {
  RichInput,
  Tooltip,
  CircularProgress,
  Autocomplete,
} from "grindery-ui";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";
import Button from "../../network/Button";
import useConnectorContext from "../../../hooks/useConnectorContext";
import { useNavigate } from "react-router";

const Title = styled.h3`
  font-weight: 700;
  font-size: 32px;
  line-height: 120%;
  color: #0b0d17;
  padding: 0;
  margin: 0 0 20px;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 20px;
  margin-top: 32px;
`;

const ButtonsRight = styled.div`
  margin-left: auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: nowrap;
  gap: 10px;
`;

const AutocompleteWrapper = styled.div`
  & .MuiOutlinedInput-root {
    box-shadow: none !important;
    border: 1px solid #dcdcdc !important;
  }

  &.has-error .MuiOutlinedInput-root {
    box-shadow: inset 0px 0px 0px 1px #ff5858 !important;
    border: 1px solid #ff5858 !important;
  }
`;

const JSONWrapper = styled.div`
  margin: 20px 0;
`;

const JSONLabel = styled.div`
  margin: 0 0 4px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 6px;
`;

const JSONLabelText = styled.p`
  font-size: 14px;
  line-height: 150%;
  text-align: left;
  color: #0b0d17;
  font-style: normal;
  font-weight: 400;
  margin: 0;
  padding: 0;
`;

const JSONInfo = styled.span`
  color: #898989;
  font-size: 14px !important;
`;

const JSONRequired = styled.p`
  font-size: 14px;
  color: #898989;
  line-height: 150%;
  font-style: normal;
  font-weight: 400;
  margin: 0 0 0 auto;
  padding: 0;
`;

const JSONError = styled.p`
  font-weight: 400;
  font-size: 14px;
  line-height: 150%;
  color: #ff5858;
  margin: 4px 0 0;
  padding: 0;
`;

type JSONFieldType = {
  key:
    | "test"
    | "authenticatedRequestTemplate"
    | "allowedHosts"
    | "fields"
    | "label"
    | "oauth1Config"
    | "oauth2Config"
    | "sessionConfig";
  label: string;
  placeholder: string;
  tooltip: string;
  required?: boolean;
  hide?: boolean;
};

type Props = {};

const ConnectorAuthenticationPage = (props: Props) => {
  const { state, onConnectorAuthenticationSave } = useConnectorContext();
  let navigate = useNavigate();
  const { cds, id } = state;
  const [data, setData] = useState({
    type: cds.authentication?.type || "none",
    test:
      (cds.authentication?.test &&
        JSON.stringify(cds.authentication?.test, null, 2)) ||
      "",
    defaultDisplayName: cds.authentication?.defaultDisplayName || "",
    authenticatedRequestTemplate:
      (cds.authentication?.authenticatedRequestTemplate &&
        JSON.stringify(
          cds.authentication?.authenticatedRequestTemplate,
          null,
          2
        )) ||
      "",
    allowedHosts:
      (cds.authentication?.allowedHosts &&
        JSON.stringify(cds.authentication?.allowedHosts, null, 2)) ||
      "",
    fields:
      (cds.authentication?.fields &&
        JSON.stringify(cds.authentication?.fields, null, 2)) ||
      "",
    label:
      (cds.authentication?.label &&
        JSON.stringify(cds.authentication?.label, null, 2)) ||
      "",
    oauth1Config:
      (cds.authentication?.oauth1Config &&
        JSON.stringify(cds.authentication?.oauth1Config, null, 2)) ||
      "",
    oauth2Config:
      (cds.authentication?.oauth2Config &&
        JSON.stringify(cds.authentication?.oauth2Config, null, 2)) ||
      "",
    sessionConfig:
      (cds.authentication?.sessionConfig &&
        JSON.stringify(cds.authentication?.sessionConfig, null, 2)) ||
      "",
  });
  const [error, setError] = useState({ type: "", text: "" });

  const typeOptions = [
    {
      value: "none",
      label: "None",
    },
    {
      value: "basic",
      label: "Basic",
    },
    {
      value: "custom",
      label: "Custom",
    },
    {
      value: "digest",
      label: "Digest",
    },
    {
      value: "oauth1",
      label: "OAuth1",
    },
    {
      value: "oauth2",
      label: "OAuth2",
    },
    {
      value: "session",
      label: "Session",
    },
  ];

  const jsonFields: JSONFieldType[] = [
    {
      key: "test",
      label: "Test schema",
      placeholder: `{method: "GET", url: "https://example.com"}`,
      tooltip:
        "See schema definition for reference: https://github.com/grindery-io/grindery-nexus-schema-v2/tree/master/connectors#requestschema",
      required: true,
    },
    {
      key: "authenticatedRequestTemplate",
      label: "Extra request options",
      placeholder: `{method: "GET", url: "https://example.com"}`,
      tooltip:
        "Added to all requests sent via credential manager. See schema definition for reference: https://github.com/grindery-io/grindery-nexus-schema-v2/tree/master/connectors#requestschema",
    },
    {
      key: "allowedHosts",
      label: "Allowed Hosts",
      placeholder: `["example.com"]`,
      tooltip:
        "When specified, credential manager is allowed to send requests to these hosts only. Must be an array of strings.",
    },
    {
      key: "fields",
      label:
        "Fields you can request from the user before they connect your app to Nexus",
      placeholder: `[]`,
      tooltip:
        "See schema definition for reference: https://github.com/grindery-io/grindery-nexus-schema-v2/tree/master/connectors#fieldschema",
    },
    {
      key: "label",
      label: "Label",
      placeholder: ``,
      tooltip:
        "A string with variables or request that returns the connection label for the authenticated user. See schema definition for reference: https://github.com/grindery-io/grindery-nexus-schema-v2/tree/master/connectors#requestschema",
    },
    {
      key: "oauth1Config",
      label: "OAuth1 authentication configuration",
      placeholder: ``,
      tooltip:
        "See schema definition for reference: https://github.com/grindery-io/grindery-nexus-schema-v2/tree/master/connectors#authenticationoauth1configschema",
      hide: data.type && data.type !== "oauth1",
    },

    {
      key: "oauth2Config",
      label: "OAuth2 authentication configuration",
      placeholder: ``,
      tooltip:
        "See schema definition for reference: https://github.com/grindery-io/grindery-nexus-schema-v2/tree/master/connectors#authenticationoauth2configschema",
      hide: data.type && data.type !== "oauth2",
    },
    {
      key: "sessionConfig",
      label: "Session authentication configuration",
      placeholder: ``,
      tooltip:
        "See schema definition for reference: https://github.com/grindery-io/grindery-nexus-schema-v2/tree/master/connectors#authenticationsessionconfigschema",
      hide: data.type && data.type !== "session",
    },
  ];

  return cds ? (
    <div>
      <Title>Authentication</Title>
      <div>
        <AutocompleteWrapper
          className={error.type === "type" ? "has-error" : ""}
        >
          <Autocomplete
            key={`${cds.key}_type`}
            label="Authentication type"
            placeholder="Select type"
            value={data.type || ""}
            onChange={(value: string) => {
              setError({ type: "", text: "" });
              setData({
                ...data,
                type: value,
              });
            }}
            required
            size="full"
            options={typeOptions}
            error={error.type === "type" ? error.text : ""}
          />
        </AutocompleteWrapper>

        {data.type && data.type !== "none" && (
          <>
            <RichInput
              options={[]}
              value={data.defaultDisplayName}
              onChange={(value: string) => {
                setError({ type: "", text: "" });
                setData({
                  ...data,
                  defaultDisplayName: value,
                });
              }}
              label="Template for generating display name"
              placeholder=""
              singleLine
              tooltip="Template can contain {{ data.FIELD }} to reference data returned from test request, and {{ auth.FIELD }} to reference data in token response."
              error={error.type === "defaultDisplayName" ? error.text : ""}
            />

            {jsonFields
              .filter((field: JSONFieldType) => !field.hide)
              .map((field: JSONFieldType) => (
                <JSONWrapper>
                  <JSONLabel>
                    <JSONLabelText>{field.label}</JSONLabelText>

                    <Tooltip title={field.tooltip}>
                      <JSONInfo className="material-icons notranslate MuiIcon-root MuiIcon-fontSizeMedium rich-input__label-tooltip css-kp9ftd-MuiIcon-root">
                        error
                      </JSONInfo>
                    </Tooltip>

                    {field.required && <JSONRequired>(required)</JSONRequired>}
                  </JSONLabel>

                  <AceEditor
                    placeholder={field.placeholder}
                    mode="json"
                    theme="monokai"
                    name="blah2"
                    onChange={(value: string) => {
                      setError({ type: "", text: "" });
                      setData({
                        ...data,
                        [field.key]: value,
                      });
                    }}
                    width="100%"
                    height="200px"
                    wrapEnabled={true}
                    fontSize={14}
                    showPrintMargin={false}
                    showGutter={true}
                    highlightActiveLine={true}
                    value={data[field.key]}
                    setOptions={{
                      enableBasicAutocompletion: false,
                      enableLiveAutocompletion: false,
                      enableSnippets: false,
                      showLineNumbers: false,
                      tabSize: 2,
                    }}
                  />
                  {error && error.type === field.key && (
                    <JSONError>{error.text}</JSONError>
                  )}
                </JSONWrapper>
              ))}
          </>
        )}

        <ButtonsWrapper>
          <ButtonsRight>
            <Button
              style={{
                padding: "11px 24px",
                background: "none",
                border: "1px solid #0b0d17",
              }}
              onClick={() => {
                navigate(`/connector/${id}`);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setError({ type: "", text: "" });
                if (!data.type) {
                  setError({
                    type: "type",
                    text: "Authentication type is required",
                  });
                  return;
                }

                if (!data.test) {
                  setError({
                    type: "test",
                    text: "Test schema is required",
                  });
                  return;
                }

                let newData = {
                  ...data,
                };

                if (data.type !== "none") {
                  for (var i = 0; i < jsonFields.length; i++) {
                    const field: JSONFieldType = jsonFields[i];
                    if (data[field.key]) {
                      try {
                        newData[field.key] = JSON.parse(data[field.key]);
                      } catch (err) {
                        setError({
                          type: field.key,
                          text: "Invalid format",
                        });
                        return;
                      }
                    }
                  }
                }

                onConnectorAuthenticationSave(newData);
              }}
            >
              Save
            </Button>
          </ButtonsRight>
        </ButtonsWrapper>
      </div>
    </div>
  ) : (
    <div
      style={{
        textAlign: "center",
        color: "#8C30F5",
        width: "100%",
        margin: "40px 0",
      }}
    >
      <CircularProgress color="inherit" />
    </div>
  );
};

export default ConnectorAuthenticationPage;
