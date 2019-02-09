import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import styled from "styled-components";
import Error from "./ErrorMessage";
import Head from "next/head";

const StyledSingleItem = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  box-shadow: ${props => props.theme.bs};
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  min-height: 800px;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  details {
    margin: 3rem;
    font-size: 2rem;
  }
`;

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      largeImage
    }
  }
`;

const SingleItem = props => {
  return (
    <Query query={SINGLE_ITEM_QUERY} variables={{ id: props.id }}>
      {({ error, loading, data }) => {
        if (error) return <p>{Error}</p>;
        if (loading) return <p>Loading...</p>;
        if (!data.item) return <p>No Item found for {props.id}</p>;
        const item = data.item;
        return (
          <StyledSingleItem>
            <Head>
              <title>Sick Fits | {item.title}</title>
            </Head>
            <img src={item.largeImage} alt={item.title} />
            <div className="details">
              <h2>Viewing {item.title}</h2>
              <p>{item.description}</p>
            </div>
          </StyledSingleItem>
        );
      }}
    </Query>
  );
};

export default SingleItem;
