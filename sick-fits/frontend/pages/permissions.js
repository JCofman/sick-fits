import React from "react";
import PleaseSignIn from "../components/PleaseSignIn";
import Permissions from "../components/Permissions";
import Link from "next/link";

const PermissionsPage = () => {
  return (
    <div>
      <PleaseSignIn>
        <Permissions />
      </PleaseSignIn>
    </div>
  );
};

export default PermissionsPage;
