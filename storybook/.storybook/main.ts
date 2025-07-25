import { join, dirname } from 'path';

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value) {
    return dirname(require.resolve(join(value, 'package.json')));
}

/** @type { import('@storybook/react-vite').StorybookConfig } */
export default {
    stories: ['../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'],

    addons: [
        getAbsolutePath('@storybook/addon-docs'),
        getAbsolutePath('@storybook/addon-links'),
    ],

    framework: {
        name: getAbsolutePath('@storybook/react-vite'),
        options: {},
    },

    docs: {},

    staticDirs: ['./public'],

    core: {
        disableTelemetry: true,
    },
};
