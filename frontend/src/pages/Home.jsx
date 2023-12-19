import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logoKaon from "../assets/kaon_icon1.png";
import imgCard from "../assets/1_91b60997-7ad6-41f9-a0f5-dde0c9a782e7_768x.png";
import "../index.css";

const Home = () => {
  const navigate = useNavigate();

  const checkIsLoggedIn = () => {
    const accessToken = localStorage.getItem('accessToken');
    let tokenExp;
  
    try {
      tokenExp = localStorage.getItem('tokenExp');
      tokenExp = tokenExp ? parseInt(tokenExp, 10) * 1000 : null;
    } catch (error) {
      console.error('Error parsing tokenExp:', error);
    }
  
    return !!accessToken && tokenExp && new Date(tokenExp) > new Date();
  };
  
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('tokenExp');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  useEffect(() => {
    const userIsLoggedIn = checkIsLoggedIn();

    if (!userIsLoggedIn) {
      navigate('/login');
    }
  }, [navigate]);
  

  return (<div className="main-page">
  <div className="container-fluid ps-md-0">
    <div className="row g-0">
      {/* sidebar */}
      <div className="side-bar fixed d-none d-md-flex col-md-1 bg-white">
        <div className="container-fluid d-flex flex-column">
          <div className="row">
            <div className="logo">
              <img src={logoKaon} alt="" />
            </div>
            <div className="menu row d-flex flex-column flex-grow-1">
              <a href="">
                <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34" fill="none">
                  <path opacity="0.15" d="M28.3333 5.66663H5.66666V28.3333H28.3333V5.66663Z" fill="black"/>
                  <path d="M28.3333 5.66663H5.66666V28.3333H28.3333V5.66663Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M9.91666 11.3333H24.0833" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M9.91666 17H24.0833" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M9.91666 22.6666H18.4167" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                  menu
              </a>
              <a href="">
                <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34" fill="none">
                  <path opacity="0.15" d="M7.08333 25.5H26.9167C28.4815 25.5 29.75 24.2315 29.75 22.6666V14.1666H4.25V22.6666C4.25 24.2315 5.51853 25.5 7.08333 25.5Z" fill="#ADADAD"/>
                  <path d="M26.9167 8.5H7.08333C5.51853 8.5 4.25 9.76853 4.25 11.3333V14.1667V22.6667C4.25 24.2315 5.51853 25.5 7.08333 25.5H26.9167C28.4815 25.5 29.75 24.2315 29.75 22.6667V14.1667V11.3333C29.75 9.76853 28.4815 8.5 26.9167 8.5Z" stroke="#ADADAD" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M29.75 14.1666H4.25" stroke="#ADADAD" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M8.5 21.25H14.1667" stroke="#ADADAD" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                sales
              </a>
            </div>
            <div className="logout mt-auto mb-3">
              <button onClick={handleLogout} type="button">
              <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34" fill="none">
                <path d="M21.25 28.3334H25.5C27.0649 28.3334 28.3333 27.0648 28.3333 25.5V8.50004C28.3333 6.93519 27.0649 5.66671 25.5 5.66671H21.25" stroke="black" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M11.3333 22.6667L5.66666 17.0001L11.3333 11.3334" stroke="black" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M5.66666 17H22.6667" stroke="black" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* main-bar */}
      <div className="col-md-11">
        <nav className="navbar navbar-light bg-white justify-content-between">
          <form className="search form-inline ml-4">
            <input className="border-0 mr-sm-2 pl-5 py-2" type="search" placeholder="Input QR Code Number" aria-label="Search"/>
            <button className="btn my-2 my-sm-0 ml-5 px-5" type="submit">Generate</button>
          </form>
          <div className="date">
            <p>03 April 2023, 15:00PM</p>
            <h5>Daily Order</h5>
          </div>
        </nav>

        <div className="main d-flex">
          <div className="product col-md-8 card-columns">
            <div className="card ml-2 mt-2" style={{width: "195px", height:"329px"}}>
              <img className="card-img-top" src={imgCard} alt="Card image cap"/>
              <div className="card-body">
                <h5 className="card-title">Strowbery Pancake</h5>
                <a href="#">Rp 28,000</a>
              </div>
            </div>
            <div className="card ml-2 mt-2" style={{width: "195px", height:"329px"}}>
              <img className="card-img-top" src={imgCard} alt="Card image cap"/>
              <div className="card-body">
                <h5 className="card-title">Strowbery Pancake</h5>
                <a href="#">Rp 28,000</a>
              </div>
            </div>
            <div className="card ml-2 mt-2" style={{width: "195px", height:"329px"}}>
              <img className="card-img-top" src={imgCard} alt="Card image cap"/>
              <div className="card-body">
                <h5 className="card-title">Strowbery Pancake</h5>
                <a href="#">Rp 28,000</a>
              </div>
            </div>
            <div className="card ml-2 mt-2" style={{width: "195px", height:"329px"}}>
              <img className="card-img-top" src={imgCard} alt="Card image cap"/>
              <div className="card-body">
                <h5 className="card-title">Strowbery Pancake</h5>
                <a href="#">Rp 28,000</a>
              </div>
            </div>
            <div className="card ml-2 mt-2" style={{width: "195px", height:"329px"}}>
              <img className="card-img-top" src={imgCard} alt="Card image cap"/>
              <div className="card-body">
                <h5 className="card-title">Strowbery Pancake</h5>
                <a href="#">Rp 28,000</a>
              </div>
            </div>
            <div className="card ml-2 mt-2" style={{width: "195px", height:"329px"}}>
              <img className="card-img-top" src={imgCard} alt="Card image cap"/>
              <div className="card-body">
                <h5 className="card-title">Strowbery Pancake</h5>
                <a href="#">Rp 28,000</a>
              </div>
            </div>
            <div className="card ml-2 mt-2" style={{width: "195px", height:"329px"}}>
              <img className="card-img-top" src={imgCard} alt="Card image cap"/>
              <div className="card-body">
                <h5 className="card-title">Strowbery Pancake</h5>
                <a href="#">Rp 28,000</a>
              </div>
            </div>
            <div className="card ml-2 mt-2" style={{width: "195px", height:"329px"}}>
              <img className="card-img-top" src={imgCard} alt="Card image cap"/>
              <div className="card-body">
                <h5 className="card-title">Strowbery Pancake</h5>
                <a href="#">Rp 28,000</a>
              </div>
            </div>
          </div>
          <div className="checkout col-md-3">
            <div className="card-checkout bg-white mt-2 ml-2">
              <div className="number">
                1
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  );
};

export default Home;
