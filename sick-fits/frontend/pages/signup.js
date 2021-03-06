import React from "react";
import styled from "styled-components";

import Signup from "../components/Signup";
import Signin from "../components/Signin";
import ReqeustReset from "../components/ReqeustReset";

const Columns = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 20px;
`;

const SignupPage = props => {
  return (
    <Columns>
      <Signup />
      <Signin />
      <ReqeustReset />
    </Columns>
  );
};

export default SignupPage;
