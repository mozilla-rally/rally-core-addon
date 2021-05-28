/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import { createInputFormatters } from './formatters';

export const schema = {
    age: {
      key: "age",
      label: "1. What is your age?",
      type: "single",
      columns: true,
      values: [
        { key: "19_24", label: "19-24 years old" },
        { key: "25_34", label: "25-34 years old" },
        { key: "35_44", label: "35-44 years old" },
        { key: "45_54", label: "45-54 years old" },
        { key: "55_64", label: "55-64 years old" },
        { key: "over_65", label: "65 years and older" },
      ],
    },
    gender: {
      key: "gender",
      label: "2. What is your gender?",
      type: "single",
      columns: true,
      values: [
        { key: "male", label: "Male" },
        { key: "female", label: "Female" },
        { key: "neither", label: "Neither choice describes me" },
        { key: "decline", label: "Decline to identify" },
      ],
    },
    hispanicLatinxSpanishOrigin: {
      key: "hispanicLatinxSpanishOrigin",
      label: "3. Are you of Hispanic, Latinx, or Spanish origin?",
      type: "single",
      values: [
        { key: "other", label: "No, not of Hispanic, Latinx, or Spanish origin" },
        { key: "hispanicLatinxSpanish", label: "Yes" },
      ],
    },
    race: {
      key: "race",
      label: "4. What is your race / ethnicity?",
      type: "multi",
      columns: true,
      values: [
        {
          key: "american_indian_or_alaska_native",
          label: "American Indian or Alaska Native",
        },
        { key: "asian_indian", label: "Asian Indian" },
        {
          key: "black_or_african_american",
          label: "Black or African American",
        },
        { key: "chamorro", label: "Chamorro" },
        { key: "chinese", label: "Chinese" },
        { key: "filipino", label: "Filipino" },
        { key: "japanese", label: "Japanese" },
        { key: "korean", label: "Korean" },
        { key: "native_hawaiian", label: "Native Hawaiian" },
        { key: "samoan", label: "Samoan" },
        { key: "vietnamese", label: "Vietnamese" },
        { key: "white", label: "White" },
        { key: "other_asian", label: "Other Asian" },
        { key: "other_pacific_islander", label: "Other Pacific Islander" },
        { key: "some_other_race", label: "Some other race" },
      ],
    },

    school: {
      key: "school",
      label: "5. What is the highest level of school you have completed?",
      type: "single",
      values: [
        { key: "less_than_high_school", label: "Less than high school" },
        { key: "some_high_school", label: "Some high school" },
        {
          key: "high_school_graduate_or_equivalent",
          label: "High school graduate or equivalent (for example GED)",
        },
        {
          key: "some_college_but_no_degree_or_in_progress",
          label: "Some college, but degree not received or in progress",
        },
        {
          key: "associates_degree",
          label: "Associate's degree (for example AA, AS)",
        },
        {
          key: "bachelors_degree",
          label: "Bachelor's degree (for example BA, BS, BB)",
        },
        {
          key: "graduate_degree",
          label:
            "Graduate degree (for example master's, professional, doctorate)",
        },
      ],
    },
    income: {
      key: "income",
      label:
        "6. What is your household's combined annual income during the past 12 months?",
      sublabel: "Please provide an approximate estimate in US Dollars:",
      type: "text",
      formatter: "currency"
    },
    zipcode: {
      key: "zipcode",
      label: "7. What is your zip code?",
      type: "text",
      formatter: "zipcode"
    },
  };

export const inputFormatters = createInputFormatters(schema);
