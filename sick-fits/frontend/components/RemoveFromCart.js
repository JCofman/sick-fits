import React from "react";
import { Mutation } from "react-apollo";
import styled from "styled-components";
import PropTypes from "prop-types";
import gql from "graphql-tag";

import { CURRENT_USER_QUERY } from "./User";

const REMOVE_FROM_CART_MUTATION = gql`
  mutation removeFromCart($id: ID!) {
    removeFromCart(id: $id) {
      id
    }
  }
`;

const BigButton = styled.button`
  font-size: 3rem;
  background: none;
  border: 0;
  &:hover,
  &:focus {
    color: ${props => props.theme.red};
    cursor: pointer;
  }
`;

const RemoveFromCart = props => {
  // this gets called as soon as we get a response back from the server
  // after a mutation has been performed
  const update = (cache, payload) => {
    // 1. read the cache
    const data = cache.readQuery({ query: CURRENT_USER_QUERY });
    // 2. remove that item from the cache
    const cartItemId = payload.data.removeFromCart.id;
    data.me.cart = data.me.cart.filter(cartItem => cartItem.id !== cartItemId);
    // 3. write it back to the cache
    cache.writeQuery({ query: CURRENT_USER_QUERY, data });
  };
  return (
    <Mutation
      mutation={REMOVE_FROM_CART_MUTATION}
      variables={{ id: props.id }}
      update={update}
      // with that we can delete the item in the frontend immediately without waiting for the backend
      optimisticResponse={{
        __typename: "Mutation",
        removeFromCart: {
          __typename: "CartItem",

          id: props.id
        }
      }}
    >
      {(removeFromCart, { loading, error }) => (
        <BigButton
          disable={loading}
          onClick={() => {
            removeFromCart().catch(err => alert(err.message));
          }}
          title="Delete Item"
        >
          &times;
        </BigButton>
      )}
    </Mutation>
  );
};

RemoveFromCart.propTypes = {
  id: PropTypes.string.isRequired
};
export default RemoveFromCart;
