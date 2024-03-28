// eslint-disable-next-line import/no-unresolved
import '@jezvejs/react/style';
import { TabList } from '@jezvejs/react';
import PropTypes from 'prop-types';
import './TabList.stories.scss';

export default {
    title: 'Components/TabList',
    component: TabList,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

const TabContent = ({ value }) => (
    <div className='tab-list__content-item'>
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
        Impedit aliquam aperiam sapiente libero rerum reiciendis quas est? {value}
    </div>
);

TabContent.propTypes = {
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
};

const ArrayContent = () => (
    <div className='tab-list__content-item'>
        <div>1</div>
        <div>2</div>
        <div>3</div>
        <div>4</div>
    </div>
);

const getItems = (disableLast = false) => ([{
    id: '1',
    title: 'First',
    value: 1,
    content: <TabContent value={1} />,
}, {
    id: '2',
    title: 'Second',
    value: 2,
    content: <TabContent value={2} />,
}, {
    id: 'str',
    title: 'Array content',
    value: 'str',
    content: <ArrayContent />,
    disabled: disableLast,
}]);

export const Default = {
    args: {
        items: getItems(),
    },
};

export const Styled = {
    args: {
        className: 'styled bold',
        items: getItems(),
    },
};

export const DisabledItem = {
    args: {
        className: 'styled',
        items: getItems(true),
    },
};
