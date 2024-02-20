import { readFileSync } from 'fs';
import { resolve } from 'path';
import shell from 'shelljs';
import * as dotenv from 'dotenv';

/* eslint-disable no-console */

dotenv.config();

const dirPath = (str) => (
    resolve(str.toString()).replace(/\\/g, '/')
);

const getPackageVersion = (fileName) => {
    const content = readFileSync(fileName);
    const json = JSON.parse(content);
    return json.version;
};

const versionFiles = [
    'package-lock.json',
    'package.json',
    'packages/react/package.json',
];

const RELEASE_BRANCH = 'release';
const MAIN_BRANCH = 'main';

if (!shell.which('git')) {
    shell.echo('Sorry, this script requires git');
    shell.exit(1);
}

const gitDir = dirPath(process.env.PROJECT_GIT_DIR);
const currentDir = dirPath(shell.pwd());

// If git directory is different from current(working) directory
// then copy files with package version updates to git directory
if (gitDir.toLowerCase() !== currentDir.toLowerCase()) {
    versionFiles.forEach((file) => {
        const source = resolve(currentDir, file);
        const dest = resolve(gitDir, file);

        shell.cp('-f', source, dest);
    });
}

const version = getPackageVersion('./packages/react/package.json');

shell.pushd('-q', gitDir);

shell.exec(`git commit -a -m "Updated version to ${version}"`);
shell.exec(`git checkout ${RELEASE_BRANCH} --`);
shell.exec(`git pull -v --no-rebase "origin/${RELEASE_BRANCH}"`);
shell.exec(`git merge --no-ff -m "Version ${version}" ${MAIN_BRANCH}`);
shell.exec(`git tag -a v.${version} -m "Version ${version}"`);
shell.exec(`git checkout ${MAIN_BRANCH} --`);

shell.popd('-q');
