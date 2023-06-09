import React, { useEffect, useState } from 'react';
import { SanityAssetDocument } from '@sanity/client';
import { useRouter } from 'next/router';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import axios from 'axios';

import useAuthStore from '../store/authStore';
import { client } from '../utils/client';
import { topics } from '../utils/constants';
import { BASE_URL } from '../utils';


const Upload = () => {
    const [isLoading, setisLoading] = useState(false);
    const [videoAsset, setVideoAsset] = useState<SanityAssetDocument | undefined>();
    const [wrongFileType, setWrongFileType] = useState(false);
    const [caption, setCaption] = useState('');
    const [category, setCategory] = useState(topics[0].name);
    const [savingPost, setSavingPost] = useState(false);

    const {userProfile} : {userProfile:any} = useAuthStore();

    const router = useRouter();

    const uploadVideo = async (e: any) => {
        const selectedFile = e.target.files[0];
        const fileTypes = ['video/mp4', 'video/webm', 'video/ogg'];

        if (fileTypes.includes(selectedFile.type)) {
            client.assets.upload('file', selectedFile, {
                contentType: selectedFile.type,
                filename: selectedFile.name
            })
            .then((data)=>{
                setVideoAsset(data);
                setisLoading(false);
            })
        } else {
            setisLoading(false);
            setWrongFileType(true);
        }
    }

    const handlePost = async () => {
        if(caption && videoAsset?._id && category){
            setSavingPost(true);

            const document = {
                _type: 'post',
                caption,
                video: {
                    _type: 'file',
                    asset: {
                        _type: 'reference',
                        _ref: videoAsset._id
                    }
                },
                userId: userProfile?._id,
                postedBy: {
                    _type: 'postedBy',
                    _ref: userProfile?._id
                },
                topic: category
            }

            await axios.post(`${BASE_URL}/api/post`, document);

            router.push('/');
        }
    }

   const handleDiscard = () => {
        setSavingPost(false);
        setVideoAsset(undefined);
        setCaption('');
        setCategory('');
   } 

  return (
    <div className='flex w-full h-full absolute left-0 top-[60px] lg:top-[70px] 
                    mb-10 md:pt-10 pt-1 lg:pt-20 lg:pb-20 md:pb-10 bg-[#F8F8F8] 
                    justify-center'>
        <div className='bg-white rounded-lg xl:h-[80vh] flex gap-6 flex-wrap 
                        justify-between items-center p-14 pt-6'>
            <div>
                <div>
                    <p className='text-2xl font-bold'>Upload Video</p>
                    <p className='text-md text-gray-400 mt-1'>Post a video to your account</p>
                </div>
                <div className='border-dashed rounded-xl border-4 border-gray-200 flex 
                                flex-col justify-center items-center outline-none lg:mt-10 
                                mt-5 w-[260px] h-[458px] p-10 cursor-pointer hover:border-red-300 
                                hover:bg-gray-100'>
                    {isLoading? (
                        <p className='text-center text-3xl text-red-400 font-semibold'>
                            Uploading...
                        </p>
                    ) : (
                        <div>
                            {videoAsset ? (
                                <div className=''>
                                    <video
                                        src={videoAsset.url}
                                        loop
                                        controls
                                        className='rounded-xl h-[307px] mt-15 bg-black'
                                    >
                                    </video>
                                </div>
                            ) : (
                                <label className="cursor-pointer">
                                    <div className='flex flex-col items-center justify-center h-full'>
                                        <div className='flex flex-col items-center justify-center'>
                                        <p className='font-bold text-xl'>
                                            <FaCloudUploadAlt className='text-gray-300 text-6xl' />
                                        </p>
                                        <p className='text-xl font-semibold'>
                                            Upload Video
                                        </p>
                                        </div>

                                        <p className='text-gray-400 text-center mt-10 text-sm leading-10'>
                                            MP4 or WebM or ogg <br />
                                            720x1280 resolution or higher <br />
                                            Up to 10 minutes <br />
                                            Less than 2 GB
                                        </p>
                                        <p className='rounded-lg text-center mt-10 rounded text-white text-md 
                                                      font-medium p-2 w-52 outline-none group bg-gradient-to-br 
                                                      from-purple-600 to-blue-500 dark:text-white focus:ring-4 
                                                      focus:ring-blue-300 dark:focus:ring-blue-800'>
                                            Select file
                                        </p>
                                    </div>
                                    <input 
                                        type='file'
                                        name='upload-video'
                                        onChange={uploadVideo}
                                        className='w-0 h-0'
                                    />
                                </label>
                            )}
                        </div>
                    )}
                    {wrongFileType && (
                        <p className='text-center text-xl text-red-400 font-semibold mt-4 w-[250px]'>
                            Please select a video file
                        </p>
                    )}
                </div>


            </div>
                <div className='flex flex-col pl-2 gap-3 lg:pt-16 '>
                        <label className='text-md font-medium'>
                            Caption
                        </label>
                        <input 
                            type='text'
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            className='border-2 border-gray-200 rounded p-2 outline-none text-md'    
                        />
                        <label className='text-md font-medium'>Choose a Category</label>
                        <select
                            onChange={(e) => setCategory(e.target.value)}
                            className='outline-none border-2 border-gray-200 text-md capitalize lg:p-4 p-2 rounded cursor-pointer'
                        >
                            {topics.map((topic, index) => (
                                <option 
                                    key={topic.name}
                                    className='outline-none capitalize bg-white text-gray-700 text-md p-2 hover:bg-slate-300'
                                    value={topic.name}
                                >
                                    {topic.name}
                                </option>
                            ))}
                        </select>
                        <div className='flex gap-6 mt-4 mb-16'>
                            <button
                                onClick={handleDiscard}
                                type='button'
                                className='border-gray-300 border-2 text-md font-medium p-2 rounded w-28 lg:w-44 outline-none rounded-lg'
                            >
                                Discard
                            </button>
                            <button
                                onClick={handlePost}
                                type='button'
                                className='rounded-lg text-white text-md font-medium p-2 rounded w-28 lg:w-44 outline-none group 
                                           bg-gradient-to-br from-purple-600 to-blue-500 dark:text-white focus:ring-4 focus:ring-blue-300 
                                           dark:focus:ring-blue-800'
                            >
                                Post
                            </button>
                        </div>
                </div>
        </div>
    </div>
  )
}

export default Upload