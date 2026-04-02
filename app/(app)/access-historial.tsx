import React from "react";

import MainLayout from "../../components/MainLayout";
import AccessHistorialView from "../../views/app/access/historial";

const AccessHistorialPage = () => {
  return (
    <MainLayout returnButtonPath="/access">
      <AccessHistorialView />
    </MainLayout>
  );
};

export default AccessHistorialPage;
