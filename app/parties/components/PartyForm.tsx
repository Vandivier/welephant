import { Form, FormProps } from "app/core/components/Form"
import LabeledBooleanField from "app/core/components/LabeledBooleanField"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { z } from "zod"
export { FORM_ERROR } from "app/core/components/Form"

export function PartyForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  return (
    <Form<S> {...props}>
      <LabeledTextField name="name" label="Name" placeholder="Name" />

      <LabeledBooleanField name="hasGiftAssignments" label="Has Gift Assignments" default={true} />
      <LabeledBooleanField name="hasGiftStealing" label="Has Gift Stealing" />
      <LabeledTextField name="notes" label="Notes" placeholder="Notes" />
    </Form>
  )
}
