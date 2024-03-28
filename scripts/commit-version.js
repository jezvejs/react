import * as dotenv from 'dotenv';
import { commitVersion } from '@jezvejs/release-tools';

dotenv.config();

commitVersion({
    versionFiles: [
        'package-lock.json',
        'package.json',
        'packages/react/package.json',
        'storybook/package.json',
    ],
    packageName: 'react',
    gitDir: process.env.PROJECT_GIT_DIR,
});
