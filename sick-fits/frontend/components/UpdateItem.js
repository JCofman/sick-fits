import React, { Component, useState } from "react";
import { Mutation, Query } from "react-apollo";
import gql from "graphql-tag";
import Router from "next/router";

import Form from "./styles/Form";
import formatMoney from "../lib/formatMoney";
import ErrorMessage from "./ErrorMessage";

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      price
    }
  }
`;

const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION(
    $id: ID!
    $title: String
    $description: String
    $price: Int
  ) {
    updateItem(
      id: $id
      title: $title
      description: $description
      price: $price
    ) {
      id
      title
      description
      price
    }
  }
`;

const UpdateItem = props => {
  const [item, setItem] = useState({});

  const handleChange = e => {
    const { name, type, value } = e.target;
    const val = type === "number" ? parseFloat(value) : value;
    setItem(state => ({ ...state, [name]: val }));
  };

  const handleItemUpdate = async (e, updateItemMutation) => {
    e.preventDefault();

    const res = await updateItemMutation({
      variables: {
        id: props.id,
        ...item
      }
    });
  };

  return (
    <Query query={SINGLE_ITEM_QUERY} variables={{ id: props.id }}>
      {({ loading, data }) => {
        if (loading) return <p>Loading...</p>;
        if (!data) return <p>No Item Found for id {id}</p>;
        return (
          <Mutation mutation={UPDATE_ITEM_MUTATION} variables={item}>
            {(updateItem, { loading, error }) => {
              return (
                <Form onSubmit={e => handleItemUpdate(e, updateItem)}>
                  <h2>Sell an Item</h2>
                  <ErrorMessage error={error} />
                  <fieldset disabled={loading} aria-busy={loading}>
                    <label htmlFor="title">
                      Title
                      <input
                        type="text"
                        id="title"
                        name="title"
                        placeholder="title"
                        required
                        defaultValue={data.item.title}
                        onChange={handleChange}
                      />
                    </label>
                    <label htmlFor="Price">
                      Price
                      <input
                        type="number"
                        id="price"
                        name="price"
                        placeholder="price"
                        required
                        defaultValue={data.item.price}
                        onChange={handleChange}
                      />
                    </label>
                    <label htmlFor="description">
                      Description
                      <textarea
                        id="description"
                        name="description"
                        placeholder="description"
                        required
                        defaultValue={data.item.description}
                        onChange={handleChange}
                      />
                    </label>
                    <button type="submit">
                      Sav{loading ? "ing" : "e"} Change
                    </button>
                  </fieldset>
                </Form>
              );
            }}
          </Mutation>
        );
      }}
    </Query>
  );
};

export default UpdateItem;
