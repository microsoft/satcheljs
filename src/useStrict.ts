import { configure } from 'mobx';

export default function useStrict(strictMode: boolean) {
    configure({ enforceActions: strictMode ? 'observed' : 'never' });
}
