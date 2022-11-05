'use client';
import 'client-only';
import { format } from 'date-fns';
import { HiTrash, HiPencil } from 'react-icons/hi';
import React from 'react';

import { useQuiz } from '~/quiz/admin/components/QuizzesContext';
import type { Question, Quiz } from '~/types';

import QuestionFormModal from './QuestionFormModal';

interface QuestionListProps {
  quizId?: Quiz['id'];
}

export default function QuestionList({ quizId }: QuestionListProps) {
  const { quiz } = useQuiz(quizId);

  const [isFormModalOpen, setIsFormModalOpen] = React.useState(false);
  const [question, setQuestion] = React.useState<Question>();

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex w-full items-end justify-between">
        <h3 className="pb-2 text-lg font-bold">Questions</h3>

        <button
          type="button"
          className="btn-accent btn-sm btn mb-6"
          onClick={() => setIsFormModalOpen(true)}
        >
          Add Question
        </button>
      </div>

      <table className="table w-full">
        <thead>
          <tr className="h-12 [&>th]:bg-gray-200">
            <th className="w-1/12"></th>
            <th className="w-6/12">Text</th>
            <th className="w-1/12">Duration</th>
            <th className="w-1/12">Max Points</th>
            <th className="w-1/12 text-end">Created At</th>
            <th className="w-1/12 text-end">Updated At</th>
            <th className="w-1/12 text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          {quiz?.questions && quiz.questions.length > 0 ? (
            quiz.questions.map((question, index) => {
              return (
                <tr key={question.id} className="h-12">
                  <td>{index + 1}</td>
                  <td>{question.text}</td>
                  <td className="text-center">{question.duration}</td>
                  <td className="text-center">{question.maxPoints}</td>
                  <td className="text-end">
                    {format(new Date(question.createdAt), 'MM/dd/yyyy')}
                  </td>
                  <td className="text-end">
                    {question.updatedAt &&
                      format(new Date(question.updatedAt), 'MM/dd/yyyy')}
                  </td>
                  <td>
                    <div className="flex justify-end">
                      <HiPencil
                        className="h-8 w-8 cursor-pointer pl-3 text-gray-400"
                        onClick={() => {
                          setQuestion(question);
                          setIsFormModalOpen(true);
                        }}
                      />
                      <HiTrash
                        className="h-8 w-8 cursor-pointer pl-3 text-gray-400"
                        onClick={() => {
                          alert('delete me');
                        }}
                      />
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr className="h-12">
              <td colSpan={7}>
                <span className="flex w-full items-center justify-center">
                  No question yet
                </span>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {isFormModalOpen && (
        <QuestionFormModal
          question={question}
          onClose={() => {
            setIsFormModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
