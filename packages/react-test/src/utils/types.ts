/** waitFor() condition callback result object */
export interface WaitForConditionResultObject {
    value: boolean;
}

export type WaitForConditionFuncResultType = false | WaitForConditionResultObject;

/** waitFor() condition callback result object */
export type WaitForConditionFuncResult =
    | WaitForConditionFuncResultType
    | Promise<WaitForConditionFuncResultType>;

/** waitFor() condition callback */
export type WaitForConditionFunc = () => WaitForConditionFuncResult;

/** waitFor() options object */
export interface WaitForOptions {
    timeout?: number;
    polling?: number;
}

/** waitForFunction() condition callback */
export type WaitForFunctionConditionFunc = () => boolean | Promise<boolean>;
