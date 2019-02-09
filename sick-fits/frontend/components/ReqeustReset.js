import React, { useState } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Form from "./styles/Form";
import Error from "./ErrorMessage";
import { CURRENT_USER_QUERY } from "./User";

const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    requestReset(email: $email) {
      message
    }
  }
`;

const RequestReset = () => {
  const [signInInfos, setSignInInfos] = useState({
    email: ""
  });

  const saveToState = e => {
    setSignInInfos({
      ...signInInfos,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Mutation
      mutation={REQUEST_RESET_MUTATION}
      variables={signInInfos}
      refetchQueries={[{ query: CURRENT_USER_QUERY }]}
    >
      {(reset, { error, loading, called }) => (
        <Form
          method="post"
          onSubmit={async e => {
            e.preventDefault();
            const res = await reset();
            setSignInInfos({ email: "" });
          }}
        >
          <fieldset disabled={loading} aria-busy={loading}>
            <h2> Request password reset </h2>
            <Error error={error} />
            {!error && !loading && called && (
              <p>Success! Check your email for reset link </p>
            )}
            <label htmlFor="email">
              Email
              <input
                type="email"
                name="email"
                placeholder="email"
                value={signInInfos.email}
                onChange={saveToState}
              />
            </label>
            <button type="submit">Request reset</button>
          </fieldset>
        </Form>
      )}
    </Mutation>
  );
};

export default RequestReset;
