import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { signInStart } from "../redux/user/userSlice";
import { signInSuccess } from "../redux/user/userSlice";
import { signInFailure } from "../redux/user/userSlice";
import OAuth from "../components/OAuth";
import { fetchAPI } from "../api";


function SignIn() {
    const [formData, setFormData] = useState({});
        const { loading, error } = useSelector((state) => state.user);
        const dispatch = useDispatch();
        const navigate = useNavigate();
    
        const handleChange = (e) => {
            setFormData({
                ...formData,
                [e.target.id]: e.target.value,
            });
        };
        const handleSubmit = async (e) => {
            e.preventDefault();
            try {
                dispatch(signInStart());
                const data = await fetchAPI(`/api/auth/signin`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(formData)
                    });
                    
                    if (data.success === false) {
                        dispatch(signInFailure(data.message));
                        return;
                    }
                    dispatch(signInSuccess(data));
                    navigate("/");
                } catch(error) {
                dispatch(signInFailure(error.message));
            }
        };
    
        return (
            <>
            <div className="p-3 max-w-lg mx-auto">
                <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <input type="email" placeholder="Email" className="border p-3 rounded-lg border-gray-400 focus:outline-gray-500" id="email" onChange={handleChange}/>
                    <input type="password" placeholder="Password" className="border p-3 rounded-lg border-gray-400 focus:outline-gray-500" id="password" onChange={handleChange}/>

                    <button disabled={loading} className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">{loading ? "Loading..." : "Sign in"}</button>

                    <OAuth/>
                </form>
                <div className="flex gap-2 mt-5">
                    <p>Don't you have an account? </p>
                    <Link to={"/sign-up"}><span className="text-blue-700">Sign up</span></Link>
                </div>
                {error && <p className="text-red-500 mt-3">{error}</p>}
                
            </div>
            </>
        );
}

export default SignIn;