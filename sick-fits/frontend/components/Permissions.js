import React, { useState } from "react";

import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
import PropTypes from "prop-types";

import Error from "./ErrorMessage";
import Table from "./styles/Table";
import SickButton from "./styles/SickButton";

const possiblePermissions = [
  "ADMIN",
  "USER",
  "ITEMCREATE",
  "ITEMUPDATE",
  "ITEMDELETE",
  "PERMISSIONUPDATE"
];

const UPDATE_PERMISSIONS_MUTATION = gql`
  mutation updatePermissions($permissions: [Permission], $userId: ID!) {
    updatePermissions(permissions: $permissions, userId: $userId) {
      id
      permissions
      name
      email
    }
  }
`;

const ALL_USER_QUERY = gql`
  query ALL_USER_QUERY {
    users {
      id
      name
      permissions
      email
    }
  }
`;

const Permissions = () => {
  return (
    <Query query={ALL_USER_QUERY}>
      {({ data, loading, error }) => {
        if (loading) return <p>loading...</p>;
        if (error) return <Error error={error} />;
        return (
          <div>
            <h2>Manage Permissions</h2>
            <Table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  {possiblePermissions.map(permission => (
                    <th key={permission}>{permission}</th>
                  ))}
                  <th>📝</th>
                </tr>
              </thead>
              <tbody>
                {data.users.map(user => (
                  <UserPermissions key={user.id} user={user} />
                ))}
              </tbody>
            </Table>
          </div>
        );
      }}
    </Query>
  );
};

const UserPermissions = props => {
  const user = props.user;
  const [userPermissions, setUserPermissions] = useState(user.permissions);
  const hanldePermissionChange = e => {
    const checkbox = e.target;
    let updatedPermissions = [...userPermissions];
    if (checkbox.checked) {
      updatedPermissions.push(checkbox.value);
    } else {
      updatedPermissions = updatedPermissions.filter(
        permission => permission !== checkbox.value
      );
    }
    setUserPermissions(updatedPermissions);
  };
  return (
    <Mutation
      mutation={UPDATE_PERMISSIONS_MUTATION}
      variables={{ permissions: userPermissions, userId: props.user.id }}
    >
      {(updatePermissions, { loading, error }) => (
        <>
          {error && (
            <tr>
              <td colspan="8">
                <Error error={error} />{" "}
              </td>
            </tr>
          )}
          <tr>
            <td>{user.name}</td>
            <td>{user.email}</td>
            {possiblePermissions.map(permission => (
              <td key={permission}>
                <label htmlFor={`${user.id}-permission-${permission}`}>
                  <input
                    id={`${user.id}-permission-${permission}`}
                    type="checkbox"
                    checked={userPermissions.includes(permission)}
                    value={permission}
                    onChange={hanldePermissionChange}
                  />
                </label>
              </td>
            ))}
            <td>
              <SickButton
                type="button"
                disabled={loading}
                onClick={updatePermissions}
              >
                Updat{loading ? "ing" : "e"}
              </SickButton>
            </td>
          </tr>
        </>
      )}
    </Mutation>
  );
};

UserPermissions.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    id: PropTypes.string,
    permissions: PropTypes.array
  }).isRequired
};

export default Permissions;
