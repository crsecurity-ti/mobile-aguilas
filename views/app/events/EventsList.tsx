import "react-native-get-random-values";
import firestore from "@react-native-firebase/firestore";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, FlatList, View } from "react-native";
import { v4 as uuidv4 } from "uuid";

import EventsListRenderItem from "./EventsListRenderItem";
import NoEvents from "./NoEvents";
import { logCatchErr } from "../../../api/utils/crashlytics";
import ButtonDS from "../../../components/ButtonDS";
import LoadingSpinner from "../../../components/LoadingSpinner";
import useEventsList from "../../../hooks/useEventsList";
import { useUserStore } from "../../../store/auth";
import { Category } from "../newEvent/SelectCategory";

const EventsList = () => {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const [categories, setCategories] = useState<Category[]>([]);

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
      } catch (error) {
        logCatchErr(error);
      }
    }
    getCategoriesInfo();
  }, []);

  const { eventsListData } = useEventsList();

  if (!eventsListData || categories.length === 0) return <LoadingSpinner />;

  return (
    <View className="mx-5">
      <ButtonDS
        onPress={() =>
          router.navigate({
            pathname: "/new-event",
            params: { uuid: uuidv4() },
          })
        }
        text="Agregar un nuevo evento"
      />
      <Text className="text-center my-10">
        <Text className="text-sky-600 text-2xl font-bold">Últimos eventos</Text>
      </Text>
      {eventsListData.length === 0 ? (
        <NoEvents />
      ) : (
        <FlatList
          data={eventsListData
            .map((d) => ({
              ...d,
              category: categories.find(
                (category) => category.uuid === d.categoryUuid
              )?.name,
            }))
            .sort(
              (objA, objB) => Number(objB.createdAt) - Number(objA.createdAt)
            )
            .slice(0, 5)}
          renderItem={({ item, index }) => (
            <EventsListRenderItem key={item.uuid} item={item as any} />
          )}
          keyExtractor={(item) => item.uuid}
        />
      )}
    </View>
  );
};

export default EventsList;
