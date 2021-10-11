import { AppText, AppTextMedium } from "@common-ui/AppText";
import { Color } from "@theme/colors";
import { rem } from "@theme/styleContants";
import React, { Fragment } from "react";
import { FlatList, ScrollView, StyleSheet, View } from "react-native";
import Animated, {
    interpolate,
    scrollTo,
    useAnimatedRef,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
} from "react-native-reanimated";
const FlatListAnimated = Animated.createAnimatedComponent(FlatList);

const MemoRow = React.memo(
    ({ children = null, heightRow }) => {
        return <View style={{ height: heightRow, overflow: "hidden" }}>{children}</View>;
    },
    (prev, next) => prev.data == next.data
);

const TableStickColumn = ({
    data = [],
    keyItem = "key",
    leftHeader = null,
    rightHeader = null,
    LeftRow = ({ item, index }) => null,
    RightRow = ({ item, index }) => null,
    containerStyle,
    rightContainerStyle,
    leftContainerStyle,
    heightRow = 50,
    heightHeader = 50,
    leftWidth = 100,
    stickPosition = 100,
    EmptyDataComponent = null,
}) => {
    const allowScroll = useSharedValue(0);
    const rightARef = useAnimatedRef();
    const leftARef = useAnimatedRef();
    const leftContainerAnimated = useSharedValue(0);

    const onRightScroll = useAnimatedScrollHandler({
        onBeginDrag: () => {
            allowScroll.value = 2;
        },
        onScroll: (event) => {
            if (allowScroll.value == 1) return;
            scrollTo(leftARef, 0, event.contentOffset.y, false);
            allowScroll.value = 0;
        },
    });

    const onLeftScroll = useAnimatedScrollHandler({
        onBeginDrag: () => {
            allowScroll.value = 1;
        },
        onScroll: (event) => {
            if (allowScroll.value == 2) return;
            scrollTo(rightARef, 0, event.contentOffset.y, false);
            allowScroll.value = 0;
        },
    });

    const onRightHorizontalScroll = useAnimatedScrollHandler((event) => {
        const x = event.contentOffset.x;
        leftContainerAnimated.value = x > stickPosition ? -stickPosition : -x;
    });

    const leftContainerStyleAnimated = useAnimatedStyle(() => ({
        transform: [
            {
                translateX: leftContainerAnimated.value,
            },
        ],
    }));

    const renderLeftRow = ({ item, index }) => (
        <MemoRow heightRow={heightRow} data={data}>
            <LeftRow index={index} item={item} />
        </MemoRow>
    );

    const renderRightRow = ({ item, index }) => (
        <MemoRow heightRow={heightRow} data={data}>
            <RightRow index={index} item={item} />
        </MemoRow>
    );

    return (
        <Fragment>
            <View style={[styles.container, data.length == 0 ? { flex: 0 } : undefined, containerStyle]}>
                <View style={[styles.rightContainer, rightContainerStyle]}>
                    <Animated.ScrollView horizontal scrollEventThrottle={16} onScroll={onRightHorizontalScroll}>
                        <View>
                            <View style={{ height: heightHeader, paddingLeft: leftWidth, overflow: "hidden" }}>
                                {rightHeader}
                            </View>
                            <FlatListAnimated
                                ref={rightARef}
                                getItemLayout={(data, index) => ({
                                    length: heightRow,
                                    offset: heightRow * index,
                                    index,
                                })}
                                contentContainerStyle={{ paddingLeft: leftWidth }}
                                windowSize={7}
                                bounces={false}
                                keyExtractor={(item, index) => item?.[keyItem] || index.toString()}
                                data={data}
                                scrollEventThrottle={16}
                                onScroll={onRightScroll}
                                renderItem={renderRightRow}
                                decelerationRate={0.9}
                                nestedScrollEnabled
                            />
                        </View>
                    </Animated.ScrollView>
                </View>
                <Animated.View style={[{ width: leftWidth }, leftContainerStyleAnimated, leftContainerStyle]}>
                    <View style={{ height: heightHeader, overflow: "hidden" }}>{leftHeader}</View>
                    <FlatListAnimated
                        ref={leftARef}
                        getItemLayout={(data, index) => ({
                            length: heightRow,
                            offset: heightRow * index,
                            index,
                        })}
                        windowSize={7}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item, index) => item?.[keyItem] || index.toString()}
                        data={data}
                        renderItem={renderLeftRow}
                        onScroll={onLeftScroll}
                        scrollEventThrottle={16}
                        bounces={false}
                        decelerationRate={0.9}
                        nestedScrollEnabled
                    />
                </Animated.View>
            </View>
            {data.length == 0 ? (
                EmptyDataComponent ? (
                    EmptyDataComponent
                ) : (
                    <View style={styles.centerEmptyData}>
                        <AppTextMedium style={{ color: Color.gray_8 }}>Dữ liệu trống</AppTextMedium>
                    </View>
                )
            ) : null}
        </Fragment>
    );
};

export default TableStickColumn;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
    },
    rightContainer: {
        ...StyleSheet.absoluteFill,
    },
    centerEmptyData: {
        justifyContent: "center",
        alignItems: "center",
        padding: rem,
    },
});
