import { Form, FormProps } from "app/core/components/Form"
import { LabeledBooleanField } from "app/core/components/LabeledBooleanField"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import React from "react"
import { z } from "zod"
export { FORM_ERROR } from "app/core/components/Form"

export const ERROR_STYLE = { color: "red" }
export const RE_VALID_EMAIL = /.+@.+\.[a-z]+/

export function ParticipantForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  const [isGifter, setIsGifter] = React.useState(Boolean(props.initialValues?.isGifter))
  const [email, setEmail] = React.useState(String(props.initialValues?.email || ""))
  const hasValidEmail = RE_VALID_EMAIL.test(email)

  return (
    <div>
      <Form<S> {...props}>
        <LabeledTextField name="name" label="Name" placeholder="Name" />
        <LabeledTextField
          name="email"
          label="Email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email (Optional)"
        />
        <LabeledBooleanField name="isAttending" label="I Plan to Attend" />
        <LabeledBooleanField
          name="isGifter"
          label="I Plan to Buy a Gift"
          onChange={(event) => setIsGifter(event.target.checked)}
        />
      </Form>

      {isGifter && !hasValidEmail ? (
        <div style={ERROR_STYLE}>
          <p>Note: If you register as a gifter, you must also provide a valid email address.</p>
          <p>The email entered is not valid.</p>
        </div>
      ) : null}

      {isGifter ? null : (
        <p style={ERROR_STYLE}>
          Note: If you do not register as a gifter, then you also will not be a registered gift
          recipient.
        </p>
      )}
    </div>
  )
}
