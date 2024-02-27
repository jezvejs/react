import { create } from '@storybook/theming/create';
import logo from '../stories/assets/images/jezvejs.svg';

export default create({
    base: 'dark',
    brandTitle: 'JezveJS React Storybook',
    brandUrl: 'https://henryfeesler.com/jezvejs-react',
    brandImage: logo,
    brandTarget: '_self',
});
