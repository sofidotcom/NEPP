// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const TeacherRegister = () => {
//     const [formData, setFormData] = useState({
//         fullName: '',
//         email: '',
//         password: '',
//         subject: '',
//     });
//     const navigate = useNavigate();

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const res = await axios.post('/api/v1/registerteacher/', formData);
//             console.log(res.data);
//             navigate('/login'); // Redirect to login after successful signup
//         } catch (error) {
//             console.error(error.response.data);
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit}>
//             <h2>Teacher Signup</h2>
//             <input type="text" name="fullName" placeholder="Full Name" onChange={handleChange} required />
//             <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
//             <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
//             <input type="text" name="subject" placeholder="Subject" onChange={handleChange} required />
//             <button type="submit">Sign Up</button>
//         </form>
//     );
// };

// export default TeacherRegister;