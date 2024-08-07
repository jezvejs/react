import packageJSON from '@jezvejs/react/package.json';

const [major, minor, patch] = packageJSON.version.split('.');

/** @type { import('@storybook/react').Preview } */
const preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
        version: {
            major,
            minor,
            patch,
        },
    },
};

export default preview;
