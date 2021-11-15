import { ColorDefault } from "@theme/";
import { Color } from "@theme/colors";
import { unit } from "@theme/styleContants";
import { GoogleSansFontType } from "@theme/typography";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        backgroundColor: "white",
    },
    titleContainer: {
        padding: 16 * unit,
        paddingBottom: 8 * unit,
    },
    title: {
        fontSize: 18 * unit,
        color: Color.gray_10,
    },

    modeContainer: {
        paddingHorizontal: 20 * unit,
        paddingVertical: 8 * unit,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    modeItem: {
        flex: 1,
        padding: 8 * unit,
        textAlign: "center",
        color: Color.gray_10,
        fontSize: 15 * unit,
    },
    modeSelection: {
        borderRadius: 24 * unit,
        backgroundColor: ColorDefault.primary,
        color: "white",
        fontFamily: GoogleSansFontType.bold,
    },
    dateContainer: {
        paddingVertical: 4 * unit,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    dateDirectItem: {
        paddingHorizontal: 12 * unit,
    },
    displayDate: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 6 * unit,
        paddingHorizontal: 12 * unit,
        backgroundColor: Color.gray_0,
        borderRadius: 6 * unit,
        borderWidth: 1,
        borderColor: Color.gray_3,
    },

    textDateDisplay: {
        color: Color.gray_8,
        paddingHorizontal: 12 * unit,
    },
    echartContainer: { flex: 1, width: "100%" },
});
