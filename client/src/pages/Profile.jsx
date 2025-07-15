import { useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import { updateUserStart, updateUserSuccess, updateUserFailure } from '../redux/user/userSlice.js';
import { useDispatch } from 'react-redux';

function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [formData, setFormData] = useState({
  username: currentUser.username,
  email: currentUser.email,
  avatar: currentUser.avatar,
  });
  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      if (file.size > 2 * 1024 * 1024) {

        setFileUploadError(true);
        setFilePerc(0);
        return;
      }
      handleFileUpload(file);
    }
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

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          const res = JSON.parse(xhr.responseText);
          if (xhr.status === 200 && res.secure_url) {
            setFormData((prev) => ({ ...prev, avatar: res.secure_url }));
            console.log();
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

  const handleChange = (e) => {
    setFormData((formData) => ({ ...formData, [e.target.id]: e.target.value }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  return (
    <>
      <div className='p-3 max-w-lg mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <input
            onChange={(e) => setFile(e.target.files[0])}
            type='file'
            ref={fileRef}
            hidden
            accept='image/*'
          />

          <img
            onClick={() => fileRef.current.click()}
            alt='profile'
            src={formData.avatar || currentUser.avatar}
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
            defaultValue={currentUser.username}
            id='username'
            className='border p-3 rounded-lg'
            onChange={handleChange}
          />
          <input
            type='email'
            placeholder='email'
            defaultValue={currentUser.email}
            id='email'
            className='border p-3 rounded-lg'
            onChange={handleChange}
          />
          <input
            type='password'
            placeholder='password'
            id='password'
            className='border p-3 rounded-lg'
            onChange={handleChange}
          />

          <button disabled={loading} className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>
            {loading ? 'Loading...' : 'Update'}
          </button>
        </form>
        <div className='flex justify-between mt-5'>
          <span className='text-red-700 cursor-pointer'>Delete account</span>
          <span className='text-red-700 cursor-pointer'>Sign out</span>
        </div>
        <p className='text-red-700 mt-5'> {error ? error : ''} </p>

        <p className='text-green-700 mt-5'>{ updateSuccess ? 'User updated successfully!' : '' }</p>
      </div>
    </>
  );
}

export default Profile;
