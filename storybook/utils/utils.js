/** Returns array of items */
export const initItems = (options = {}) => {
    const {
        title = 'Item',
        idPrefix = '',
        startFrom = 1,
        count = 10,
        ...props
    } = options;

    const res = [];

    for (let ind = startFrom; ind < startFrom + count; ind += 1) {
        res.push({
            id: `${idPrefix}${ind}`,
            title: `${title} ${ind}`,
            ...props,
        });
    }

    return res;
};
