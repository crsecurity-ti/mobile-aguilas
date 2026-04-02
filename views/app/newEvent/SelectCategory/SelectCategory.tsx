import firestore from "@react-native-firebase/firestore";
import React, { useEffect, useState } from "react";
import { View } from "react-native";

import { StyleSheet } from "react-native";

import { logCatchErr } from "../../../../api/utils/crashlytics";
import { useUserStore } from "../../../../store/auth";
import { Dropdown } from "react-native-element-dropdown";

export interface Category {
  uuid?: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface SelectCategoryProps {
  onChange: (uuid: string) => void;
  value: string;
}

const SelectCategory = ({ onChange, value }: SelectCategoryProps) => {
  const user = useUserStore((state) => state.user);
  const [categories, setCategories] = useState<Category[]>([]);

  const [isFocus, setIsFocus] = useState(false);

  useEffect(() => {
    async function getCategoriesInfo() {
      try {
        const categoriesIn: Category[] = [];
        const querySnapshot = await firestore()
          .collection("categories")
          .where(
            "businessUuid",
            "==",
            user?.userInformation?.businessUuid ?? ""
          )
          .get();
        querySnapshot.forEach((doc) => {
          categoriesIn.push(doc.data() as Category);
        });
        setCategories(categoriesIn);
      } catch (err) {
        logCatchErr(err);
      }
    }
    getCategoriesInfo();
  }, [user]);

  return (
    <View className="border border-gray-400 rounded-lg">
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={categories.map((category) => ({
          label: category.name,
          value: category.uuid,
        }))}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? "Elige la categoría del evento" : "..."}
        searchPlaceholder="Buscar una categoría..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          onChange(item.value);
          setIsFocus(false);
        }}
      />
    </View>
  );
};

export default SelectCategory;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 16,
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
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
