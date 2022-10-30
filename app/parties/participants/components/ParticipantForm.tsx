import { Form, FormProps } from "app/core/components/Form"
import { LabeledBooleanField } from "app/core/components/LabeledBooleanField"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { z } from "zod"
export { FORM_ERROR } from "app/core/components/Form"

export function ParticipantForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  return (
    <Form<S> {...props}>
      <LabeledTextField name="name" label="Name" placeholder="Name" />
      <LabeledTextField name="email" label="Email" placeholder="Email (Optional)" />
      <LabeledBooleanField default={true} name="isAttending" label="I Plan to Attend" />
      <LabeledBooleanField default={true} name="isGifter" label="I Plan to Buy a Gift" />
    </Form>
  )
}
