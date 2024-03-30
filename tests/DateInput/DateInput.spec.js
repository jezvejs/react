import { test } from '@playwright/test';
import {
    inputToEmpty,
    pasteToEmpty,
    backspaceFromPos,
    deleteFromPos,
    inputFromPos,
    inputToSelection,
    pasteToSelection,
    pasteFromPos,
    backspaceSelection,
    deleteSelection,
    cutSelection,
} from '../utils/index.js';

test.describe('Type to empty input', () => {
    test('en-US locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--english-locale');

        await inputToEmpty({ page }, 'usLocaleInput', '1', '1_/__/__');
        await inputToEmpty({ page }, 'usLocaleInput', '11', '11/__/__');
        await inputToEmpty({ page }, 'usLocaleInput', '112', '11/2_/__');
        await inputToEmpty({ page }, 'usLocaleInput', '1122', '11/22/__');
        await inputToEmpty({ page }, 'usLocaleInput', '11220', '11/22/0_');
        await inputToEmpty({ page }, 'usLocaleInput', '112203', '11/22/03');
    });

    test('ko-KR locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--korean-locale');

        await inputToEmpty({ page }, 'koLocaleInput', '0', '0_. __. __.');
        await inputToEmpty({ page }, 'koLocaleInput', '03', '03. __. __.');
        await inputToEmpty({ page }, 'koLocaleInput', '031', '03. 1_. __.');
        await inputToEmpty({ page }, 'koLocaleInput', '0311', '03. 11. __.');
        await inputToEmpty({ page }, 'koLocaleInput', '03112', '03. 11. 2_.');
        await inputToEmpty({ page }, 'koLocaleInput', '031122', '03. 11. 22.');
    });

    test('ru-RU locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--russian-locale');

        await inputToEmpty({ page }, 'ruLocaleInput', '2', '2_.__.____');
        await inputToEmpty({ page }, 'ruLocaleInput', '22', '22.__.____');
        await inputToEmpty({ page }, 'ruLocaleInput', '221', '22.1_.____');
        await inputToEmpty({ page }, 'ruLocaleInput', '2211', '22.11.____');
        await inputToEmpty({ page }, 'ruLocaleInput', '22113', '22.11.3___');
        await inputToEmpty({ page }, 'ruLocaleInput', '221133', '22.11.33__');
        await inputToEmpty({ page }, 'ruLocaleInput', '2211333', '22.11.333_');
        await inputToEmpty({ page }, 'ruLocaleInput', '22113333', '22.11.3333');
    });

    test('es-ES locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--es-locale');

        await inputToEmpty({ page }, 'esLocaleInput', '2', '2_/__/__');
        await inputToEmpty({ page }, 'esLocaleInput', '22', '22/__/__');
        await inputToEmpty({ page }, 'esLocaleInput', '221', '22/1_/__');
        await inputToEmpty({ page }, 'esLocaleInput', '2211', '22/11/__');
        await inputToEmpty({ page }, 'esLocaleInput', '22113', '22/11/3_');
        await inputToEmpty({ page }, 'esLocaleInput', '221133', '22/11/33');
    });
});

