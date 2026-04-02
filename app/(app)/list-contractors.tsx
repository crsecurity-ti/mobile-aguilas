import MainLayout from "../../components/MainLayout";
import ListContractorsView from "../../views/app/roundsAdmin/ListContractors";

export default function ListContractors() {
  return (
    <MainLayout>
      <ListContractorsView pathname="/list-rounds" />
    </MainLayout>
  );
}
