import React from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import { ALL_ITEMS_QUERY } from "./Items";

const DELETE_ITEM_MUTATION = gql`
  mutation DELETE_ITEM_MUTATION($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
`;

const DeleteItem = props => {
  return (
    <Mutation
      mutation={DELETE_ITEM_MUTATION}
      variables={{ id: props.id }}
      update={(cache, payload) => {
        // 1. read items

        const data = cache.readQuery({ query: ALL_ITEMS_QUERY });
        console.log(data, payload);
        data.items = data.items.filter(
          item => item.id !== payload.data.deleteItem.id
        );

        cache.writeData({ query: ALL_ITEMS_QUERY, data });
      }}
    >
      {(deleteItem, { error }) => (
        <button
          onClick={() => {
            if (confirm("Do you really want to delete this Item")) {
              deleteItem().catch(err => {
                alert(err.message);
              });
            }
          }}
        >
          {props.children}
        </button>
      )}
    </Mutation>
  );
};

export default DeleteItem;
