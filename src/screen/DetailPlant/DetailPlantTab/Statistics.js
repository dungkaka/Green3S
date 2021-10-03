import { AppText } from "@common-ui/AppText";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Line } from "react-native-svg";
import {
    createContainer,
    VictoryArea,
    VictoryBar,
    VictoryChart,
    VictoryTheme,
    VictoryTooltip,
    VictoryLabel,
    VictoryVoronoiContainer,
} from "victory-native";
import { ECharts } from "react-native-echarts-wrapper";

const VictoryCursorVoronoiContainer = createContainer("cursor", "voronoi");

// const data = [
//     { quarter: 1, earnings: 13000 },
//     { quarter: 2, earnings: 16500 },
//     { quarter: 3, earnings: 14250 },
//     { quarter: 4, earnings: 19000 },
// ];

const data = [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42].map((x) => ({
    quarter: x,
    earnings: x * x,
}));

const findClosestPointSorted = (data, value) => {
    // assumes 3 things:
    // 1. data is sorted by x
    // 2. data points are equally spaced
    // 3. the search is 1-dimentional (x, not x and y)
    if (value === null) return null;
    const start = data[0].quarter;
    const range = data[3].quarter - start;
    const index = Math.round(((value - start) / range) * (data.length - 1));
    return data[index];
};

const Statistics = () => {
    const [activePoint, setActivePoint] = useState(null);
    const yMax = 19000;

    const handleCursorChange = (value) => {
        console.log("A", findClosestPointSorted(data, value));
        // setActivePoint(findClosestPointSorted(data, value));
    };

    return (
        <View style={styles.container}>
            <VictoryChart
                // animate={{
                //     duration: 2000,
                //     onLoad: { duration: 1000 },
                // }}
                height={300}
                width={350}
                theme={VictoryTheme.material}
                domainPadding={{ x: [30, 20], y: [0, 20] }}
                containerComponent={
                    <VictoryCursorVoronoiContainer
                        voronoiDimension="x"
                        cursorDimension="x"
                        mouseFollowTooltips
                        // cursorLabel={(cursor) => `Ha QUy Dung Ha Ha Quy`}
                        // cursorLabelComponent={<VictoryTooltip constrainToVisibleArea />}
                        labels={({ datum }) => "Ha QUy Dung Ha Ha Ha Quy Ha Quy"}
                        labelComponent={
                            <VictoryTooltip
                                // constrainToVisibleArea
                                orientation={({ datum }) => {
                                    console.log("DATUM", datum);
                                    return "right";
                                }}
                            />
                        }
                        // onCursorChange={handleCursorChange}
                        // defaultCursorValue={0}
                    />
                }
            >
                <VictoryBar data={data} x="quarter" y="earnings" />
            </VictoryChart>
        </View>
    );
};

export default React.memo(Statistics, () => true);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5fcff",
    },
});
