import React from "react";
import PropTypes from "prop-types";
import { Query } from "react-apollo";
import { format } from "date-fns";
import Head from "next/head";
import gql from "graphql-tag";
import formatMoney from "../lib/formatMoney";
import Error from "./ErrorMessage";
import OrderStyles from "./styles/OrderStyles";

const SINGLE_ORDER_QUERY = gql`
  query SINGLE_ORDER_QUERY($id: ID!) {
    order(id: $id) {
      id
      charge
      total
      createdAt
      user {
        id
      }
      items {
        id
        title
        description
        price
        image
        quantity
      }
    }
  }
`;
const Order = props => {
  return (
    <Query query={SINGLE_ORDER_QUERY} variables={{ id: props.id }}>
      {({ data, error, loading }) => {
        if (error) return <Error error={error} />;
        if (loading) return <p>Loading...</p>;
        console.log(data);
        const order = data.order;
        return (
          <OrderStyles>
            <Head>
              <title>Sick Fits - Order {order.id}</title>
            </Head>
            <p>
              <span>Order Id:</span>
              <span>{order.id}</span>
            </p>
            <p>
              <span>Charge:</span>
              <span>{order.charge}</span>
            </p>

            <p>
              <span>Date:</span>
              <span>{format(order.createdAt, "MMMM d, yyyy h:mm a")}</span>
            </p>
            <p>
              <span>Order Total:</span>
              <span>{formatMoney(order.total)}</span>
            </p>
            <p>
              <span>Item count:</span>
              <span>{order.items.length}</span>
            </p>
            <div>
              {order.items.map(item => (
                <div className="order-item" key={item.id}>
                  <img src={item.image} alt={item.title} />
                  <div className="item-details">
                    <h2>{item.title}</h2>
                    <p>Qty: {item.quantity}</p>
                    <p>Each: {formatMoney(item.price)}</p>
                    <p>SubTotal: {formatMoney(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
          </OrderStyles>
        );
      }}
    </Query>
  );
};

Order.propTypes = {
  id: PropTypes.string.isRequired
};

export default Order;
