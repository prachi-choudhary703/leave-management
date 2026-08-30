import "./Landing.css"
import { useNavigate } from "react-router-dom"
import hero from "../assets/hero.png"

import {
  Building2,
  LogIn,
  UserPlus,
  ShieldCheck,
  CalendarDays,
  Users,
  Megaphone,
  Bell,
  BadgeDollarSign,
  FileText,
  CalendarCheck,
  BadgeCheck,
  Headset,
  ArrowRight,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
} from "lucide-react"

const Landing = () => {

  const navigate = useNavigate()

  const features = [
    {
      icon: <CalendarDays size={30} />,
      title: "Leave Management",
      desc: "Manage leave requests with an easy approval process.",
    },
    {
      icon: <Users size={30} />,
      title: "Employee Records",
      desc: "Maintain employee details and department information.",
    },
    {
      icon: <Megaphone size={30} />,
      title: "Announcements",
      desc: "Share company announcements with all employees.",
    },
    {
      icon: <Bell size={30} />,
      title: "Notifications",
      desc: "Get real-time updates for approvals and requests.",
    },
    {
      icon: <BadgeDollarSign size={30} />,
      title: "Salary Deduction",
      desc: "Automatic salary deduction for unpaid leave.",
    },
    {
      icon: <FileText size={30} />,
      title: "Medical Certificate",
      desc: "Upload and verify medical certificates easily.",
    },
  ]

  const stats = [
    {
      icon: <Users size={28} />,
      number: "500+",
      text: "Employees",
    },
    {
      icon: <CalendarCheck size={28} />,
      number: "1500+",
      text: "Leaves Managed",
    },
    {
      icon: <BadgeCheck size={28} />,
      number: "98%",
      text: "Approval Rate",
    },
    {
      icon: <Headset size={28} />,
      number: "24/7",
      text: "Support",
    },
  ]

  const steps = [
    "Employee Signup",
    "Login",
    "Apply Leave",
    "Admin Approval",
    "Notification",
  ]

  const benefits = [
    "Smart Leave Conflict Detection",
    "Salary Deduction Preview",
    "Medical Certificate Upload",
    "Company Announcements",
    "Dashboard Analytics",
    "Real-Time Notifications",
  ]

  return (
    <div className="landing">
      {/* navbar */}

      <nav className="navbar">
        <div className="logo">
          <Building2 size={26} />
          <h2>LeavePro</h2>
        </div>

        <ul className="nav-links">
          <li>
            <a href="#home">Home</a>
          </li>

          <li>
            <a href="#features">Features</a>
          </li>

          <li>
            <a href="#about">About</a>
          </li>

          <li>
            <a href="#contact">Contact</a>
          </li>
        </ul>

        <div className="nav-btns">
          <button className="login-btn" onClick={() => navigate("/login")}>
            <LogIn size={16} />
            Login
          </button>

          <button className="signup-btn" onClick={() => navigate("/signup")}>
            <UserPlus size={16} />
            Employee Signup
          </button>
        </div>
      </nav>

      {/* hero */}

      <section id="home" className="hero">
        <div className="hero-left">
          <h1>Leave Management<br />Made Simple</h1>
          <p>Manage employee leave requests, approvals, notifications and attendance with a modern HR solution.</p>

          <div className="hero-buttons">
            <button className="hero-login" onClick={() => navigate("/login")}>Login</button>
            <button className="hero-signup" onClick={() => navigate("/signup")}>Employee Signup</button>
          </div>

          <div className="hero-bottom">
            <span><ShieldCheck size={18} />Secure</span>
            <span>•</span>
            <span>Fast</span>
            <span>•</span>
            <span>Reliable</span>
          </div>
        </div>

        <div className="hero-right">
          <img src={hero} alt="" />
        </div>
      </section>

      {/* features */}

      <section id="features" className="features">
        <h2>Our Features</h2>
        <p>Everything you need for smarter leave management.</p>

        <div className="feature-grid">
          {features.map((item, index) => (
            <div className="feature-card" key={index}>
              <div className="feature-icon">
                {item.icon}
              </div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* about */}

      <section id="about" className="about">
        <div className="about-left">
          <span className="about-tag">ABOUT US</span>

          <h2>We Simplify Leave Management</h2>

          <p>Our system helps organizations automate leave approvals, announcements, salary deduction and employee notifications through one centralized platform.</p>

          <button>Learn More</button>
        </div>

        <div className="about-right">
          {stats.map((item, index) => (
            <div className="stat-card" key={index}>
              <div className="stat-icon">
                {item.icon}
              </div>
              <div>
                <h3>{item.number}</h3>
                <p>{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* how works */}

      <section className="work">

        <div className="section-title">
          <h2>How It Works</h2>
          <p>Just a few simple steps to manage employee leaves.</p>
        </div>

        <div className="work-container">
          {steps.map((step, index) => (
            <div className="work-card" key={index}>
              <div className="step-number">
                {index + 1}
              </div>
              <h3>{step}</h3>
            </div>
          ))}
        </div>

      </section>

      {/* why */}

      <section className="why">

        <div className="why-left">
          <h2>Why Choose LeavePro?</h2>
          <p>We provide a complete HR leave management solution with smart automation, salary deduction tracking, medical verification and instant notifications.</p>
        </div>

        <div className="why-right">
          {
            benefits.map((item, index) => (
              <div className="benefit" key={index}>
                <CheckCircle size={20} />
                <span>{item}</span>
              </div>
            ))
          }
        </div>

      </section>

      {/* cta */}

      <section className="cta">
        <h2>Ready To Simplify Leave Management?</h2>
        <p>Join hundreds of organizations already managing employee leaves smarter.</p>

        <div className="cta-buttons">
          <button className="cta-login" onClick={() => navigate("/login")}>Login</button>
          <button className="cta-signup" onClick={() => navigate("/signup")}>Employee Signup<ArrowRight size={18} /></button></div>
      </section>

      {/* contact */}

      <section id="contact" className="contact">

        <div className="section-title">
          <h2>Contact Us</h2>
          <p>We'd love to hear from you.</p>
        </div>

        <div className="contact-grid">
          <div className="contact-card">
            <Phone size={26} />
            <h3>Phone</h3>
            <p>+91 9876543210</p>
          </div>

          <div className="contact-card">
            <Mail size={26} />
            <h3>Email</h3>
            <p>support@leavepro.com</p>
          </div>

          <div className="contact-card">
            <MapPin size={26} />
            <h3>Address</h3>
            <p>Kurukshetra, Haryana</p>
          </div>
        </div>

      </section>

      {/* footer */}

      <footer className="footer">

        <div className="footer-logo">
          <Building2 size={24} />
          <h2>LeavePro</h2>
        </div>

        <p>Smart Leave Management System for modern organizations.</p>
        <span>© 2026 LeavePro. All Rights Reserved.</span>

      </footer>
    </div>
  )
}

export default Landing