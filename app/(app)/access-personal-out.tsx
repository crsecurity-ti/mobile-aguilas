import React from "react";

import MainLayout from "../../components/MainLayout";
import AccessPersonalOutView from "../../views/app/access/outList";

const accessPersonalOut = () => {
  return (
    <MainLayout returnButtonPath="/access">
      <AccessPersonalOutView />
    </MainLayout>
  );
};

export default accessPersonalOut;
