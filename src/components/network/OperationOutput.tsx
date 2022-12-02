import React from "react";
import styled from "styled-components";
import { Navigate, Route, Routes, useParams } from "react-router";
import OperationOutputFields from "./OperationOutputFields";
import OperationOutputFieldForm from "./OperationOutputFieldForm";

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-itmes: flex-start;
  justify-content: flex-start;
  flew-wrap: nowrap;
  gap: 20px;
`;

const Editor = styled.div`
  width: 100%;
  max-width: calc(50% - 10px);
  margin-top: 20px;

  &.full {
    max-width: 100%;
  }

  & h3 {
    font-weight: 700;
    font-size: 22px;
    line-height: 150%;
    color: #141416;
    margin: 10px 0 15px;
    padding: 0;
  }
`;

type Props = {};

const OperationOutput = (props: Props) => {
  let { id, type, key } = useParams();

  return (
    <Container>
      <Editor className={"full"}>
        <h3>Output fields editor</h3>
        <Routes>
          <Route path="/" element={<OperationOutputFields />}></Route>
          <Route path=":inputKey" element={<OperationOutputFieldForm />} />
          <Route
            path="*"
            element={
              <Navigate
                to={`/connector/${id}/${type}/${key}/outputFields`}
                replace
              />
            }
          ></Route>
        </Routes>
      </Editor>
    </Container>
  );
};

export default OperationOutput;
