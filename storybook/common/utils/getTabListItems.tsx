export type TabContentProps = {
    value?: number | string;
};

const TabContent = ({ value }: TabContentProps) => (
    <div className='tab-list__content-item'>
        Lorem ipsum dolor sit amet consectetur adipisicing elit.<br />
        Impedit aliquam aperiam sapiente libero rerum reiciendis quas est? {value}
    </div>
);

const ArrayContent = () => (
    <div className='tab-list__content-item'>
        <div>1</div>
        <div>2</div>
        <div>3</div>
        <div>4</div>
    </div>
);

export const getTabListItems = (disableLast = false) => ([{
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
