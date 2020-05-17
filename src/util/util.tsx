export const toCss = (...classNames: string[]): string => {
    return classNames.join(' ');
}

export const updateObject = (oldObject, updatedProperties) => {
    return {
        ...oldObject,
        ...updatedProperties
    };
};