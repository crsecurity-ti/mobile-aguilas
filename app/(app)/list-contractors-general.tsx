import MainLayout from "../../components/MainLayout";
import ListContractorsView from "../../views/app/roundsAdmin/ListContractors";

export default function ListContractorsGeneral() {
  return (
    <MainLayout>
      <ListContractorsView pathname="/map-admin-contractor" />
    </MainLayout>
  );
}
