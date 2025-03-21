import type { Meta, StoryObj } from '@storybook/react';

import '@jezvejs/react/style.scss';
import { TabList } from '@jezvejs/react';

import { getTabListItems } from '../../common/utils/getTabListItems.tsx';
import { TabListStyled } from '../../common/Components/TabListStyled/TabListStyled.tsx';

import './TabList.stories.scss';

export type Story = StoryObj<typeof TabList>;

const meta: Meta<typeof TabList> = {
    title: 'Components/TabList',
    component: TabList,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};
export default meta;

export const Default: Story = {
    args: {
        items: getTabListItems(),
    },
};

export const Styled: Story = {
    args: {
        className: 'bold',
        items: getTabListItems(),
    },
    render: TabListStyled,
};

export const DisabledItem: Story = {
    args: {
        className: 'styled',
        items: getTabListItems(true),
    },
    render: TabListStyled,
};
