import type Satchel from './Satchel';
import type SatchelInternalFunctions from './SatchelInternalFunctions';
import type SatchelState from './SatchelState';

type SatchelInternal = Satchel & SatchelInternalFunctions & SatchelState;
export default SatchelInternal;
