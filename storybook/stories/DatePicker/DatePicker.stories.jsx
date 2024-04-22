// eslint-disable-next-line import/no-unresolved
import '@jezvejs/react/style';
import { DatePicker } from '@jezvejs/react';
import './DatePicker.stories.scss';

export default {
    title: 'Components/DatePicker',
    component: DatePicker,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

const heightDecorator = (Story) => (
    <div className="height-container">
        <Story />
    </div>
);

export const Default = {
    args: {
        inline: true,
    },
    decorators: [heightDecorator],
};
