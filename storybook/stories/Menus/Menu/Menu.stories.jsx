// eslint-disable-next-line import/no-unresolved
import '@jezvejs/react/style';
import { Menu } from '@jezvejs/react';

// Local components
import { CheckboxGroupsMenu } from './components/CheckboxGroups/CheckboxGroupsMenu.jsx';
import { CollapsibleGroupsMenu } from './components/CollapsibleGroups/CollapsibleGroupsMenu.jsx';
import { CustomMenuHeader } from './components/CustomHeader/CustomMenuHeader.jsx';
import { CustomMenuFooter } from './components/CustomFooter/CustomMenuFooter.jsx';
import { LoadingPlaceholder } from './components/LoadingPlaceholder/LoadingPlaceholder.jsx';

import {
    getDefaultItems,
    getHorizontalItems,
    groupItems,
    checkboxGroupItems,
    initItems,
} from './data.js';
import './Menu.stories.scss';

export default {
    title: 'Menu/Menu',
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
