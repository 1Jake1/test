'use client';

import * as LabelPrimitive from '@radix-ui/react-label';
import { Slot } from '@radix-ui/react-slot';
import * as React from 'react';
import {
	Controller,
	FormProvider,
	useFormContext,
	useFormState,
	type ControllerProps,
	type FieldPath,
	type FieldValues,
} from 'react-hook-form';

import { Label } from '../../components/ui/label';
import { useAppDispatch, useAppSelector } from '../../lib/store/hooks';
import { registerFormItem, unregisterFormItem } from '../../lib/store/formSlice';
import { makeSelectFormItemMeta } from '../../lib/store/selectors';
import { cn } from '../../lib/utils';

const Form = FormProvider;

const FormField = <
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
	...props
}: ControllerProps<TFieldValues, TName>) => {
	return <Controller {...props} />;
};

const useFormField = (name: string) => {
	if (!name) {
		throw new Error('useFormField requires a non-empty field name.');
	}

	const selector = React.useMemo(
		() => makeSelectFormItemMeta(name),
		[name]
	);
	const meta = useAppSelector(selector);
	const fallbackId = React.useId();
	const baseId = meta?.id ?? fallbackId;

	const { getFieldState } = useFormContext();
	const formState = useFormState({ name });
	const fieldState = getFieldState(name, formState);

	return {
		id: baseId,
		name,
		formItemId: `${baseId}-form-item`,
		formDescriptionId: `${baseId}-form-item-description`,
		formMessageId: `${baseId}-form-item-message`,
		...fieldState,
	};
};

type FormItemProps = React.ComponentProps<'div'> & {
	name: string;
};

function FormItem({ name, className, ...props }: FormItemProps) {
	const dispatch = useAppDispatch();
	const id = React.useId();

	React.useEffect(() => {
		dispatch(registerFormItem({ name, id }));
		return () => {
			dispatch(unregisterFormItem({ name }));
		};
	}, [dispatch, name, id]);

	return (
		<div
			data-slot='form-item'
			data-form-item-name={name}
			className={cn('grid gap-2', className)}
			{...props}
		/>
	);
}

function FormLabel({
	name,
	className,
	...props
}: React.ComponentProps<typeof LabelPrimitive.Root> & { name: string }) {
	const { error, formItemId } = useFormField(name);

	return (
		<Label
			data-slot='form-label'
			data-error={!!error}
			className={cn('data-[error=true]:text-destructive', className)}
			htmlFor={formItemId}
			{...props}
		/>
	);
}

function FormControl({
	name,
	...props
}: React.ComponentProps<typeof Slot> & { name: string }) {
	const { error, formItemId, formDescriptionId, formMessageId } =
		useFormField(name);

	return (
		<Slot
			data-slot='form-control'
			id={formItemId}
			aria-describedby={
				!error
					? `${formDescriptionId}`
					: `${formDescriptionId} ${formMessageId}`
			}
			aria-invalid={!!error}
			{...props}
		/>
	);
}

function FormDescription({
	name,
	className,
	...props
}: React.ComponentProps<'p'> & { name: string }) {
	const { formDescriptionId } = useFormField(name);

	return (
		<p
			data-slot='form-description'
			id={formDescriptionId}
			className={cn('text-muted-foreground text-sm', className)}
			{...props}
		/>
	);
}

function FormMessage({
	name,
	className,
	...props
}: React.ComponentProps<'p'> & { name: string }) {
	const { error, formMessageId } = useFormField(name);
	const body = error ? String(error?.message ?? '') : props.children;

	if (!body) {
		return null;
	}

	return (
		<p
			data-slot='form-message'
			id={formMessageId}
			className={cn('text-destructive text-sm', className)}
			{...props}
		>
			{body}
		</p>
	);
}

export {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	useFormField,
};
