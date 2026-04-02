import firestore from "@react-native-firebase/firestore";
import { useEffect, useState } from "react";
import { Dropdown } from 'react-native-element-dropdown';
import { View } from "react-native";
import { StyleSheet } from 'react-native';

import { logCatchErr } from "../../../../api/utils/crashlytics";
import { useUserStore } from "../../../../store/auth";

export interface Contractor {
  uuid?: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface SelectContractorProps {
  onChange: (uuid: string) => void;
  value: string;
}

const SelectContractor = ({ onChange, value }: SelectContractorProps) => {
  const user = useUserStore((state) => state.user);
  const [contractors, setContractors] = useState<Contractor[]>([]);

  const [isFocus, setIsFocus] = useState(false);

  useEffect(() => {
    async function getContractorsInfo() {
      try {
        const contractorsIn: Contractor[] = [];
        const querySnapshot = await firestore().collection("contractors").get();
        querySnapshot.forEach((doc) => {
          const contractorData = doc.data() as Contractor;
          if (user?.userInformation?.contractors) {
            if (
              user?.userInformation?.contractors?.includes(
                contractorData.uuid as string
              )
            ) {
              contractorsIn.push(contractorData);
            }
          } else {
            if (user?.userInformation?.contractorUuid === contractorData.uuid) {
              contractorsIn.push(contractorData);
            }
          }
        });
        setContractors(contractorsIn);
      } catch (err) {
        logCatchErr(err);
      }
    }
    getContractorsInfo();
  }, [user]);

  return (
    <View className="border border-gray-400 rounded-lg">
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={contractors.map((contractor) => ({
          label: contractor.name,
          value: contractor.uuid,
        }))}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? 'Elige la instalación del evento' : '...'}
        searchPlaceholder="Buscar una instalación..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          onChange(item.value);
          setIsFocus(false);
        }}
      />
    </View>
  );
};

export default SelectContractor;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16,
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});