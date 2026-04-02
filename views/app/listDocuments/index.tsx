import ButtonDS from "../../../components/ButtonDS";
import DocumentListItem from "./DocumentListItem";
import PDFModal from "./PDFModal";
import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import SignatureModal from "./SignatureModal";
import useSignaturesList from "../../../hooks/useSignaturesList";
import { isAfter, isBefore } from "date-fns";

const ListDocumentsView = () => {
  const [pdfData, setPdfData] = useState({
    visible: false,
    uri: "",
  });

  const [signatureVisible, setSignatureVisible] = useState(false);

  const { signaturesListData } = useSignaturesList();

  const [signaturesChecked, setSignaturesChecked] =
    useState<{ checked: boolean; signatureUuid: string }[]>();

  useEffect(() => {
    if (!signaturesListData) return;
    
    setSignaturesChecked(
      signaturesListData.map((signature: any) => ({
        checked: false,
        signatureUuid: signature.uuid,
      }))
    );
  }, [signaturesListData]);

  console.log({ signaturesChecked, signaturesListData });
  return (
    <View>
      <PDFModal
        uri={pdfData.uri}
        modalVisible={pdfData.visible}
        setModalVisible={setPdfData}
      />
      <SignatureModal
        modalVisible={signatureVisible}
        setModalVisible={setSignatureVisible}
        signaturesChecked={signaturesChecked ?? []}
      />
      {signaturesChecked && signaturesChecked?.length === 0 ? (
        <Text className="text-center mt-10 font-bold text-xl">
          No hay documentos para firmar
        </Text>
      ) : signaturesListData?.some(
          (signature) =>
            isAfter(new Date(), signature.startDate) &&
            isBefore(new Date(), signature.endDate)
        ) ? (
        <FlatList
          data={signaturesListData.filter(
            (signature) =>
              isAfter(new Date(), signature.startDate) &&
              isBefore(new Date(), signature.endDate)
          )}
          keyExtractor={(item) => item.uuid}
          renderItem={(item) => (
            <DocumentListItem
              setPdfData={setPdfData}
              checked={signaturesChecked ?? []}
              setChecked={setSignaturesChecked}
              index={item.index}
              item={item.item}
            />
          )}
          ListFooterComponent={
            <ButtonDS
              intent="primary"
              disabled={!signaturesChecked?.some((item) => item.checked)}
              text={"Firmar Documentos"}
              className="mx-5 mb-4"
              onPress={() => setSignatureVisible(true)}
            />
          }
        />
      ) : (
        <Text className="text-center mt-10 font-bold text-xl">
          No hay documentos para firmar
        </Text>
      )}
    </View>
  );
};

export default ListDocumentsView;
