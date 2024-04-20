export const initItems = (title = 'Item', count = 10, startFrom = 1) => {
    const res = [];

    for (let ind = startFrom; ind < startFrom + count; ind += 1) {
        res.push({ id: ind.toString(), title: `${title} ${ind}` });
    }

    return res;
};

export const groupsItems = () => ([{
    id: 'grVisible',
    title: 'Visible',
    type: 'group',
    items: [
        { id: 'groupItem11', title: 'Item 1', group: 'grVisible' },
        { id: 'groupItem12', title: 'Item 2', group: 'grVisible' },
        {
            id: 'groupItem13',
            title: 'Item 3',
            group: 'grVisible',
            selected: true,
        },
    ],
}, {
    id: 'grHidden',
    title: 'Hidden',
    type: 'group',
    items: [
        { id: 'groupItem24', title: 'Item 4', group: 'grHidden' },
        { id: 'groupItem25', title: 'Item 5', group: 'grHidden' },
        { id: 'groupItem26', title: 'Item 6', group: 'grHidden' },
    ],
}]);

export const initGroupItems = () => ([
    {
        id: 'group10',
        type: 'group',
        title: '1 - 9',
        items: [
            { id: '1', title: 'Item 1', group: 'group10' },
            { id: '2', title: 'Item 2', group: 'group10' },
            { id: '3', title: 'Item 3', group: 'group10' },
            { id: '4', title: 'Item 4', group: 'group10' },
            { id: '5', title: 'Item 5', group: 'group10' },
            { id: '6', title: 'Item 6', group: 'group10' },
            { id: '7', title: 'Item 7', group: 'group10' },
            { id: '8', title: 'Item 8', group: 'group10' },
            { id: '9', title: 'Item 9', group: 'group10' },
        ],
    },
    {
        id: 'group20',
        type: 'group',
        title: '10 - 19',
        items: [
            { id: '10', title: 'Item 10', group: 'group20' },
            { id: '11', title: 'Item 11', group: 'group20' },
            { id: '12', title: 'Item 12', group: 'group20' },
            { id: '13', title: 'Item 13', group: 'group20' },
            { id: '14', title: 'Item 14', group: 'group20' },
            { id: '15', title: 'Item 15', group: 'group20' },
            { id: '16', title: 'Item 16', group: 'group20' },
            { id: '17', title: 'Item 17', group: 'group20' },
            { id: '18', title: 'Item 18', group: 'group20' },
            { id: '19', title: 'Item 19', group: 'group20' },
        ],
    },
    {
        id: 'group30',
        type: 'group',
        title: '20 - 29',
        items: [
            { id: '20', title: 'Item 20', group: 'group30' },
            { id: '21', title: 'Item 21', group: 'group30' },
            { id: '22', title: 'Item 22', group: 'group30' },
            { id: '23', title: 'Item 23', group: 'group30' },
            { id: '24', title: 'Item 24', group: 'group30' },
            { id: '25', title: 'Item 25', group: 'group30' },
            { id: '26', title: 'Item 26', group: 'group30' },
            { id: '27', title: 'Item 27', group: 'group30' },
            { id: '28', title: 'Item 28', group: 'group30' },
            { id: '29', title: 'Item 29', group: 'group30' },
        ],
    },
]);
