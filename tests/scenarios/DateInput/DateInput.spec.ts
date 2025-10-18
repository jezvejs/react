import baseTest from 'fixtures/test.ts';
import { DateInputPage } from 'pages/DateInput/DateInputPage.ts';

export interface DateInputPageFixture {
    dateInputPage: DateInputPage;
}

const inputId = 'localeInput';

const test = baseTest.extend<DateInputPageFixture>({
    dateInputPage: async ({ page }, use) => {
        const dateInputPage = new DateInputPage(page);
        await use(dateInputPage);
    },
});

test.describe('Type to empty input', () => {
    test('en-US locale', async ({ dateInputPage }) => {
        await dateInputPage.selectLocale('en-US');

        await dateInputPage.inputToEmpty(inputId, '1', '1_/__/__');
        await dateInputPage.inputToEmpty(inputId, '11', '11/__/__');
        await dateInputPage.inputToEmpty(inputId, '112', '11/2_/__');
        await dateInputPage.inputToEmpty(inputId, '1122', '11/22/__');
        await dateInputPage.inputToEmpty(inputId, '11220', '11/22/0_');
        await dateInputPage.inputToEmpty(inputId, '112203', '11/22/03');
    });

    test('ko-KR locale', async ({ dateInputPage }) => {
        await dateInputPage.selectLocale('ko-KR');

        await dateInputPage.inputToEmpty(inputId, '0', '0_. __. __.');
        await dateInputPage.inputToEmpty(inputId, '03', '03. __. __.');
        await dateInputPage.inputToEmpty(inputId, '031', '03. 1_. __.');
        await dateInputPage.inputToEmpty(inputId, '0311', '03. 11. __.');
        await dateInputPage.inputToEmpty(inputId, '03112', '03. 11. 2_.');
        await dateInputPage.inputToEmpty(inputId, '031122', '03. 11. 22.');
    });

    test('ru-RU locale', async ({ dateInputPage }) => {
        await dateInputPage.selectLocale('ru-RU');

        await dateInputPage.inputToEmpty(inputId, '2', '2_.__.____');
        await dateInputPage.inputToEmpty(inputId, '22', '22.__.____');
        await dateInputPage.inputToEmpty(inputId, '221', '22.1_.____');
        await dateInputPage.inputToEmpty(inputId, '2211', '22.11.____');
        await dateInputPage.inputToEmpty(inputId, '22113', '22.11.3___');
        await dateInputPage.inputToEmpty(inputId, '221133', '22.11.33__');
        await dateInputPage.inputToEmpty(inputId, '2211333', '22.11.333_');
        await dateInputPage.inputToEmpty(inputId, '22113333', '22.11.3333');
    });

    test('es-ES locale', async ({ dateInputPage }) => {
        await dateInputPage.selectLocale('es');

        await dateInputPage.inputToEmpty(inputId, '2', '2_/__/__');
        await dateInputPage.inputToEmpty(inputId, '22', '22/__/__');
        await dateInputPage.inputToEmpty(inputId, '221', '22/1_/__');
        await dateInputPage.inputToEmpty(inputId, '2211', '22/11/__');
        await dateInputPage.inputToEmpty(inputId, '22113', '22/11/3_');
        await dateInputPage.inputToEmpty(inputId, '221133', '22/11/33');
    });
});

