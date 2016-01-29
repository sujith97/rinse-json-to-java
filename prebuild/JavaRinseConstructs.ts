/**
 * Created by sbheemir on 1/14/16.
 */

export let ImportsJava = {
    Rinse: 'import com.linkedin.library.Rinse;',
    RinseBuilder: 'import com.linkedin.library.RinseBuilder;',
    RinseTestBase: 'import com.linkedin.library.RinseTestBase;',
    RinseHelper: 'import com.linkedin.library.RinseHelper;',
    annotations: 'import com.linkedin.library.annotations.*;',
    Arrays: 'import java.util.Arrays;',
    ArrayList: 'import java.util.ArrayList;',
    External: 'import com.linkedin.restrunner.jsonmodel.External;'
}

export let JsonTestCaseJava = {
    retryTestCount: { value: '@RinseMetaDataRetryTestCount($_value)', import: [ImportsJava.annotations]},
    description: { value: '@RinseMetaDataDescription("$_value")', import: [ImportsJava.annotations]},
    priority: { value: '@RinseMetaDataPriority($_value)', import: [ImportsJava.annotations]},
    title: { value: '@RinseMetaDataTitle("$_value")', import: [ImportsJava.annotations]},
    datafile: { value: '@RinseMetaDataDataFile("$_value")', import: [ImportsJava.annotations]},
    tags: { value: '@RinseMetaDataTags(tags = { $_value })', import: [ImportsJava.annotations]},
    feature: { value: '@RinseMetaDataFeature("$_value")', import: [ImportsJava.annotations]},
    jiraId: { value: '@RinseMetaDataJiraId("$_value")', import: [ImportsJava.annotations]},
    scope: { value: '@RinseMetaDataScope("$_value")', import: [ImportsJava.annotations]},
    id: { value: '@RinseMetaDataId("$_value")', import: [ImportsJava.annotations]},
    isDisabled: { value: '@RinseMetaDataIsDisabled(isDisabled = $_value)', import: [ImportsJava.annotations]},
    owner: { value: '@RinseMetaDataOwner("$_value")', import: [ImportsJava.annotations]},
    repeatCount: { value: '@RinseMetaDataRepeatCount($_value)', import: [ImportsJava.annotations]}
}

export let JsonTestScenarioJava = {
    name: { value: 'RinseBuilder.withName("$_value")', import: [ImportsJava.RinseBuilder] },
    cleanupName: { value: 'RinseBuilder.cleanup().name("$_value")', import: [ImportsJava.RinseBuilder] },
    invoke: { value: '.invoke("$_value")', import: [] },
    precondition: { value: '.precondition(RinseHelper.precondition("$_actual", "$_expected", $_isNegative))', import: [ImportsJava.RinseHelper] },
    params: { value: '.params(new ArrayList<String>(Arrays.asList($_value)))', import: [ImportsJava.Arrays, ImportsJava.ArrayList] },
    results: { value: '.results(new ArrayList<String>(Arrays.asList($_value)))', import: [ImportsJava.Arrays, ImportsJava.ArrayList] }
}

export let JsonTestScenarioCommandJava ={
    retrycount: { value: '.retryCount($_value)', import: [] },
    cookie: { value: '.cookies("$_value")', import: [] },
    session: { value: '.session("$_value")', import: [] },
    body: { value: '.body("$_value")', import: [] },
    httpmethod: { value: '.method("$_value")', import: [] },
    params: JsonTestScenarioJava.params,
    querystring: { value: '.queryString("$_value")', import: [] },
    timeout: { value: '.queryString($_value)', import: [] },
    url: { value: '.forUrl("$_value")', import: [] },
    allowredirect: { value: '.allowRedirect($_value)', import: [] },
    retryms: { value: '.retryInterval($_value)', import: [] },
    header: { value: '.headers("$_value")', import: [] },
    httpresponsecode: { value: '.expectedCode("$_value")', import: [] },
    repeatcount: { value: '.repeatCount($_value)', import: [] },
    encoderesponse: { value: '.encodeResponse($_value)', import: [] },
    contenttype: { value: '.contentType("$_value")', import: [] },
    templateid: { value: '.template("$_value")', import: [] },
    templatename: { value: '.templateName("$_value")', import: [] },
    http: { value: '.http()', import: [] },
    expects: { value: '.expects($_value\n\t\t\t\t)', import: [] },
    exports: { value: '.exports($_value\n\t\t\t\t)', import: [] },
}

export let List = {
    ExternalList: { value: 'new ArrayList<External>(Arrays.asList($_value)))', import: [ImportsJava.External] }
}

export let JsonTestScenarioCommandValidatorJava = {
    validator: { value: 'RinseHelper.validator($_data, $_expectedPattern, $_name, $_type, $_isNegative, $_external)', import: [ImportsJava.RinseHelper] },
    external: { value: 'RinseHelper.external($_header, $_httpResponseCode, $_body, $_queryString, $_url)', import: [ImportsJava.RinseHelper] }
}

export let JsonTestScenarioCommandExportJava = {
    export: { value: 'RinseHelper.export($_data, $_deafultValue, $_name, $_type, $_regex)', import: [ImportsJava.RinseHelper] }
}
