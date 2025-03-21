import classNames from 'classnames';
import { TabList, TabListProps } from '@jezvejs/react';
import './TabListStyled.scss';

export const TabListStyled = (props: TabListProps) => (
    <TabList
        {...props}
        className={classNames('styled', props.className)}
    />
);
