import GlyphIcon from '../../../common/assets/icons/glyph.svg';
import SelectIcon from '../../../common/assets/icons/select.svg';
import SearchIcon from '../../../common/assets/icons/search.svg';

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

export const nestedItems2 = (prefix = '') => ([{
    id: `${prefix}item1`,
    icon: SelectIcon,
    title: 'Child item 1',
}, {
    id: `${prefix}item2`,
    icon: SearchIcon,
    title: 'Child item 2',
}, {
    id: `${prefix}item3`,
    title: 'Child item 3',
}, {
    id: `${prefix}separator1`,
    type: 'separator',
}, {
    id: `${prefix}item4`,
    title: 'Child item 4',
    ...(
        (prefix === 'item4_')
            ? {
                icon: GlyphIcon,
                iconAlign: 'right',
                type: 'parent',
                items: nestedItems2('item4_4_'),
            }
            : {}
    ),
}]);

export const nestedItems1 = () => ([{
    id: 'item1',
    icon: SelectIcon,
    title: 'Child item 1',
}, {
    id: 'item2',
    icon: SearchIcon,
    title: 'Child item 2',
}, {
    id: 'item3',
    title: 'Child item 3',
}, {
    id: 'separator1',
    type: 'separator',
}, {
    id: 'item4',
    title: 'Child item 4',
    icon: GlyphIcon,
    iconAlign: 'right',
    type: 'parent',
    items: nestedItems2('item4_'),
}]);

export const getNestedMenuItems = () => ([
    ...getDefaultItems(),
    {
        id: 'nestedParentItem1',
        title: 'Nested menu 1',
        icon: GlyphIcon,
        iconAlign: 'right',
        type: 'parent',
        items: nestedItems1(),
    }, {
        id: 'nestedParentItem2',
        title: 'Nested menu 2',
        icon: GlyphIcon,
        iconAlign: 'right',
        type: 'parent',
        items: nestedItems2('nested2_'),
    },
]);
