/// <reference path='../typings/tsd.d.ts' />

/**
 * Created by sbheemir on 1/12/16.
 */
import { TestScenario, JsonTestCase, Precondition, Command, Export, Validator } from './schema/Rinse';
import * as fs from 'fs-extra';
import { ImportsJava, JsonTestCaseJava, JsonTestScenarioJava,JsonTestScenarioCommandJava, JsonTestScenarioCommandValidatorJava, JsonTestScenarioCommandExportJava, List } from './JavaRinseConstructs';
import { WriteStream } from "fs-extra";

export default class JavaRinseClass {
    private static FORMAT_1:string = '\n\t';
    private static FORMAT_2:string = '\n\t\t';
    private static FORMAT_3:string = '\n\t\t\t';
    private static FORMAT_4:string = '\n\t\t\t\t';
    public static FORMAT_5:string = '\n\t\t\t\t\t';

    private static JSON_TEST_SCENARIO:string = 'testScenario';
    private static CLEANUP: string = 'cleanup';

    private packageName: string;
    private jsonFile: string;
    private javaFileStream: WriteStream;
    private imports = {};
    private javaTestContent = '';
    private metadataContent: string = '';
    private javaClassName: string;
    private static IgnoreCommands = ['exports', 'validators', 'templateid', 'templatename', 'rtfModifiers'];

    constructor(jsonFileParam: string, packageNameParam: string, javaClassNameParam: string, javaFileStreamParam: WriteStream) {
        this.jsonFile = jsonFileParam;
        this.packageName = packageNameParam;
        this.javaFileStream = javaFileStreamParam;
        this.javaClassName = javaClassNameParam;
    }

    execute() {
        fs.readJson(this.jsonFile, { encoding: 'utf8' }, (err: Error, jsonTestCase: JsonTestCase) => {
            if (err) {
                console.error('Unable to read the JSON rINse test case ' + this.jsonFile);
            } else {
                this.processJsonTestCase(jsonTestCase);
            }
        });
    }

    private processJsonTestCase(jsonTestCase: JsonTestCase) {
        for (var obj in jsonTestCase) {
            if (obj === JavaRinseClass.JSON_TEST_SCENARIO) {
                this.processTestCase(jsonTestCase.id, jsonTestCase[obj], false);
            } else if (obj === JavaRinseClass.CLEANUP) {
                this.processTestCase(jsonTestCase.id, jsonTestCase[obj], true);
            } else if (JsonTestCaseJava.hasOwnProperty(obj)) {
                this.processMetaData(JsonTestCaseJava[obj], jsonTestCase[obj]);
            } else {
                console.error('Unable to read property ' + obj + ' from test with id ' + jsonTestCase.id);
            }
        }

        this.printFile();
    }

    private processMetaData(javaConstruct: {value: string, import: Array<string>}, jsonValue: string) {
        this.metadataContent += '\n' + this.setValue(javaConstruct, jsonValue, '');
    }

    private processTestCase(testId: string, jsonTestScenarios: Array<TestScenario>, cleanUp: boolean) {
        jsonTestScenarios.forEach((jsonTestScenario) => {
            if (cleanUp) {
                this.javaTestContent += this.setValue(JsonTestScenarioJava.cleanupName, jsonTestScenario.name, JavaRinseClass.FORMAT_2);
            } else {
                this.javaTestContent += this.setValue(JsonTestScenarioJava.name, jsonTestScenario.name, JavaRinseClass.FORMAT_2);
            }
            this.javaTestContent += this.setValue(JsonTestScenarioJava.params, jsonTestScenario.params, JavaRinseClass.FORMAT_3);
            this.javaTestContent += this.assignPreCondition(JsonTestScenarioJava.precondition, jsonTestScenario.precondition, JavaRinseClass.FORMAT_3);
            this.javaTestContent += this.setValue(JsonTestScenarioJava.results, jsonTestScenario.results, JavaRinseClass.FORMAT_3);
            this.assignCommand(testId, jsonTestScenario.command, jsonTestScenario.invoke, jsonTestScenario.type);
            this.javaTestContent += ';\n';
        })
    }

