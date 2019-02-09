import React from "react";
import ResetPassword from "../components/ResetPassword";
import Link from "next/link";

const Reset = props => {
  return (
    <div>
      <p>Reset your password {props.query.resetToken}</p>
      <ResetPassword resetToken={props.query.resetToken} />
    </div>
  );
};

export default Reset;
