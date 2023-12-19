import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    hp: '',
    email: '',
    password: '',
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage('Silakan cek email Anda untuk mengaktifkan Akun.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        const errorData = await response.json();
        setMessage(`Gagal registrasi: ${errorData.message}`);
        console.error('Registrasi gagal:', response.statusText);
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
                    <h3 className="login-heading">Register</h3>
                    <form onSubmit={handleRegister}>
                    {message && (
                      <div className="alert alert-info" role="alert">
                        {message}
                      </div>
                    )}
                    <div className="mb-1">
                        <label htmlFor="nohp">HP <span>*</span></label>
                        <input type="text" className="form__input" id="nohp" placeholder="HP" onChange={handleInputChange}/>
                      </div>
                      <div className="mb-1">
                        <label htmlFor="email">Email <span>*</span></label>
                        <input type="email" className="form__input" id="email" placeholder="Email" onChange={handleInputChange}/>
                      </div>
                      <div className="mb-1">
                        <label htmlFor="password">Password <span>*</span></label>
                        <input type="password" className="form__input" id="password" placeholder="Password" onChange={handleInputChange}/>
                      </div>
                      <div className="d-grid">
                        <button className="btn btn-lg btn-primary btn-login text-uppercase fw-bold mb-2 mt-3" type="submit">REGISTER</button>
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

export default Register