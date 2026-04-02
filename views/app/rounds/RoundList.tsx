import { format } from "date-fns";
import { Text, View, FlatList, StyleSheet } from "react-native";

import NoRounds from "./NoRounds";
import RoundListRenderItem from "./RoundListRenderItem";
import LoadingSpinner from "../../../components/LoadingSpinner";
import useRoundGuardsByDay from "../../../hooks/useRoundGuardsByDay";

const RoundList = () => {
  const { roundsListDataLoading, roundsListData } = useRoundGuardsByDay();

  if (roundsListDataLoading) return <LoadingSpinner text="Cargando..." />;

  if (!roundsListData || roundsListData.length === 0) return <NoRounds />;

  const allRounds = roundsListData
    .map((roundListData) =>
      roundListData.roundsForTheDay.map((round) => ({
        ...round,
        parentRoundListData: roundListData,
      }))
    )
    .flat();

  if (allRounds.length === 0) return <NoRounds />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rondas del Día</Text>
      <Text style={styles.dateText}>{format(new Date(), "yyyy-MM-dd")}</Text>
      <FlatList
        data={allRounds}
        renderItem={({ item, index }) => (
          <RoundListRenderItem
            key={item.uuid}
            item={item}
            index={index}
            roundListData={item.parentRoundListData}
          />
        )}
        keyExtractor={(item) => item.uuid}
        contentContainerStyle={styles.flatListContent}
        ListFooterComponent={<View style={styles.footerComponent} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 20,
  },
  title: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
  },
  dateText: {
    textAlign: "center",
    marginVertical: 10,
    fontSize: 18,
    fontWeight: "600",
    color: "#38bdf8",
  },
  flatListContent: {
    paddingBottom: 20,
  },
  footerComponent: {
    height: 20,
  },
});

export default RoundList;