test.describe('Type invalid values', () => {
    test('en-US locale', async ({ dateInputPage }) => {
        await dateInputPage.selectLocale('en-US');

        // Month
        await dateInputPage.inputToEmpty(inputId, 'x', '');
        await dateInputPage.inputToEmpty(inputId, '13', '1_/__/__');
        await dateInputPage.inputToEmpty(inputId, '1.', '1_/__/__');
        await dateInputPage.inputToEmpty(inputId, '1x', '1_/__/__');
        await dateInputPage.inputToEmpty(inputId, '0x', '0_/__/__');
        // Day
        await dateInputPage.inputToEmpty(inputId, '4x', '04/__/__');
        await dateInputPage.inputToEmpty(inputId, '438', '04/3_/__');
        await dateInputPage.inputToEmpty(inputId, '43.', '04/3_/__');
        await dateInputPage.inputToEmpty(inputId, '43x', '04/3_/__');
        await dateInputPage.inputToEmpty(inputId, '40x', '04/0_/__');
        // Year
        await dateInputPage.inputToEmpty(inputId, '45x', '04/05/__');
        await dateInputPage.inputToEmpty(inputId, '451x', '04/05/1_');
        await dateInputPage.inputToEmpty(inputId, '451.', '04/05/1_');
    });

    test('ko-KR locale', async ({ dateInputPage }) => {
        await dateInputPage.selectLocale('ko-KR');

        // Year
        await dateInputPage.inputToEmpty(inputId, 'x', '');
        await dateInputPage.inputToEmpty(inputId, '1x', '1_. __. __.');
        // Month
        await dateInputPage.inputToEmpty(inputId, '33x', '33. __. __.');
        await dateInputPage.inputToEmpty(inputId, '3313', '33. 1_. __.');
        await dateInputPage.inputToEmpty(inputId, '331x', '33. 1_. __.');
        await dateInputPage.inputToEmpty(inputId, '330x', '33. 0_. __.');
        // Day
        await dateInputPage.inputToEmpty(inputId, '334x', '33. 04. __.');
        await dateInputPage.inputToEmpty(inputId, '33438', '33. 04. 3_.');
        await dateInputPage.inputToEmpty(inputId, '3343x', '33. 04. 3_.');
        await dateInputPage.inputToEmpty(inputId, '3340x', '33. 04. 0_.');
    });

    test('ru-RU locale', async ({ dateInputPage }) => {
        await dateInputPage.selectLocale('ru-RU');

        // Day
        await dateInputPage.inputToEmpty(inputId, 'x', '');
        await dateInputPage.inputToEmpty(inputId, '38', '3_.__.____');
        await dateInputPage.inputToEmpty(inputId, '3x', '3_.__.____');
        await dateInputPage.inputToEmpty(inputId, '0x', '0_.__.____');
        // Month
        await dateInputPage.inputToEmpty(inputId, '4x', '04.__.____');
        await dateInputPage.inputToEmpty(inputId, '413', '04.1_.____');
        await dateInputPage.inputToEmpty(inputId, '41x', '04.1_.____');
        await dateInputPage.inputToEmpty(inputId, '40x', '04.0_.____');
        // Year
        await dateInputPage.inputToEmpty(inputId, '45x', '04.05.____');
        await dateInputPage.inputToEmpty(inputId, '451x', '04.05.1___');
    });

    test('es-ES locale', async ({ dateInputPage }) => {
        await dateInputPage.selectLocale('es');

        // Day
        await dateInputPage.inputToEmpty(inputId, 'x', '');
        await dateInputPage.inputToEmpty(inputId, '38', '3_/__/__');
        await dateInputPage.inputToEmpty(inputId, '3x', '3_/__/__');
        await dateInputPage.inputToEmpty(inputId, '3.', '3_/__/__');
        await dateInputPage.inputToEmpty(inputId, '0x', '0_/__/__');
        // Month
        await dateInputPage.inputToEmpty(inputId, '4x', '04/__/__');
        await dateInputPage.inputToEmpty(inputId, '413', '04/1_/__');
        await dateInputPage.inputToEmpty(inputId, '41x', '04/1_/__');
        await dateInputPage.inputToEmpty(inputId, '41.', '04/1_/__');
        await dateInputPage.inputToEmpty(inputId, '40x', '04/0_/__');
        // Year
        await dateInputPage.inputToEmpty(inputId, '45x', '04/05/__');
        await dateInputPage.inputToEmpty(inputId, '451x', '04/05/1_');
    });
});

test.describe('Paste text to empty input', () => {
    test('en-US locale', async ({ dateInputPage }) => {
        await dateInputPage.selectLocale('en-US');

        await dateInputPage.pasteToEmpty(inputId, '11', '11/__/__');
        await dateInputPage.pasteToEmpty(inputId, '1122', '11/22/__');
        await dateInputPage.pasteToEmpty(inputId, '11220', '11/22/0_');
        await dateInputPage.pasteToEmpty(inputId, '112203', '11/22/03');
        await dateInputPage.pasteToEmpty(inputId, '11/22', '11/22/__');
        await dateInputPage.pasteToEmpty(inputId, '11/22/', '11/22/__');
        await dateInputPage.pasteToEmpty(inputId, '11/22/03', '11/22/03');
        await dateInputPage.pasteToEmpty(inputId, '4', '04/__/__');
        await dateInputPage.pasteToEmpty(inputId, '045', '04/05/__');
        await dateInputPage.pasteToEmpty(inputId, '04050', '04/05/0_');
    });

    test('ko-KR locale', async ({ dateInputPage }) => {
        await dateInputPage.selectLocale('ko-KR');

        await dateInputPage.pasteToEmpty(inputId, '03', '03. __. __.');
        await dateInputPage.pasteToEmpty(inputId, '0311', '03. 11. __.');
        await dateInputPage.pasteToEmpty(inputId, '031122', '03. 11. 22.');
        await dateInputPage.pasteToEmpty(inputId, '03.', '03. __. __.');
        await dateInputPage.pasteToEmpty(inputId, '03. ', '03. __. __.');
        await dateInputPage.pasteToEmpty(inputId, '03. 1', '03. 1_. __.');
        await dateInputPage.pasteToEmpty(inputId, '03. 11', '03. 11. __.');
        await dateInputPage.pasteToEmpty(inputId, '03. 11. ', '03. 11. __.');
        await dateInputPage.pasteToEmpty(inputId, '03. 11. 22', '03. 11. 22.');
        await dateInputPage.pasteToEmpty(inputId, '034', '03. 04. __.');
        await dateInputPage.pasteToEmpty(inputId, '03045', '03. 04. 05.');
    });

    test('ru-RU locale', async ({ dateInputPage }) => {
        await dateInputPage.selectLocale('ru-RU');

        await dateInputPage.pasteToEmpty(inputId, '22', '22.__.____');
        await dateInputPage.pasteToEmpty(inputId, '2211', '22.11.____');
        await dateInputPage.pasteToEmpty(inputId, '22113333', '22.11.3333');
        await dateInputPage.pasteToEmpty(inputId, '22.11', '22.11.____');
        await dateInputPage.pasteToEmpty(inputId, '22.11.', '22.11.____');
        await dateInputPage.pasteToEmpty(inputId, '22.11.3333', '22.11.3333');
        await dateInputPage.pasteToEmpty(inputId, '4', '04.__.____');
        await dateInputPage.pasteToEmpty(inputId, '045', '04.05.____');
    });

    test('es-ES locale', async ({ dateInputPage }) => {
        await dateInputPage.selectLocale('es');

        await dateInputPage.pasteToEmpty(inputId, '22', '22/__/__');
        await dateInputPage.pasteToEmpty(inputId, '2211', '22/11/__');
        await dateInputPage.pasteToEmpty(inputId, '22110', '22/11/0_');
        await dateInputPage.pasteToEmpty(inputId, '221103', '22/11/03');
        await dateInputPage.pasteToEmpty(inputId, '22/11', '22/11/__');
        await dateInputPage.pasteToEmpty(inputId, '22/11/03', '22/11/03');
        await dateInputPage.pasteToEmpty(inputId, '4', '04/__/__');
        await dateInputPage.pasteToEmpty(inputId, '045', '04/05/__');
    });
});

