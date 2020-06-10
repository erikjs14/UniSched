import { SubjectModelWithId, SubjectModel } from "../firebase/model";

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

export const hex2rgba = ( hex: string, a: number = 1 ): string => {
    let r,g,b;
    if ( hex.charAt(0) === '#' ) {
        hex = hex.substr(1);
    }
    if ( hex.length === 3 ) {
        hex = hex.substr(0,1) + hex.substr(0,1) + hex.substr(1,2) + hex.substr(1,2) + hex.substr(2,3) + hex.substr(2,3);
    }
    r = hex.charAt(0) + '' + hex.charAt(1);
    g = hex.charAt(2) + '' + hex.charAt(3);
    b = hex.charAt(4) + '' + hex.charAt(5);
    r = parseInt( r,16 );
    g = parseInt( g,16 );
    b = parseInt( b ,16);
    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
}

export const getResult = <T extends any>(fct: () => T ): T => fct();

export const subjectsToObject = (subjects: SubjectModelWithId[]): {[id: string]: SubjectModel} => {
    const out: {[id: string]: SubjectModel} = {};
    subjects.forEach(sub => out[sub.id] = (removeKey('id', sub) as SubjectModel));
    return out;
}

// heuristic approach
export const isMobile = (): boolean => {
    return window.screen.width < 601;
}