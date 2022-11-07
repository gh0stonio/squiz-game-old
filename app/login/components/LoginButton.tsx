'use client';
import 'client-only';
import { useRouter, useSearchParams } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';
import { ThreeDots } from 'react-loader-spinner';
import React from 'react';

import { useAuth } from '~/shared/context/AuthContext';

export default function LoginButton() {
  const auth = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const referer = params.get('referer');

  const [error, setError] = React.useState<Error>();

  const logIn = React.useCallback(() => {
    auth.logIn().catch((e) => setError(e));
  }, [auth]);

  if (auth.user && referer) {
    router.push(referer);
  }

  return (
    <>
      {auth.user && referer !== '/quiz/admin' ? (
        <div className="flex w-full items-center justify-center">
          <ThreeDots
            height="40"
            width="40"
            radius="9"
            color="rgb(236 72 153)"
            ariaLabel="three-dots-loading"
            visible={true}
          />
        </div>
      ) : (
        <button
          onClick={logIn}
          className="group loading h-12 rounded-full border-2 border-gray-300 px-6 
transition duration-300 hover:border-pink-500"
        >
          <div className="relative flex items-center justify-center space-x-4">
            <FcGoogle className="absolute left-0 h-6 w-6" />
            <span className="block w-max text-sm font-semibold tracking-wide text-gray-700 transition duration-300 group-hover:text-pink-600 sm:text-base">
              Continue with Google
            </span>
          </div>
        </button>
      )}
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
