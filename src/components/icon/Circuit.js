import * as React from "react";
import Svg, { Path, G, Circle } from "react-native-svg";

function Circuit({ size = 24 }) {
    return (
        <Svg viewBox="0 0 64 64" width={size} height={size}>
            <G data-name="Layer 20">
                <Path d="M10 42v10h37V12H10v10H6V8h45v48H6V42z" fill="#c8cded" />
                <Circle cx={49} cy={32} fill="#f4a93c" r={13} />
                <Path
                    d="M59 30a12.952 12.952 0 00-4.371-9.7 12.984 12.984 0 00-14.258 21.4A12.976 12.976 0 0059 30z"
                    fill="#f6b940"
                />
                <Path d="M51 23l-9 11h6l-2 7 10-11h-6z" fill="#fce797" />
                <Path d="M2 22h12v4H2z" fill="#5e87ca" />
                <Path d="M12 23v-1H2v2h9a1 1 0 001-1z" fill="#78a0d4" />
                <Path d="M2 38h12v4H2z" fill="#5e87ca" />
                <Path d="M4 30h8v4H4z" fill="#f0ae42" />
                <Path
                    d="M10 31v-1H4v2h5a1 1 0 001-1zM24 38a1 1 0 01-.948-.684l-2.238-6.71-.914 1.841A1 1 0 0119 33h-4v-2h3.382l1.723-3.447a1 1 0 011.843.131l2 6 2.092-6.975a1 1 0 01.915-.709.977.977 0 01.974.627L29.677 31H33v2h-4a1 1 0 01-.929-.628l-.936-2.342-2.177 7.257a1 1 0 01-.942.713z"
                    fill="#f9d266"
                />
                <Path d="M12 39v-1H2v2h9a1 1 0 001-1z" fill="#78a0d4" />
            </G>
        </Svg>
    );
}

export default Circuit;
