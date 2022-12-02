import React, { useState } from "react";
import styled from "styled-components";
import { Autocomplete, RichInput } from "grindery-ui";
import Button from "./Button";
import useConnectorContext from "../../hooks/useConnectorContext";
import { useNavigate, useParams } from "react-router";

const Container = styled.div`
  & [data-slate-editor="true"][contenteditable="false"] {
    cursor: not-allowed;
    opacity: 0.75;
  }
`;

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-itmes: center;
  justify-content: flex-end;
  flex-wrap: nowrap;
  gap: 12px;
  margin: 20px 0;

  & button {
    padding: 8px 24px;
    font-size: 14px;
  }
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

type Props = {};

const OperationOutputFieldForm = (props: Props) => {
  let { id, type, key, inputKey } = useParams();
  let navigate = useNavigate();
  const { state, onOutputFieldSave } = useConnectorContext();
  const [error, setError] = useState({ type: "", text: "" });
  const outputField: any = (
    (type &&
      (state.cds?.[type] || []).find((op: any) => op.key === key)?.operation
        ?.outputFields) ||
    []
  ).find((input: any) => input.key === inputKey);

  const [data, setData] = useState<any>({
    key: outputField?.key || "",
    label: outputField?.label || "",
    type: outputField?.type || "string",
  });

  const [sample, setSample] = useState(
    (type &&
      inputKey &&
      (state.cds?.[type] || []).find((op: any) => op.key === key)?.operation
        ?.sample?.[inputKey]) ||
      ""
  );

  const typeOptions = [
    { value: "string", label: "String" },
    { value: "text", label: "Text" },
    { value: "integer", label: "Integer" },
    { value: "number", label: "Number" },
    { value: "boolean", label: "Boolean" },
    { value: "datetime", label: "Datetime" },
    { value: "file", label: "File" },
    { value: "password", label: "Password" },
    { value: "copy", label: "Copy" },
    { value: "code", label: "Code" },
    { value: "address", label: "Blockchain address" },
    { value: "email", label: "Email" },
    { value: "luhn", label: "Luhn" },
    { value: "mac", label: "Mac address" },
    { value: "url", label: "URL address" },
    { value: "uuid", label: "UUID" },
    { value: "info", label: "Information message" },
    { value: "evmAddress", label: "EVM blockchain address" },
    { value: "flowAddress", label: "Flow blckchain address" },
  ];

  return (
    <Container>
      <RichInput
        value={data.key || ""}
        label="Key"
        options={[]}
        onChange={(value: string) => {
          setError({ type: "", text: "" });
          setData({ ...data, key: value });
        }}
        required
        placeholder="field_key"
        singleLine
        tooltip="Enter the word or phrase your Connector uses to reference this field or parameter. Not seen by users. Example: first_name"
        readonly={inputKey !== "__new__"}
        error={error.type === "key" ? error.text : ""}
      />
      <RichInput
        value={data.label || ""}
        label="Label"
        options={[]}
        onChange={(value: string) => {
          setError({ type: "", text: "" });
          setData({ ...data, label: value });
        }}
        placeholder="Field Label"
        singleLine
        tooltip="Enter a user friendly name for this field that describes the output value. Shown to users inside Nexus. Example: First Name"
        error={error.type === "label" ? error.text : ""}
      />
      <AutocompleteWrapper className={error.type === "type" ? "has-error" : ""}>
        <Autocomplete
          placeholder="Select field type"
          onChange={(value: string) => {
            setError({ type: "", text: "" });
            setData({ ...data, type: value });
          }}
          label="Field type"
          required
          tooltip="See schema definition for reference: https://github.com/grindery-io/grindery-nexus-schema-v2/tree/master/connectors#fieldschema"
          value={data.type || ""}
          size="full"
          options={typeOptions}
          error={error.type === "type" ? error.text : ""}
        />
      </AutocompleteWrapper>

      <RichInput
        value={sample || ""}
        label="Sample value"
        options={[]}
        onChange={(value: string) => {
          setError({ type: "", text: "" });
          setSample(value);
        }}
        placeholder=""
        singleLine
        tooltip="An example value that will be used as placeholder for the output."
        error={error.type === "sample" ? error.text : ""}
      />

      <ButtonsWrapper>
        <Button
          style={{
            padding: "7px 24px",
            background: "none",
            border: "1px solid #0b0d17",
          }}
          onClick={() => {
            navigate(`/connector/${id}/${type}/${key}/outputFields`);
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={async () => {
            setError({ type: "", text: "" });
            if (!data.type) {
              setError({ type: "type", text: "Field type is required" });
              return;
            }
            if (!data.key) {
              setError({ type: "key", text: "Field key is required" });
              return;
            }
            if (!sample) {
              setError({ type: "sample", text: "Sample value is required" });
              return;
            }

            onOutputFieldSave(
              key || "",
              type,
              inputKey || "",
              {
                ...data,
              },
              sample
            );
          }}
        >
          Save
        </Button>
      </ButtonsWrapper>
    </Container>
  );
};

export default OperationOutputFieldForm;
