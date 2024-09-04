// eslint-disable-next-line import/no-unresolved
import '@jezvejs/react/style';
import { DecimalInput } from '@jezvejs/react';
import { SectionControls } from '../../../common/Components/SectionControls/SectionControls.jsx';
import { useInputState } from '../../../common/hooks/useInputState.js';

const TempInputDecorator = (Story) => (
    <div>
        <Story />
        <SectionControls>
            <input className="input tmp-input" placeholder="Temporary input" type="text" />
        </SectionControls>
    </div>
);

const InputWithState = (props) => {
    const { inputProps } = useInputState(props);

    return (
        <DecimalInput {...inputProps} />
    );
};

export default {
    title: 'Input/DecimalInput',
    component: InputWithState,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export const Default = {
    args: {
        id: 'defaultInput',
    },
    render: function Render(args) {
        const onSubmit = (e) => {
            e.preventDefault();
            alert('Form submitted');
        };

        return (
            <form onSubmit={onSubmit}>
                <InputWithState {...args} />
                <input type="submit" hidden />
            </form>
        );
    },
    decorators: [TempInputDecorator],
};

export const DigitsLimit = {
    args: {
        id: 'digitsLimitInput',
        digits: 3,
        value: '2',
    },
    decorators: [TempInputDecorator],
};

export const MinMax = {
    args: {
        id: 'minMaxDecInput',
        min: -10,
        max: 10,
    },
    decorators: [TempInputDecorator],
};

export const Integer = {
    args: {
        id: 'integerInput',
        digits: 0,
    },
    decorators: [TempInputDecorator],
};

export const OnlyPositive = {
    args: {
        id: 'positiveInput',
        allowNegative: false,
    },
    decorators: [TempInputDecorator],
};

export const LeadingZeros = {
    args: {
        id: 'leadZerosInput',
        allowMultipleLeadingZeros: true,
    },
    decorators: [TempInputDecorator],
};
