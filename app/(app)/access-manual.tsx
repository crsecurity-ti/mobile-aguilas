import React from "react";

import MainLayout from "../../components/MainLayout";
import AccessManualPageView from "../../views/app/access/manual";

const accessPersonalPage = () => {
  return (
    <MainLayout returnButtonPath="/access">
      <AccessManualPageView />
    </MainLayout>
  );
};

export default accessPersonalPage;
