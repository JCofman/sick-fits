import React, { useState } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Form from "./styles/Form";
import Error from "./ErrorMessage";
import { CURRENT_USER_QUERY } from "./User";

const RESET_MUTATION = gql`
  mutation RESET_MUTATION(
    $resetToken: String!
    $password: String!
    $confirmPassword: String!
  ) {
    resetPassword(
      resetToken: $resetToken
      password: $password
      confirmPassword: $confirmPassword
    ) {
      id
      email
      name
    }
  }
`;

const ResetPassword = props => {
  const [resetInfos, setResetInfos] = useState({
    password: "",
    confirmPassword: ""
  });

  const saveToState = e => {
    setResetInfos({
      ...resetInfos,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Mutation
      mutation={RESET_MUTATION}
      variables={{
        resetToken: props.resetToken,
        password: resetInfos.password,
        confirmPassword: resetInfos.confirmPassword
      }}
      refetchQueries={[{ query: CURRENT_USER_QUERY }]}
    >
      {(resetPassword, { error, loading }) => (
        <Form
          method="post"
          onSubmit={async e => {
            e.preventDefault();
            const res = await resetPassword();
            setResetInfos({ password: "", confirmPassword: "" });
          }}
        >
          <fieldset disabled={loading} aria-busy={loading}>
            <h2> Reset your Password </h2>
            <Error error={error} />

            <label htmlFor="password">
              Password
              <input
                type="password"
                name="password"
                placeholder="password"
                value={resetInfos.password}
                onChange={saveToState}
              />
            </label>
            <label htmlFor="confirmPassword">
              Password
              <input
                type="password"
                name="confirmPassword"
                placeholder="confirmPassword"
                value={resetInfos.confirmPassword}
                onChange={saveToState}
              />
            </label>
            <button type="submit">Reset your Password</button>
          </fieldset>
        </Form>
      )}
    </Mutation>
  );
};

export default ResetPassword;
