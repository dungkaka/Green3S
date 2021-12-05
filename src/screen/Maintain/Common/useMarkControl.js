const { useState, useEffect, useMemo } = require("react");

export const useMarkControl = ({ datas }) => {
    const [marks, setMarks] = useState({});
    const arrayMarks = useMemo(() => Object.keys(marks).filter((errorId) => marks[errorId] == true), [marks]);
    const isAllMark = datas.length > 0 && arrayMarks.length == datas.length;

    useEffect(() => {
        if (Object.keys(marks).length != 0) setMarks({});
    }, [datas]);

    return {
        marks,
        setMarks,
        arrayMarks,
        isAllMark,
    };
};
