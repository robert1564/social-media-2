import React, {useState, useEffect} from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {GoogleLogin, googleLogout} from '@react-oauth/google'
import { AiOutlineLogout} from 'react-icons/ai'
import {FcSearch} from 'react-icons/fc'
import { IoMdAdd } from 'react-icons/io'

import { IUser } from '../types';
import Logo from '../utils/app-logo.png'
import { createOrGetUser } from '../utils'

import userAuthStore from '../store/authStore'

const Navbar = () => {
  const {userProfile, addUser, removeUser} = userAuthStore();
  const [searchValue, setSearchValue] = useState('');

  const router = useRouter();
  
  const [user, setUser] = useState<IUser | null>();
  
  useEffect(() => {
    setUser(userProfile);
  }, [userProfile]);

  const handleSearch = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (searchValue) {
      router.push(`/search/${searchValue}`)
    }
  }
  
  return (
    <div className='w-full flex justify-between items-center border-b-2 border-gray-200 py-2 px-4'>
        <Link href="/">
            <div className='w-[100px] md:w-[130px]'>
                <Image 
                    className='cursor-pointer'
                    src={Logo}
                    alt = "VidVers"
                    layout='responsive'
                />
            </div>
        </Link>

        <div className='relative hidden md:block'>
          <form
            className='absolute md:static top-10 -left-20 bg-white '
            onSubmit={handleSearch}>
            <input 
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder='Search accounts and videos'
              className='bg-primary p-3 md:text-md font-medium border-2 border-gray-100 
                         focus:outline-none focus:border-2 focus:border-gray-300 lg:w-[300px] 
                         md:w-[300px] rounded-full md:top-0'/>
            <button
              onClick={handleSearch}
              className='absolute md:right-5 right-6 top-4 border-l-2 border-gray-300 
                         pl-4 text-2xl text-gray-400'>
              <FcSearch />
            </button>
          </form>
        </div>

        <div>
          {user ? (
            <div className='flex gap-5 md:gap-10'>
              <Link href="/upload">
                <button className='border-2 px-2 md:px-4 text-md font-semibold flex 
                                   items-center gap-2 rounded-lg group bg-gradient-to-br 
                                   from-purple-600 to-blue-500 dark:text-white focus:ring-4 
                                   focus:ring-blue-300 dark:focus:ring-blue-800'>
                  <IoMdAdd className='text-xl'/> {` `}
                  <span className='hidden md:block'>Upload</span>
                </button>
              </Link>
              {user.image && (
                <Link href="/">
                <div>
                  <Image
                    className='rounded-full cursor-pointer'
                    src={user.image}
                    alt='user'
                    width={40}
                    height={40}
                  />
                </div>
              </Link>
              )}
              <button
                type='button'
                className=' border-2 p-2 rounded-full cursor-pointer outline-none shadow-md'
                onClick={() => {
                  googleLogout();
                  removeUser();
                }}>
                <AiOutlineLogout color='red' fontSize={21} />
              </button>
            </div>
          ) : (
            <GoogleLogin 
              onSuccess={(response) => createOrGetUser(response, addUser)}
              onError={() => console.log('Login Failed')}
              />
          )}
        </div>
    </div>
  )
}

export default Navbar