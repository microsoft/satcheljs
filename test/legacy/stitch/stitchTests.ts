import 'jasmine';
import { LegacyDispatchFunction, ActionContext } from '../../../src/legacy';
import { stitch, subscribe } from '../../../src/legacy/stitch';

let sequenceOfEvents: any[];

describe('stitch', () => {
    beforeAll(() => {
        subscribe('testAction1', args => {
            sequenceOfEvents.push('callback');
            sequenceOfEvents.push(args);
        });
    });

    beforeEach(() => {
        sequenceOfEvents = [];
    });

    it('calls next with the given arguments', () => {
        let actionType = 'testAction1';
        let args = <IArguments>{};
        let actionContext: ActionContext = {};
        stitch(getNext(), () => {}, actionType, args, actionContext);
        expect(sequenceOfEvents[0]).toEqual({
            actionType,
            args,
        });
    });

    it('returns the return value from next', () => {
        let originalReturnValue = Promise.resolve({});
        let returnValue = stitch(getNext(originalReturnValue), null, null, null, null);
        expect(returnValue).toBe(originalReturnValue);
    });

    it('calls callback for subscribed actions', () => {
        stitch(getNext(), () => {}, 'testAction1', null, null);
        expect(sequenceOfEvents).toContain('callback');
    });

    it("passes the action's arguments to the callback", () => {
        let arg0 = {};
        let args = getArguments(arg0);
        stitch(getNext(), () => {}, 'testAction1', args, null);
        expect(sequenceOfEvents).toContain('callback');
        expect(sequenceOfEvents).toContain(arg0);
    });

    it("doesn't call callback for non-subscribed actions", () => {
        stitch(getNext(), () => {}, 'testAction2', null, null);
        expect(sequenceOfEvents).not.toContain('callback');
    });

    it('does nothing if actionType is null', () => {
        stitch(getNext(), () => {}, null, null, null);
        expect(sequenceOfEvents).not.toContain('callback');
    });

    it('calls callbacks AFTER dispatching action', () => {
        let actionType = 'testAction1';
        let args = getArguments({});
        stitch(getNext(), () => {}, actionType, args, null);
        expect(sequenceOfEvents).toEqual([
            {
                actionType,
                args,
            },
            'callback',
            args[0],
        ]);
    });
});

function getNext(returnValue?: Promise<any>): LegacyDispatchFunction {
    return (action, actionType, args) => {
        sequenceOfEvents.push({
            actionType,
            args,
        });

        return returnValue;
    };
}

function getArguments(arg0: any) {
    return arguments;
}
