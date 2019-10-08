import {Dictionaries} from 'polar-shared/src/util/Dictionaries';

export function canonicalize<T>(obj: T) {
    delete (<any> obj).uuid;
    const result = Dictionaries.sorted(obj);
    return result;
}