test.describe('Paste invalid text to empty input', () => {
    test('en-US locale', async ({ dateInputPage }) => {
        await dateInputPage.selectLocale('en-US');

        await dateInputPage.pasteToEmpty(inputId, 'x', '');
        await dateInputPage.pasteToEmpty(inputId, '45', '');
        await dateInputPage.pasteToEmpty(inputId, '04x5', '');
        await dateInputPage.pasteToEmpty(inputId, '04/05/x', '');
    });

    test('ko-KR locale', async ({ dateInputPage }) => {
        await dateInputPage.selectLocale('ko-KR');

        await dateInputPage.pasteToEmpty(inputId, 'x', '');
        await dateInputPage.pasteToEmpty(inputId, '11x', '');
        await dateInputPage.pasteToEmpty(inputId, '1145', '');
        await dateInputPage.pasteToEmpty(inputId, '1104x5', '');
    });

    test('ru-RU locale', async ({ dateInputPage }) => {
        await dateInputPage.selectLocale('ru-RU');

        await dateInputPage.pasteToEmpty(inputId, 'x', '');
        await dateInputPage.pasteToEmpty(inputId, '0x', '');
        await dateInputPage.pasteToEmpty(inputId, '04x5', '');
        await dateInputPage.pasteToEmpty(inputId, '04.05.x', '');
    });

    test('es-ES locale', async ({ dateInputPage }) => {
        await dateInputPage.selectLocale('es');

        await dateInputPage.pasteToEmpty(inputId, 'x', '');
        await dateInputPage.pasteToEmpty(inputId, '45', '');
        await dateInputPage.pasteToEmpty(inputId, '04x5', '');
        await dateInputPage.pasteToEmpty(inputId, '04/05/x', '');
    });
});

