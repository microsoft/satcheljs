import {
    createSatchel,
    SatchelInstance,
    SatchelOptions,
    PrivateSatchelFunctions,
} from '../../src/createSatchel';

type TestSatchelFunction = (options?: SatchelOptions) => SatchelInstance & PrivateSatchelFunctions;

export const createTestSatchel = createSatchel as TestSatchelFunction;
