'use client';
import 'client-only';
import { format } from 'date-fns';
import { HiTrash, HiPencil } from 'react-icons/hi';
import React from 'react';

import type { Question } from '~/types';

import QuestionFormModal from './QuestionFormModal';

interface QuestionListProps {
  questions: Question[];
  addQuestion: (question: Question) => void;
  editQuestion: (question: Question) => void;
  deleteQuestion: (question: Question) => void;
}

export default function QuestionList({
  questions,
  addQuestion,
  editQuestion,
  deleteQuestion,
}: QuestionListProps) {
  const [isFormModalOpen, setIsFormModalOpen] = React.useState(false);
  const [question, setQuestion] = React.useState<Question>();

  return (
    <div className="relative h-full w-full">
      <div className="absolute top-0 left-0 right-0 bottom-0 flex h-full w-full flex-col pt-8">
        <div className="flex w-full items-center justify-between">
          <h3 className="pb-2 text-lg font-bold">Questions</h3>

          <button
            type="button"
            className="btn-accent btn-sm btn mb-6"
            onClick={() => setIsFormModalOpen(true)}
          >
            Add Question
          </button>
        </div>

        <div className="overflow-auto rounded-lg">
          <table className="table h-full w-full">
            <thead className="sticky top-0">
              <tr className="h-12 [&>th]:bg-gray-200">
                <th className="w-7/12">Text</th>
                <th className="w-1/12">Duration</th>
                <th className="w-1/12">Max Points</th>
                <th className="w-1/12 text-end">Created At</th>
                <th className="w-1/12 text-end">Updated At</th>
                <th className="w-1/12 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {questions.length > 0 ? (
                questions.map((question) => {
                  return (
                    <tr key={question.id} className="h-12">
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
                              deleteQuestion(question);
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
        </div>
      </div>

      {isFormModalOpen && (
        <QuestionFormModal
          question={question}
          onClose={(updatedQuestion) => {
            if (updatedQuestion) {
              question
                ? editQuestion(updatedQuestion)
                : addQuestion(updatedQuestion);
            }

            setIsFormModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
