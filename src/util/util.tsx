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

// expects a before and after string with *one* keystroke difference
// export const getDiffAndIdx = (before: string, after: string): [string, number, number] => {
//     if (before.length === 0) {
//         return [after, 0, 0];
//     } else if (before.length >= after.length) {
//         return ['', -1, -1];
//     } else {
//         let curLineIdx = 0;
//         for (let i = 0; i < before.length; i++) {
//             const curChar = before.charAt(i);
//             const newChar = after.charAt(i);
//             if (curChar !== newChar) {
//                 return [after.substring(i, i + (after.length - before.length)), i, curLineIdx];
//             }
//             if (curChar === '\n') {
//                 curLineIdx++;
//             }
//         }
//         return [after.substring(before.length), before.length, curLineIdx];
//     }
// }

export const getDiffAndIdx = (before: string, after: string, endChangeIdx: number): [string, number, number] => {
    if (before.length === 0) {
        return [after, 0, 0];
    } else if (before.length >= after.length) {
        return ['', -1, -1];
    } else {
        const startChangeIdx = endChangeIdx - (after.length - before.length);
        const lineChangedIdx = after.split('').reduce((prev, cur, idx) => idx >= startChangeIdx ? prev : cur === '\n' ? prev + 1: prev, 0);
        return [after.substring(startChangeIdx, endChangeIdx), startChangeIdx, lineChangedIdx];
    }
}

export const getMatchStart = (line: string): {matches: boolean, dotIdx: number | null, nr: number | null, length: number | null} => {
    const matchNr = line.match(/^\d*\.[ ]/);
    if (matchNr && matchNr.length > 0) {
        const dotIdx = line.indexOf('.');
        const nr = parseInt(line.substring(0, dotIdx));
        const length = matchNr[0].length;
        return {matches: true, dotIdx, nr, length};
    } else {
        return {matches: false, dotIdx: null, nr: null, length: null};
    }
}

export const updateNumberLists = (input: string, caretPriorIdx: number): [string, number] => {
    const lines = getLines(input, false);
    // let newCaretIdx = caretPriorIdx;
    for (let i = 0; i < lines.length; i++) {
        // const startLineIdx = lines.filter((_, idx) => idx < i).reduce((prev, cur) => prev + cur.length, 0);
        const updatedMatch = getMatchStart(lines[i]);
        if (updatedMatch.matches && updatedMatch.length) {
            let prevMatch;
            if (i > 0) {
                prevMatch = getMatchStart(lines[i - 1]);
            }
            if (prevMatch?.matches && prevMatch?.nr) {
                if (updatedMatch.nr !== prevMatch.nr + 1) {
                    lines[i] = `${prevMatch.nr + 1}. ` + lines[i].substring(updatedMatch.length)
                }
            } else {
                lines[i] = `1. ` + lines[i].substring(updatedMatch.length);
            }
        }
    }
    return [lines.join('\n'), caretPriorIdx]; // implementation todo: update caret index
}

export const updateMdOnEnter = (prev: string | null | undefined, newText: string, afterDiffIdx: number): [string, number | null] => { // return updated string and updated cursor position
    if (!prev || newText.length <= prev.length) {
        return updateNumberLists(newText, afterDiffIdx);
    }
    const [diff, diffStartIdx, lastLineIdx] = getDiffAndIdx(prev, newText, afterDiffIdx);

    if (diff.endsWith('\n')) {
        // debugger;
        const lines = getLines(newText, false);
        const lastLine = lines[lastLineIdx];
        console.log({lastLine})
        if (lastLine.length === 2 && lastLine.endsWith('- ')) {
            return [newText.substring(0, afterDiffIdx - 3) + newText.substring(afterDiffIdx), afterDiffIdx - 3];
        } else if (lastLine.length === 6 && (lastLine.endsWith('- [ ] ') || lastLine.endsWith('- [x] '))) {
            return [newText.substring(0, afterDiffIdx - 7) + newText.substring(afterDiffIdx), afterDiffIdx - 7];
        } else {
            const matchEndNr = lastLine.match(/^\d*\.[ ]$/);
            if (matchEndNr && matchEndNr.length > 0) {
                return updateNumberLists(newText.substring(0, afterDiffIdx - matchEndNr[0].length - 1) + newText.substring(afterDiffIdx), afterDiffIdx - matchEndNr[0].length - 1);
            } else if (lastLine.startsWith('- [ ] ')) {
                return [newText.substring(0, afterDiffIdx) + '- [ ] ' + newText.substring(afterDiffIdx), afterDiffIdx + 6];
            } else if (lastLine.startsWith('- [x] ')) {
                return [newText.substring(0, afterDiffIdx) + '- [x] ' + newText.substring(afterDiffIdx), afterDiffIdx + 6];
            } else if (lastLine.startsWith('- ')) {
                return [newText.substring(0, afterDiffIdx) + '- ' + newText.substring(afterDiffIdx), afterDiffIdx + 2];
            } else {
                const {matches, dotIdx, nr} = getMatchStart(lastLine);
                if (matches && dotIdx && nr) {
                    const updated = newText.substring(0, afterDiffIdx) + `${nr + 1}. ` + newText.substring(afterDiffIdx);
                    return updateNumberLists(updated, afterDiffIdx + `${nr + 1}. `.length);
                }
                return [newText, afterDiffIdx];
            }
        }
    } else {
        return updateNumberLists(newText, afterDiffIdx);
    }
};