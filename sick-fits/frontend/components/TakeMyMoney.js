import React from "react";
import StripeCheckout from "react-stripe-checkout";
import { Mutation } from "react-apollo";
import Router from "next/router";
import NProgress from "nprogress";
import PropTypes from "prop-types";
import gql from "graphql-tag";
import calcTotalPrice from "../lib/calcTotalPrice";
import Error from "./ErrorMessage";
import User, { CURRENT_USER_QUERY } from "./User";

const CREATE_ORDER_MUTATION = gql`
  mutation createOrder($token: String!) {
    createOrder(token: $token) {
      id
      charge
      total
      items {
        id
        title
      }
    }
  }
`;
const totalItems = cart => {
  return cart.reduce((tally, cartItem) => tally + cartItem.quantity, 0);
};
const onToken = async (res, createOrder) => {
  NProgress.start();
  // manually call the mutation once we have the stripe token
  const order = await createOrder({
    variables: {
      token: res.id
    }
  }).catch(err => alert(err.message));

  Router.push({
    pathname: "/order",
    query: { id: order.data.createOrder.id }
  });
};

const TakeMyMoney = props => {
  return (
    <User>
      {({ data: { me } }) => (
        <Mutation
          mutation={CREATE_ORDER_MUTATION}
          refetchQueries={[{ query: CURRENT_USER_QUERY }]}
        >
          {createOrder => (
            <StripeCheckout
              amount={calcTotalPrice(me.cart)}
              name="Sick Fits"
              description={`order of ${totalItems(me.cart)} items!`}
              image={me.cart.length && me.cart[0].item && me.cart[0].item.image}
              stripeKey="pk_test_eTPoADrRxBZgCxmdjHv3eMAz"
              currency="USD"
              email={me.email}
              token={res => onToken(res, createOrder)}
            >
              {props.children}
            </StripeCheckout>
          )}
        </Mutation>
      )}
    </User>
  );
};

export default TakeMyMoney;
