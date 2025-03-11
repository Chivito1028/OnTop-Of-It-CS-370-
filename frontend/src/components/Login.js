// Import React and the useState hook for managing component state
import React, { useState } from 'react';

// Import authentication functions for user registration and login
import { registerUser, loginUser } from '../services/authService';  

// Import styles for the authentication component
import styles from '../styles/authStyles';  

import PasswordStrengthMeter from './PasswordStrengthMeter';


// This component provides both login and registration functionality.
// Users can toggle between login and registration modes.
const Login = ({ onLogin }) => {
    // State to store the entered username
    const [username, setUsername] = useState('');

    // State to store the entered password
    const [password, setPassword] = useState('');

    // State to determine whether the user is registering (true) or logging in (false)
    const [isRegistering, setIsRegistering] = useState(false);

    // State to track whether a request is currently being processed
    const [loading, setLoading] = useState(false);

    // Handles form submission for both login and registration.
    // Sends user credentials to the backend and processes the response.
    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setLoading(true); 
    
       const endpoint = isRegistering ? "/auth/register" : "/auth/login";
       const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";
       //const endpoint = isRegistering ? "/register" : "/login";
    
        // Log the data before sending
        console.log("Submitting data:", { username, password });
    
        try {
            //API Calls
            const response = await fetch(`${backendUrl}${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });
    
            const data = await response.json();
    
            console.log("Server Response:", data); // Log server response
    
            if (!response.ok) {
                throw new Error(data.message || "An error occurred. Please try again.");
            }
    
            if (isRegistering) {
                alert("Registration successful! Please log in.");
                setIsRegistering(false);
                setUsername('');
                setPassword('');
            } else {
                localStorage.setItem("token", data.token);
                setUsername('');
                setPassword('');
                onLogin();
            }
        } catch (error) {
            console.error("Error:", error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        // Container for the login/registration form, styled using imported styles
        <div style={styles.container}>
            {/* Display appropriate heading based on the current mode */}
            <h2>{isRegistering ? "Sign Up" : "Login"}</h2>

            {/* Form for user login or registration */}
            <form onSubmit={handleSubmit} style={styles.form}>
                {/* Input field for username */}
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    // Update username state on change
                    onChange={(e) => setUsername(e.target.value)} 
                    // Make the input field required
                    required 
                    style={styles.input} // Apply styles
                />
                {/* Input field for password */}
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    // Update password state on change
                    onChange={(e) => setPassword(e.target.value)} 
                    required // Make the input field required
                    style={styles.input} // Apply styles
                />
                {/* Submit button with dynamic text based on state */}
                <button type="submit" style={styles.button} disabled={loading}>
                    {loading ? "Processing..." : isRegistering ? "Sign Up" : "Login"}
                </button>
            </form>


            {/* Password Strength Meter */}
            {isRegistering && <PasswordStrengthMeter password={password} />}
                {!isRegistering }

            {/* Toggle button to switch between login and registration modes */}
            <p style={styles.toggleText}>
                {isRegistering ? "Already have an account?" : "Don't have an account?"}
                <button 
                // Toggle registration state
                    onClick={() => setIsRegistering(!isRegistering)} 
                    style={styles.toggleButton}
                >
                    {isRegistering ? "Login here" : "Sign up here"}
                </button>
            </p>
        </div>
    );
};

// Export the Login component so it can be used in other parts of the application
export default Login;




// import React, { useState } from 'react';

// const Login = ({ onLogin }) => {
//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');
//     const [isRegistering, setIsRegistering] = useState(false);
//     const [loading, setLoading] = useState(false);

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         setLoading(true);

//         if (isRegistering) {
//             // Get existing users from localStorage
//             const users = JSON.parse(localStorage.getItem("users")) || [];

//             // Check if username already exists
//             if (users.some(user => user.username === username)) {
//                 alert("Username already taken!");
//                 setLoading(false);
//                 return;
//             }

//             // Store new user
//             users.push({ username, password });  //Passwords should be hashed in real apps!
//             localStorage.setItem("users", JSON.stringify(users));

//             alert("Registration successful! Please log in.");
//             setIsRegistering(false);
//         } else {
//             // Log in: Check if username/password match stored users
//             const users = JSON.parse(localStorage.getItem("users")) || [];
//             const user = users.find(user => user.username === username && user.password === password);

//             if (!user) {
//                 alert("Invalid credentials!");
//                 setLoading(false);
//                 return;
//             }

//             // Save login state in localStorage
//             localStorage.setItem("token", "dummyToken"); // Simulated authentication token
//             alert("Login successful!");
//             onLogin();
//         }

//         setLoading(false);
//     };

//     return (
//         <div style={styles.container}>
//             <h2>{isRegistering ? "Sign Up" : "Login"}</h2>
//             <form onSubmit={handleSubmit} style={styles.form}>
//                 <input
//                     type="text"
//                     placeholder="Username"
//                     value={username}
//                     onChange={(e) => setUsername(e.target.value)}
//                     required
//                     style={styles.input}
//                 />
//                 <input
//                     type="password"
//                     placeholder="Password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                     style={styles.input}
//                 />
//                 <button type="submit" style={styles.button} disabled={loading}>
//                     {loading ? "Processing..." : isRegistering ? "Sign Up" : "Login"}
//                 </button>
//             </form>
//             <p style={styles.toggleText}>
//                 {isRegistering ? "Already have an account?" : "Don't have an account?"}
//                 <button onClick={() => setIsRegistering(!isRegistering)} style={styles.toggleButton}>
//                     {isRegistering ? "Login here" : "Sign up here"}
//                 </button>
//             </p>
//         </div>
//     );
// };

// // Styling remains the same
// const styles = { 
//     container: {
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'center',
//         height: '100vh',
//         backgroundColor: '#f4f4f4'
//     },
//     form: {
//         display: 'flex',
//         flexDirection: 'column',
//         width: '300px',
//         padding: '20px',
//         backgroundColor: '#fff',
//         boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
//         borderRadius: '8px',
//     },
//     input: {
//         margin: '10px 0',
//         padding: '10px',
//         fontSize: '16px',
//         border: '1px solid #ccc',
//         borderRadius: '4px',
//     },
//     button: {
//         marginTop: '10px',
//         padding: '10px',
//         backgroundColor: '#007BFF',
//         color: 'white',
//         border: 'none',
//         cursor: 'pointer',
//         fontSize: '16px',
//         borderRadius: '4px',
//         transition: 'background 0.3s',
//     },
//     toggleText: {
//         marginTop: '10px',
//         fontSize: '14px',
//     },
//     toggleButton: {
//         border: 'none',
//         background: 'none',
//         color: '#007BFF',
//         cursor: 'pointer',
//         fontSize: '14px',
//         textDecoration: 'underline',
//         marginLeft: '5px'
//     }
// };

// export default Login;
















