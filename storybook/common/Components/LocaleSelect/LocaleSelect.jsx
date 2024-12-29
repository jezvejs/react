import { forwardRef } from 'react';

const locales = [
    'en-US',
    'en-UK',
    'ko-KR',
    'es',
    'ru-RU',
    'fr',
];

export const LocaleSelect = forwardRef((props, ref) => (
    <select {...props} ref={ref}>
        {locales.map((item) => (
            <option key={`localeSel_${item}`} value={item}>{item}</option>
        ))}
    </select>
));

LocaleSelect.displayName = 'LocaleSelect';
