// eslint-disable-next-line import/no-unresolved
import '@jezvejs/react/style';
import { Progress } from '@jezvejs/react';
import './Progress.stories.scss';

export default {
    title: 'Components/Progress',
    component: Progress,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
};

export const Default = {
    args: {
        className: 'w-500',
        value: 50,
    },
};

export const Styled = {
    render: function Render() {
        return (
            <>
                <Progress className="w-500 green-progress thin-progress" value={25} />
                <Progress className="w-500 thick-progress square-progress" value={50} />
                <Progress className="w-500 border-progress" value={75} />
            </>
        );
    },
};