test.describe('Backspace key', () => {
    test('en-US locale', async ({ dateInputPage }) => {
        await dateInputPage.selectLocale('en-US');

        await dateInputPage.backspaceFromPos(inputId, '11/22/33', 8, '11/22/3_');
        await dateInputPage.backspaceFromPos(inputId, '11/22/3_', 7, '11/22/__');
        await dateInputPage.backspaceFromPos(inputId, '11/22/__', 6, '11/2_/__');
        await dateInputPage.backspaceFromPos(inputId, '11/22/__', 5, '11/2_/__');
        await dateInputPage.backspaceFromPos(inputId, '11/2_/__', 4, '11/__/__');
        await dateInputPage.backspaceFromPos(inputId, '11/__/__', 3, '1_/__/__');
        await dateInputPage.backspaceFromPos(inputId, '11/__/__', 2, '1_/__/__');
        await dateInputPage.backspaceFromPos(inputId, '1_/__/__', 1, '');
        await dateInputPage.backspaceFromPos(inputId, '', 0, '');

        await dateInputPage.backspaceFromPos(inputId, '11/22/33', 4, '11/_2/33');
        await dateInputPage.backspaceFromPos(inputId, '11/_2/33', 3, '1_/_2/33');
        await dateInputPage.backspaceFromPos(inputId, '1_/_2/33', 1, '__/_2/33');
        await dateInputPage.backspaceFromPos(inputId, '__/_2/33', 0, '__/_2/33');
    });

    test('ko-KR locale', async ({ dateInputPage }) => {
        await dateInputPage.selectLocale('ko-KR');

        await dateInputPage.backspaceFromPos(inputId, '33. 11. 22.', 10, '33. 11. 2_.');
        await dateInputPage.backspaceFromPos(inputId, '33. 11. 2_.', 9, '33. 11. __.');
        await dateInputPage.backspaceFromPos(inputId, '33. 11. __.', 8, '33. 1_. __.');
        await dateInputPage.backspaceFromPos(inputId, '33. 11. __.', 6, '33. 1_. __.');
        await dateInputPage.backspaceFromPos(inputId, '33. 1_. __.', 5, '33. __. __.');
        await dateInputPage.backspaceFromPos(inputId, '33. __. __.', 4, '3_. __. __.');
        await dateInputPage.backspaceFromPos(inputId, '33. __. __.', 2, '3_. __. __.');
        await dateInputPage.backspaceFromPos(inputId, '3_. __. __.', 1, '');
        await dateInputPage.backspaceFromPos(inputId, '', 0, '');

        await dateInputPage.backspaceFromPos(inputId, '33. 11. 22.', 5, '33. _1. 22.');
        await dateInputPage.backspaceFromPos(inputId, '33. _1. 22.', 4, '3_. _1. 22.');
        await dateInputPage.backspaceFromPos(inputId, '3_. _1. 22.', 1, '__. _1. 22.');
        await dateInputPage.backspaceFromPos(inputId, '__. _1. 22.', 0, '__. _1. 22.');
    });

    test('ru-RU locale', async ({ dateInputPage }) => {
        await dateInputPage.selectLocale('ru-RU');

        await dateInputPage.backspaceFromPos(inputId, '22.11.3333', 10, '22.11.333_');
        await dateInputPage.backspaceFromPos(inputId, '22.11.333_', 9, '22.11.33__');
        await dateInputPage.backspaceFromPos(inputId, '22.11.33__', 8, '22.11.3___');
        await dateInputPage.backspaceFromPos(inputId, '22.11.3___', 7, '22.11.____');
        await dateInputPage.backspaceFromPos(inputId, '22.11.____', 6, '22.1_.____');
        await dateInputPage.backspaceFromPos(inputId, '22.11.____', 5, '22.1_.____');
        await dateInputPage.backspaceFromPos(inputId, '22.1_.____', 4, '22.__.____');
        await dateInputPage.backspaceFromPos(inputId, '22.__.____', 3, '2_.__.____');
        await dateInputPage.backspaceFromPos(inputId, '22.__.____', 2, '2_.__.____');
        await dateInputPage.backspaceFromPos(inputId, '2_.__.____', 1, '');
        await dateInputPage.backspaceFromPos(inputId, '', 0, '');

        await dateInputPage.backspaceFromPos(inputId, '22.11.3333', 4, '22._1.3333');
        await dateInputPage.backspaceFromPos(inputId, '22._1.3333', 3, '2_._1.3333');
        await dateInputPage.backspaceFromPos(inputId, '2_._1.3333', 1, '__._1.3333');
        await dateInputPage.backspaceFromPos(inputId, '__._1.3333', 0, '__._1.3333');
    });

    test('es-ES locale', async ({ dateInputPage }) => {
        await dateInputPage.selectLocale('es');

        await dateInputPage.backspaceFromPos(inputId, '22/11/33', 8, '22/11/3_');
        await dateInputPage.backspaceFromPos(inputId, '22/11/3_', 7, '22/11/__');
        await dateInputPage.backspaceFromPos(inputId, '22/11/__', 6, '22/1_/__');
        await dateInputPage.backspaceFromPos(inputId, '22/11/__', 5, '22/1_/__');
        await dateInputPage.backspaceFromPos(inputId, '22/1_/__', 4, '22/__/__');
        await dateInputPage.backspaceFromPos(inputId, '22/__/__', 3, '2_/__/__');
        await dateInputPage.backspaceFromPos(inputId, '22/__/__', 2, '2_/__/__');
        await dateInputPage.backspaceFromPos(inputId, '2_/__/__', 1, '');

        await dateInputPage.backspaceFromPos(inputId, '22/11/33', 4, '22/_1/33');
        await dateInputPage.backspaceFromPos(inputId, '22/_1/33', 3, '2_/_1/33');
        await dateInputPage.backspaceFromPos(inputId, '2_/_1/33', 1, '__/_1/33');
        await dateInputPage.backspaceFromPos(inputId, '__/_1/33', 0, '__/_1/33');
    });
});

test.describe('Delete key', () => {
    test('en-US locale', async ({ dateInputPage }) => {
        await dateInputPage.selectLocale('en-US');

        await dateInputPage.deleteFromPos(inputId, '11/22/33', 6, '11/22/_3');
        await dateInputPage.deleteFromPos(inputId, '11/22/33', 5, '11/22/_3');
        await dateInputPage.deleteFromPos(inputId, '11/22/33', 4, '11/2_/33');
        await dateInputPage.deleteFromPos(inputId, '11/22/33', 0, '_1/22/33');
    });

    test('ko-KR locale', async ({ dateInputPage }) => {
        await dateInputPage.selectLocale('ko-KR');

        await dateInputPage.deleteFromPos(inputId, '33. 11. 22.', 8, '33. 11. _2.');
        await dateInputPage.deleteFromPos(inputId, '33. 11. 22.', 6, '33. 11. _2.');
        await dateInputPage.deleteFromPos(inputId, '33. 11. 22.', 4, '33. _1. 22.');
        await dateInputPage.deleteFromPos(inputId, '33. 11. 22.', 0, '_3. 11. 22.');
    });

    test('ru-RU locale', async ({ dateInputPage }) => {
        await dateInputPage.selectLocale('ru-RU');

        await dateInputPage.deleteFromPos(inputId, '22.11.3333', 6, '22.11._333');
        await dateInputPage.deleteFromPos(inputId, '22.11.3333', 5, '22.11._333');
        await dateInputPage.deleteFromPos(inputId, '22.11.3333', 4, '22.1_.3333');
        await dateInputPage.deleteFromPos(inputId, '22.11.3333', 0, '_2.11.3333');
    });

    test('es-ES locale', async ({ dateInputPage }) => {
        await dateInputPage.selectLocale('es');

        await dateInputPage.deleteFromPos(inputId, '22/11/33', 6, '22/11/_3');
        await dateInputPage.deleteFromPos(inputId, '22/11/33', 5, '22/11/_3');
        await dateInputPage.deleteFromPos(inputId, '22/11/33', 4, '22/1_/33');
        await dateInputPage.deleteFromPos(inputId, '22/11/33', 0, '_2/11/33');
    });
});

