// eslint-disable-next-line import/no-unresolved
import '@jezvejs/react/style';
import { DateInput } from '@jezvejs/react';

export default {
    title: 'Input/DateInput',
    component: DateInput,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export const Default = {
    args: {
        value: '01.02.3456',
    },
    render: function Render(args) {
        const onSubmit = (e) => {
            e.preventDefault();
            alert('Form submitted');
        };

        return (
            <form style={{ marginBottom: '1rem' }} onSubmit={onSubmit}>
                <DateInput {...args} />
                <input type="submit" hidden />
            </form>
        );
    },
};

export const Placeholder = {
    args: {
        placeholder: 'Input date',
    },
};

export const EnglishLocale = {
    args: {
        locales: ['en-US'],
    },
};

export const KoreanLocale = {
    args: {
        locales: ['ko-KR'],
    },
};

export const RussianLocale = {
    args: {
        locales: ['ru-RU'],
    },
};

export const EsLocale = {
    args: {
        locales: ['es'],
    },
};
