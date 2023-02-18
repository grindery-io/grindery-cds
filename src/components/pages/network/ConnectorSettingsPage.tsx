import React, { useState } from "react";
import styled from "styled-components";
import { RichInput, CircularProgress } from "grindery-ui";
import Button from "../../network/Button";
import useConnectorContext from "../../../hooks/useConnectorContext";
import IconField from "../../network/IconField";
import RadioButton from "../../network/RadioButton";
import useWorkspaceContext from "../../../hooks/useWorkspaceContext";

const Title = styled.h3`
  font-weight: 700;
  font-size: 32px;
  line-height: 120%;
  color: #0b0d17;
  padding: 0;
  margin: 0 0 20px;
`;

const MaxHeightInput = styled.div`
  & .rich-input-box {
    max-height: 200px;
    overflow: auto;
  }
  & .rich-input div[data-slate-editor="true"] {
    overflow: auto !important;
  }
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
`;

const Card = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 20px;
  border: 1px solid #dcdcdc;
  border-radius: 5px;
  padding: 15px 20px;
  margin-bottom: 20px;
`;

const CardContent = styled.div`
  width: 100%;
`;

const CardTitle = styled.h5`
  font-weight: 500;
  font-size: 20px;
  line-height: 150%;
  margin: 0;
  padding: 0;
  color: #0b0d17;
`;

const CardDescription = styled.p`
  font-weight: 400;
  font-size: 14px;
  line-height: 150%;
  margin: 10px 0 0;
  padding: 0;
  color: #898989;
`;

const RadioWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 4px;
  margin-top: 10px;
  margin-bottom: 5px;
`;

type Props = {};

const ConnectorSettingsPage = (props: Props) => {
  const { state, onConnectorSettingsSave } = useConnectorContext();
  const { workspaces, workspace } = useWorkspaceContext();
  const { cds } = state;
  const [data, setData] = useState({
    name: cds.name || "",
    description: cds.description || "",
    icon: cds.icon || "",
    access: cds.access || "",
  });
  const [error, setError] = useState({ type: "", text: "" });

  return cds ? (
    <div>
      <Title>Settings</Title>
      <div>
        <RichInput
          options={[]}
          value={data.name}
          onChange={(value: string) => {
            setError({ type: "", text: "" });
            setData({
              ...data,
              name: value,
            });
          }}
          required
          label="Connector Name"
          placeholder="Connector name"
          singleLine
          error={error.type === "name" ? error.text : ""}
        />
        <MaxHeightInput>
          <RichInput
            options={[]}
            value={data.description}
            onChange={(value: string) => {
              setError({ type: "", text: "" });
              setData({
                ...data,
                description: value,
              });
            }}
            label="Connector Description"
            tooltip="A sentence describing your connector in 140 characters or less"
            placeholder=""
            error={error.type === "description" ? error.text : ""}
          />
        </MaxHeightInput>
        <IconField
          label="Connector Icon"
          onChange={(value: string) => {
            setError({ type: "", text: "" });
            setData({
              ...data,
              icon: value,
            });
          }}
          value={data.icon}
          error={error.type === "icon" ? error.text : ""}
          tooltip="Recommended icon size 40x40px. Allowed formats: PNG or SVG. Must be on transparent background."
          required
        />

        <Card>
          <CardContent>
            <CardTitle>Connector Access</CardTitle>
            <CardDescription>
              Who will be able to use your connector in Grindery Gateway?
            </CardDescription>
            <RadioWrapper>
              <RadioButton
                label="Private"
                selected={
                  data.access === "Private" || data.access === "Workspace"
                }
                onChange={() => {
                  setData({
                    ...data,
                    access: "Private",
                  });
                }}
                description={
                  workspace !== "personal"
                    ? `Connector will be available for all members of <strong>${
                        workspaces?.find((ws: any) => ws.key === workspace)
                          ?.title || ""
                      }</strong> workspace`
                    : "Only you will be able to use Connector"
                }
              />

              <RadioButton
                label="Beta"
                selected={data.access === "Beta"}
                onChange={() => {
                  setData({
                    ...data,
                    access: "Beta",
                  });
                }}
                description={
                  "Connector will be available for all Grindery Gateway BETA users"
                }
              />
              {cds.access === "Public" && (
                <RadioButton
                  label="Public"
                  selected={data.access === "Public"}
                  onChange={() => {
                    setData({
                      ...data,
                      access: "Public",
                    });
                  }}
                  description={`Connector will be available for all Grindery Gateway users.`}
                />
              )}
            </RadioWrapper>
          </CardContent>
        </Card>

        <ButtonsWrapper>
          <ButtonsRight>
            <Button
              onClick={() => {
                setError({ type: "", text: "" });
                if (!data.name) {
                  setError({
                    type: "name",
                    text: "Connector Name is required",
                  });
                  return;
                }
                if (!data.icon) {
                  setError({
                    type: "icon",
                    text: "Connector Icon is required",
                  });
                  return;
                }
                onConnectorSettingsSave(data);
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

export default ConnectorSettingsPage;
