import {rootStore, initializeState, action} from 'satcheljs';
import serialize from './serialize';

export default function exportSnapshot(): any {
    return serialize(rootStore, true);
}
