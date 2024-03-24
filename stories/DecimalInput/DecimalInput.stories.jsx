// eslint-disable-next-line import/no-unresolved
import '@jezvejs/react/style';
import { DecimalInput } from '@jezvejs/react';

export default {
    title: 'Components/DecimalInput',
    component: DecimalInput,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export const Default = {
    args: {
    },
    render: function Render(args) {
        const onSubmit = (e) => {
            e.preventDefault();
            alert('Form submitted');
        };

        return (
            <form style={{ marginBottom: '1rem' }} onSubmit={onSubmit}>
                <DecimalInput {...args} />
                <input type="submit" hidden />
            </form>
        );
    },
};

export const DigitsLimit = {
    args: {
        digits: 3,
        value: '2',
    },
};

export const MinMax = {
    args: {
        min: -10,
        max: 10,
    },
};

export const Integer = {
    args: {
        digits: 0,
    },
};

export const OnlyPositive = {
    args: {
        allowNegative: false,
    },
};

export const LeadingZeros = {
    args: {
        allowMultipleLeadingZeros: true,
    },
};
