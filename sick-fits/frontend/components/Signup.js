import React, { useState } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Form from "./styles/Form";
import Error from "./ErrorMessage";
import { CURRENT_USER_QUERY } from "./User";

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION(
    $email: String!
    $name: String!
    $password: String!
  ) {
    signup(email: $email, name: $name, password: $password) {
      id
      email
      name
    }
  }
`;

const Signup = () => {
  const [signupInfos, setSignupInfos] = useState({
    name: "",
    password: "",
    email: ""
  });

  const saveToState = e => {
    setSignupInfos({
      ...signupInfos,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Mutation
      mutation={SIGNUP_MUTATION}
      variables={signupInfos}
      refetchQuery={[{ query: CURRENT_USER_QUERY }]}
    >
      {(signup, { error, loading }) => (
        <Form
          method="post"
          onSubmit={async e => {
            e.preventDefault();
            const res = await signup();
            setSignupInfos({ name: "", password: "", email: "" });
          }}
        >
          <fieldset disabled={loading} aria-busy={loading}>
            <h2> Sign Up for An Account</h2>
            <Error error={error} />
            <label htmlFor="email">
              Email
              <input
                type="email"
                name="email"
                placeholder="email"
                value={signupInfos.email}
                onChange={saveToState}
              />
            </label>
            <label htmlFor="name">
              Name
              <input
                type="text"
                name="name"
                placeholder="name"
                value={signupInfos.name}
                onChange={saveToState}
              />
            </label>
            <label htmlFor="password">
              Password
              <input
                type="password"
                name="password"
                placeholder="password"
                value={signupInfos.password}
                onChange={saveToState}
              />
            </label>
            <button type="submit">Sign Up</button>
          </fieldset>
        </Form>
      )}
    </Mutation>
  );
};

export default Signup;
