import type { Meta, StoryObj } from '@storybook/react';

import {
    InputGroup,
    InputGroupButton,
    InputGroupInnerButton,
    InputGroupInput,
    InputGroupInputProps,
    InputGroupOuterContainer,
    InputGroupText,
} from '@jezvejs/react';
import '@jezvejs/react/style.scss';

// Icons
import SmallCloseIcon from 'common/assets/icons/close-sm.svg';
import SearchIcon from 'common/assets/icons/search.svg';

// Hooks
import { useInputState } from 'common/hooks/useInputState.ts';
import { withInputState } from 'common/utils/withInputState.tsx';

// Common components
import { ActionButton } from 'common/Components/ActionButton/ActionButton.tsx';
import { SectionControls } from 'common/Components/SectionControls/SectionControls.tsx';

import './InputGroup.stories.scss';

type Story = StoryObj<typeof InputGroup>;

const meta: Meta<typeof InputGroup> = {
    title: 'Input/InputGroup',
    component: InputGroup,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};
export default meta;

const InputWithState = withInputState<InputGroupInputProps>(InputGroupInput);

export const TextAfterInput: Story = {
    args: {
        children: (
            <>
                <InputWithState
                    className="stretch-input amount-input"
                    placeholder="Input value"
                />
                <InputGroupText title=".00" />
            </>
        ),
    },
};

export const TextBeforeInput: Story = {
    args: {
        children: (
            <>
                <InputGroupText title="$" />
                <InputWithState
                    className="stretch-input amount-input"
                    placeholder="Input value"
                    value="1000"
                />
            </>
        ),
    },
};

export const TextBothBeforeAndAfterInput: Story = {
    args: {
        children: (
            <>
                <InputGroupText title="$" />
                <InputWithState
                    className="stretch-input amount-input"
                    placeholder="Input value"
                    value="1000"
                />
                <InputGroupText title=".00" />
            </>
        ),
    },
};

export const MoreText: Story = {
    args: {
        children: (
            <>
                <InputGroupText title="€" />
                <InputGroupText title="$" />
                <InputWithState
                    className="stretch-input amount-input"
                    placeholder="Input value"
                    value="1000"
                />
                <InputGroupText title=".00" />
                <InputGroupText title=".12" />
            </>
        ),
    },
};

export const Buttons: Story = {
    args: {
        children: (
            <>
                <InputGroupButton title="€" />
                <InputGroupButton title="$" />
                <InputWithState
                    className="stretch-input amount-input"
                    placeholder="Input value"
                    value="1000"
                />
                <InputGroupButton title=".00" />
                <InputGroupButton title=".12" />
            </>
        ),
    },
};

export const InnerButtons: Story = {
    args: {
        children: (
            <>
                <InputWithState
                    className="stretch-input"
                    placeholder="Start"
                />
                <InputGroupInnerButton icon={SmallCloseIcon} />
                <InputGroupButton title=".00" />
            </>
        ),
    },
};

/**
 * Use 'input-group__input-outer' CSS class to choose element to highlight
 * on focus within
 */
export const OuterContainer: Story = {
    args: {
        className: 'input-group__input-outer',
        children: (
            <>
                <InputWithState
                    className="stretch-input"
                    placeholder="Start"
                />
                <InputGroupInnerButton icon={SmallCloseIcon} />
                <InputGroupButton title=".00" />
            </>
        ),
    },
};

/**
 * Use InputGroupOuterContainer component
 */
export const OuterContainerComponent: Story = {
    args: {
        children: (
            <>
                <InputGroupOuterContainer>
                    <InputWithState
                        className="stretch-input"
                        placeholder="Start"
                    />
                    <InputGroupInnerButton icon={SmallCloseIcon} />
                </InputGroupOuterContainer>
                <InputGroupButton title=".00" />
            </>
        ),
    },
};

export const Disabled: Story = {
    render: function Render() {
        const { inputProps, state, setState } = useInputState<InputGroupInputProps>({
            disabled: true,
        });

        function onToggle() {
            setState((prev) => ({ ...prev, disabled: !prev.disabled }));
        }

        return (
            <>
                <InputGroup>
                    <InputGroupOuterContainer>
                        <InputGroupInnerButton
                            className="search-btn"
                            icon={SearchIcon}
                            disabled={state.disabled}
                        />
                        <InputGroupInput className="stretch-input" {...inputProps} />
                        <InputGroupInnerButton icon={SmallCloseIcon} disabled={state.disabled} />
                    </InputGroupOuterContainer>
                </InputGroup>

                <SectionControls>
                    <ActionButton
                        title={(state.disabled ? 'Enable' : 'Disable')}
                        onClick={onToggle}
                    />
                </SectionControls>
            </>
        );
    },
};
