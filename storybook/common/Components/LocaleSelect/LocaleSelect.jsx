import { forwardRef } from 'react';

const locales = [
    'en-US',
    'en-UK',
    'ko-KR',
    'es',
    'ru-RU',
    'fr',
];

// eslint-disable-next-line react/display-name
export const LocaleSelect = forwardRef((props, ref) => (
    <select {...props} ref={ref}>
        {locales.map((item) => (
            <option key={`localeSel_${item}`} value={item}>{item}</option>
        ))}
    </select>
));
