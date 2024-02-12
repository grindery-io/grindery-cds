import React from "react";
import { useLocation, useNavigate } from "react-router";
import styled from "styled-components";
import { AppsMenu } from "grindery-ui";
import { GRINDERY_APPS, ICONS } from "../../constants";
import useAppContext from "../../hooks/useAppContext";
import UserMenu from "../shared/UserMenu";
import WorkspaceSelector from "../shared/WorkspaceSelector";
import { useGrinderyLogin } from "use-grindery-login";

const Container = styled.div`
  padding: 1.5px 25px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 16px;
  background: #0b0d17;
  position: fixed;
  z-index: 1210;
  top: 0;
  width: 100%;
  box-sizing: border-box;
`;

const LeftWrapper = styled.div`
  margin-right: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 16px;
  padding: 0;
`;

const RightWrapper = styled.div`
  margin-left: auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: nowrap;
  gap: 16px;
  padding: 0;
`;

const Logo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 10px;
  cursor: pointer;
  padding: 16px 0;
`;

const Title = styled.div`
  font-weight: 700;
  font-size: 20px;
  line-height: 100%;
  letter-spacing: 0.02em;
  color: #ffffff;
`;

const Subtitle = styled.div`
  font-weight: 400;
  font-size: 20px;
  line-height: 100%;
  color: #e48b05;
`;

const LinksMenu = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: nowrap;
  gap: 8px;
`;

const Link = styled.p`
  margin: 0;
  padding: 24px 10px;
  font-weight: 400;
  font-size: 16px;
  line-height: 150%;
  color: #ffffff;
  cursor: pointer;

  &.active {
    position: relative;
    font-weight: 700;

    &:after {
      content: "";
      display: block;
      position: absolute;
      bottom: -1px;
      left: 0;
      width: 100%;
      height: 4px;
      background: #ffffff;
    }
  }
`;

/*const AppsMenuWrapper = styled.div`
  margin-left: auto;
`;*/

const ConnectWrapper = styled.div`
  & button {
    background: #ffb930;
    border-radius: 5px;
    box-shadow: none;
    font-weight: 700;
    font-size: 16px;
    line-height: 150%;
    color: #0b0d17;
    padding: 8px 24px;
    cursor: pointer;
    border: none;

    &:hover {
      box-shadow: 0px 4px 8px rgba(106, 71, 147, 0.1);
    }
  }
`;

type Props = {};

const NetworkHeader = (props: Props) => {
  let navigate = useNavigate();
  let location = useLocation();
  const { user } = useAppContext();
  const { connect } = useGrinderyLogin();

  return (
    <Container>
      <LeftWrapper>
        <Logo
          onClick={() => {
            navigate("/");
          }}
        >
          <img
            src={ICONS.GRINDERY_DEV_LOGO}
            alt="Grindery developer network logo"
          />
          <div>
            <Title>CDS</Title>
            <Subtitle>Developer Network</Subtitle>
          </div>
        </Logo>
        {user && <WorkspaceSelector mode="dark" />}
      </LeftWrapper>
      <RightWrapper>
        {user && (
          <LinksMenu>
            <Link
              onClick={() => {
                navigate("/");
              }}
              className={location.pathname === "/" ? "active" : ""}
            >
              My Connectors
            </Link>
            <Link
              onClick={() => {
                window.open(
                  "https://docs.grindery.com/18-od-buxPOERx51kvaZeGDm2v0oYSrw1/SDK-Documentation",
                  "_blank"
                );
              }}
            >
              Documentation
            </Link>
          </LinksMenu>
        )}
        {/*<AppsMenuWrapper>
          <AppsMenu apps={GRINDERY_APPS} dark />
            </AppsMenuWrapper>*/}
        {!user && (
          <ConnectWrapper>
            <button
              onClick={() => {
                connect();
              }}
            >
              Connect wallet
            </button>
          </ConnectWrapper>
        )}

        {user && <UserMenu mode="dark" />}
      </RightWrapper>
    </Container>
  );
};

export default NetworkHeader;
