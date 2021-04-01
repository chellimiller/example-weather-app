import React from 'react';

export enum FormInputType {
  TEXT = 'text',
  SEARCH = 'search',
  NUMBER = 'number',
  CHECKBOX = 'checkbox',
}

type BaseFormInput<T extends FormInputType, V> = {
  type: T;
  defaultValue: V;
  label?: string;
  placeholder?: string;
  className?: string;
}

type TextInput = BaseFormInput<FormInputType.TEXT, string>;
type SearchInput = BaseFormInput<FormInputType.SEARCH, string>;
type NumberInput = BaseFormInput<FormInputType.NUMBER, number>;
type CheckboxInput = BaseFormInput<FormInputType.CHECKBOX, boolean>;

export type FormInput = TextInput | SearchInput | NumberInput | CheckboxInput;

export type FormInputMap = Record<string, FormInput>;

export type FormObject<T extends FormInputMap> = {
  [K in keyof T]:
  T[K] extends TextInput | SearchInput ? string :
  T[K] extends NumberInput ? number :
  T[K] extends CheckboxInput ? boolean :
  never;
}

export type FormConfig<T extends FormInputMap, U> = {
  order: Array<keyof T>;
  inputs: T;
  mapFormObject: (value: FormObject<T>) => U;
}

type NativeFormProps = React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;

export type FormProps<U> = Omit<NativeFormProps, 'onSubmit'> & {
  onSubmit?: (event: React.FormEvent<HTMLFormElement>, value: U) => void;
}

export default function createForm<T extends FormInputMap, U>(config: FormConfig<T, U>): React.FC<FormProps<U>> {
  // @todo #6 Fix ts-ignore
  // @ts-ignore
  return (props: FormProps<T>) => {
    const { onSubmit, ...nativeProps } = props;
    const doSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {

      const formData = new FormData(event.currentTarget);
      const formObject: FormObject<T> = {} as any;

      Object.keys(config.inputs).forEach((inputName: keyof T) => {
        // @todo #6 Fix ts-ignore
        // @ts-ignore
        formObject[inputName] = formData.get(inputName);
      })

      // @todo #6 Fix ts-ignore
      // @ts-ignore
      if (onSubmit) onSubmit(event, config.mapFormObject(formObject));

      event.preventDefault();
    }

    return (
      <form {...nativeProps} onSubmit={doSubmit}>
        {
          // @todo #6 This can be moved out so it's not recalculated
          // @todo #6 Fix casting
          config.order.map(key => {
            const inputProps = config.inputs[key] as any;
            const name = `${key}`;
            const className = ['input', `input-${inputProps.type}`, inputProps.className || ''].join(' ');

            return (<input {...inputProps} key={name} name={name} className={className} />)
          })
        }
      </form>
    )
  }
}