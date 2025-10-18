import { Page } from '@playwright/test';

export type AsyncCallback<T> = (value: T, index: number, array: T[]) => unknown;

export type Fixtures = {
    page: Page;
};
