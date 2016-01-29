export interface JsonTestCase {
    owner: string,
    retryTestCount: number,
    description: string,
    priority: number,
    title: string,
    datafile: string,
    tags: Array<string>,
    feature: string,
    cleanup: Array<TestScenario>,
    jiraId: string,
    scope: string,
    id: string,
    isDisabled: boolean,
    testScenario: Array<TestScenario>,
    repeatCount: number
}

export interface TestScenario {
    name: string,
    invoke: string,
    precondition: Precondition,
    params: Array<string>,
    type: string,
    results: Array<string>,
    command: Array<Command>
}

export interface Command {
    retrycount: number,
    cookie: string,
    exports: Array<Export>,
    session: string,
    validators: Array<Validator>,
    body: string,
    httpMethod: string,
    params: Array<string>,
    queryString: string,
    templateId: string,
    timeout: number,
    url: string,
    allowRedirect: boolean,
    templateName: string,
    retryms: number,
    header: string,
    rtfModifiers: Array<RTFRequestModifier>,
    httpResponseCode: string,
    repeatcount: number,
    encodeResponse: boolean,
    contentType: string
}

export interface Export {
    name: string,
    type: string,
    data: string,
    regex: string,
    defaultvalue: string,
}

export interface Validator {
    negative: boolean,
    external: Array<External>,
    data: string,
    expectedPattern: string,
    name: string,
    type: string
}

export interface External {
    header: string,
    httpResponseCode: string,
    body: string,
    queryString: string,
    url: string
}

interface RTFRequestModifier {
    type: RequestTypes,
    key: string,
    value: string
}

enum RequestTypes {
    header, uri_regex, body_regex, body_json, mapping_file, custom_first_modifier, custom_last_modifier
}

export interface Precondition {
    actual: string,
    expected: string,
    negative: boolean
}