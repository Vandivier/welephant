import { Form, FormProps } from "app/core/components/Form"
import LabeledBooleanField from "app/core/components/LabeledBooleanField"
import LabeledDateField from "app/core/components/LabeledDateField"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import LabeledTimeField from "app/core/components/LabeledTimeField"
import { z } from "zod"

export { FORM_ERROR } from "app/core/components/Form"

export function PartyForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  return (
    <Form<S> {...props}>
      <LabeledTextField name="name" label="Name" placeholder="Name" />
      <LabeledDateField name="eventDate" label="Event Date" />
      <LabeledTimeField name="eventTime" label="Event Time" />
      <LabeledTextField name="location" label="Location" placeholder="USA" />

      <LabeledBooleanField name="hasGiftAssignments" label="Has Gift Assignments" />
      <LabeledBooleanField name="hasGiftStealing" label="Has Gift Stealing" />
      <LabeledTextField name="notes" label="Notes" placeholder="Notes" />
    </Form>
  )
}
