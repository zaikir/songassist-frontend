import React from 'react';

import { languages } from 'src/shared/constants/languages';

import { Field } from 'src/components/hook-form';

export function NewProjectFormFields() {
  return (
    <>
      <Field.Text
        name="name"
        label="Name"
        placeholder="e.g. Your station name"
        slotProps={{ inputLabel: { shrink: true } }}
      />
      <Field.Autocomplete
        name="language"
        label="Language"
        options={languages}
        itemText="name"
        itemValue="code"
        selectOnFocus
        disableClearable
      />
      <Field.Text
        name="country"
        label="Country"
        placeholder="Enter your country"
        slotProps={{ inputLabel: { shrink: true } }}
      />
      <Field.Text
        name="city"
        label="City"
        placeholder="Enter your city"
        slotProps={{ inputLabel: { shrink: true } }}
      />
    </>
  );
}
