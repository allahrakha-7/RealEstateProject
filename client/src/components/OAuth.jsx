import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import app from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import { fetchAPI } from '../api';

function OAuth() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);

            const result = await signInWithPopup(auth, provider);

            const data = await fetchAPI('/api/auth/google', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include',
                body: JSON.stringify({ 
                    name: result.user.displayName,
                    email: result.user.email, 
                    photo: result.user.photoURL,
                })
            });
            
            dispatch(signInSuccess(data));
            
            navigate("/");
        } catch (error) {
            console.error("Could not login with Google. Google Authentication Error:", error);
        }
    };
    return (
        <>
            <button onClick={handleGoogleClick} type="button" className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95">Continue with Google</button>
        </>
    );
}

export default OAuth;