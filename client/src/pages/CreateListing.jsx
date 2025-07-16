import { useState } from "react";

function CreateListing() {
    const [files, setFiles] = useState([]);
    const [formData, setFormData] = useState({
        imageUrls: [],
    });
    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);

    // eslint-disable-next-line no-unused-vars
    const handleImageSubmit = (e) => {
        if(files.length > 0 && files.length + formData.imageUrls.length < 7) {
            setUploading(true);
            setImageUploadError(false);
            const promises = [];

            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]));
            }

            Promise.all(promises).then((urls) => {
                setFormData({...formData, imageUrls: formData.imageUrls.concat(urls),
                });
                setImageUploadError(false);
                setUploading(false);
            // eslint-disable-next-line no-unused-vars
            }).catch((err) => {
                setImageUploadError('Image upload failed (2 MB max per image!)');
                setUploading(false);
            });
        } else {
            setImageUploadError('You can only upload 6 images per listing!');
            setUploading(false);
        }
    }
 
    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            try {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
                formData.append("folder", "listing_images");

                const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
                const xhr = new XMLHttpRequest();
                xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`);

                xhr.onload = function () {
                    if (xhr.status === 200) {
                        const res = JSON.parse(xhr.responseText);
                        resolve(res.secure_url);
                    } else {
                        reject(xhr.responseText);
                    }
                };

                xhr.onerror = function () {
                    reject("XHR request failed");
                };

                xhr.send(formData);
            } catch (err) {
                reject(err);
            }
        });
    }

    const handleRemoveImage = (index) => {
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_, i) => i !== index),
        });
    }
    return (
        <main className="p-3 max-w-4xl mx-auto">
            <h1 className="text-3xl font-semibold text-center my-6">Create a listing</h1>

            <form className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col gap-4 flex-1">
                    <input type="text" placeholder="Name" className="border border-gray-300 p-3 rounded-lg" id="name" maxLength='62' minLength='10' required />
                    <textarea type="text" placeholder="Description" className="border border-gray-300 p-3 rounded-lg" id="description" required />
                    <input type="text" placeholder="Address" className="border border-gray-300 p-3 rounded-lg" id="address" required />

                    <div className="flex gap-6 flex-wrap">
                        <div className="flex gap-2">
                            <input type="checkbox" id="sale" className="w-5" />
                            <span>Sell</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id="rent" className="w-5" />
                            <span>Rent</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id="parking" className="w-5" />
                            <span>Parking Spot</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id="furnished" className="w-5" />
                            <span>Furnished</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id="offer" className="w-5" />
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-6">
                        <div className="flex items-center gap-2">
                            <input type="number" id="bedrooms" min="1" max="10" required className="p-3 border border-gray-300 rounded-lg"/>
                            <p>Beds</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="number" id="bathrooms" min="1" max="10" required className="p-3 border border-gray-300 rounded-lg"/>
                            <p>Baths</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="number" id="regularPrice" min="0" max="1000000" required className="p-3 border border-gray-300 rounded-lg"/>
                            <div className="flex flex-col items-center">
                                <p>Regular Price</p>
                                <span className="text-xs">($ / month)</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="number" id="discountPrice" min="0" max="1000000" required className="p-3 border border-gray-300 rounded-lg"/>
                            <div className="flex flex-col items-center">
                            <p>Discounted Price</p>
                            <span className="text-xs">($ / month)</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col flex-col-1 gap-4">
                    <p className="font-semibold">Images:
                        <span className="font-normal text-gray-600 ml-2">The first image will be the cover (Max 6)</span>
                    </p>
                    <div className="flex gap-4">
                        <input onChange={(e) => {setFiles(e.target.files)}} type="file" id="images" accept="image/*" multiple className="p-3 border border-gray-300 rounded w-full"/>
                        <button type="button" disabled={uploading} onClick={handleImageSubmit} className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80 hover:cursor-pointer hover:bg-green-700 hover:text-white">{uploading ? 'Uploading...' : 'Upload'}</button>
                    </div>
                <p className="text-red-700 text-sm">{imageUploadError && imageUploadError}</p>
                {
                    formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
                        <div key={url} className="flex justify-between p-3 items-center border border-gray-300">
                            <img src={url} alt="listing image" className="w-20 h-20 object-contain rounded-lg"/>
                            <button onClick={() => handleRemoveImage(index)} type="button" className="p-3 text-red-700 rounded-lg uppercase hover:opacity-80 hover:cursor-pointer">Delete</button>
                        </div>
                    ))
                }
                <button className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">Create Listing</button>
                </div>
            </form>
        </main>
    );
}

export default CreateListing;