test.describe('Type invalid values', () => {
    test('en-US locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--english-locale');

        // Month
        await inputToEmpty({ page }, 'usLocaleInput', 'x', '');
        await inputToEmpty({ page }, 'usLocaleInput', '13', '1_/__/__');
        await inputToEmpty({ page }, 'usLocaleInput', '1.', '1_/__/__');
        await inputToEmpty({ page }, 'usLocaleInput', '1x', '1_/__/__');
        await inputToEmpty({ page }, 'usLocaleInput', '0x', '0_/__/__');
        // Day
        await inputToEmpty({ page }, 'usLocaleInput', '4x', '04/__/__');
        await inputToEmpty({ page }, 'usLocaleInput', '438', '04/3_/__');
        await inputToEmpty({ page }, 'usLocaleInput', '43.', '04/3_/__');
        await inputToEmpty({ page }, 'usLocaleInput', '43x', '04/3_/__');
        await inputToEmpty({ page }, 'usLocaleInput', '40x', '04/0_/__');
        // Year
        await inputToEmpty({ page }, 'usLocaleInput', '45x', '04/05/__');
        await inputToEmpty({ page }, 'usLocaleInput', '451x', '04/05/1_');
        await inputToEmpty({ page }, 'usLocaleInput', '451.', '04/05/1_');
    });

    test('ko-KR locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--korean-locale');

        // Year
        await inputToEmpty({ page }, 'koLocaleInput', 'x', '');
        await inputToEmpty({ page }, 'koLocaleInput', '1x', '1_. __. __.');
        // Month
        await inputToEmpty({ page }, 'koLocaleInput', '33x', '33. __. __.');
        await inputToEmpty({ page }, 'koLocaleInput', '3313', '33. 1_. __.');
        await inputToEmpty({ page }, 'koLocaleInput', '331x', '33. 1_. __.');
        await inputToEmpty({ page }, 'koLocaleInput', '330x', '33. 0_. __.');
        // Day
        await inputToEmpty({ page }, 'koLocaleInput', '334x', '33. 04. __.');
        await inputToEmpty({ page }, 'koLocaleInput', '33438', '33. 04. 3_.');
        await inputToEmpty({ page }, 'koLocaleInput', '3343x', '33. 04. 3_.');
        await inputToEmpty({ page }, 'koLocaleInput', '3340x', '33. 04. 0_.');
    });

    test('ru-RU locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--russian-locale');

        // Day
        await inputToEmpty({ page }, 'ruLocaleInput', 'x', '');
        await inputToEmpty({ page }, 'ruLocaleInput', '38', '3_.__.____');
        await inputToEmpty({ page }, 'ruLocaleInput', '3x', '3_.__.____');
        await inputToEmpty({ page }, 'ruLocaleInput', '0x', '0_.__.____');
        // Month
        await inputToEmpty({ page }, 'ruLocaleInput', '4x', '04.__.____');
        await inputToEmpty({ page }, 'ruLocaleInput', '413', '04.1_.____');
        await inputToEmpty({ page }, 'ruLocaleInput', '41x', '04.1_.____');
        await inputToEmpty({ page }, 'ruLocaleInput', '40x', '04.0_.____');
        // Year
        await inputToEmpty({ page }, 'ruLocaleInput', '45x', '04.05.____');
        await inputToEmpty({ page }, 'ruLocaleInput', '451x', '04.05.1___');
    });

    test('es-ES locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--es-locale');

        // Day
        await inputToEmpty({ page }, 'esLocaleInput', 'x', '');
        await inputToEmpty({ page }, 'esLocaleInput', '38', '3_/__/__');
        await inputToEmpty({ page }, 'esLocaleInput', '3x', '3_/__/__');
        await inputToEmpty({ page }, 'esLocaleInput', '3.', '3_/__/__');
        await inputToEmpty({ page }, 'esLocaleInput', '0x', '0_/__/__');
        // Month
        await inputToEmpty({ page }, 'esLocaleInput', '4x', '04/__/__');
        await inputToEmpty({ page }, 'esLocaleInput', '413', '04/1_/__');
        await inputToEmpty({ page }, 'esLocaleInput', '41x', '04/1_/__');
        await inputToEmpty({ page }, 'esLocaleInput', '41.', '04/1_/__');
        await inputToEmpty({ page }, 'esLocaleInput', '40x', '04/0_/__');
        // Year
        await inputToEmpty({ page }, 'esLocaleInput', '45x', '04/05/__');
        await inputToEmpty({ page }, 'esLocaleInput', '451x', '04/05/1_');
    });
});

test.describe('Paste text to empty input', () => {
    test('en-US locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--english-locale');

        await pasteToEmpty({ page }, 'usLocaleInput', '11', '11/__/__');
        await pasteToEmpty({ page }, 'usLocaleInput', '1122', '11/22/__');
        await pasteToEmpty({ page }, 'usLocaleInput', '11220', '11/22/0_');
        await pasteToEmpty({ page }, 'usLocaleInput', '112203', '11/22/03');
        await pasteToEmpty({ page }, 'usLocaleInput', '11/22', '11/22/__');
        await pasteToEmpty({ page }, 'usLocaleInput', '11/22/', '11/22/__');
        await pasteToEmpty({ page }, 'usLocaleInput', '11/22/03', '11/22/03');
        await pasteToEmpty({ page }, 'usLocaleInput', '4', '04/__/__');
        await pasteToEmpty({ page }, 'usLocaleInput', '045', '04/05/__');
        await pasteToEmpty({ page }, 'usLocaleInput', '04050', '04/05/0_');
    });

    test('ko-KR locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--korean-locale');

        await pasteToEmpty({ page }, 'koLocaleInput', '03', '03. __. __.');
        await pasteToEmpty({ page }, 'koLocaleInput', '0311', '03. 11. __.');
        await pasteToEmpty({ page }, 'koLocaleInput', '031122', '03. 11. 22.');
        await pasteToEmpty({ page }, 'koLocaleInput', '03.', '03. __. __.');
        await pasteToEmpty({ page }, 'koLocaleInput', '03. ', '03. __. __.');
        await pasteToEmpty({ page }, 'koLocaleInput', '03. 1', '03. 1_. __.');
        await pasteToEmpty({ page }, 'koLocaleInput', '03. 11', '03. 11. __.');
        await pasteToEmpty({ page }, 'koLocaleInput', '03. 11. ', '03. 11. __.');
        await pasteToEmpty({ page }, 'koLocaleInput', '03. 11. 22', '03. 11. 22.');
        await pasteToEmpty({ page }, 'koLocaleInput', '034', '03. 04. __.');
        await pasteToEmpty({ page }, 'koLocaleInput', '03045', '03. 04. 05.');
    });

    test('ru-RU locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--russian-locale');

        await pasteToEmpty({ page }, 'ruLocaleInput', '22', '22.__.____');
        await pasteToEmpty({ page }, 'ruLocaleInput', '2211', '22.11.____');
        await pasteToEmpty({ page }, 'ruLocaleInput', '22113333', '22.11.3333');
        await pasteToEmpty({ page }, 'ruLocaleInput', '22.11', '22.11.____');
        await pasteToEmpty({ page }, 'ruLocaleInput', '22.11.', '22.11.____');
        await pasteToEmpty({ page }, 'ruLocaleInput', '22.11.3333', '22.11.3333');
        await pasteToEmpty({ page }, 'ruLocaleInput', '4', '04.__.____');
        await pasteToEmpty({ page }, 'ruLocaleInput', '045', '04.05.____');
    });

    test('es-ES locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--es-locale');

        await pasteToEmpty({ page }, 'esLocaleInput', '22', '22/__/__');
        await pasteToEmpty({ page }, 'esLocaleInput', '2211', '22/11/__');
        await pasteToEmpty({ page }, 'esLocaleInput', '22110', '22/11/0_');
        await pasteToEmpty({ page }, 'esLocaleInput', '221103', '22/11/03');
        await pasteToEmpty({ page }, 'esLocaleInput', '22/11', '22/11/__');
        await pasteToEmpty({ page }, 'esLocaleInput', '22/11/03', '22/11/03');
        await pasteToEmpty({ page }, 'esLocaleInput', '4', '04/__/__');
        await pasteToEmpty({ page }, 'esLocaleInput', '045', '04/05/__');
    });
});

