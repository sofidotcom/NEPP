import React from 'react';
import '../css/index.css'; // Assuming you have CSS styles in App.css
import { Link } from 'react-router-dom';
import book1 from '../images/book1.jpg'
import book2 from '../images/book2.jpg'
import book3 from '../images/book3.jpg'
import pc2 from '../images/pc2.jpg'

const Index= () => {
 return (
        <div className="app">
            <header className="header">
                <h1>EthioAce</h1>
                <nav className="nav">
                    <button>Courses</button>
                    <button>Exams</button>
                    <button>Tips</button>
                    <button>About Us</button>
                
                    <Link to ='/login' className='login'>Login</Link> 
                </nav>
            </header>

            <main className="main-content">
                <div className='background'>
                <h2>PASS YOUR EXAM<br />WITH <h3>EthioAce</h3></h2>
                </div>
                <div className="search-bar">
                    <input type="text" className='searchbarr' placeholder="Search any course" />
                </div>
                

                <div className="card-container">
                    <div className="card">
                        <p>Study for class</p>
                        <img src={book1} alt="Study for class" />
                        
                    </div>
                    <div className="card">
                        <p>Ace your Exam preparation</p>
                        <img src={book2} alt="Ace your Exam preparation" />
                        
                    </div>
                    <div className="card">
                         <p>Getting Important Tips</p>
                        <img src={pc2} alt="Getting Important Tips" />
                       
                    </div>
                    <div className="card">
                        <p>Finding Interactive study tools</p>
                        <img src={book3}alt="Finding Interactive Study tools" />
                        
                    </div>
                </div>

                <footer className="footer">
                    <button>Courses</button>
                    <button>About Us</button>
                    <button>Tips</button>
                </footer>
            </main>
        </div>
    );
};

export default Index;
