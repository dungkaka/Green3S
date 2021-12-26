export const Int = (value) => {
    const intValue = parseInt(String(value));
    // if (intValue != Number(value)) {
    //     throw new Exe(400, "Cast to Int fail !");
    // }
    if (isNaN(intValue)) return undefined;
    return intValue;
};

export const Float = (value) => {
    const floatValue = parseFloat(String(value));
    // if (floatValue != Number(value)) {
    //     throw new HttpException(400, "Cast to Float fail !");
    // }
    if (isNaN(floatValue)) return undefined;
    return floatValue;
};
