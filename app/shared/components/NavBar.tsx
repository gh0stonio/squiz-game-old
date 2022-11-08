'use client';
import 'client-only';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HiOutlineUser } from 'react-icons/hi';
import React from 'react';

import useQuiz from '~/quiz/[id]/hooks/useQuiz';
import { useAuth } from '~/shared/context/AuthContext';

import Logo from '../../../public/logo.png';

export default function NavBar() {
  const pathName = usePathname();
  const { quiz } = useQuiz();
  const { user, logOut, logIn } = useAuth();

  const isAdminPage = pathName?.startsWith('/quiz/admin');

  const subTitle = React.useMemo(() => {
    if (quiz && !isAdminPage) {
      return quiz.name;
    }

    return 'Admin';
  }, [quiz, isAdminPage]);

  const adminQuizPath = React.useMemo(() => {
    const parts = pathName?.split('/') || [];
    parts.pop();

    return parts.join('/');
  }, [pathName]);

  return (
    <div className="navbar my-10 w-11/12 rounded-xl bg-gray-100 px-4">
      <div className="navbar-start">
        <div className="flex items-center justify-center">
          <Image src={Logo} alt="logo" height={40} priority />
          <p className="pl-4 text-2xl font-semibold">
            Squiz Game {subTitle ? ` - ${subTitle}` : ''}
          </p>
        </div>
      </div>

      <div className="navbar-center lg:flex">
        <ul className="menu menu-horizontal p-0">
          <li>
            <Link
              href={
                isAdminPage
                  ? `${adminQuizPath}/lobby`
                  : `/quiz/${quiz.id}/lobby`
              }
            >
              Lobby
            </Link>
          </li>
          <li>
            <Link
              href={
                isAdminPage
                  ? `${adminQuizPath}/teams`
                  : `/quiz/${quiz.id}/teams`
              }
            >
              Teams
            </Link>
          </li>
        </ul>
      </div>

      <div className="navbar-end">
        <div className="flex-none">
          <div className="dropdown-end dropdown">
            <label tabIndex={0} className="btn-ghost btn-circle avatar btn">
              <div className="w-10 rounded-full">
                {user?.photoURL ? (
                  <Image
                    src={user.photoURL!}
                    alt="user photo"
                    width={40}
                    height={40}
                    priority
                  />
                ) : (
                  <div className="flex h-[40px] w-[40px] items-center justify-center bg-gray-200">
                    <HiOutlineUser className="h-6 w-6 text-gray-600" />
                  </div>
                )}
              </div>
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu rounded-box menu-compact mt-3 w-52 bg-gray-100 p-2 shadow"
            >
              {user ? (
                <li>
                  <button onClick={logOut}>Sign Out</button>
                </li>
              ) : (
                <li>
                  <button onClick={logIn}>Sign In</button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
