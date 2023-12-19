import { useNavigate } from "react-router-dom";
import "../../index.css";
import React, { useState } from 'react';
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    if (e.target.id === 'email') {
      setEmail(e.target.value);
    } else if (e.target.id === 'password') {
      setPassword(e.target.value);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const decodedToken = jwtDecode(data.accessToken);

        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('tokenExp', decodedToken.exp);
        localStorage.setItem('refreshToken', data.refreshToken);
        navigate('/')
      } else {
        const errorData = await response.json();
        setMessage(`Login gagal: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Terjadi kesalahan:', error);
    }
  };

  return (
    <div>
      <div className="container-fluid ps-md-0">
        <div className="row g-0">
          {/* gambar kiri */}
          <div className="d-none d-md-flex col-md-4 bg-image"></div>
          {/* form login */}
          <div className="col-md-8">
            <div className="login d-flex align-items-center">
              <div className="container">
                <div className="row">
                  
                  <div className="col-md-9 col-lg-6 mx-auto">
                    <h3 className="login-heading">Get Started</h3>
                    <form onSubmit={handleLogin}>
                    {message && (
                      <div className="alert alert-danger" role="alert">
                        {message}
                      </div>
                    )}
                      <div className="mb-4">
                        <label htmlFor="email">Email <span>*</span></label>
                        <input type="email" className="form__input mt-3" id="email" placeholder="Email" onChange={handleInputChange}/>
                      </div>
                      <div className="mb-5">
                        <label htmlFor="password">Password <span>*</span></label>
                        <input type="password" className="form__input mt-3" id="password" placeholder="Password" onChange={handleInputChange} />
                      </div>
                      <div className="d-grid">
                        <button className="btn btn-lg btn-primary btn-login text-uppercase fw-bold mb-2 mt-3" type="submit">LOGIN</button>
                        <div className="text-center mt-2">
                          <a className="register" href="#">REGISTER NOW</a>
                        </div>
                      </div>
                    </form>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    )
}

export default Login