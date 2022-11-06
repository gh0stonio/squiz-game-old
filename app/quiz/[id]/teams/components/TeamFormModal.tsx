'use client';
import 'client-only';
import clsx from 'clsx';
import { createPortal } from 'react-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import React from 'react';
import { uid } from 'uid';

import useQuiz from '~/quiz/[id]/hooks/useQuiz';
import type { Team } from '~/types';

export type TeamFormInputs = Pick<Team, 'name'>;
type TeamFormProps = {
  onClose: (question?: Team) => void;
  team?: Team;
};

export default function TeamFormModal({ onClose, team }: TeamFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { createTeam } = useQuiz();

  const isEdit = !!team;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TeamFormInputs>({ defaultValues: { ...team } });

  const closeModal = React.useCallback(() => {
    reset();
    setIsSubmitting(false);
    onClose();
  }, [onClose, reset]);

  const onSubmit: SubmitHandler<TeamFormInputs> = async (data) => {
    setIsSubmitting(true);

    createTeam(data.name)?.then(() => {
      reset();
      closeModal();
    });
  };

  return createPortal(
    <div className={'modal modal-open'}>
      <div className="modal-box">
        <h3 className="pb-4 text-lg font-bold">Create new team</h3>

        <form>
          <div className="form-control">
            <label className="label">
              <span className="label-text text-lg">Name*</span>
              {errors.name && (
                <span className="label-text-alt text-red-400">
                  This field is required
                </span>
              )}
            </label>
            <input
              className={clsx('input-bordered input', {
                'input-error': !!errors.name,
              })}
              {...register('name', { required: true })}
            />
          </div>

          <div className="mt-10 flex items-center justify-between">
            <button className="btn-sm btn" onClick={() => closeModal()}>
              Cancel
            </button>
            {isSubmitting ? (
              <button className="btn-disabled loading btn-sm btn-square btn" />
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
    document.getElementById('team-form-modal')!,
  );
}
