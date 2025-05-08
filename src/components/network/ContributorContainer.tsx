import React from "react";

type Props = {
  children: React.ReactNode;
};

const ContributorContainer = (props: Props) => {
  const { children } = props;

  return <>{children}</>;
};

export default ContributorContainer;
