// eslint-disable-next-line import/no-unresolved
import '@jezvejs/react/style';
import { Menu } from '@jezvejs/react';

import SelectIcon from '../../assets/icons/select.svg';
import SearchIcon from '../../assets/icons/search.svg';

import { CheckboxGroupsMenu } from './components/CheckboxGroups/CheckboxGroupsMenu.jsx';
import { CollapsibleGroupsMenu } from './components/CollapsibleGroups/CollapsibleGroupsMenu.jsx';
import { CustomMenuHeader } from './components/CustomHeader/CustomMenuHeader.jsx';
import { CustomMenuFooter } from './components/CustomFooter/CustomMenuFooter.jsx';
import { LoadingPlaceholder } from './components/LoadingPlaceholder/LoadingPlaceholder.jsx';

import './Menu.stories.scss';

const getDefaultItems = () => ([{
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

const getHorizontalItems = () => ([{
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

const groupItems = [{
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

const checkboxGroupItems = [{
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

const initItems = (title, count, startFrom = 1) => {
    const res = [];

    for (let ind = startFrom; ind < startFrom + count; ind += 1) {
        res.push({ id: ind.toString(), title: `${title} ${ind}` });
    }

    return res;
};

export default {
    title: 'Components/Menu',
    component: Menu,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export const Default = {
    args: {
        items: getDefaultItems(),
        preventNavigation: true,
    },
};

export const IconAlignment = {
    args: {
        items: getDefaultItems(),
        iconAlign: 'right',
        preventNavigation: true,
    },
};

export const CheckboxSide = {
    args: {
        items: [
            ...getDefaultItems(),
            {
                id: 'leftSideCheckboxItem',
                type: 'checkbox',
                title: 'Checkbox item',
                selected: true,
                checkboxSide: 'left',
            },
        ],
        checkboxSide: 'right',
        preventNavigation: true,
    },
};

export const Horizontal = {
    args: {
        items: getHorizontalItems(),
        className: 'horizontal-menu',
        preventNavigation: true,
    },
};

export const HeaderFooter = {
    args: {
        id: 'headerFooterMenu',
        className: 'scroll-menu',
        items: initItems('Menu item', 5),
        preventNavigation: true,
        header: {
            title: 'Custom header',
        },
        footer: {
            title: 'Custom footer',
        },
        components: {
            Header: CustomMenuHeader,
            Footer: CustomMenuFooter,
        },
    },
};

export const Placeholder = {
    args: {
        items: [],
        components: {
            ListPlaceholder: LoadingPlaceholder,
        },
    },
};

/**
 * With disabled 'tabThrough' option
 */
export const Scroll = {
    args: {
        items: initItems('Menu item', 30),
        className: 'scroll-menu',
        tabThrough: false,
    },
};

export const Groups = {
    args: {
        items: groupItems,
    },
};

export const CheckboxGroups = {
    args: {
        items: checkboxGroupItems,
        allowActiveGroupHeader: true,
    },
    render: function Render(args) {
        return (
            <CheckboxGroupsMenu {...args} />
        );
    },
};

export const CollapsibleGroups = {
    args: {
        items: groupItems,
        allowActiveGroupHeader: true,
    },
    render: function Render(args) {
        return (
            <CollapsibleGroupsMenu {...args} />
        );
    },
};
