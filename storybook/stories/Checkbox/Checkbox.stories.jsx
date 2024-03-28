// eslint-disable-next-line import/no-unresolved
import '@jezvejs/react/style';
import { Checkbox } from '@jezvejs/react';
import './Checkbox.stories.scss';

const SmallCloseIcon = (props = {}) => (
    <svg {...props} className='checkbox__icon' viewBox='0 0 14 14'>
        <path
            d='M 1.1415,2.4266 5.7838,7 1.1415,11.5356 2.4644,12.8585 7,8.2162 11.5734,12.8585 12.8585,11.5356 8.2162,7 12.8585,2.4266 11.5734,1.1415 7,5.7838 2.4644,1.1415 Z'
        />
    </svg>
);

export default {
    title: 'Components/Checkbox',
    component: Checkbox,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export const Default = {
    args: {
        label: 'Checkbox',
    },
};

export const Checked = {
    args: {
        checked: true,
        label: 'Checked',
    },
};

export const CustomIcon = {
    args: {
        checked: true,
        checkIcon: SmallCloseIcon(),
        label: 'Custom icon',
    },
};

export const Disabled = {
    args: {
        label: 'Disabled checkbox',
        disabled: true,
    },
};
