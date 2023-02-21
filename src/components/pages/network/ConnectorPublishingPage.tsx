import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { RichInput, Dialog, CircularProgress } from "grindery-ui";
import Button from "../../network/Button";
import useConnectorContext from "../../../hooks/useConnectorContext";
import RadioButton from "../../network/RadioButton";
import useWorkspaceContext from "../../../hooks/useWorkspaceContext";
import { useNavigate } from "react-router";

const Title = styled.h3`
  font-weight: 700;
  font-size: 32px;
  line-height: 120%;
  color: #0b0d17;
  padding: 0;
  margin: 0 0 20px;
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

const ConnectorDetails = styled.div`
  margin-top: 10px;

  & p {
    margin: 0 0 8px;
    padding: 0;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  border: none;

  & tbody tr {
    border-bottom: 1px solid #dcdcdc;

    & td {
      padding: 10px;
    }

    & td:first-child {
      width: 30%;
      padding-left: 0;
      font-size: 14px;
    }

    &:last-child {
      border-bottom: none;
    }
  }
`;

const PublishingText = styled.p`
  margin: 0 0 20px;
  padding: 0;
  text-align: center;
`;

const NotValidMessage = styled.p`
  font-size: 14px;
  text-align: left;
  color: #ff5858;
  margin: 10px 0 10px;
  padding: 0;

  & span {
    color: inherit;
    text-decoration: underline;
    cursor: pointer;
  }
`;

type Props = {};

const ConnectorPublishingPage = (props: Props) => {
  const { state, setState, publishConnector } = useConnectorContext();
  let navigate = useNavigate();
  const { connector, cds } = state;
  const { workspaces, workspace } = useWorkspaceContext();
  const { id } = state;
  const isValid = cds && cds.name && cds.key && cds.icon;
  const hasTriggers = cds.triggers && cds.triggers.length > 0;
  const hasActions = cds.actions && cds.actions.length > 0;
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (!cds?.access) {
      setState({
        cds: {
          ...state.cds,
          access: "Private",
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cds?.access]);

  return id ? (
    <div>
      <Title>Publishing</Title>
      <div>
        <Card>
          <CardContent>
            <CardTitle>Publish connector</CardTitle>
            <CardDescription>
              Your connector will be manually reviewed and approved before
              publishing.
            </CardDescription>
            <CardDescription>
              Published Connector will be avaialble for all users of Grindery
              Web3 Gateway app.
            </CardDescription>
            <CardDescription>
              You can add a comment for our moderators. Please, add any relevant
              information on how to test the connector.
            </CardDescription>
            <br />
            <RichInput
              label="Comment"
              options={[]}
              value={comment}
              onChange={(value: string) => {
                setComment(value);
              }}
            />
            {!isValid && (
              <NotValidMessage>
                Please, configure connector before publishing.{" "}
                <span
                  onClick={() => {
                    navigate(`/connector/${id}/settings`);
                  }}
                >
                  Settings
                </span>{" "}
                is a good place to start.
              </NotValidMessage>
            )}
            {!hasTriggers && !hasActions && (
              <NotValidMessage>
                Please, add at least one{" "}
                <span
                  onClick={() => {
                    navigate(`/connector/${id}`);
                  }}
                >
                  trigger or action
                </span>{" "}
                before publishing.
              </NotValidMessage>
            )}
            <Button
              style={{ marginTop: "5px" }}
              onClick={() => {
                publishConnector(comment);
              }}
              disabled={
                !isValid ||
                (!hasTriggers && !hasActions) ||
                state.isPublishing ||
                connector?.access === "Public"
              }
            >
              {connector?.access === "Public" ? "Published" : "Submit"}
            </Button>
          </CardContent>
        </Card>

        <Dialog open={state.isPublishing} onClose={() => {}} maxWidth={"350px"}>
          <div
            style={{
              textAlign: "center",
              color: "#ffb930",
              width: "100%",
              margin: "40px 0",
            }}
          >
            <CircularProgress color="inherit" />
          </div>
          <PublishingText>Submitting...</PublishingText>
        </Dialog>
      </div>
    </div>
  ) : (
    <div
      style={{
        textAlign: "center",
        color: "#ffb930",
        width: "100%",
        margin: "40px 0",
      }}
    >
      <CircularProgress color="inherit" />
    </div>
  );
};

export default ConnectorPublishingPage;
