// eslint-disable-next-line import/no-unresolved
import '@jezvejs/react/style';
import {
    InputGroup,
    InputGroupInput,
    InputGroupText,
    InputGroupButton,
    InputGroupInnerButton,
    InputGroupOuterContainer,
} from '@jezvejs/react';
import { useState } from 'react';

import SmallCloseIcon from '../../../assets/icons/close-sm.svg';
import SearchIcon from '../../../assets/icons/search.svg';

import { ActionButton } from '../../../Components/ActionButton/ActionButton.jsx';

import './InputGroup.stories.scss';

export default {
    title: 'Input/InputGroup',
    component: InputGroup,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export const TextAfterInput = {
    args: {
        children: (
            <>
                <InputGroupInput
                    className="stretch-input amount-input"
                    placeholder="Input value"
                />
                <InputGroupText title=".00" />
            </>
        ),
    },
};

export const TextBeforeInput = {
    args: {
        children: (
            <>
                <InputGroupText title="$" />
                <InputGroupInput
                    className="stretch-input amount-input"
                    placeholder="Input value"
                    value="1000"
                />
            </>
        ),
    },
};

export const TextBothBeforeAndAfterInput = {
    args: {
        children: (
            <>
                <InputGroupText title="$" />
                <InputGroupInput
                    className="stretch-input amount-input"
                    placeholder="Input value"
                    value="1000"
                />
                <InputGroupText title=".00" />
            </>
        ),
    },
};

export const MoreText = {
    args: {
        children: (
            <>
                <InputGroupText title="€" />
                <InputGroupText title="$" />
                <InputGroupInput
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

export const Buttons = {
    args: {
        children: (
            <>
                <InputGroupButton title="€" />
                <InputGroupButton title="$" />
                <InputGroupInput
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

export const InnerButtons = {
    args: {
        children: (
            <>
                <InputGroupInput
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
export const OuterContainer = {
    args: {
        className: 'input-group__input-outer',
        children: (
            <>
                <InputGroupInput
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
export const OuterContainerComponent = {
    args: {
        children: (
            <>
                <InputGroupOuterContainer>
                    <InputGroupInput
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

export const Disabled = {
    render: function Render() {
        const [state, setState] = useState({
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
                        <InputGroupInput className="stretch-input" disabled={state.disabled} />
                        <InputGroupInnerButton icon={SmallCloseIcon} disabled={state.disabled} />
                    </InputGroupOuterContainer>
                </InputGroup>

                <div className="section-controls">
                    <ActionButton
                        title={(state.disabled ? 'Enable' : 'Disable')}
                        onClick={onToggle}
                    />
                </div>
            </>
        );
    },
};
