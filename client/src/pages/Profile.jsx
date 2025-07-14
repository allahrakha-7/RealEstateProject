import { useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';

function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  const handleFileUpload = async (file) => {
    try {
      setFileUploadError(false);
      setFilePerc(0);

      const data = new FormData();
      data.append('file', file);
      data.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
      data.append('folder', 'profile_images');

      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

      const xhr = new XMLHttpRequest();
      xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`);

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          setFilePerc(progress);
        }
      });

      // Handle success
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          const res = JSON.parse(xhr.responseText);
          if (xhr.status === 200 && res.secure_url) {
            setFormData({ ...formData, avatar: res.secure_url });
          } else {
            setFileUploadError(true);
          }
        }
      };

      xhr.send(data);
    } catch (err) {
      console.error('Image upload failed:', err);
      setFileUploadError(true);
    }
  };

  return (
    <>
      <div className='p-3 max-w-lg mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
        <form className='flex flex-col gap-4'>
          <input
            onChange={(e) => setFile(e.target.files[0])}
            type='file'
            ref={fileRef}
            hidden
            accept='image/*'
          />

          <img
            onClick={() => fileRef.current.click()}
            src={formData.avatar || currentUser.avatar}
            alt='profile'
            className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'
          />

          <p className='text-sm self-center'>
            {fileUploadError ? (
              <span className='text-red-700'>
                Error uploading image (Must be less than 2MB)
              </span>
            ) : filePerc > 0 && filePerc < 100 ? (
              <span className='text-green-700'>{`Uploading ${filePerc}%`}</span>
            ) : filePerc === 100 ? (
              <span className='text-green-700'>Image successfully uploaded!</span>
            ) : (
              ''
            )}
          </p>

          <input
            type='text'
            placeholder='username'
            id='username'
            className='border p-3 rounded-lg'
          />
          <input
            type='email'
            placeholder='email'
            id='email'
            className='border p-3 rounded-lg'
          />
          <input
            type='password'
            placeholder='password'
            id='password'
            className='border p-3 rounded-lg'
          />

          <button className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>
            Update
          </button>
        </form>
        <div className='flex justify-between mt-5'>
          <span className='text-red-700 cursor-pointer'>Delete account</span>
          <span className='text-red-700 cursor-pointer'>Sign out</span>
        </div>
      </div>
    </>
  );
}

export default Profile;