    private assignCommand(testId: string, jsonTestScenarioCommands: Array<Command>, jsonTestScenarioInvoke: string, jsonTestScenarioType: string) {
        if (jsonTestScenarioCommands) {
            jsonTestScenarioCommands.forEach((jsonTestScenarioCommand) => {
                for (let jsonTestScenarioCommandKey in jsonTestScenarioCommand) {
                    let jsonTestScenarioCommandKeyLower = jsonTestScenarioCommandKey.toLowerCase();
                    if (jsonTestScenarioCommand.hasOwnProperty(jsonTestScenarioCommandKey) && JavaRinseClass.IgnoreCommands.indexOf(jsonTestScenarioCommandKeyLower) === -1) {
                        if(JsonTestScenarioCommandJava[jsonTestScenarioCommandKeyLower] === undefined) {
                            console.error('Unable to find command entry "' + jsonTestScenarioCommandKey + '" for test id: ' + testId + '\n' + JSON.stringify(jsonTestScenarioCommand) + '\n-------------------------\n');
                        } else {
                            this.javaTestContent += this.setValue(JsonTestScenarioCommandJava[jsonTestScenarioCommandKeyLower], jsonTestScenarioCommand[jsonTestScenarioCommandKey], JavaRinseClass.FORMAT_4);
                        }
                    }
                }
                this.assignExports(testId, jsonTestScenarioCommand.exports);
                this.assignValidators(testId, jsonTestScenarioCommand.validators);

                if (jsonTestScenarioType.toLowerCase() === 'template') {
                    this.javaTestContent += this.setValue(JsonTestScenarioCommandJava.templatename, jsonTestScenarioCommand.templateName, JavaRinseClass.FORMAT_4);
                    this.javaTestContent += this.setValue(JsonTestScenarioCommandJava.templateid, jsonTestScenarioCommand.templateId, JavaRinseClass.FORMAT_4);
                } else {
                    this.javaTestContent += JavaRinseClass.FORMAT_4 + JsonTestScenarioCommandJava.http.value;
                }
            });
        } else if (jsonTestScenarioInvoke) {
            this.javaTestContent += this.setValue(JsonTestScenarioJava.invoke, jsonTestScenarioInvoke, JavaRinseClass.FORMAT_3);
        } else {
            console.error('Unable to find command entry and not a library step: ' + testId + '\n-------------------------\n');
        }

    }

    private assignExports(testId: string, jsonTestScenarioExports: Array<Export>) {
        if (jsonTestScenarioExports && jsonTestScenarioExports.length > 0) {
            let exports = [];
            jsonTestScenarioExports.forEach((jsonTestScenarioExport) => {
                exports.push(JavaRinseClass.FORMAT_5 + JsonTestScenarioCommandExportJava.export.value
                    .replace('$_data', jsonTestScenarioExport.data ? '"' + this.encodeJavaString(jsonTestScenarioExport.data) + '"': null)
                    .replace('$_deafultValue', jsonTestScenarioExport.defaultvalue ? '"' + this.encodeJavaString(jsonTestScenarioExport.defaultvalue) + '"': null)
                    .replace('$_name', jsonTestScenarioExport.name ? '"' + this.encodeJavaString(jsonTestScenarioExport.name) + '"': null)
                    .replace('$_type', jsonTestScenarioExport.type ? '"' + this.encodeJavaString(jsonTestScenarioExport.type) + '"': null)
                    .replace('$_regex', jsonTestScenarioExport.regex ? '"' + this.encodeJavaString(jsonTestScenarioExport.regex) + '"': null));
            });
            this.registerImport(JsonTestScenarioCommandExportJava.export.import);
            this.javaTestContent += this.setValue(JsonTestScenarioCommandJava.exports, exports, JavaRinseClass.FORMAT_4);
        }
    }

    private assignValidators(testId: string, jsonTestScenarioValidators: Array<Validator>) {
        if (jsonTestScenarioValidators && jsonTestScenarioValidators.length > 0) {
                let expects = [];
                jsonTestScenarioValidators.forEach((jsonTestScenarioValidator) => {
                let externalFragment = null;
                if (jsonTestScenarioValidator.external && jsonTestScenarioValidator.external.length > 0) {
                    let external = '';
                    jsonTestScenarioValidator.external.forEach((jsonTestScenarioValidatorExternal) => {
                        external += JavaRinseClass.FORMAT_4 + '\n' + JsonTestScenarioCommandValidatorJava.external.value
                            .replace('$_header', jsonTestScenarioValidatorExternal.header ? '"' + this.encodeJavaString(jsonTestScenarioValidatorExternal.header) + '"' : null)
                            .replace('$_httpResponseCode', jsonTestScenarioValidatorExternal.httpResponseCode ? '"' + this.encodeJavaString(jsonTestScenarioValidatorExternal.httpResponseCode) + '"' : null)
                            .replace('$_body', jsonTestScenarioValidatorExternal.body ? '"' + this.encodeJavaString(jsonTestScenarioValidatorExternal.body) + '"' : null)
                            .replace('$_queryString', jsonTestScenarioValidatorExternal.queryString ? '"' + this.encodeJavaString(jsonTestScenarioValidatorExternal.queryString) + '"' : null)
                            .replace('$_url', jsonTestScenarioValidatorExternal.url ? '"' + this.encodeJavaString(jsonTestScenarioValidatorExternal.url) + '"' : null) + ', ';
                        this.registerImport(JsonTestScenarioCommandValidatorJava.external.import);
                    });
                    externalFragment = List.ExternalList.value.replace('$_value', external.substring(0, external.length - 2));
                }

                expects.push(JavaRinseClass.FORMAT_5 + JsonTestScenarioCommandValidatorJava.validator.value
                    .replace('$_data', jsonTestScenarioValidator.data ? '"' + this.encodeJavaString(jsonTestScenarioValidator.data) + '"': null)
                    .replace('$_expectedPattern', jsonTestScenarioValidator.expectedPattern ? '"' + this.encodeJavaString(jsonTestScenarioValidator.expectedPattern) + '"': null)
                    .replace('$_name', jsonTestScenarioValidator.name ? '"' + this.encodeJavaString(jsonTestScenarioValidator.name) + '"': null)
                    .replace('$_type', jsonTestScenarioValidator.type ? '"' + this.encodeJavaString(jsonTestScenarioValidator.type) + '"': null)
                    .replace('$_isNegative', (jsonTestScenarioValidator.negative === undefined || jsonTestScenarioValidator.negative === null)  ? null : jsonTestScenarioValidator.negative)
                    .replace('$_external', externalFragment));

            });
            this.registerImport(JsonTestScenarioCommandValidatorJava.validator.import);
            this.javaTestContent += this.setValue(JsonTestScenarioCommandJava.expects, expects, JavaRinseClass.FORMAT_4);
        }
    }

