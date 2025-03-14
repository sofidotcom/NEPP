// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const StudentRegister = () => {
//     const [formData, setFormData] = useState({
//         name: '',
//         email: '',
//         password: '',
//         phoneNumber: '',
//         role: 'student',
//     });
//     const navigate = useNavigate();

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const res = await axios.post('/api/v1/register/', formData);
//             console.log(res.data);
//             navigate('/loginn'); // Redirect to login after successful signup
//         } catch (error) {
//             console.error(error.response.data);
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit}>
//             <h2>Student Signup</h2>
//             <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
//             <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
//             <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
//             <input type="text" name="phoneNumber" placeholder="Phone Number" onChange={handleChange} required />
//             <button type="submit">Sign Up</button>
//         </form>
//     );
// };

// export default StudentRegister;