import packageJSON from '@jezvejs/react/package.json';
import { create } from '@storybook/theming/create';
import logo from '../assets/images/jezvejs-react.svg';

export default create({
    base: 'dark',
    brandTitle: `JezveJS React v.${packageJSON.version}`,
    brandUrl: 'https://henryfeesler.com/jezvejs-react',
    brandImage: logo,
    brandTarget: '_self',
});
