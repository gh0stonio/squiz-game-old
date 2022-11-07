'use client';
import 'client-only';
import clsx from 'clsx';
import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import React from 'react';

import useQuiz from '~/quiz/admin/hooks/useQuiz';
import { Quiz } from '~/types';

import QuestionList from './QuestionList';

type QuizFormProps = {};
type QuizFormInputs = Pick<Quiz, 'name' | 'description' | 'maxMembersPerTeam'>;

export default function QuizForm({}: QuizFormProps) {
  const { quiz, saveQuiz } = useQuiz();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<QuizFormInputs>({ defaultValues: { ...quiz } });

  const onSubmit: SubmitHandler<QuizFormInputs> = async (data) => {
    setIsSubmitting(true);

    saveQuiz(data).finally(() => {
      setIsSubmitting(false);
    });
  };

  return (
    <form className="flex flex-1 flex-col">
      <div className="flex h-full flex-col items-stretch">
        <div className="flex w-full items-center justify-between gap-4">
          <div className="form-control w-9/12">
            <label className="label">
              <span className="label-text text-lg">Label*</span>
              {errors.name && (
                <span className="label-text-alt">This field is required</span>
              )}
            </label>
            <input
              type="text"
              className={clsx('input-bordered input', {
                'input-error': !!errors.name,
              })}
              {...register('name', { required: true })}
            />
          </div>

          <div className="form-control w-3/12">
            <label className="label">
              <span className="label-text text-lg">Members per team*</span>
              {errors.maxMembersPerTeam && (
                <span className="label-text-alt">This field is required</span>
              )}
            </label>
            <input
              type="number"
              max={10}
              className={clsx('input-bordered input', {
                'input-error': !!errors.maxMembersPerTeam,
              })}
              {...register('maxMembersPerTeam', { required: true })}
            />
          </div>
        </div>

        <div>
          <div className="w-12/12 form-control pt-2">
            <label className="label">
              <span className="label-text text-lg">Description*</span>
              {errors.description && (
                <span className="label-text-alt">This field is required</span>
              )}
            </label>
            <input
              type="text"
              className={clsx('input-bordered input', {
                'input-error': !!errors.description,
              })}
              {...register('description', { required: true })}
            />
          </div>
        </div>

        <QuestionList />

        <div className="flex items-center justify-between pt-10">
          <Link href="/quiz/admin">
            <button className="btn-sm btn">Go back</button>
          </Link>
          {isSubmitting ? (
            <button className="loading btn-disabled btn-sm btn-square btn" />
          ) : (
            <button
              type="submit"
              onClick={handleSubmit(onSubmit)}
              className="btn-secondary btn-sm btn"
            >
              {quiz ? 'Update' : 'Create'}
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
