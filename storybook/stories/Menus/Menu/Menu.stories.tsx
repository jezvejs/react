import type { Meta, StoryObj } from '@storybook/react';

import '@jezvejs/react/style.scss';
import { Menu } from '@jezvejs/react';

import { initItems } from '../../../common/utils/utils.ts';

// Local components
import { CheckboxGroupsMenu } from './components/CheckboxGroups/CheckboxGroupsMenu.tsx';
import { CollapsibleGroupsMenu } from './components/CollapsibleGroups/CollapsibleGroupsMenu.tsx';
import { CustomMenuHeader } from './components/CustomHeader/CustomMenuHeader.tsx';
import { CustomMenuFooter } from './components/CustomFooter/CustomMenuFooter.tsx';
import { LoadingPlaceholder } from './components/LoadingPlaceholder/LoadingPlaceholder.tsx';

import {
    getDefaultItems,
    getHorizontalItems,
    groupItems,
    checkboxGroupItems,
    collapsibleGroupItems,
} from '../../../common/assets/data/menuData.ts';
import './Menu.stories.scss';

export type Story = StoryObj<typeof Menu>;

const meta: Meta<typeof Menu> = {
    title: 'Menu/Menu',
    component: Menu,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};
export default meta;

export const Default: Story = {
    args: {
        items: getDefaultItems(),
        preventNavigation: true,
        multiple: true,
    },
};

export const IconAlignment: Story = {
    args: {
        items: getDefaultItems(),
        iconAlign: 'right',
        preventNavigation: true,
        multiple: true,
    },
};

export const CheckboxSide: Story = {
    args: {
        items: [
            ...getDefaultItems(),
            {
                id: 'leftSideCheckboxItem',
                type: 'checkbox',
                title: 'Checkbox item',
                selected: true,
                selectable: true,
                checkboxSide: 'left',
            },
        ],
        checkboxSide: 'right',
        preventNavigation: true,
        multiple: true,
    },
};

export const Horizontal: Story = {
    args: {
        items: getHorizontalItems(),
        className: 'horizontal-menu',
        preventNavigation: true,
        horizontal: true,
    },
};

export const HeaderFooter: Story = {
    args: {
        id: 'headerFooterMenu',
        className: 'scroll-menu',
        items: initItems({ title: 'Menu item', count: 5 }),
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

export const Placeholder: Story = {
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
export const Scroll: Story = {
    args: {
        items: initItems({ title: 'Menu item', count: 30 }),
        className: 'scroll-menu',
        tabThrough: false,
    },
};

/**
 * Disabled \'focusItemOnHover\' option. Default is enabled.
 */
export const FocusItemOnHover: Story = {
    name: '\'focusItemOnHover\' option',
    args: {
        id: 'focusOnHoverMenu',
        focusItemOnHover: false,
        className: 'horizontal-menu',
        horizontal: true,
        items: initItems({ title: 'Menu item', count: 4 }),
    },
};

export const Groups: Story = {
    args: {
        items: groupItems,
    },
};

export const CheckboxGroups: Story = {
    args: {
        items: checkboxGroupItems,
        allowActiveGroupHeader: true,
        multiple: true,
    },
    render: function Render(args) {
        return (
            <CheckboxGroupsMenu {...args} />
        );
    },
};

export const CollapsibleGroups: Story = {
    args: {
        items: collapsibleGroupItems,
        allowActiveGroupHeader: true,
    },
    render: function Render(args) {
        return (
            <CollapsibleGroupsMenu {...args} />
        );
    },
};