test.describe('Input text inside value', () => {
    test('en-US locale', async ({ dateInputPage }) => {
        await dateInputPage.selectLocale('en-US');

        await dateInputPage.inputFromPos(inputId, '11/__/33', 3, '2', '11/2_/33');
        await dateInputPage.inputFromPos(inputId, '11/2_/33', 4, '2', '11/22/33');
        await dateInputPage.inputFromPos(inputId, '1_/__/__', 1, '/', '01/__/__');
        await dateInputPage.inputFromPos(inputId, '01/2_/__', 4, '/', '01/02/__');
        await dateInputPage.inputFromPos(inputId, '01/02/0_', 7, '/', '01/02/0_');
    });

    test('ko-KR locale', async ({ dateInputPage }) => {
        await dateInputPage.selectLocale('ko-KR');

        await dateInputPage.inputFromPos(inputId, '33. __. 22.', 2, '1', '33. 1_. 22.');
        await dateInputPage.inputFromPos(inputId, '33. __. 22.', 3, '1', '33. 1_. 22.');
        await dateInputPage.inputFromPos(inputId, '33. __. 22.', 4, '1', '33. 1_. 22.');
        await dateInputPage.inputFromPos(inputId, '33. __. 22.', 4, '7', '33. 07. 22.');
        await dateInputPage.inputFromPos(inputId, '33. 1_. 22.', 5, '1', '33. 11. 22.');
        await dateInputPage.inputFromPos(inputId, '33. 1_. __.', 5, '.', '33. 01. __.');
        await dateInputPage.inputFromPos(inputId, '33. 01. __.', 6, '.', '33. 01. __.');
        await dateInputPage.inputFromPos(inputId, '33. 01. __.', 6, ' ', '33. 01. __.');
        await dateInputPage.inputFromPos(inputId, '33. 01. __.', 7, '.', '33. 01. __.');
        await dateInputPage.inputFromPos(inputId, '33. 01. __.', 7, ' ', '33. 01. __.');
        await dateInputPage.inputFromPos(inputId, '33. 01. 2_.', 9, '.', '33. 01. 02.');
        await dateInputPage.inputFromPos(inputId, '33. 01. 2_.', 9, ' ', '33. 01. 02.');
        await dateInputPage.inputFromPos(inputId, '3_. __. __.', 1, '.', '3_. __. __.');
        await dateInputPage.inputFromPos(inputId, '3_. __. __.', 1, ' ', '3_. __. __.');
    });

    test('ru-RU locale', async ({ dateInputPage }) => {
        await dateInputPage.selectLocale('ru-RU');

        await dateInputPage.inputFromPos(inputId, '22.__.3333', 3, '1', '22.1_.3333');
        await dateInputPage.inputFromPos(inputId, '22.1_.3333', 4, '1', '22.11.3333');
        await dateInputPage.inputFromPos(inputId, '2_.__.____', 1, '.', '02.__.____');
        await dateInputPage.inputFromPos(inputId, '02.__.____', 2, '.', '02.__.____');
        await dateInputPage.inputFromPos(inputId, '02.1_.____', 4, '.', '02.01.____');
        await dateInputPage.inputFromPos(inputId, '02.01.1___', 7, '.', '02.01.1___');
    });

    test('es-ES locale', async ({ dateInputPage }) => {
        await dateInputPage.selectLocale('es');

        await dateInputPage.inputFromPos(inputId, '22/__/33', 3, '1', '22/1_/33');
        await dateInputPage.inputFromPos(inputId, '22/1_/33', 4, '1', '22/11/33');
        await dateInputPage.inputFromPos(inputId, '2_/__/__', 1, '/', '02/__/__');
        await dateInputPage.inputFromPos(inputId, '02/__/__', 2, '/', '02/__/__');
        await dateInputPage.inputFromPos(inputId, '02/1_/__', 4, '/', '02/01/__');
    });
});

test.describe('Input invalid text inside value', () => {
    test('en-US locale', async ({ dateInputPage }) => {
        await dateInputPage.selectLocale('en-US');

        await dateInputPage.inputFromPos(inputId, '11/__/33', 3, 'x', '11/__/33');
        await dateInputPage.inputFromPos(inputId, '1_/22/33', 1, '5', '1_/22/33');
    });

    test('ko-KR locale', async ({ dateInputPage }) => {
        await dateInputPage.selectLocale('ko-KR');

        await dateInputPage.inputFromPos(inputId, '33. __. 22.', 4, 'x', '33. __. 22.');
        await dateInputPage.inputFromPos(inputId, '33. 1_. 22.', 5, '5', '33. 1_. 22.');
    });

    test('ru-RU locale', async ({ dateInputPage }) => {
        await dateInputPage.selectLocale('ru-RU');

        await dateInputPage.inputFromPos(inputId, '22.__.3333', 3, 'x', '22.__.3333');
        await dateInputPage.inputFromPos(inputId, '22.1_.3333', 4, '5', '22.1_.3333');
    });

    test('es-ES locale', async ({ dateInputPage }) => {
        await dateInputPage.selectLocale('es');

        await dateInputPage.inputFromPos(inputId, '22/__/33', 3, 'x', '22/__/33');
        await dateInputPage.inputFromPos(inputId, '22/1_/33', 4, '5', '22/1_/33');
    });
});

