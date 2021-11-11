import { ColorDefault } from "@theme";
import * as React from "react";
import Svg, { G, Path, Text } from "react-native-svg";

function ErrorIcon({ size = 32, color = ColorDefault.primary }) {
    return (
        <Svg viewBox="0 0 32 32" width={size} height={size} fill={color}>
            <G data-name="No Data Found, Not Found, Lost, Searching, Search">
                <Path d="M24.71 24.29a1 1 0 00-1-.24l-1.9-1.91a8.52 8.52 0 10-.71.71l1.91 1.91a1 1 0 00.24.95l2.2 2.19a1 1 0 00.7.29 1 1 0 00.71-.29 1 1 0 000-1.41zM10.2 21.8a7.5 7.5 0 1110.6 0 7.49 7.49 0 01-10.6 0z" />
                <Path d="M11.65 16.35a.48.48 0 00.7 0l.65-.64.65.64a.48.48 0 00.7 0 .48.48 0 000-.7l-.64-.65.64-.65a.49.49 0 00-.7-.7l-.65.64-.65-.64a.49.49 0 00-.7.7l.64.65-.64.65a.48.48 0 000 .7zM16.65 16.35a.48.48 0 00.7 0l.65-.64.65.64a.48.48 0 00.7 0 .48.48 0 000-.7l-.64-.65.64-.65a.49.49 0 10-.7-.7l-.65.64-.65-.64a.49.49 0 00-.7.7l.64.65-.64.65a.48.48 0 000 .7zM19.5 18h-8a.5.5 0 000 1H13v1.5a1.5 1.5 0 003 0V19h3.5a.5.5 0 000-1zM15 20.5a.5.5 0 01-1 0V19h1zM25.5 5A2.5 2.5 0 1028 7.5 2.5 2.5 0 0025.5 5zm0 4A1.5 1.5 0 1127 7.5 1.5 1.5 0 0125.5 9zM9 6a2 2 0 10-2 2 2 2 0 002-2zM6 6a1 1 0 111 1 1 1 0 01-1-1zM8.5 26H8v-.5a.5.5 0 00-1 0v.5h-.5a.5.5 0 000 1H7v.5a.5.5 0 001 0V27h.5a.5.5 0 000-1z" />
            </G>
        </Svg>
    );
}

export default ErrorIcon;
