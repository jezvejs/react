import type { Meta, StoryObj } from '@storybook/react';

import '@jezvejs/react/style.scss';
import { TabList } from '@jezvejs/react';
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

export type TabContentProps = {
    value?: number | string;
};

const TabContent = ({ value }: TabContentProps) => (
    <div className='tab-list__content-item'>
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
        Impedit aliquam aperiam sapiente libero rerum reiciendis quas est? {value}
    </div>
);

const ArrayContent = () => (
    <div className='tab-list__content-item'>
        <div>1</div>
        <div>2</div>
        <div>3</div>
        <div>4</div>
    </div>
);

const getItems = (disableLast = false) => ([{
    id: '1',
    title: 'First',
    value: 1,
    content: <TabContent value={1} />,
}, {
    id: '2',
    title: 'Second',
    value: 2,
    content: <TabContent value={2} />,
}, {
    id: 'str',
    title: 'Array content',
    value: 'str',
    content: <ArrayContent />,
    disabled: disableLast,
}]);

export const Default: Story = {
    args: {
        items: getItems(),
    },
};

export const Styled: Story = {
    args: {
        className: 'styled bold',
        items: getItems(),
    },
};

export const DisabledItem: Story = {
    args: {
        className: 'styled',
        items: getItems(true),
    },
};