test.describe('Paste invalid text to empty input', () => {
    test('en-US locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--english-locale');

        await pasteToEmpty({ page }, 'usLocaleInput', 'x', '');
        await pasteToEmpty({ page }, 'usLocaleInput', '45', '');
        await pasteToEmpty({ page }, 'usLocaleInput', '04x5', '');
        await pasteToEmpty({ page }, 'usLocaleInput', '04/05/x', '');
    });

    test('ko-KR locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--korean-locale');

        await pasteToEmpty({ page }, 'koLocaleInput', 'x', '');
        await pasteToEmpty({ page }, 'koLocaleInput', '11x', '');
        await pasteToEmpty({ page }, 'koLocaleInput', '1145', '');
        await pasteToEmpty({ page }, 'koLocaleInput', '1104x5', '');
    });

    test('ru-RU locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--russian-locale');

        await pasteToEmpty({ page }, 'ruLocaleInput', 'x', '');
        await pasteToEmpty({ page }, 'ruLocaleInput', '0x', '');
        await pasteToEmpty({ page }, 'ruLocaleInput', '04x5', '');
        await pasteToEmpty({ page }, 'ruLocaleInput', '04.05.x', '');
    });

    test('es-ES locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--es-locale');

        await pasteToEmpty({ page }, 'esLocaleInput', 'x', '');
        await pasteToEmpty({ page }, 'esLocaleInput', '45', '');
        await pasteToEmpty({ page }, 'esLocaleInput', '04x5', '');
        await pasteToEmpty({ page }, 'esLocaleInput', '04/05/x', '');
    });
});

