'use client';
import 'client-only';
import clsx from 'clsx';
import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import React from 'react';

import useQuiz from '~/quiz/admin/hooks/useQuiz';
import { Quiz } from '~/types';

import QuestionList from './QuestionList';

type QuizFormProps = {
  quizId?: Quiz['id'];
};
type QuizFormInputs = Pick<Quiz, 'name' | 'description'>;

export default function QuizForm({ quizId }: QuizFormProps) {
  const {
    quiz,
    saveQuiz,
    questions,
    addQuestion,
    editQuestion,
    deleteQuestion,
  } = useQuiz(quizId);
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
        <div className="flex w-full items-center justify-between gap-12">
          <div className="form-control w-full">
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

          <div className="form-control w-full">
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

        <QuestionList
          questions={questions}
          addQuestion={addQuestion}
          editQuestion={editQuestion}
          deleteQuestion={deleteQuestion}
        />

        <div className="flex items-center justify-between pt-14">
          <Link href="/quiz/admin">
            <button className="btn-sm btn">Go back</button>
          </Link>
          {isSubmitting ? (
            <button className="btn-disabled loading btn-square btn-sm btn" />
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
