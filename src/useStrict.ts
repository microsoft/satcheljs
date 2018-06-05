import { configure } from 'mobx';

export default function useStrict(enforceActions: boolean) {
    configure({ enforceActions });
}
