import { RangeSlider, RangeSliderProps } from '@jezvejs/react';
import classNames from 'classnames';

import './RangeSliderStyled.scss';

export const RangeSliderStyled = ({ className, ...props }: Partial<RangeSliderProps>) => (
    <RangeSlider className={classNames('styled', className)} {...props} />
);
