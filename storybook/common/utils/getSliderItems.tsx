import { SlideContent } from '../Components/SlideContent/SlideContent.tsx';

export type GetSliderItemsParams = {
    idPrefix?: string;
    itemsCount?: number;
};

export const getSliderItems = (options: GetSliderItemsParams = {}) => {
    const {
        itemsCount = 3,
        idPrefix = 'slide',
    } = options;
    const res = [];

    for (let i = 1; i <= itemsCount; i += 1) {
        res.push({
            id: `${idPrefix}-${i}`,
            name: `${idPrefix}-${i}`,
            content: <SlideContent>{`Slide ${i}`}</SlideContent>,
        });
    }

    return res;
};
