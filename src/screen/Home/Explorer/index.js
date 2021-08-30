import { showToast } from "@common-ui/ToastNotify/ToastManager";
import { WIDTH } from "@theme/scale";
import React, { useEffect, useRef, useState } from "react";
import { Dimensions, FlatList, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
    Extrapolate,
    interpolate,
    runOnJS,
    runOnUI,
    useAnimatedReaction,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import PagerView from "react-native-pager-view";

const tabs = ["Home", "Feeds", "User", "Very long tabs name", "Bookshelf", "Somthing"];

const index = () => {
    const flatlistRef = useRef();
    const tabsRef = useRef([]);
    const [tabsSize, setTabsSize] = useState();
    const pageViewRef = useRef();

    const activeIndex = useSharedValue(0);
    // const widthIndicator = useSharedValue(0);
    // const translateXIndicator = useSharedValue(0);

    useEffect(() => {
        const sizes = [];
        tabsRef.current.map((tabRef) => {
            tabRef.measureLayout(flatlistRef.current, (x, y, w, h) => {
                let positionActive = x + (w - WIDTH) / 2;
                sizes.push({ x, y, w, h, positionActive });
                if (tabs.length == sizes.length) setTabsSize(sizes);
            });
        });
    }, []);

    const arrayTabsIndex = tabs.map((_, index) => index);
    const arrayWidthIndicator = tabsSize?.map((tabSize) => tabSize.w);
    const arrayTranslateXIndicator = tabsSize?.map((tabSize) => tabSize.x);

    const widthIndicator = useDerivedValue(
        () => (tabsSize ? interpolate(activeIndex.value, arrayTabsIndex, arrayWidthIndicator, Extrapolate.CLAMP) : 0),
        [tabsSize]
    );
    const translateXIndicator = useDerivedValue(
        () => (tabsSize ? interpolate(activeIndex.value, arrayTabsIndex, arrayTranslateXIndicator, Extrapolate.CLAMP) : 0),
        [tabsSize]
    );

    const scrollHandler = (event) => {
        "worklet";
        activeIndex.value = event.nativeEvent.position + event.nativeEvent.offset;
        // const lowIndex = Math.floor(activeIndex.value);
        // const highIndex = Math.ceil(activeIndex.value);
        // if (lowIndex == highIndex) return;
        // const lowWidth = tabsSize.current[lowIndex].w;
        // const highWidth = tabsSize.current[highIndex].w;
        // const lowX = tabsSize.current[lowIndex].x;
        // const highX = tabsSize.current[highIndex].x;

        // widthIndicator.value = ((activeIndex.value - lowIndex) * (highWidth - lowWidth)) / (highIndex - lowIndex) + lowWidth;
        // translateXIndicator.value = ((activeIndex.value - lowIndex) * (highX - lowX)) / (highIndex - lowIndex) + lowX;
    };

    const indicatorStyle = useAnimatedStyle(() => ({
        width: widthIndicator.value,
        transform: [{ translateX: translateXIndicator.value }],
    }));

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ height: 90 }}>
                <ScrollView
                    ref={flatlistRef}
                    style={{ backgroundColor: "red" }}
                    horizontal
                    snapToAlignment={"center"}
                    showsHorizontalScrollIndicator={false}
                >
                    {tabs.map((item, index) => (
                        <TouchableOpacity
                            ref={(ref) => (tabsRef.current[index] = ref)}
                            onPress={() => {
                                // activeIndex.value = index;
                                // widthIndicator.value = withTiming(tabsSize.current[index].w);
                                // translateXIndicator.value = withTiming(tabsSize.current[index].x);
                                // flatlistRef.current.scrollTo({
                                //     animated: true,
                                //     x: tabsSize[index].positionActive,
                                //     y: 0,
                                // });

                                pageViewRef.current.setPage(index);
                            }}
                            key={index}
                        >
                            <Text style={{ padding: 12, paddingTop: 50, fontSize: 16 }}>{item}</Text>
                        </TouchableOpacity>
                    ))}
                    <Animated.View style={[styles.indicator, indicatorStyle]} />
                </ScrollView>
            </View>
            <View style={{ flex: 1 }}>
                <PagerView
                    ref={pageViewRef}
                    style={{ flex: 1 }}
                    initialPage={0}
                    onPageScroll={scrollHandler}
                    onPageSelected={(e) => {
                        flatlistRef.current.scrollTo({
                            animated: true,
                            x: tabsSize[e.nativeEvent.position].positionActive,
                            y: 0,
                        });
                    }}
                >
                    <View style={{ justifyContent: "center", alignItems: "center" }} collapsable={false}>
                        <Text>{`Page ${0}`}</Text>
                    </View>
                    <View style={{ justifyContent: "center", alignItems: "center" }} collapsable={false}>
                        <Text>{`Page ${1}`}</Text>
                    </View>

                    <View style={{ justifyContent: "center", alignItems: "center" }} collapsable={false}>
                        <Text>{`Page ${2}`}</Text>
                    </View>

                    <View style={{ justifyContent: "center", alignItems: "center" }} collapsable={false}>
                        <Text>{`Page ${3}`}</Text>
                    </View>

                    <View style={{ justifyContent: "center", alignItems: "center" }} collapsable={false}>
                        <Text>{`Page ${4}`}</Text>
                    </View>

                    <View style={{ justifyContent: "center", alignItems: "center" }} collapsable={false}>
                        <Text>{`Page ${5}`}</Text>
                    </View>
                </PagerView>
            </View>
        </SafeAreaView>
    );
};

export default index;

const styles = StyleSheet.create({
    indicator: {
        height: 5,
        width: 20,
        position: "absolute",
        bottom: 0,
        left: 0,
        backgroundColor: "black",
    },
});
