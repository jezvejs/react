import type { Meta, StoryObj } from '@storybook/react';

import '@jezvejs/react/style.scss';
import { ReactNode, useState } from 'react';
import { Button, ButtonProps, Collapsible } from '@jezvejs/react';

import EditIcon from 'common/assets/icons/edit.svg';
import DeleteIcon from 'common/assets/icons/del.svg';
import ToggleIcon from 'common/assets/icons/toggle.svg';

import './Collapsible.stories.scss';

type Story = StoryObj<typeof Collapsible>;

const meta: Meta<typeof Collapsible> = {
    title: 'Components/Collapsible',
    component: Collapsible,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};
export default meta;

const createContent = (content: ReactNode) => (
    <div
        className='collapsible-content-container'
    >
        {content ?? ''}
    </div>
);

const createListContent = ({ itemsCount = 5, prefix = '', ...props } = {}) => (
    <ul {...props}>
        {Array(itemsCount).fill(0).map((_, index) => (
            <li key={`${prefix}${index}`}>Item {index}</li>
        ))}
    </ul>
);

export const Default: Story = {
    args: {
        className: 'simple',
        header: 'Show',
        children: (
            <>
                Content
            </>
        ),
    },
};

export const Styled: Story = {
    args: {
        className: 'styled',
        header: 'Show',
        children: createContent(createListContent({ prefix: 'styled' })),
    },
};

export const Animated: Story = {
    args: {
        className: 'styled',
        header: 'Show',
        animated: true,
        children: createContent(createListContent({ prefix: 'animated' })),
    },
};

const EditIconCustom = (props: React.SVGProps<SVGElement>) => (
    <EditIcon {...props} className='custom-header-icon' />
);

const DeleteIconCustom = (props: React.SVGProps<SVGElement>) => (
    <DeleteIcon {...props} className='custom-header-icon' />
);

const CustomHeaderButton = (props: ButtonProps) => (
    <Button
        className='custom-header-btn'
        onClick={(e) => e.stopPropagation()}
        {...props}
    />
);

export const CustomHeader: Story = {
    args: {
        className: 'custom',
        header: <>
            <div className='custom-title'>Hover/focus to see controls</div>
            <CustomHeaderButton icon={EditIconCustom} />
            <CustomHeaderButton icon={DeleteIconCustom} />
        </>,
        animated: true,
        children: createContent(createListContent({ prefix: 'custom' })),
    },
};

export const ToggleOnClick: Story = {
    args: {
        className: 'disabled-toggle',
        animated: true,
        expanded: true,
        toggleOnClick: false,
        children: createContent(createListContent({ prefix: 'toggle' })),
    },
    render: function Render(args) {
        const [state, setState] = useState({
            ...args,
        });

        function onToggle() {
            setState((prev) => ({ ...prev, expanded: !prev.expanded }));
        }

        return (
            <Collapsible
                {...state}
                header={
                    <>
                        <div className='custom-title'>Toggle only by click button</div>
                        <CustomHeaderButton icon={ToggleIcon} onClick={onToggle} />
                    </>
                }
            />
        );
    },
};