test.describe('Backspace key', () => {
    test('en-US locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--english-locale');

        await backspaceFromPos({ page }, 'usLocaleInput', '11/22/33', 8, '11/22/3_');
        await backspaceFromPos({ page }, 'usLocaleInput', '11/22/3_', 7, '11/22/__');
        await backspaceFromPos({ page }, 'usLocaleInput', '11/22/__', 6, '11/2_/__');
        await backspaceFromPos({ page }, 'usLocaleInput', '11/22/__', 5, '11/2_/__');
        await backspaceFromPos({ page }, 'usLocaleInput', '11/2_/__', 4, '11/__/__');
        await backspaceFromPos({ page }, 'usLocaleInput', '11/__/__', 3, '1_/__/__');
        await backspaceFromPos({ page }, 'usLocaleInput', '11/__/__', 2, '1_/__/__');
        await backspaceFromPos({ page }, 'usLocaleInput', '1_/__/__', 1, '');
        await backspaceFromPos({ page }, 'usLocaleInput', '', 0, '');

        await backspaceFromPos({ page }, 'usLocaleInput', '11/22/33', 4, '11/_2/33');
        await backspaceFromPos({ page }, 'usLocaleInput', '11/_2/33', 3, '1_/_2/33');
        await backspaceFromPos({ page }, 'usLocaleInput', '1_/_2/33', 1, '__/_2/33');
        await backspaceFromPos({ page }, 'usLocaleInput', '__/_2/33', 0, '__/_2/33');
    });

    test('ko-KR locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--korean-locale');

        await backspaceFromPos({ page }, 'koLocaleInput', '33. 11. 22.', 10, '33. 11. 2_.');
        await backspaceFromPos({ page }, 'koLocaleInput', '33. 11. 2_.', 9, '33. 11. __.');
        await backspaceFromPos({ page }, 'koLocaleInput', '33. 11. __.', 8, '33. 1_. __.');
        await backspaceFromPos({ page }, 'koLocaleInput', '33. 11. __.', 6, '33. 1_. __.');
        await backspaceFromPos({ page }, 'koLocaleInput', '33. 1_. __.', 5, '33. __. __.');
        await backspaceFromPos({ page }, 'koLocaleInput', '33. __. __.', 4, '3_. __. __.');
        await backspaceFromPos({ page }, 'koLocaleInput', '33. __. __.', 2, '3_. __. __.');
        await backspaceFromPos({ page }, 'koLocaleInput', '3_. __. __.', 1, '');
        await backspaceFromPos({ page }, 'koLocaleInput', '', 0, '');

        await backspaceFromPos({ page }, 'koLocaleInput', '33. 11. 22.', 5, '33. _1. 22.');
        await backspaceFromPos({ page }, 'koLocaleInput', '33. _1. 22.', 4, '3_. _1. 22.');
        await backspaceFromPos({ page }, 'koLocaleInput', '3_. _1. 22.', 1, '__. _1. 22.');
        await backspaceFromPos({ page }, 'koLocaleInput', '__. _1. 22.', 0, '__. _1. 22.');
    });

    test('ru-RU locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--russian-locale');

        await backspaceFromPos({ page }, 'ruLocaleInput', '22.11.3333', 10, '22.11.333_');
        await backspaceFromPos({ page }, 'ruLocaleInput', '22.11.333_', 9, '22.11.33__');
        await backspaceFromPos({ page }, 'ruLocaleInput', '22.11.33__', 8, '22.11.3___');
        await backspaceFromPos({ page }, 'ruLocaleInput', '22.11.3___', 7, '22.11.____');
        await backspaceFromPos({ page }, 'ruLocaleInput', '22.11.____', 6, '22.1_.____');
        await backspaceFromPos({ page }, 'ruLocaleInput', '22.11.____', 5, '22.1_.____');
        await backspaceFromPos({ page }, 'ruLocaleInput', '22.1_.____', 4, '22.__.____');
        await backspaceFromPos({ page }, 'ruLocaleInput', '22.__.____', 3, '2_.__.____');
        await backspaceFromPos({ page }, 'ruLocaleInput', '22.__.____', 2, '2_.__.____');
        await backspaceFromPos({ page }, 'ruLocaleInput', '2_.__.____', 1, '');
        await backspaceFromPos({ page }, 'ruLocaleInput', '', 0, '');

        await backspaceFromPos({ page }, 'ruLocaleInput', '22.11.3333', 4, '22._1.3333');
        await backspaceFromPos({ page }, 'ruLocaleInput', '22._1.3333', 3, '2_._1.3333');
        await backspaceFromPos({ page }, 'ruLocaleInput', '2_._1.3333', 1, '__._1.3333');
        await backspaceFromPos({ page }, 'ruLocaleInput', '__._1.3333', 0, '__._1.3333');
    });

    test('es-ES locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--es-locale');

        await backspaceFromPos({ page }, 'esLocaleInput', '22/11/33', 8, '22/11/3_');
        await backspaceFromPos({ page }, 'esLocaleInput', '22/11/3_', 7, '22/11/__');
        await backspaceFromPos({ page }, 'esLocaleInput', '22/11/__', 6, '22/1_/__');
        await backspaceFromPos({ page }, 'esLocaleInput', '22/11/__', 5, '22/1_/__');
        await backspaceFromPos({ page }, 'esLocaleInput', '22/1_/__', 4, '22/__/__');
        await backspaceFromPos({ page }, 'esLocaleInput', '22/__/__', 3, '2_/__/__');
        await backspaceFromPos({ page }, 'esLocaleInput', '22/__/__', 2, '2_/__/__');
        await backspaceFromPos({ page }, 'esLocaleInput', '2_/__/__', 1, '');

        await backspaceFromPos({ page }, 'esLocaleInput', '22/11/33', 4, '22/_1/33');
        await backspaceFromPos({ page }, 'esLocaleInput', '22/_1/33', 3, '2_/_1/33');
        await backspaceFromPos({ page }, 'esLocaleInput', '2_/_1/33', 1, '__/_1/33');
        await backspaceFromPos({ page }, 'esLocaleInput', '__/_1/33', 0, '__/_1/33');
    });
});