    private assignPreCondition(javaConstruct: {value: string, import: Array<string>}, jsonPrecondition: Precondition, format: string) {
        if (jsonPrecondition) {
            let actual = jsonPrecondition.actual,
                expected = jsonPrecondition.expected,
                negative = jsonPrecondition.negative;
            this.registerImport(javaConstruct.import);
            return format + javaConstruct.value
                    .replace ('$_actual', this.encodeJavaString(actual))
                    .replace ('$_expected', this.encodeJavaString(actual))
                    .replace ('$_isNegative', negative === undefined || negative === null ? null : negative);
        } else {
            return '';
        }

    }

    private printFile() {
        this.registerImport([ImportsJava.Rinse]);
        this.registerImport([ImportsJava.RinseTestBase]);

        this.javaFileStream.write('package ' + this.packageName + ';\n');

        for (let importParam in this.imports) {
            if (this.imports.hasOwnProperty(importParam)) {
                this.javaFileStream.write('\n' + this.imports[importParam]);
            }
        }

        this.javaFileStream.write('\n' + this.metadataContent);
        this.javaFileStream.write('\npublic class ' + this.javaClassName + ' extends RinseTestBase {');
        this.javaFileStream.write(JavaRinseClass.FORMAT_1 + 'public String generateTest() {');
        this.javaFileStream.write(JavaRinseClass.FORMAT_2 + 'Rinse.initialize(this);');
        this.javaFileStream.write('\n' + this.javaTestContent);
        this.javaFileStream.write(JavaRinseClass.FORMAT_2 + 'return Rinse.getTest();');
        this.javaFileStream.write(JavaRinseClass.FORMAT_1 + '}');
        this.javaFileStream.write('\n}');
        this.javaFileStream.end();
    }

    private encodeJavaString(data: string) {
        if (typeof data === 'string') {
            return data ? data.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '') : data;
        } else {
            return data;
        }
    }

    private setValue(javaConstruct: {value: string, import: Array<string>}, jsonValue: string | Array<string>, format: string) {
        let returnResponse: string = '';
        if (jsonValue || jsonValue === false) {
            if (javaConstruct && !Array.isArray(jsonValue)) {
                returnResponse = format + javaConstruct.value.replace('$_value', this.encodeJavaString(jsonValue));
            } else if (javaConstruct && Array.isArray(jsonValue)) {
                if (jsonValue.length > 0) {
                    let finalStr = '';
                    jsonValue.forEach(function(val) {
                        if (val.startsWith(JavaRinseClass.FORMAT_5 + 'RinseHelper')) {
                            finalStr += val + ', '
                        } else {
                            finalStr += '"' + val + '", '
                        }

                    });
                    returnResponse = format + javaConstruct.value.replace('$_value', finalStr.substring(0, finalStr.length - 2));
                }

            } else {
                console.error(javaConstruct);
                throw new Error('Unknown Java Construct for JSON value: ' + jsonValue);
            }
            this.registerImport(javaConstruct.import);
        }

        return returnResponse;
    }

    private registerImport(importz: Array<string>) {
        if (importz !== null) {
            importz.forEach((importVal) => {
                this.imports[importVal] = importVal;
            });
        }
    }

}