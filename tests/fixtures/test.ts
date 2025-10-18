import { test as baseTest } from '@playwright/test';

const test = baseTest.extend({
    contextOptions: async ({ baseURL }, use) => {
        await use({ baseURL });
    },
});

export default test;
