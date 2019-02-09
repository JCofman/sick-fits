import React from "react";
import CreateItem from "../components/CreateItem";
import PleaseSignIn from "../components/PleaseSignIn";
import Link from "next/link";

const Sell = () => {
  return (
    <div>
      <PleaseSignIn>
        <CreateItem />
      </PleaseSignIn>
    </div>
  );
};

export default Sell;
