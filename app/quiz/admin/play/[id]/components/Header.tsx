'use client';
import 'client-only';
import clsx from 'clsx';
import Link from 'next/link';

import useQuiz from '~/quiz/admin/hooks/useQuiz';

export default function Header() {
  const { quiz, start, reset, end } = useQuiz();

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center justify-center gap-8">
        <p className="text-2xl font-bold">Playing &quot;{quiz?.name}&quot;</p>
        <Link href="/quiz/admin">
          <button className="btn-sm btn">Go back</button>
        </Link>
      </div>

      <div className="flex gap-3">
        <button
          onClick={start}
          className={clsx('btn-success btn-sm btn', {
            'btn-disabled': quiz?.status !== 'ready',
          })}
        >
          Start
        </button>
        <button
          onClick={reset}
          className={clsx('btn-warning btn-sm btn', {
            'btn-disabled': quiz?.status === 'ready',
          })}
        >
          Reset
        </button>
        <button
          onClick={end}
          className={clsx('btn-error btn-sm btn', {
            'btn-disabled': quiz?.status !== 'in progress',
          })}
        >
          End
        </button>
      </div>
    </div>
  );
}
