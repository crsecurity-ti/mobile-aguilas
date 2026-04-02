import * as React from "react";
import { View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";

import { SBItem } from "../../views/app/newEvent/components/SBItem";
import PaginationItem from "./PaginationItem";
import { PAGE_WIDTH } from "./utils";
import { baseOptions } from "./utils";
import CarouselEmpty from "./CarouselEmpty";

const CarouselPhotos = ({
  images,
}: {
  images: {
    image: string;
  }[];
}) => {
  const progressValue = useSharedValue<number>(0);

  if (images === undefined || images.length === 0) return <CarouselEmpty />;

  return (
    <View
      style={{
        alignItems: "center",
      }}
    >
      <Carousel
        {...baseOptions}
        style={{
          width: PAGE_WIDTH * 0.86,
        }}
        loop
        pagingEnabled
        snapEnabled
        autoPlay={false}
        autoPlayInterval={1500}
        onProgressChange={(_, absoluteProgress) =>
          (progressValue.value = absoluteProgress)
        }
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 50,
        }}
        data={images.map((image) => image.image as string)}
        renderItem={({ index, item }) => <SBItem index={index} image={item} />}
      />
      {images.length > 1 && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: 100,
            alignSelf: "center",
          }}
        >
          {images.map((backgroundColor, index) => {
            return (
              <PaginationItem
                backgroundColor="#26292E"
                animValue={progressValue}
                index={index}
                key={index}
                isRotate={false}
                length={images.length}
              />
            );
          })}
        </View>
      )}
    </View>
  );
};

export default CarouselPhotos;
