import React from "react";
import styled from "styled-components";
import Button from "./Button";
import useConnectorContext from "../../hooks/useConnectorContext";
import { useNavigate, useParams } from "react-router";
import OperationOutputFieldRow from "./OperationOutputFieldRow";

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  max-width: 100%;
`;

const TableHeader = styled.thead`
  & > tr > th {
    text-align: left;
  }
`;

const TableHeaderColumn = styled.th`
  padding: 15px 10px;
  font-weight: 400;
  font-weight: bold;
`;

const ButtonWrapper = styled.div`
  text-align: right;
  margin: 20px 0;

  & button {
    padding: 8px 24px;
    font-size: 14px;
  }
`;

type Props = {};

const OperationOutputFields = (props: Props) => {
  let { id, type, key } = useParams();
  let navigate = useNavigate();
  const { state } = useConnectorContext();

  const outputFields: any[] =
    (type &&
      (state.cds?.[type] || []).find((op: any) => op.key === key)?.operation
        ?.outputFields) ||
    [];

  return (
    <>
      {outputFields && outputFields.length > 0 && (
        <div>
          <Table>
            <TableHeader>
              <tr>
                <TableHeaderColumn>Label</TableHeaderColumn>
                <TableHeaderColumn>Key</TableHeaderColumn>
                <TableHeaderColumn>Sample</TableHeaderColumn>
                <TableHeaderColumn></TableHeaderColumn>
              </tr>
            </TableHeader>
            <tbody>
              {outputFields.map((outputField: any) => (
                <OperationOutputFieldRow
                  inputKey={outputField.key}
                  key={outputField.key}
                />
              ))}
            </tbody>
          </Table>
        </div>
      )}
      <ButtonWrapper>
        <Button
          onClick={() => {
            navigate(`/connector/${id}/${type}/${key}/outputFields/__new__`);
          }}
        >
          Add Output Field
        </Button>
      </ButtonWrapper>
    </>
  );
};

export default OperationOutputFields;