test.describe('Delete key', () => {
    test('en-US locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--english-locale');

        await deleteFromPos({ page }, 'usLocaleInput', '11/22/33', 6, '11/22/_3');
        await deleteFromPos({ page }, 'usLocaleInput', '11/22/33', 5, '11/22/_3');
        await deleteFromPos({ page }, 'usLocaleInput', '11/22/33', 4, '11/2_/33');
        await deleteFromPos({ page }, 'usLocaleInput', '11/22/33', 0, '_1/22/33');
    });

    test('ko-KR locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--korean-locale');

        await deleteFromPos({ page }, 'koLocaleInput', '33. 11. 22.', 8, '33. 11. _2.');
        await deleteFromPos({ page }, 'koLocaleInput', '33. 11. 22.', 6, '33. 11. _2.');
        await deleteFromPos({ page }, 'koLocaleInput', '33. 11. 22.', 4, '33. _1. 22.');
        await deleteFromPos({ page }, 'koLocaleInput', '33. 11. 22.', 0, '_3. 11. 22.');
    });

    test('ru-RU locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--russian-locale');

        await deleteFromPos({ page }, 'ruLocaleInput', '22.11.3333', 6, '22.11._333');
        await deleteFromPos({ page }, 'ruLocaleInput', '22.11.3333', 5, '22.11._333');
        await deleteFromPos({ page }, 'ruLocaleInput', '22.11.3333', 4, '22.1_.3333');
        await deleteFromPos({ page }, 'ruLocaleInput', '22.11.3333', 0, '_2.11.3333');
    });

    test('es-ES locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--es-locale');

        await deleteFromPos({ page }, 'esLocaleInput', '22/11/33', 6, '22/11/_3');
        await deleteFromPos({ page }, 'esLocaleInput', '22/11/33', 5, '22/11/_3');
        await deleteFromPos({ page }, 'esLocaleInput', '22/11/33', 4, '22/1_/33');
        await deleteFromPos({ page }, 'esLocaleInput', '22/11/33', 0, '_2/11/33');
    });
});

test.describe('Input text inside value', () => {
    test('en-US locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--english-locale');

        await inputFromPos({ page }, 'usLocaleInput', '11/__/33', 3, '2', '11/2_/33');
        await inputFromPos({ page }, 'usLocaleInput', '11/2_/33', 4, '2', '11/22/33');
        await inputFromPos({ page }, 'usLocaleInput', '1_/__/__', 1, '/', '01/__/__');
        await inputFromPos({ page }, 'usLocaleInput', '01/2_/__', 4, '/', '01/02/__');
        await inputFromPos({ page }, 'usLocaleInput', '01/02/0_', 7, '/', '01/02/0_');
    });

    test('ko-KR locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--korean-locale');

        await inputFromPos({ page }, 'koLocaleInput', '33. __. 22.', 2, '1', '33. 1_. 22.');
        await inputFromPos({ page }, 'koLocaleInput', '33. __. 22.', 3, '1', '33. 1_. 22.');
        await inputFromPos({ page }, 'koLocaleInput', '33. __. 22.', 4, '1', '33. 1_. 22.');
        await inputFromPos({ page }, 'koLocaleInput', '33. __. 22.', 4, '7', '33. 07. 22.');
        await inputFromPos({ page }, 'koLocaleInput', '33. 1_. 22.', 5, '1', '33. 11. 22.');
        await inputFromPos({ page }, 'koLocaleInput', '33. 1_. __.', 5, '.', '33. 01. __.');
        await inputFromPos({ page }, 'koLocaleInput', '33. 01. __.', 6, '.', '33. 01. __.');
        await inputFromPos({ page }, 'koLocaleInput', '33. 01. __.', 6, ' ', '33. 01. __.');
        await inputFromPos({ page }, 'koLocaleInput', '33. 01. __.', 7, '.', '33. 01. __.');
        await inputFromPos({ page }, 'koLocaleInput', '33. 01. __.', 7, ' ', '33. 01. __.');
        await inputFromPos({ page }, 'koLocaleInput', '33. 01. 2_.', 9, '.', '33. 01. 02.');
        await inputFromPos({ page }, 'koLocaleInput', '33. 01. 2_.', 9, ' ', '33. 01. 02.');
        await inputFromPos({ page }, 'koLocaleInput', '3_. __. __.', 1, '.', '3_. __. __.');
        await inputFromPos({ page }, 'koLocaleInput', '3_. __. __.', 1, ' ', '3_. __. __.');
    });

    test('ru-RU locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--russian-locale');

        await inputFromPos({ page }, 'ruLocaleInput', '22.__.3333', 3, '1', '22.1_.3333');
        await inputFromPos({ page }, 'ruLocaleInput', '22.1_.3333', 4, '1', '22.11.3333');
        await inputFromPos({ page }, 'ruLocaleInput', '2_.__.____', 1, '.', '02.__.____');
        await inputFromPos({ page }, 'ruLocaleInput', '02.__.____', 2, '.', '02.__.____');
        await inputFromPos({ page }, 'ruLocaleInput', '02.1_.____', 4, '.', '02.01.____');
        await inputFromPos({ page }, 'ruLocaleInput', '02.01.1___', 7, '.', '02.01.1___');
    });

    test('es-ES locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--es-locale');

        await inputFromPos({ page }, 'esLocaleInput', '22/__/33', 3, '1', '22/1_/33');
        await inputFromPos({ page }, 'esLocaleInput', '22/1_/33', 4, '1', '22/11/33');
        await inputFromPos({ page }, 'esLocaleInput', '2_/__/__', 1, '/', '02/__/__');
        await inputFromPos({ page }, 'esLocaleInput', '02/__/__', 2, '/', '02/__/__');
        await inputFromPos({ page }, 'esLocaleInput', '02/1_/__', 4, '/', '02/01/__');
    });
});

