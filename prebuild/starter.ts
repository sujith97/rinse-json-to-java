/// <reference path='../typings/tsd.d.ts' />

import JavaRinseClass from './Converter';
import * as fs from 'fs-extra';
import * as q from 'q';
import * as path from 'path';
let config: Array<Config> = require('../config.json');

String.prototype.startsWith = function(searchString, position) {
    position = position || 0;
    return this.indexOf(searchString, position) === position;
};

if (config) {
    config.forEach((testProject: Config) => {
        processTests(testProject.jsonTestProps.testFileDir, testProject);
    })
}

/**
 * Process tests in a directory.
 * @param testFileDir the test file directory
 * @param testConfig the test configuration
 */
function processTests(testFileDir, testConfig: Config) {
    fs.readdir(testFileDir, (error, childFilesDirs: Array<string>) => {
        childFilesDirs.forEach((childFileDir) => {
            let childFileDirAbs = path.join(testFileDir, childFileDir);
            if (fs.lstat(childFileDirAbs, (err, stats) => {
                if (err) {
                    console.error('Unable to read status of directory ' + childFileDir + '. ' + err.stack);
                } else if (stats.isDirectory() && testConfig.jsonTestProps.excludeTestDirs.indexOf(childFileDir) === -1) {
                    processTests(childFileDirAbs, testConfig);
                } else if (childFileDir.startsWith('Test') && testConfig.jsonTestProps.excludeTestFiles.indexOf(childFileDir) === -1) {
                    processTest(childFileDir, testFileDir, testConfig);
                } else if (!childFileDir.startsWith('Test')) {
                    let dataFileSubFolderPath = (testFileDir + '/' + childFileDir).split(testConfig.jsonTestProps.testFileDir);
                    fs.readFile(testFileDir + '/' + childFileDir, function(err, data) {
                        let destFile = path.join(testConfig.javaTestProps.projectRoot, testConfig.javaTestProps.generated, dataFileSubFolderPath[1]),
                            splitDestFile = destFile.split('/'),
                            dir = splitDestFile.splice(0, splitDestFile.length - 1);

                        fs.ensureDir(dir.join('\/'), () => {
                            fs.writeFile(destFile, data, function(err: Error) {
                                if(err) {
                                    console.error('Error\n' + err)
                                }
                            });
                        });

                    });
                }
            }));
        })

    });
}

/**
 * Process the JSON rINse test.
 * @param testFile the test file.
 * @param testFilePath the test file path.
 * @param testConfig the test configuration.
 */
function processTest(testFile: string, testFilePath: string, testConfig: Config) {
    let testFileFolders = testFilePath.split(testConfig.jsonTestProps.testFileDir),
        destDir = '',
        relativeTestDir = testConfig.javaTestProps.testSubFolder;

    if (testFileFolders.length === 1) {
        relativeTestDir = path.join(relativeTestDir, testFileFolders[0]);
    } else {
        relativeTestDir = path.join(relativeTestDir, testFileFolders[1]);
    }

    destDir = path.join(testConfig.javaTestProps.projectRoot, testConfig.javaTestProps.classPath, testConfig.javaTestProps.packageRoot, relativeTestDir);

    fs.mkdirs(destDir, (err) => {
        if (err) {
            console.error('Unable to create directory ' + destDir + '. ' + err.stack);
        } else {
            let destFile = path.join(destDir, testFile.replace('.json', '.java')),
                javaFileStream = fs.createWriteStream(destFile, { encoding: 'utf8' }),
                packageRoot = testConfig.javaTestProps.packageRoot.replace(/\//g, '.'),
                relativeTestDirPackage = relativeTestDir.replace(/\//g, '.');

            let javaRinseClass = new JavaRinseClass(path.join(testFilePath, testFile), packageRoot + '.' + relativeTestDirPackage, testFile.replace('.json', ''), javaFileStream);

            javaRinseClass.execute();
        }
    })

}


interface Config {
    "jsonTestProps": {
        "testFileDir": string,
        "excludeTestDirs": Array<string>,
        "excludeTestFiles": Array<string>
    },

    "javaTestProps": {
        "projectRoot": string,
        "classPath": string,
        "testSubFolder": string,
        "packageRoot": string,
        "generated": string
    }
}