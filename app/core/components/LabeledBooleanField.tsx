import { forwardRef, PropsWithoutRef, ComponentPropsWithoutRef } from "react"
import { useFormContext } from "react-hook-form"

export interface LabeledBooleanFieldProps extends PropsWithoutRef<JSX.IntrinsicElements["input"]> {
  name: string
  label: string
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
  labelProps?: ComponentPropsWithoutRef<"label">
}

export const LabeledBooleanField = forwardRef<HTMLInputElement, LabeledBooleanFieldProps>(
  ({ label, outerProps, labelProps, name, ...props }, ref) => {
    const {
      register,
      formState: { isSubmitting, errors },
    } = useFormContext()

    // TODO: we shouldn't anytype this error
    const error = Array.isArray(errors && errors[name])
      ? (errors as any)[name].join(", ")
      : errors[name]?.message || errors[name]

    return (
      <div {...outerProps}>
        <label {...labelProps}>
          {label}
          <input disabled={isSubmitting} {...register(name)} {...props} type="checkbox" />
        </label>

        {error && (
          <div role="alert" style={{ color: "red" }}>
            {error}
          </div>
        )}

        <style jsx>{`
          label {
            display: flex;
            flex-direction: column;
            align-items: start;
            font-size: 1rem;
          }
          input {
            padding: 0.25rem 0.5rem;
            border-radius: 3px;
            border: 1px solid purple;
            margin-top: 0.5rem;
          }
        `}</style>
      </div>
    )
  }
)

export default LabeledBooleanField
