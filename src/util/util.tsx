export const toCss = (...classNames: string[]): string => {
    return classNames.join(' ');
}

export const updateObject = <T extends object>(oldObject: T, updatedProperties: object): T => {
    return {
        ...oldObject,
        ...updatedProperties
    };
};

export const removeKey = <T extends object>(key: keyof T, { [key]: _, ...rest }: T): object => rest;