test.describe('Input invalid text inside value', () => {
    test('en-US locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--english-locale');

        await inputFromPos({ page }, 'usLocaleInput', '11/__/33', 3, 'x', '11/__/33');
        await inputFromPos({ page }, 'usLocaleInput', '1_/22/33', 1, '5', '1_/22/33');
    });

    test('ko-KR locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--korean-locale');

        await inputFromPos({ page }, 'koLocaleInput', '33. __. 22.', 4, 'x', '33. __. 22.');
        await inputFromPos({ page }, 'koLocaleInput', '33. 1_. 22.', 5, '5', '33. 1_. 22.');
    });

    test('ru-RU locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--russian-locale');

        await inputFromPos({ page }, 'ruLocaleInput', '22.__.3333', 3, 'x', '22.__.3333');
        await inputFromPos({ page }, 'ruLocaleInput', '22.1_.3333', 4, '5', '22.1_.3333');
    });

    test('es-ES locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--es-locale');

        await inputFromPos({ page }, 'esLocaleInput', '22/__/33', 3, 'x', '22/__/33');
        await inputFromPos({ page }, 'esLocaleInput', '22/1_/33', 4, '5', '22/1_/33');
    });
});

test.describe('Input text into selection', () => {
    test('en-US locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--english-locale');

        await inputToSelection({ page }, 'usLocaleInput', '11/22/33', 1, 4, '1', '11/_2/33');
        await inputToSelection({ page }, 'usLocaleInput', '11/22/33', 0, 7, '2', '02/__/_3');
    });

    test('ko-KR locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--korean-locale');

        await inputToSelection({ page }, 'koLocaleInput', '33. 11. 22.', 2, 6, '1', '33. 1_. 22.');
        await inputToSelection({ page }, 'koLocaleInput', '33. 11. 22.', 3, 6, '1', '33. 1_. 22.');
        await inputToSelection({ page }, 'koLocaleInput', '33. 11. 22.', 4, 6, '1', '33. 1_. 22.');
        await inputToSelection({ page }, 'koLocaleInput', '33. 11. 22.', 2, 6, '7', '33. 07. 22.');
        await inputToSelection({ page }, 'koLocaleInput', '33. 11. 22.', 5, 9, '1', '33. 11. _2.');
        await inputToSelection({ page }, 'koLocaleInput', '33. 11. 22.', 0, 9, '3', '3_. __. _2.');
    });

    test('ru-RU locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--russian-locale');

        await inputToSelection({ page }, 'ruLocaleInput', '22.11.3333', 1, 4, '2', '22._1.3333');
        await inputToSelection({ page }, 'ruLocaleInput', '22.11.3333', 0, 9, '2', '2_.__.___3');
    });

    test('es-ES locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--es-locale');

        await inputToSelection({ page }, 'esLocaleInput', '22/11/33', 1, 4, '2', '22/_1/33');
        await inputToSelection({ page }, 'esLocaleInput', '22/11/33', 0, 7, '2', '2_/__/_3');
    });
});

test.describe('Input invalid text into selection', () => {
    test('en-US locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--english-locale');

        await inputToSelection({ page }, 'usLocaleInput', '11/22/33', 1, 4, 'x', '11/22/33');
        await inputToSelection({ page }, 'usLocaleInput', '11/22/33', 1, 4, '5', '11/22/33');
    });

    test('ko-KR locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--korean-locale');

        await inputToSelection({ page }, 'koLocaleInput', '33. 11. 22.', 5, 9, 'x', '33. 11. 22.');
        await inputToSelection({ page }, 'koLocaleInput', '33. 11. 22.', 5, 9, '5', '33. 11. 22.');
    });

    test('ru-RU locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--russian-locale');

        await inputToSelection({ page }, 'ruLocaleInput', '22.11.3333', 1, 4, 'x', '22.11.3333');
        await inputToSelection({ page }, 'ruLocaleInput', '22.11.3333', 4, 7, '5', '22.11.3333');
    });

    test('es-ES locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--es-locale');

        await inputToSelection({ page }, 'esLocaleInput', '22/11/33', 1, 4, 'x', '22/11/33');
        await inputToSelection({ page }, 'esLocaleInput', '22/11/33', 4, 7, '5', '22/11/33');
    });
});

