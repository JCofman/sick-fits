import React from "react";
import Link from "next/link";
import Items from "../components/Items";

const Home = props => {
  return (
    <div>
      <Items page={parseFloat(props.query.page) || 1} />
    </div>
  );
};

export default Home;
