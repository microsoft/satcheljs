import 'jasmine';
import { isObservableMap } from 'mobx';
import getRootStore from '../../src/getRootStore';

describe('getRootStore', () => {
    it('returns an ObservableMap', () => {
        expect(isObservableMap(getRootStore())).toBeTruthy();
    });
});
