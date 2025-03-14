// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const Loginn = () => {
//     const [formData, setFormData] = useState({
//         email: '',
//         password: '',
//     });
//     const navigate = useNavigate();

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const res = await axios.post('/api/v1/loginn/', formData);
//             localStorage.setItem('token', res.data.token);
//             localStorage.setItem('userRole', res.data.userType); 
//             if (res.data.userType === 'student') {
//                 navigate('/student');
//             } else if (res.data.userType === 'teacher') {
//                 navigate('/teacher');
//             } else if (res.data.userType === 'super_admin') {
//                 navigate('/admin');
//             }
//         } catch (error) {
//             console.error(error.response.data);
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit}>
//             <h2>Login</h2>
//             <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
//             <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
//             <button type="submit">Login</button>
//         </form>
//     );
// };

// export default Loginn;