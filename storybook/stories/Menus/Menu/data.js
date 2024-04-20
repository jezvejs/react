import SelectIcon from '../../../assets/icons/select.svg';
import SearchIcon from '../../../assets/icons/search.svg';

export const getDefaultItems = () => ([{
    id: 'selectBtnItem',
    icon: SelectIcon,
    title: 'Button item',
}, {
    id: 'separator1',
    type: 'separator',
}, {
    id: 'linkItem',
    type: 'link',
    title: 'Link item',
    icon: SearchIcon,
    url: '#123',
}, {
    id: 'noIconItem',
    title: 'No icon item',
}, {
    id: 'checkboxItem',
    type: 'checkbox',
    title: 'Checkbox item',
    selected: true,
}]);

export const getHorizontalItems = () => ([{
    id: 'selectBtnItem',
    title: 'Button item',
}, {
    id: 'separator1',
    type: 'separator',
}, {
    id: 'linkItem',
    type: 'link',
    title: 'Link item',
    url: '#123',
}, {
    id: 'noIconItem',
    title: 'Item 3',
}]);

export const groupItems = [{
    id: 'noGroupItem1',
    title: 'No group item 1',
}, {
    id: 'group1',
    type: 'group',
    title: 'Group 1',
    items: [{
        id: 'groupItem11',
        title: 'Group 1 item 1',
        group: 'group1',
    }, {
        id: 'groupItem12',
        title: 'Group 1 item 2',
        group: 'group1',
    }, {
        id: 'groupItem13',
        title: 'Group 1 item 3',
        group: 'group1',
    }],
}, {
    id: 'noGroupItem2',
    title: 'No group item 2',
}, {
    id: 'group2',
    type: 'group',
    title: 'Group 2',
    items: [{
        id: 'groupItem21',
        title: 'Group 2 item 1',
        group: 'group2',
    }],
}, {
    id: 'noGroupItem3',
    title: 'No group item 3',
}];

export const checkboxGroupItems = [{
    id: 'noGroupItem1',
    title: 'No group item 1',
    type: 'checkbox',
}, {
    id: 'group1',
    type: 'group',
    title: 'Group 1',
    items: [{
        id: 'groupItem11',
        title: 'Group 1 item 1',
        type: 'checkbox',
    }, {
        id: 'groupItem12',
        title: 'Group 1 item 2',
        type: 'checkbox',
        disabled: true,
    }, {
        id: 'groupItem13',
        title: 'Group 1 item 3',
        type: 'checkbox',
    }],
}, {
    id: 'noGroupItem2',
    title: 'No group item 2',
    type: 'checkbox',
}, {
    id: 'group2',
    type: 'group',
    title: 'Group 2',
    disabled: true,
    items: [{
        id: 'groupItem21',
        title: 'Group 2 item 1',
        type: 'checkbox',
    }],
}, {
    id: 'noGroupItem3',
    title: 'No group item 3',
    type: 'checkbox',
}];

export const initItems = (title, count, startFrom = 1) => {
    const res = [];

    for (let ind = startFrom; ind < startFrom + count; ind += 1) {
        res.push({ id: ind.toString(), title: `${title} ${ind}` });
    }

    return res;
};
