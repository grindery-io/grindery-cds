import React, { useState } from "react";
import styled from "styled-components";
import { IconButton, Menu } from "grindery-ui";
import { ICONS } from "../../constants";
import useConnectorContext from "../../hooks/useConnectorContext";
import { useNavigate, useParams } from "react-router";

const Row = styled.tr`
  border-bottom: 1px solid #dcdcdc;
  border-top: 1px solid #dcdcdc;

  & > td:first-child {
    padding-left: 10px;
  }
  & > td:last-child {
    padding-right: 10px;
  }

  &:hover {
    background: #f7f7f7;
  }
`;

const Column = styled.td`
  padding: 20px 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 0;

  cursor: pointer;

  &:last-child {
    cursor: default;
    max-width: 30px;
  }
`;

const MenuButtonWrapper = styled.div`
  & img {
    width: 12px;
    height: 12px;
  }
`;

type Props = {
  inputKey: string;
};

const OperationOutputFieldRow = (props: Props) => {
  const { inputKey } = props;
  const { id, type, key } = useParams();
  const { state, onOutputFieldDelete } = useConnectorContext();
  let navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const outputField: any =
    (type &&
      (state.cds?.[type] || [])
        ?.find((op: any) => op.key === key)
        ?.operation?.outputFields?.find(
          (field: any) => field?.key === inputKey
        )) ||
    null;
  const sample: any =
    (type &&
      (state.cds?.[type] || [])?.find((op: any) => op.key === key)?.operation
        ?.sample?.[inputKey]) ||
    "";

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return outputField ? (
    <Row>
      <Column
        onClick={() => {
          navigate(
            `/connector/${id}/${type}/${key}/outputFields/${outputField.key}`
          );
        }}
      >
        {outputField.label || outputField.key || ""}
      </Column>
      <Column
        onClick={() => {
          navigate(
            `/connector/${id}/${type}/${key}/outputFields/${outputField.key}`
          );
        }}
      >
        {outputField.key || ""}
      </Column>
      <Column
        onClick={() => {
          navigate(
            `/connector/${id}/${type}/${key}/outputFields/${outputField.key}`
          );
        }}
      >
        {sample}
      </Column>
      <Column style={{ textAlign: "right", width: "30px" }}>
        <MenuButtonWrapper>
          <IconButton onClick={handleMenuOpen} icon={ICONS.DOTS_HORIZONTAL} />
        </MenuButtonWrapper>
        <Menu
          anchorEl={anchorEl}
          onClose={handleMenuClose}
          closeOnClick
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          items={[
            {
              key: "edit",
              label: "Edit",
              onClick: () => {
                navigate(
                  `/connector/${id}/${type}/${key}/outputFields/${outputField.key}`
                );
              },
            },
            {
              key: "delete",
              label: "Delete",
              onClick: () => {
                onOutputFieldDelete(key || "", type, inputKey);
              },
            },
          ]}
        />
      </Column>
    </Row>
  ) : null;
};

export default OperationOutputFieldRow;
