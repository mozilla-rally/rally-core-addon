# Data Documentation
This describes the data being collected and sent by the Core Add-on out of the box.
This add-on will send a [`pioneer-study` pings](https://firefox-source-docs.mozilla.org/toolkit/components/telemetry/data/pioneer-study.html) with a different encrypted payload using the Ion platform, through Firefox, in different circumstances:

- when [joining the platform](#joining-the-platform-pioneer-enrollment);
- when [joining a study](#joining-a-study-pioneer-enrollment);
- when filling the [demographics survey](#filling-the-demographic-survey-demographic-survey);
- when [leaving a study](#leaving-a-study-deletion-request).
- when [leaving the platform](#leaving-the-platform);

## Joining the platform: `pioneer-enrollment`
A [`pioneer-study` ping](https://firefox-source-docs.mozilla.org/toolkit/components/telemetry/data/pioneer-study.html) with [an empty `encryptedData` field](https://github.com/mozilla-services/mozilla-pipeline-schemas/blob/master/templates/include/pioneer-study/pioneer-enrollment.1.schema.json) is sent when user joins the platform.

```json
  "payload": {
    "encryptedData": "<encrypted token>",
    "schemaVersion": 1,
    "schemaName": "pioneer-enrollment",
    "schemaNamespace": "pioneer-core",
    "encryptionKeyId": "core",
    "pioneerId": "<UUID>",
    "studyName": "pioneer-core"
  }
```

## Joining a study: `pioneer-enrollment`
After a user joins the platform, studies can be joined, too. A [`pioneer-study` ping](https://firefox-source-docs.mozilla.org/toolkit/components/telemetry/data/pioneer-study.html) with [an empty `encryptedData` field](https://github.com/mozilla-services/mozilla-pipeline-schemas/blob/master/templates/include/pioneer-study/pioneer-enrollment.1.schema.json) is sent when user clicks the Join button for a study and accepts the study policy.

```json
  "payload": {
    "encryptedData": "<encrypted token>",
    "schemaVersion": 1,
    "schemaName": "pioneer-enrollment",
    "schemaNamespace": "<study-id>",
    "encryptionKeyId": "discarded",
    "pioneerId": "<UUID>",
    "studyName": "<study-id>"
  }
```

> **Important:** the `payload.encryptionKeyId` is set to `discarded` because the `payload.encryptedData` is an empty object, but still encrypted.

## Filling the demographic survey: `demographic-survey`
After a user joins the platform they are asked to fill a demographic survey, in order to help researchers parse the data. The survey is optional and can be partially filled. A [`pioneer-study` ping](https://firefox-source-docs.mozilla.org/toolkit/components/telemetry/data/pioneer-study.html) with [the `survey` payload](https://github.com/mozilla-services/mozilla-pipeline-schemas/blob/master/templates/include/pioneer-study/survey.1.schema.json) is sent when user submits the survey.

This is an example of the data that will be sent in the `encryptedData` field:

```json
{
  "age": {
    "19_24": true
  },
  "gender": {
    "decline": true
  },
  "origin": {
    "other": true
  },
  "races": {
    "japanese": true,
    "filipino": true
  },
  "education": {
    "lessThanHighSchool": true
  },
  "income": {
    "0_24999": true
  },
  "zipCode": "00123"
}
```

All the sections in this encrypted payload are optional and some of them can contain multiple values, as described below.

- `age`: the age-group of the user.
- `gender`: the gender of the user.
- `origin`: whether or not user is of Hispanic, Latino, Spanish or other origin (if `hispanicLatinoSpanish` is `true`); if `other` in this section is `true`, then user is neither of Hispanic, Latino or Spanish origins.
- `race`: the races user identifies with; this can contain multiple entries.
- `education`: the user education level.
- `income`: the income-group of the user.
- `zipCode`: the user's zip code.

> **Important:** this payload uses the `core` value for `payload.encryptionKeyId`, since these pings are routed to the `pioneer-core` environment.

## Leaving a study: `deletion-request`
When user leaves a study, a [`pioneer-study` ping](https://firefox-source-docs.mozilla.org/toolkit/components/telemetry/data/pioneer-study.html) with [an empty `encryptedData` field](https://github.com/mozilla-services/mozilla-pipeline-schemas/blob/master/templates/include/pioneer-study/deletion-request.1.schema.json) is sent.

```json
  "payload": {
    "encryptedData": "<encrypted token>",
    "schemaVersion": 1,
    "schemaName": "deletion-request",
    "schemaNamespace": "<study-id>",
    "encryptionKeyId": "discarded",
    "pioneerId": "<UUID>",
    "studyName": "<study-id>"
  }
```

> **Important:** the `payload.encryptionKeyId` is set to `discarded` because the `payload.encryptedData` is an empty object, but still encrypted.

## Leaving the platform
When user choses to leave the platform by clicking on the related button in the Core Add-on options page, a [`deletion-request`](#leaving-a-study-deletion-request) is sent for each study user ever joined.
