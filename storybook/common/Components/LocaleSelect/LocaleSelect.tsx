import { forwardRef, HTMLAttributes } from 'react';

const locales = [
    'en-US',
    'en-UK',
    'ko-KR',
    'es',
    'ru-RU',
    'fr',
];

export type LocaleSelectRef = HTMLSelectElement;
export type LocaleSelectProps = HTMLAttributes<HTMLSelectElement>;

export const LocaleSelect = forwardRef<
    LocaleSelectRef,
    LocaleSelectProps
>((props, ref) => (
    <select {...props} ref={ref}>
        {locales.map((item) => (
            <option key={`localeSel_${item}`} value={item}>{item}</option>
        ))}
    </select>
));

LocaleSelect.displayName = 'LocaleSelect';
