import React from "react";
import styled from "styled-components";

const Container = styled.div`
  & > a,
  & > p {
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    flex-wrap: nowrap;
    gap: 8px;
    margin: 0;
    padding: 0;
    color: & span {

    }
  }
`;

const Avatar = styled.div`
  & img {
    border-radius: 50%;
    width: 24px;
    height: 24px;
    min-width: 24px;
    display: block;
  }
`;

type Props = {
  contributor: any;
};

const ConnectorContributor = (props: Props) => {
  const { contributor } = props;
  return contributor ? (
    <Container>
      <a
        href={`https://github.com/${contributor}`}
        target="_blank"
        rel="noreferrer"
      >
        <Avatar>
          <img src={`https://github.com/${contributor}.png`} alt="" />
        </Avatar>

        <span>{contributor}</span>
      </a>
    </Container>
  ) : null;
};

export default ConnectorContributor;
