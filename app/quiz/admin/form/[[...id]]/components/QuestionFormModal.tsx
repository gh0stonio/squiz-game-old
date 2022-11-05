'use client';
import 'client-only';
import clsx from 'clsx';
import { createPortal } from 'react-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import React from 'react';
import { uid } from 'uid';

import { Question } from '~/types';

export type QuestionFormInputs = Pick<
  Question,
  'text' | 'duration' | 'maxPoints'
>;
type QuestionFormProps = {
  onClose: () => void;
  question?: Question;
};

export default function QuestionFormModal({
  onClose,
  question,
}: QuestionFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<QuestionFormInputs>({ defaultValues: { ...question } });

  const closeModal = React.useCallback(() => {
    reset();
    setIsSubmitting(false);
    onClose();
  }, [onClose, reset]);

  const onSubmit: SubmitHandler<QuestionFormInputs> = async (data) => {
    setIsSubmitting(true);
    closeModal();
  };

  return createPortal(
    <div className={'modal modal-open'}>
      <div className="modal-box">
        <h3 className="pb-4 text-lg font-bold">Add new question</h3>

        <form>
          <div className="form-control">
            <label className="label">
              <span className="label-text text-lg">Text*</span>
              {errors.text && (
                <span className="label-text-alt text-red-400">
                  This field is required
                </span>
              )}
            </label>
            <textarea
              className={clsx('textarea-bordered textarea', {
                'textarea-error': !!errors.text,
              })}
              {...register('text', { required: true })}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text text-lg">Duration*</span>
              {errors.duration && (
                <span className="label-text-alt text-red-400">
                  This field is required
                </span>
              )}
            </label>
            <input
              type="number"
              min="0"
              className={clsx('input-bordered input', {
                'input-error': !!errors.duration,
              })}
              {...register('duration', { required: true })}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text text-lg">Max points*</span>
              {errors.maxPoints && (
                <span className="label-text-alt text-red-400">
                  This field is required
                </span>
              )}
            </label>
            <input
              type="number"
              min="0"
              className={clsx('input-bordered input', {
                'input-error': !!errors.maxPoints,
              })}
              {...register('maxPoints', { required: true })}
            />
          </div>

          <div className="mt-10 flex items-center justify-between">
            <button className="btn-sm btn" onClick={closeModal}>
              Cancel
            </button>
            {isSubmitting ? (
              <button className="btn-disabled loading btn-square btn-sm btn" />
            ) : (
              <input
                type="submit"
                onClick={handleSubmit(onSubmit)}
                className="btn-accent btn-sm btn"
              />
            )}
          </div>
        </form>
      </div>
    </div>,
    document.getElementById('question-form-modal')!,
  );
}