test.describe('Paste text into selection', () => {
    test('en-US locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--english-locale');

        await pasteToSelection({ page }, 'usLocaleInput', '11/22/33', 1, 4, '1', '11/_2/33');
        await pasteToSelection({ page }, 'usLocaleInput', '11/22/33', 0, 7, '2', '02/__/_3');
    });

    test('ko-KR locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--korean-locale');

        await pasteToSelection({ page }, 'koLocaleInput', '33. 11. 22.', 2, 6, '1', '33. 1_. 22.');
        await pasteToSelection({ page }, 'koLocaleInput', '33. 11. 22.', 3, 6, '1', '33. 1_. 22.');
        await pasteToSelection({ page }, 'koLocaleInput', '33. 11. 22.', 4, 6, '1', '33. 1_. 22.');
        await pasteToSelection({ page }, 'koLocaleInput', '33. 11. 22.', 2, 6, '7', '33. 07. 22.');
        await pasteToSelection({ page }, 'koLocaleInput', '33. 11. 22.', 5, 9, '1', '33. 11. _2.');
        await pasteToSelection({ page }, 'koLocaleInput', '33. 11. 22.', 0, 9, '3', '3_. __. _2.');
        await pasteToSelection({ page }, 'koLocaleInput', '33. 11. 22.', 0, 10, '30. 1', '30. 1_. __.');
    });

    test('ru-RU locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--russian-locale');

        await pasteToSelection({ page }, 'ruLocaleInput', '22.11.3333', 1, 4, '2', '22._1.3333');
        await pasteToSelection({ page }, 'ruLocaleInput', '22.11.3333', 0, 9, '2', '2_.__.___3');
        await pasteToSelection({ page }, 'ruLocaleInput', '22.11.3333', 0, 10, '20.1', '20.1_.____');
    });

    test('es-ES locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--es-locale');

        await pasteToSelection({ page }, 'esLocaleInput', '22/11/33', 1, 4, '2', '22/_1/33');
        await pasteToSelection({ page }, 'esLocaleInput', '22/11/33', 0, 7, '2', '2_/__/_3');
        await pasteToSelection({ page }, 'esLocaleInput', '22/11/33', 0, 8, '201', '20/1_/__');
        await pasteToSelection({ page }, 'esLocaleInput', '22/11/33', 0, 8, '20/1', '20/1_/__');
    });
});

test.describe('Paste invalid text into selection', () => {
    test('en-US locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--english-locale');

        await pasteToSelection({ page }, 'usLocaleInput', '11/22/33', 1, 4, 'x', '11/22/33');
        await pasteToSelection({ page }, 'usLocaleInput', '11/22/33', 1, 4, '5', '11/22/33');
    });

    test('ko-KR locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--korean-locale');

        await pasteToSelection({ page }, 'koLocaleInput', '33. 11. 22.', 5, 9, 'x', '33. 11. 22.');
        await pasteToSelection({ page }, 'koLocaleInput', '33. 11. 22.', 5, 9, '5', '33. 11. 22.');
    });

    test('ru-RU locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--russian-locale');

        await pasteToSelection({ page }, 'ruLocaleInput', '22.11.3333', 1, 4, 'x', '22.11.3333');
        await pasteToSelection({ page }, 'ruLocaleInput', '22.11.3333', 4, 7, '5', '22.11.3333');
    });

    test('es-ES locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--es-locale');

        await pasteToSelection({ page }, 'esLocaleInput', '22/11/33', 1, 4, 'x', '22/11/33');
        await pasteToSelection({ page }, 'esLocaleInput', '22/11/33', 4, 7, '5', '22/11/33');
    });
});

test.describe('Paste text inside value', () => {
    test('en-US locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--english-locale');

        await pasteFromPos({ page }, 'usLocaleInput', '11/__/33', 3, '2', '11/2_/33');
        await pasteFromPos({ page }, 'usLocaleInput', '11/2_/33', 4, '2', '11/22/33');
    });

    test('ko-KR locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--korean-locale');

        await pasteFromPos({ page }, 'koLocaleInput', '33. __. 22.', 2, '1', '33. 1_. 22.');
        await pasteFromPos({ page }, 'koLocaleInput', '33. __. 22.', 3, '1', '33. 1_. 22.');
        await pasteFromPos({ page }, 'koLocaleInput', '33. __. 22.', 4, '1', '33. 1_. 22.');
        await pasteFromPos({ page }, 'koLocaleInput', '33. __. 22.', 4, '7', '33. 07. 22.');
        await pasteFromPos({ page }, 'koLocaleInput', '3_. __. 22.', 1, '3. 1', '33. 1_. 22.');
        await pasteFromPos({ page }, 'koLocaleInput', '33. __. 22.', 2, '. 1', '33. 1_. 22.');
        await pasteFromPos({ page }, 'koLocaleInput', '33. __. 22.', 2, '. ', '33. __. 22.');
        await pasteFromPos({ page }, 'koLocaleInput', '33. __. 22.', 2, ' ', '33. __. 22.');
        await pasteFromPos({ page }, 'koLocaleInput', '33. 1_. 22.', 5, '1', '33. 11. 22.');
    });

    test('ru-RU locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--russian-locale');

        await pasteFromPos({ page }, 'ruLocaleInput', '22.__.3333', 3, '1', '22.1_.3333');
        await pasteFromPos({ page }, 'ruLocaleInput', '22.1_.3333', 4, '1', '22.11.3333');
    });

    test('es-ES locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--es-locale');

        await pasteFromPos({ page }, 'esLocaleInput', '22/__/33', 3, '1', '22/1_/33');
        await pasteFromPos({ page }, 'esLocaleInput', '22/1_/33', 4, '1', '22/11/33');
    });
});

