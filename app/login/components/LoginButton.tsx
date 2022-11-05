'use client';
import 'client-only';
import { FcGoogle } from 'react-icons/fc';
import React from 'react';

import { useAuth } from '~/shared/context/AuthContext';

export default function LoginButton() {
  const auth = useAuth();

  const [error, setError] = React.useState<Error>();

  const logIn = React.useCallback(() => {
    auth.logIn().catch((e) => setError(e));
  }, [auth]);

  return (
    <>
      <button
        onClick={logIn}
        className="group h-12 rounded-full border-2 border-gray-300 px-6 transition duration-300 
hover:border-pink-500"
      >
        <div className="relative flex items-center justify-center space-x-4">
          <FcGoogle className="absolute left-0 h-6 w-6" />
          <span className="block w-max text-sm font-semibold tracking-wide text-gray-700 transition duration-300 group-hover:text-pink-600 sm:text-base">
            Continue with Google
          </span>
        </div>
      </button>
      {error && (
        <p className=" text-red-600">
          {error.message === 'Not a pup'
            ? 'Sorry but only Datadog pups can join, retry with the proper Gmail account.'
            : 'Sorry something wrong happened during auth, please retry.'}
        </p>
      )}
    </>
  );
}
