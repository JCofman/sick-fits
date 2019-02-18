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

const totalItems = cart => {
  return cart.reduce((tally, cartItem) => tally + cartItem.quantity, 0);
};
const onToken = token => {
  console.log(token);
};
const TakeMyMoney = props => {
  return (
    <User>
      {({ data: { me } }) => (
        <StripeCheckout
          amount={calcTotalPrice(me.cart)}
          name="Sick Fits"
          description={`order of ${totalItems(me.cart)} items!`}
          image={me.cart[0].item && me.cart[0].item.image}
          stripeKey="pk_test_eTPoADrRxBZgCxmdjHv3eMAz"
          currency="USD"
          email={me.email}
          token={res => onToken(res)}
        >
          {props.children}
        </StripeCheckout>
      )}
    </User>
  );
};

export default TakeMyMoney;
