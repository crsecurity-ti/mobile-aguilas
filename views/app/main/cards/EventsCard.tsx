import { format } from "date-fns";
import { useRouter } from "expo-router";
import React from "react";
import { Text } from "react-native";

import SimpleCardDS from "../../../../components/SimpleCardDS";
import useEventsList from "../../../../hooks/useEventsList";

const EventsCard = () => {
  const { eventsListData } = useEventsList();
  const router = useRouter();

  return (
    <>
      <SimpleCardDS
        onPressButton={() =>
          router.navigate({
            pathname: "/events",
          })
        }
        textButton="Ir a Eventos"
        body={
          <>
            <Text className="font-bold text-xl pb-2">
              Detalle de los eventos de Hoy
            </Text>
            <Text className="text-sm text-violet-500 font-semibold pb-2">
              Eventos generados del dia {format(new Date(), "yyyy-MM-dd")}.
            </Text>
            <Text>
              Se han generado un total de {eventsListData?.length || 0} evento
              {(eventsListData?.length || 0) > 1 ||
              (eventsListData?.length || 0) === 0
                ? "s"
                : ""}
            </Text>
          </>
        }
      />
    </>
  );
};

export default EventsCard;
