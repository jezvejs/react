/**
 * Returns new identifier for slider
 *
 * @param {string} prefix optional string to prepend id with
 */
export const generateId = (prefix: string = ''): string => {
    const id = Date.now() * Math.random() * 10000;
    return `${prefix}${id.toString(36)}`;
};
