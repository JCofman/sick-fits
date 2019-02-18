import React from "react";
import Downshift from "downshift";
import Router from "next/router";
import { ApolloConsumer } from "react-apollo";
import gql from "graphql-tag";
import debounce from "lodash.debounce";
import { DropDown, DropDownItem, SearchStyles } from "./styles/DropDown";

const SEARCH_ITEM_QUERY = gql`
  query SEARCH_ITEM_QUERY($searchTerm: String!) {
    items(
      where: {
        OR: [
          { title_contains: $searchTerm }
          { description_contains: $searchTerm }
        ]
      }
    ) {
      id
      image
      title
    }
  }
`;

const Search = () => {
  const [items, setItems] = React.useState({
    items: [],
    loading: false
  });

  const onChange = debounce(async (e, client) => {
    const res = await client.query({
      query: SEARCH_ITEM_QUERY,
      variables: { searchTerm: e.target.value }
    });
    console.log(res);
    setItems({
      items: res.data.items,
      loading: false
    });
  }, 350);

  const routeToItem = item => {
    Router.push({
      pathname: "/item",
      query: {
        id: item.id
      }
    });
  };
  return (
    <SearchStyles>
      <Downshift
        itemToString={item => {
          if (item === null) return;
          return item.title;
        }}
        onChange={routeToItem}
      >
        {({
          getInputProps,
          getItemProps,
          isOpen,
          inputValue,
          highlightedIndex
        }) => (
          <div>
            <ApolloConsumer>
              {client => (
                <input
                  type="search"
                  {...getInputProps({
                    type: "search",
                    placeholder: "Search For An Item",
                    id: "search",
                    className: items.loading ? "loading" : "",
                    onChange: e => {
                      e.persist();
                      onChange(e, client);
                    }
                  })}
                />
              )}
            </ApolloConsumer>
            {isOpen && (
              <DropDown>
                {items.items.map((item, index) => (
                  <DropDownItem
                    {...getItemProps({ item })}
                    key={item.id}
                    highlighted={index === highlightedIndex}
                  >
                    <img width="50" src={item.image} alt={item.title} />
                    {item.title}
                  </DropDownItem>
                ))}
                {!items.items.length && !items.loading && (
                  <DropDownItem>Nothing found for {inputValue}</DropDownItem>
                )}
              </DropDown>
            )}
          </div>
        )}
      </Downshift>
    </SearchStyles>
  );
};

export default Search;
