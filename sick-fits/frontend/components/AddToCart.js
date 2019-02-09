import React from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import { CURRENT_USER_QUERY } from "./User";

const ADD_TO_CART_MUTATION = gql`
  mutation addToCart($id: ID!) {
    addToCart(id: $id) {
      id
      quantity
    }
  }
`;

const AddToCart = props => {
  const { id } = props;

  return (
    <Mutation
      mutation={ADD_TO_CART_MUTATION}
      variables={{ id: id }}
      refetchQueries={[{ query: CURRENT_USER_QUERY }]}
    >
      {(addToCart, { loading }) => (
        <button disabled={loading} onClick={addToCart}>
          Add{loading ? "ing" : ""} to Cart 🛍️{" "}
        </button>
      )}
    </Mutation>
  );
};
export default AddToCart;