test.describe('Paste invalid text inside value', () => {
    test('en-US locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--english-locale');

        await pasteFromPos({ page }, 'usLocaleInput', '11/__/33', 3, 'x', '11/__/33');
        await pasteFromPos({ page }, 'usLocaleInput', '1_/22/33', 1, '5', '1_/22/33');
    });

    test('ko-KR locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--korean-locale');

        await pasteFromPos({ page }, 'koLocaleInput', '33. __. 22.', 4, 'x', '33. __. 22.');
        await pasteFromPos({ page }, 'koLocaleInput', '33. 1_. 22.', 5, '5', '33. 1_. 22.');
    });

    test('ru-RU locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--russian-locale');

        await pasteFromPos({ page }, 'ruLocaleInput', '22.__.3333', 3, 'x', '22.__.3333');
        await pasteFromPos({ page }, 'ruLocaleInput', '22.1_.3333', 4, '5', '22.1_.3333');
    });

    test('es-ES locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--es-locale');

        await pasteFromPos({ page }, 'esLocaleInput', '22/__/33', 3, 'x', '22/__/33');
        await pasteFromPos({ page }, 'esLocaleInput', '22/1_/33', 4, '5', '22/1_/33');
    });
});

test.describe('Backspace key with selection', () => {
    test('en-US locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--english-locale');

        await backspaceSelection({ page }, 'usLocaleInput', '11/22/33', 4, 7, '11/2_/_3');
        await backspaceSelection({ page }, 'usLocaleInput', '11/22/33', 0, 8, '');
    });

    test('ko-KR locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--korean-locale');

        await backspaceSelection({ page }, 'koLocaleInput', '33. 11. 22.', 5, 9, '33. 1_. _2.');
        await backspaceSelection({ page }, 'koLocaleInput', '33. 11. 22.', 0, 10, '');
    });

    test('ru-RU locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--russian-locale');

        await backspaceSelection({ page }, 'ruLocaleInput', '22.11.3333', 4, 7, '22.1_._333');
        await backspaceSelection({ page }, 'ruLocaleInput', '22.11.3333', 0, 10, '');
    });

    test('es-ES locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--es-locale');

        await backspaceSelection({ page }, 'esLocaleInput', '22/11/33', 4, 7, '22/1_/_3');
        await backspaceSelection({ page }, 'esLocaleInput', '22/11/33', 0, 8, '');
    });
});

test.describe('Delete key with selection', () => {
    test('en-US locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--english-locale');

        await deleteSelection({ page }, 'usLocaleInput', '11/22/33', 4, 7, '11/2_/_3');
        await deleteSelection({ page }, 'usLocaleInput', '11/22/33', 0, 8, '');
    });

    test('ko-KR locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--korean-locale');

        await deleteSelection({ page }, 'koLocaleInput', '33. 11. 22.', 5, 9, '33. 1_. _2.');
        await deleteSelection({ page }, 'koLocaleInput', '33. 11. 22.', 0, 10, '');
    });

    test('ru-RU locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--russian-locale');

        await deleteSelection({ page }, 'ruLocaleInput', '22.11.3333', 4, 7, '22.1_._333');
        await deleteSelection({ page }, 'ruLocaleInput', '22.11.3333', 0, 10, '');
    });

    test('es-ES locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--es-locale');

        await deleteSelection({ page }, 'esLocaleInput', '22/11/33', 4, 7, '22/1_/_3');
        await deleteSelection({ page }, 'esLocaleInput', '22/11/33', 0, 8, '');
    });
});

test.describe('Cut selection', () => {
    test('en-US locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--english-locale');

        await cutSelection({ page }, 'usLocaleInput', '11/22/33', 4, 7, '11/2_/_3');
        await cutSelection({ page }, 'usLocaleInput', '11/22/33', 0, 8, '');
    });

    test('ko-KR locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--korean-locale');

        await cutSelection({ page }, 'koLocaleInput', '33. 11. 22.', 5, 9, '33. 1_. _2.');
        await cutSelection({ page }, 'koLocaleInput', '33. 11. 22.', 0, 10, '');
    });

    test('ru-RU locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--russian-locale');

        await cutSelection({ page }, 'ruLocaleInput', '22.11.3333', 4, 7, '22.1_._333');
        await cutSelection({ page }, 'ruLocaleInput', '22.11.3333', 0, 10, '');
    });

    test('es-ES locale', async ({ page }) => {
        await page.goto('http://localhost:6006/iframe.html?viewMode=story&id=input-dateinput--es-locale');

        await cutSelection({ page }, 'esLocaleInput', '22/11/33', 4, 7, '22/1_/_3');
        await cutSelection({ page }, 'esLocaleInput', '22/11/33', 0, 8, '');
    });
});
