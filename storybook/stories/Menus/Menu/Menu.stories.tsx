import type { Meta, StoryObj } from '@storybook/react';

import '@jezvejs/react/style.scss';
import { Menu } from '@jezvejs/react';
import { useState } from 'react';

import { initItems } from '../../../common/utils/utils.ts';

// Local components
import { CheckboxGroupsMenu } from './components/CheckboxGroups/CheckboxGroupsMenu.tsx';
import { CollapsibleGroupsMenu, CollapsibleGroupsMenuProps } from './components/CollapsibleGroups/CollapsibleGroupsMenu.tsx';
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
        id: 'defaultMenu',
        items: getDefaultItems(),
        preventNavigation: true,
        multiple: true,
    },
};

export const IconAlignment: Story = {
    args: {
        id: 'iconAlignmentMenu',
        items: getDefaultItems(),
        iconAlign: 'right',
        preventNavigation: true,
        multiple: true,
    },
};

export const CheckboxSide: Story = {
    args: {
        id: 'checkboxSideMenu',
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
        id: 'horizontalMenu',
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
        id: 'groupsMenu',
        items: groupItems,
    },
};

export const CheckboxGroups: Story = {
    args: {
        id: 'checkboxGroupMenu',
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

type CollapsibleGroupsState = {
    message: string;
};

export const CollapsibleGroups: Story = {
    args: {
        id: 'collapsibleGroupMenu',
        items: collapsibleGroupItems,
        allowActiveGroupHeader: true,
    },
    parameters: {
        layout: 'fullscreen',
    },
    render: function Render(args) {
        const [state, setState] = useState<CollapsibleGroupsState>({
            message: '',
        });

        const props: CollapsibleGroupsMenuProps = {
            ...args,
            onItemClick: (item) => {
                if (!item) {
                    return;
                }

                setState((prev) => ({ ...prev, message: `Clicked by '${item.id}' menu item` }));
            },
        };

        return (
            <div className="collapsible-groups-menu">
                <CollapsibleGroupsMenu {...props} />
                <div className="collapsible-groups-menu__state">{state.message}</div>
            </div>
        );
    },
};
