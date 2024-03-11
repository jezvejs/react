// eslint-disable-next-line import/no-unresolved
import '@jezvejs/react/style';
import { Button, Collapsible } from '@jezvejs/react';

import EditIcon from '../assets/icons/edit.svg';
import DeleteIcon from '../assets/icons/del.svg';

import './Collapsible.stories.scss';

export default {
    title: 'Components/Collapsible',
    component: Collapsible,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

const createContent = (content) => (
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

export const Default = {
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

export const Styled = {
    args: {
        className: 'styled',
        header: 'Show',
        children: createContent(createListContent({ prefix: 'styled' })),
    },
};

export const Animated = {
    args: {
        className: 'styled',
        header: 'Show',
        animated: true,
        children: createContent(createListContent({ prefix: 'animated' })),
    },
};

const EditIconCustom = (props) => (
    <EditIcon {...props} className='custom-header-icon' />
);

const DeleteIconCustom = (props) => (
    <DeleteIcon {...props} className='custom-header-icon' />
);

const CustomHeaderButton = (props) => (
    <Button
        {...props}
        className='custom-header-btn'
        onClick={(e) => e.stopPropagation()}
    />
);

export const CustomHeader = {
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