test.describe('Input text into selection', () => {
    test('en-US locale', async ({ dateInputPage }) => {
        await dateInputPage.selectLocale('en-US');

        await dateInputPage.inputToSelection(inputId, '11/22/33', 1, 4, '1', '11/_2/33');
        await dateInputPage.inputToSelection(inputId, '11/22/33', 0, 7, '2', '02/__/_3');
    });

    test('ko-KR locale', async ({ dateInputPage }) => {
        await dateInputPage.selectLocale('ko-KR');

        await dateInputPage.inputToSelection(inputId, '33. 11. 22.', 2, 6, '1', '33. 1_. 22.');
        await dateInputPage.inputToSelection(inputId, '33. 11. 22.', 3, 6, '1', '33. 1_. 22.');
        await dateInputPage.inputToSelection(inputId, '33. 11. 22.', 4, 6, '1', '33. 1_. 22.');
        await dateInputPage.inputToSelection(inputId, '33. 11. 22.', 2, 6, '7', '33. 07. 22.');
        await dateInputPage.inputToSelection(inputId, '33. 11. 22.', 5, 9, '1', '33. 11. _2.');
        await dateInputPage.inputToSelection(inputId, '33. 11. 22.', 0, 9, '3', '3_. __. _2.');
    });

    test('ru-RU locale', async ({ dateInputPage }) => {
        await dateInputPage.selectLocale('ru-RU');

        await dateInputPage.inputToSelection(inputId, '22.11.3333', 1, 4, '2', '22._1.3333');
        await dateInputPage.inputToSelection(inputId, '22.11.3333', 0, 9, '2', '2_.__.___3');
    });

    test('es-ES locale', async ({ dateInputPage }) => {
        await dateInputPage.selectLocale('es');

        await dateInputPage.inputToSelection(inputId, '22/11/33', 1, 4, '2', '22/_1/33');
        await dateInputPage.inputToSelection(inputId, '22/11/33', 0, 7, '2', '2_/__/_3');
    });
});

test.describe('Input invalid text into selection', () => {
    test('en-US locale', async ({ dateInputPage }) => {
        await dateInputPage.selectLocale('en-US');

        await dateInputPage.inputToSelection(inputId, '11/22/33', 1, 4, 'x', '11/22/33');
        await dateInputPage.inputToSelection(inputId, '11/22/33', 1, 4, '5', '11/22/33');
    });

    test('ko-KR locale', async ({ dateInputPage }) => {
        await dateInputPage.selectLocale('ko-KR');

        await dateInputPage.inputToSelection(inputId, '33. 11. 22.', 5, 9, 'x', '33. 11. 22.');
        await dateInputPage.inputToSelection(inputId, '33. 11. 22.', 5, 9, '5', '33. 11. 22.');
    });

    test('ru-RU locale', async ({ dateInputPage }) => {
        await dateInputPage.selectLocale('ru-RU');

        await dateInputPage.inputToSelection(inputId, '22.11.3333', 1, 4, 'x', '22.11.3333');
        await dateInputPage.inputToSelection(inputId, '22.11.3333', 4, 7, '5', '22.11.3333');
    });

    test('es-ES locale', async ({ dateInputPage }) => {
        await dateInputPage.selectLocale('es');

        await dateInputPage.inputToSelection(inputId, '22/11/33', 1, 4, 'x', '22/11/33');
        await dateInputPage.inputToSelection(inputId, '22/11/33', 4, 7, '5', '22/11/33');
    });
});

test.describe('Paste text into selection', () => {
    test('en-US locale', async ({ dateInputPage }) => {
        await dateInputPage.selectLocale('en-US');

        await dateInputPage.pasteToSelection(inputId, '11/22/33', 1, 4, '1', '11/_2/33');
        await dateInputPage.pasteToSelection(inputId, '11/22/33', 0, 7, '2', '02/__/_3');
    });

    test('ko-KR locale', async ({ dateInputPage }) => {
        await dateInputPage.selectLocale('ko-KR');

        await dateInputPage.pasteToSelection(inputId, '33. 11. 22.', 2, 6, '1', '33. 1_. 22.');
        await dateInputPage.pasteToSelection(inputId, '33. 11. 22.', 3, 6, '1', '33. 1_. 22.');
        await dateInputPage.pasteToSelection(inputId, '33. 11. 22.', 4, 6, '1', '33. 1_. 22.');
        await dateInputPage.pasteToSelection(inputId, '33. 11. 22.', 2, 6, '7', '33. 07. 22.');
        await dateInputPage.pasteToSelection(inputId, '33. 11. 22.', 5, 9, '1', '33. 11. _2.');
        await dateInputPage.pasteToSelection(inputId, '33. 11. 22.', 0, 9, '3', '3_. __. _2.');
        await dateInputPage.pasteToSelection(inputId, '33. 11. 22.', 0, 10, '30. 1', '30. 1_. __.');
    });

    test('ru-RU locale', async ({ dateInputPage }) => {
        await dateInputPage.selectLocale('ru-RU');

        await dateInputPage.pasteToSelection(inputId, '22.11.3333', 1, 4, '2', '22._1.3333');
        await dateInputPage.pasteToSelection(inputId, '22.11.3333', 0, 9, '2', '2_.__.___3');
        await dateInputPage.pasteToSelection(inputId, '22.11.3333', 0, 10, '20.1', '20.1_.____');
    });

    test('es-ES locale', async ({ dateInputPage }) => {
        await dateInputPage.selectLocale('es');

        await dateInputPage.pasteToSelection(inputId, '22/11/33', 1, 4, '2', '22/_1/33');
        await dateInputPage.pasteToSelection(inputId, '22/11/33', 0, 7, '2', '2_/__/_3');
        await dateInputPage.pasteToSelection(inputId, '22/11/33', 0, 8, '201', '20/1_/__');
        await dateInputPage.pasteToSelection(inputId, '22/11/33', 0, 8, '20/1', '20/1_/__');
    });
});

