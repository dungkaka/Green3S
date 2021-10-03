import * as React from "react";
import Svg, { Path } from "react-native-svg";

function SolarPanel({ size = 24 }) {
    return (
        <Svg viewBox="0 0 512 512" width={size} height={size}>
            <Path d="M0 136.625h55.015v30H0z" fill="#fffd73" />
            <Path d="M12.811 88.805l15-25.98 25.981 15-15 25.98z" fill="#ffdb2e" />
            <Path d="M249.45 77.822l25.98-15 15 25.98-25.98 15z" fill="#ffb74a" />
            <Path d="M12.812 214.443l25.981-15 15 25.98-25.98 15zM136.62 0h30v30h-30z" fill="#ffdb2e" />
            <Path d="M151.63 0h14.99v30h-14.99z" fill="#ffb74a" />
            <Path d="M273.25 136.625h30v30h-30z" fill="#ffdb2e" />
            <Path d="M62.816 275.436l27.5-47.63 25.98 15-27.5 47.63z" fill="#fffd73" />
            <Path d="M186.945 60.45l27.5-47.63 25.98 15-27.5 47.63z" fill="#ffdb2e" />
            <Path d="M62.82 27.813l25.98-15 27.5 47.63-25.98 15z" fill="#fffd73" />
            <Path
                d="M259.12 151.63c0 59.36-48.13 107.49-107.49 107.49-59.37 0-107.5-48.13-107.5-107.49 0-59.37 48.13-107.5 107.5-107.5 59.36 0 107.49 48.13 107.49 107.5z"
                fill="#ffdb2e"
            />
            <Path
                d="M259.12 151.63c0 59.36-48.13 107.49-107.49 107.49V44.13c59.36 0 107.49 48.13 107.49 107.5z"
                fill="#ffb74a"
            />
            <Path
                d="M189.38 151.63c0 20.85-16.9 37.75-37.75 37.75-20.86 0-37.76-16.9-37.76-37.75 0-20.86 16.9-37.76 37.76-37.76 20.85 0 37.75 16.9 37.75 37.76z"
                fill="#fffd73"
            />
            <Path d="M189.38 151.63c0 20.85-16.9 37.75-37.75 37.75v-75.51c20.85 0 37.75 16.9 37.75 37.76z" fill="#ffdb2e" />
            <Path d="M492.71 203.75l-59.22 233H92.6l59.22-233z" fill="#429ffe" />
            <Path d="M492.71 203.75l-59.22 233H263.05l59.22-233z" fill="#2276ee" />
            <Path d="M143.712 431.47v70.81h231.05v-70.81z" fill="#cadbf8" />
            <Path d="M259.242 431.47h115.52v70.81h-115.52z" fill="#a6c1ea" />
            <Path d="M0 482h512v30H0z" fill="#d0ec43" />
            <Path d="M259.237 482H512v30H259.237z" fill="#53cf55" />
            <Path
                d="M140.16 188.75l-66.84 263h371.84l66.84-263zm136.96 30h82.67l-12.11 47.67H265zm-113.63 0h82.67l-12.11 47.67h-82.68zm31.08 203h-82.68l12.12-47.67h82.67zm-62.94-77.67l12.12-47.66h82.67l-12.11 47.66zm176.57 77.67h-82.68l12.12-47.67h82.67zm-62.94-77.67l12.12-47.66h82.67l-12.11 47.66zm176.57 77.67h-82.68l12.12-47.67h82.67zm19.74-77.67h-82.68l12.12-47.66h82.67zm-62.94-77.66l12.12-47.67h82.67l-12.11 47.67z"
                fill="#e6f0ff"
            />
            <Path
                d="M326.08 188.75l-7.62 30h41.33l-12.11 47.67h-41.34l-7.62 30h41.33l-12.11 47.66H286.6l-7.62 30h41.33l-12.11 47.67h-41.34l-7.62 30h185.92l66.84-263zm95.75 233h-82.68l12.12-47.67h82.67zm19.74-77.67h-82.68l12.12-47.66h82.67zm-62.94-77.66l12.12-47.67h82.67l-12.11 47.67z"
                fill="#cadbf8"
            />
        </Svg>
    );
}

export default SolarPanel;
