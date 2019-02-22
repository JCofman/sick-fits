import React from "react";
import PleaseSignIn from "../components/PleaseSignIn";
import Order from "../components/Order";

const order = props => {
  return (
    <div>
      <PleaseSignIn>
        <Order id={props.query.id} />
      </PleaseSignIn>
    </div>
  );
};

export default order;