test.describe('Paste invalid text into selection', () => {
    test('en-US locale', async ({ dateInputPage }) => {
        await dateInputPage.selectLocale('en-US');

        await dateInputPage.pasteToSelection(inputId, '11/22/33', 1, 4, 'x', '11/22/33');
        await dateInputPage.pasteToSelection(inputId, '11/22/33', 1, 4, '5', '11/22/33');
    });

    test('ko-KR locale', async ({ dateInputPage }) => {
        await dateInputPage.selectLocale('ko-KR');

        await dateInputPage.pasteToSelection(inputId, '33. 11. 22.', 5, 9, 'x', '33. 11. 22.');
        await dateInputPage.pasteToSelection(inputId, '33. 11. 22.', 5, 9, '5', '33. 11. 22.');
    });

    test('ru-RU locale', async ({ dateInputPage }) => {
        await dateInputPage.selectLocale('ru-RU');

        await dateInputPage.pasteToSelection(inputId, '22.11.3333', 1, 4, 'x', '22.11.3333');
        await dateInputPage.pasteToSelection(inputId, '22.11.3333', 4, 7, '5', '22.11.3333');
    });

    test('es-ES locale', async ({ dateInputPage }) => {
        await dateInputPage.selectLocale('es');

        await dateInputPage.pasteToSelection(inputId, '22/11/33', 1, 4, 'x', '22/11/33');
        await dateInputPage.pasteToSelection(inputId, '22/11/33', 4, 7, '5', '22/11/33');
    });
});

test.describe('Paste text inside value', () => {
    test('en-US locale', async ({ dateInputPage }) => {
        await dateInputPage.selectLocale('en-US');

        await dateInputPage.pasteFromPos(inputId, '11/__/33', 3, '2', '11/2_/33');
        await dateInputPage.pasteFromPos(inputId, '11/2_/33', 4, '2', '11/22/33');
    });

    test('ko-KR locale', async ({ dateInputPage }) => {
        await dateInputPage.selectLocale('ko-KR');

        await dateInputPage.pasteFromPos(inputId, '33. __. 22.', 2, '1', '33. 1_. 22.');
        await dateInputPage.pasteFromPos(inputId, '33. __. 22.', 3, '1', '33. 1_. 22.');
        await dateInputPage.pasteFromPos(inputId, '33. __. 22.', 4, '1', '33. 1_. 22.');
        await dateInputPage.pasteFromPos(inputId, '33. __. 22.', 4, '7', '33. 07. 22.');
        await dateInputPage.pasteFromPos(inputId, '3_. __. 22.', 1, '3. 1', '33. 1_. 22.');
        await dateInputPage.pasteFromPos(inputId, '33. __. 22.', 2, '. 1', '33. 1_. 22.');
        await dateInputPage.pasteFromPos(inputId, '33. __. 22.', 2, '. ', '33. __. 22.');
        await dateInputPage.pasteFromPos(inputId, '33. __. 22.', 2, ' ', '33. __. 22.');
        await dateInputPage.pasteFromPos(inputId, '33. 1_. 22.', 5, '1', '33. 11. 22.');
    });

    test('ru-RU locale', async ({ dateInputPage }) => {
        await dateInputPage.selectLocale('ru-RU');

        await dateInputPage.pasteFromPos(inputId, '22.__.3333', 3, '1', '22.1_.3333');
        await dateInputPage.pasteFromPos(inputId, '22.1_.3333', 4, '1', '22.11.3333');
    });

    test('es-ES locale', async ({ dateInputPage }) => {
        await dateInputPage.selectLocale('es');

        await dateInputPage.pasteFromPos(inputId, '22/__/33', 3, '1', '22/1_/33');
        await dateInputPage.pasteFromPos(inputId, '22/1_/33', 4, '1', '22/11/33');
    });
});

