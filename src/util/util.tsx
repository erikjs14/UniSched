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

export const scrollTo = (myRef: any) => myRef.current ? window.scrollTo(0, myRef.current.offsetTop) : null;

export const arrayToN = (n: number): number[] => {
    const out = [];
    for (let i = 0; i < n; i++) 
        out.push(i);
    return out;
}

export const filterSubjectsForSpace = (subjects: SubjectModelWithId[], selectedSpaceId: string | null, checkTaskExclude = false): SubjectModelWithId[] => {
    return subjects
        .filter(subject => {
            if (selectedSpaceId === 'all') {
                if (checkTaskExclude) {
                    return subject.excludeTasksFromAll ? false : true;
                } else {
                    return true;
                }
            } else if (selectedSpaceId === 'mainSpace') {
                return !subject.spaceId || subject.spaceId === 'mainSpace';
            } else {
                return subject.spaceId === selectedSpaceId;
            }
        });
}

export const getPseudoRandomIdByTime = () => new Date().getTime() + '-' + Math.floor(Math.random() * 1000000);

export const getLines = (s: string, onlyLast: boolean): string[] => {
    let i = s.indexOf('\n');
    if (i === -1) {
        return [s];
    } else {
        const out: string[] = [];
        let lastIdx = -1;
        while (i >= 0) {
            out.push(s.substring(lastIdx+1, i));
            lastIdx = i;
            i = s.indexOf('\n', i + 1);
        }
        if (s.length > lastIdx + 1) {
            out.push(s.substring(lastIdx+1));
        }
        if (onlyLast) {
            return [out[out.length - 1]];
        } else {
            return out;
        }
    }
}

export const updateMdOnEnter = (prev: string | null | undefined, newText: string): string => {
    if (!prev) {
        return newText;
    }
    if (newText.length > prev.length && newText.endsWith('\n')) {
        const lastLine = getLines(newText, true)[0];
        if (lastLine.endsWith('- ')) {
            return prev.substring(0, prev.length - 2);
        } else if (lastLine.endsWith('- [ ] ') || lastLine.endsWith('- [x] ')) {
            return prev.substring(0, prev.length - 6);
        } else {
            const matchEndNr = lastLine.match(/\d*\.[ ]$/);
            if (matchEndNr && matchEndNr.length > 0) {
                return prev.substring(0, prev.length - matchEndNr[0].length);
            } else if (lastLine.startsWith('- [ ] ')) {
                return newText + '- [ ] ';
            } else if (lastLine.startsWith('- [x] ')) {
                return newText + '- [x] ';
            } else if (lastLine.startsWith('- ')) {
                return newText + '- ';
            } else {
                const matchNr = lastLine.match(/^\d*\.[ ]/);
                if (matchNr && matchNr.length > 0) {
                    const dotIdx = lastLine.indexOf('.');
                    const nr = parseInt(lastLine.substring(0, dotIdx));
                    return newText + `${nr + 1}. `
                }
                return newText;
            }
        }
    } else {
        return newText;
    }
};