import 'server-only';

import CurrentQuestion from './components/CurrentQuestion';
import Header from './components/Header';
import NextQuestion from './components/NextQuestion';

export default async function AdminQuizPlayPage() {
  // see current question
  // -> allow to push to players
  // -> during see timer
  // -> when over see answers from teams
  // -> validation phase for all teams
  //   -> see team answer
  //   -> set score (slider from 0 to max point)
  //   -> submit -> send data to DD

  // see next question
  // -> preview it?
  // -> go next (only of score validated)

  return (
    <div className="flex h-full w-full flex-col p-10">
      <div className="flex w-full items-center justify-between pt-2 pb-6">
        <Header />
      </div>

      <div className="flex h-full w-full flex-1 flex-col">
        <div className="flex-1">
          <CurrentQuestion />
        </div>

        <NextQuestion />
      </div>
    </div>
  );
}
