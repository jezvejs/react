import { initItems } from './utils.ts';

export const getSortableItems = () => (
    initItems({ idPrefix: 'src_', count: 5 })
);
