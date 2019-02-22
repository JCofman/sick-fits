import React from "react";
import PleaseSignIn from "../components/PleaseSignIn";
import OrdersList from "../components/OrdersList";

const orders = props => {
  return (
    <div>
      <PleaseSignIn>
        <OrdersList />
      </PleaseSignIn>
    </div>
  );
};

export default orders;