test.describe('Paste invalid text inside value', () => {
    test('en-US locale', async ({ dateInputPage }) => {
        await dateInputPage.selectLocale('en-US');

        await dateInputPage.pasteFromPos(inputId, '11/__/33', 3, 'x', '11/__/33');
        await dateInputPage.pasteFromPos(inputId, '1_/22/33', 1, '5', '1_/22/33');
    });

    test('ko-KR locale', async ({ dateInputPage }) => {
        await dateInputPage.selectLocale('ko-KR');

        await dateInputPage.pasteFromPos(inputId, '33. __. 22.', 4, 'x', '33. __. 22.');
        await dateInputPage.pasteFromPos(inputId, '33. 1_. 22.', 5, '5', '33. 1_. 22.');
    });

    test('ru-RU locale', async ({ dateInputPage }) => {
        await dateInputPage.selectLocale('ru-RU');

        await dateInputPage.pasteFromPos(inputId, '22.__.3333', 3, 'x', '22.__.3333');
        await dateInputPage.pasteFromPos(inputId, '22.1_.3333', 4, '5', '22.1_.3333');
    });

    test('es-ES locale', async ({ dateInputPage }) => {
        await dateInputPage.selectLocale('es');

        await dateInputPage.pasteFromPos(inputId, '22/__/33', 3, 'x', '22/__/33');
        await dateInputPage.pasteFromPos(inputId, '22/1_/33', 4, '5', '22/1_/33');
    });
});

test.describe('Backspace key with selection', () => {
    test('en-US locale', async ({ dateInputPage }) => {
        await dateInputPage.selectLocale('en-US');

        await dateInputPage.backspaceSelection(inputId, '11/22/33', 4, 7, '11/2_/_3');
        await dateInputPage.backspaceSelection(inputId, '11/22/33', 0, 8, '');
    });

    test('ko-KR locale', async ({ dateInputPage }) => {
        await dateInputPage.selectLocale('ko-KR');

        await dateInputPage.backspaceSelection(inputId, '33. 11. 22.', 5, 9, '33. 1_. _2.');
        await dateInputPage.backspaceSelection(inputId, '33. 11. 22.', 0, 10, '');
    });

    test('ru-RU locale', async ({ dateInputPage }) => {
        await dateInputPage.selectLocale('ru-RU');

        await dateInputPage.backspaceSelection(inputId, '22.11.3333', 4, 7, '22.1_._333');
        await dateInputPage.backspaceSelection(inputId, '22.11.3333', 0, 10, '');
    });

    test('es-ES locale', async ({ dateInputPage }) => {
        await dateInputPage.selectLocale('es');

        await dateInputPage.backspaceSelection(inputId, '22/11/33', 4, 7, '22/1_/_3');
        await dateInputPage.backspaceSelection(inputId, '22/11/33', 0, 8, '');
    });
});

test.describe('Delete key with selection', () => {
    test('en-US locale', async ({ dateInputPage }) => {
        await dateInputPage.selectLocale('en-US');

        await dateInputPage.deleteSelection(inputId, '11/22/33', 4, 7, '11/2_/_3');
        await dateInputPage.deleteSelection(inputId, '11/22/33', 0, 8, '');
    });

    test('ko-KR locale', async ({ dateInputPage }) => {
        await dateInputPage.selectLocale('ko-KR');

        await dateInputPage.deleteSelection(inputId, '33. 11. 22.', 5, 9, '33. 1_. _2.');
        await dateInputPage.deleteSelection(inputId, '33. 11. 22.', 0, 10, '');
    });

    test('ru-RU locale', async ({ dateInputPage }) => {
        await dateInputPage.selectLocale('ru-RU');

        await dateInputPage.deleteSelection(inputId, '22.11.3333', 4, 7, '22.1_._333');
        await dateInputPage.deleteSelection(inputId, '22.11.3333', 0, 10, '');
    });

    test('es-ES locale', async ({ dateInputPage }) => {
        await dateInputPage.selectLocale('es');

        await dateInputPage.deleteSelection(inputId, '22/11/33', 4, 7, '22/1_/_3');
        await dateInputPage.deleteSelection(inputId, '22/11/33', 0, 8, '');
    });
});

test.describe('Cut selection', () => {
    test('en-US locale', async ({ dateInputPage }) => {
        await dateInputPage.selectLocale('en-US');

        await dateInputPage.cutSelection(inputId, '11/22/33', 4, 7, '11/2_/_3');
        await dateInputPage.cutSelection(inputId, '11/22/33', 0, 8, '');
    });

    test('ko-KR locale', async ({ dateInputPage }) => {
        await dateInputPage.selectLocale('ko-KR');

        await dateInputPage.cutSelection(inputId, '33. 11. 22.', 5, 9, '33. 1_. _2.');
        await dateInputPage.cutSelection(inputId, '33. 11. 22.', 0, 10, '');
    });

    test('ru-RU locale', async ({ dateInputPage }) => {
        await dateInputPage.selectLocale('ru-RU');

        await dateInputPage.cutSelection(inputId, '22.11.3333', 4, 7, '22.1_._333');
        await dateInputPage.cutSelection(inputId, '22.11.3333', 0, 10, '');
    });

    test('es-ES locale', async ({ dateInputPage }) => {
        await dateInputPage.selectLocale('es');

        await dateInputPage.cutSelection(inputId, '22/11/33', 4, 7, '22/1_/_3');
        await dateInputPage.cutSelection(inputId, '22/11/33', 0, 8, '');
    });

    test('Disabled state', async ({ dateInputPage }) => {
        await dateInputPage.loadDisabled();
        await dateInputPage.onLoadDisabled();

        await dateInputPage.toggleEnable();
        await dateInputPage.toggleEnable();

        await dateInputPage.changeValue();

        await dateInputPage.toggleEnable();
    });
});
