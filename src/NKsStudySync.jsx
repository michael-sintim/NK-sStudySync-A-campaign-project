import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";

const THEME = {
  amber: "#F5A300",
  amberLight: "#FFB800",
  amberDark: "#E09000",
  amberDeep: "#C97E00",
  black: "#111111",
  blackSoft: "#1A1A1A",
  red: "#D32F2F",
  redDark: "#B71C1C",
  white: "#FFFFFF",
  offWhite: "#FFFBF0",
  cardBg: "#FFC107",
  transition: "all 0.4s cubic-bezier(0.23, 1, 0.32, 1)",
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');

  :root {
    --amber: ${THEME.amber};
    --amber-light: ${THEME.amberLight};
    --amber-dark: ${THEME.amberDark};
    --amber-deep: ${THEME.amberDeep};
    --black: ${THEME.black};
    --black-soft: ${THEME.blackSoft};
    --red: ${THEME.red};
    --red-dark: ${THEME.redDark};
    --white: ${THEME.white};
    --card-bg: ${THEME.cardBg};
    --ease: ${THEME.transition};
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: var(--amber);
    color: var(--black);
    overflow-x: hidden;
    line-height: 1.6;
  }

  h1, h2, h3, h4 {
    font-family: 'Oswald', sans-serif;
    letter-spacing: 0.02em;
  }

  /* ===== NAVIGATION ===== */
  .nav {
    position: fixed; top: 0; width: 100%; z-index: 1000;
    padding: 1.25rem 5%;
    display: flex; align-items: center; justify-content: space-between;
    background: var(--amber-dark);
    backdrop-filter: blur(10px);
    border-bottom: 3px solid var(--black);
    box-shadow: 0 4px 0 var(--black);
    transition: var(--ease);
  }
  .nav.scrolled {
    padding: 0.8rem 5%;
    background: var(--amber-light);
    box-shadow: 0 6px 0 var(--black);
  }
  .nav-logo {
    display: flex; align-items: center; gap: 0.75rem;
    font-family: 'Oswald', sans-serif;
    font-size: 1.5rem; font-weight: 700;
    color: var(--black); cursor: pointer;
  }
  .logo-nk { color: var(--red); }
  .logo-bolt {
    background: var(--black); color: var(--amber);
    width: 32px; height: 32px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1rem; border-radius: 6px;
    border: 2px solid var(--black);
  }
  .nav-links { display: flex; gap: 2rem; list-style: none; }
  .nav-links a {
    text-decoration: none; color: var(--black);
    font-weight: 700; font-size: 0.85rem;
    letter-spacing: 0.06em; text-transform: uppercase;
    position: relative;
  }
  .nav-links a::after {
    content: ''; position: absolute; bottom: -4px; left: 0;
    width: 0%; height: 2px;
    background: var(--red); transition: var(--ease);
  }
  .nav-links a:hover::after { width: 100%; }
  .nav-cta {
    background: var(--black); color: var(--amber-light);
    border: 3px solid var(--black); padding: 0.6rem 1.5rem;
    font-family: 'Oswald', sans-serif; font-size: 0.95rem; font-weight: 700;
    letter-spacing: 0.06em; cursor: pointer; border-radius: 8px;
    box-shadow: 4px 4px 0 var(--red);
    transition: var(--ease);
  }
  .nav-cta:hover { transform: translate(2px, 2px); box-shadow: 2px 2px 0 var(--red); }
  .hamburger {
    display: none; flex-direction: column; gap: 5px;
    cursor: pointer; background: none; border: none;
  }
  .hamburger span {
    display: block; width: 26px; height: 3px;
    background: var(--black); border-radius: 2px;
    transition: all 0.3s;
  }

  /* ===== MOBILE DRAWER ===== */
  .drawer-overlay {
    position: fixed; inset: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.5); z-index: 998;
    opacity: 0; pointer-events: none; transition: opacity 0.3s;
  }
  .drawer-overlay.open { opacity: 1; pointer-events: all; }
  .mobile-drawer {
    position: fixed; top: 0; right: -100%; width: 280px; height: 100vh;
    background: var(--amber-light); z-index: 999;
    padding: 5rem 2rem 2rem;
    border-left: 4px solid var(--black);
    transition: right 0.3s ease;
    box-shadow: -8px 0 0 var(--black);
  }
  .mobile-drawer.open { right: 0; }
  .drawer-close {
    position: absolute; top: 1rem; right: 1.2rem;
    background: var(--black); border: none; color: var(--amber);
    width: 36px; height: 36px; border-radius: 50%;
    font-size: 1.2rem; cursor: pointer;
    font-family: 'Oswald', sans-serif; font-weight: 700;
    display: flex; align-items: center; justify-content: center;
  }
  .mobile-drawer ul { list-style: none; display: flex; flex-direction: column; gap: 1.2rem; }
  .mobile-drawer a {
    color: var(--black); text-decoration: none;
    font-family: 'Oswald', sans-serif; font-size: 1.3rem; font-weight: 600;
    letter-spacing: 0.05em; display: block;
    padding: 0.6rem 0; border-bottom: 2px solid rgba(0,0,0,0.15);
  }
  .mobile-drawer a:hover { color: var(--red); }

  /* ===== HERO ===== */
  .hero {
    width: 100%; min-height: 100vh;
    background: linear-gradient(135deg, #FFB800 0%, #F5A300 40%, #E09000 70%, #C97E00 100%);
    display: flex; align-items: center; justify-content: center;
    position: relative; overflow: hidden;
    padding: 160px 5% 80px;
    border-bottom: 5px solid var(--black);
  }
  .hero-shapes { position: absolute; inset: 0; width: 100%; height: 100%; overflow: hidden; pointer-events: none; }
  .hero-circle-1 {
    position: absolute; width: 500px; height: 500px; border-radius: 50%;
    background: rgba(211,47,47,0.12); right: -100px; top: -100px;
    border: 3px solid rgba(211,47,47,0.2);
  }
  .hero-circle-2 {
    position: absolute; width: 300px; height: 300px; border-radius: 50%;
    background: rgba(0,0,0,0.06); left: -60px; bottom: 100px;
  }
  .hero-grid {
    position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0.05;
    background-image: linear-gradient(rgba(0,0,0,1) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px);
    background-size: 50px 50px;
  }
  .hero-content { position: relative; z-index: 2; max-width: 900px; width: 100%; text-align: center; }
  .hero-badge {
    display: inline-flex; align-items: center; gap: 0.5rem;
    background: var(--black); color: var(--amber);
    font-family: 'Oswald', sans-serif; font-size: 0.8rem;
    letter-spacing: 0.15em; padding: 0.4rem 1.2rem;
    border-radius: 100px; margin-bottom: 2rem;
    border: 2px solid var(--red);
    box-shadow: 4px 4px 0 var(--red);
  }
  .hero-title {
    font-size: clamp(4rem, 9vw, 6rem);
    font-weight: 700; line-height: 0.95; color: var(--black);
    margin-bottom: 1.5rem; text-shadow: 4px 4px 0 rgba(0,0,0,0.1);
  }
  .hero-title .red { color: var(--red); }
  .hero-sub {
    font-size: 1.4rem; color: var(--black-soft); line-height: 1.8;
    max-width: 780px; margin: 0 auto 3rem; font-weight: 600;
  }
  .hero-btns { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
  .btn-primary {
    background: var(--black); color: var(--amber);
    border: 3px solid var(--black); padding: 0.9rem 2.2rem;
    font-family: 'Oswald', sans-serif; font-size: 1.05rem; font-weight: 700;
    letter-spacing: 0.08em; cursor: pointer; border-radius: 8px;
    box-shadow: 6px 6px 0 var(--red); transition: var(--ease);
  }
  .btn-primary:hover { transform: translate(3px, 3px); box-shadow: 3px 3px 0 var(--red); }
  .btn-outline {
    background: transparent; color: var(--black);
    border: 3px solid var(--black); padding: 0.9rem 2.2rem;
    font-family: 'Oswald', sans-serif; font-size: 1.05rem; font-weight: 700;
    letter-spacing: 0.08em; cursor: pointer; border-radius: 8px;
    box-shadow: 6px 6px 0 rgba(0,0,0,0.2); transition: var(--ease);
  }
  .btn-outline:hover { transform: translate(3px, 3px); box-shadow: 3px 3px 0 rgba(0,0,0,0.2); background: rgba(0,0,0,0.06); }
  .scroll-cue {
    position: absolute; bottom: 2rem; left: 50%; transform: translateX(-50%);
    display: flex; flex-direction: column; align-items: center; gap: 4px;
    animation: bounce 2s infinite;
  }
  .scroll-cue span { font-size: 0.65rem; font-weight: 800; letter-spacing: 0.15em; color: var(--black); opacity: 0.5; }
  .chevron { width: 16px; height: 16px; border-right: 3px solid var(--black); border-bottom: 3px solid var(--black); transform: rotate(45deg); opacity: 0.5; }
  @keyframes bounce { 0%,100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(8px); } }

  /* ===== SECTIONS ===== */
  .section-amber {
    width: 100%;
    background: linear-gradient(160deg, #FFB800 0%, #F5A300 50%, #E09000 100%);
    border-top: 4px solid var(--black);
    border-bottom: 4px solid var(--black);
  }
  .section-amber-deep {
    width: 100%;
    background: #FFD700;
    border-top: 4px solid var(--black);
    border-bottom: 4px solid var(--black);
  }
  .section-red {
    width: 100%;
    background: #D32F2F;
    border-top: 4px solid var(--black);
    border-bottom: 4px solid var(--black);
  }
  .section-red .section-inner {
    max-width: 1400px; width: 100%; margin: 0 auto; padding: 100px 2%;
  }
  .section-red .logo-strip {
    overflow: hidden; border-top: 3px solid rgba(255,255,255,0.3);
    padding-top: 2rem; width: 100%;
  }
  .section-red .logo-pill {
    background: rgba(255,255,255,0.15); color: var(--white);
    border: 2px solid rgba(255,255,255,0.4);
    padding: 0.8rem 2rem; font-family: 'Poppins', sans-serif;
    font-size: 1rem; font-weight: 600; letter-spacing: 0.05em;
    white-space: nowrap; box-shadow: 4px 4px 0 rgba(0,0,0,0.25);
  }
  .section-black {
    width: 100%;
    background: linear-gradient(160deg, #111111 0%, #1a1a1a 100%);
    border-top: 4px solid var(--amber);
    border-bottom: 4px solid var(--amber);
  }
  .join-section {
    width: 100%;
    background: #F5A300;
    border-top: 5px solid var(--black);
    border-bottom: 5px solid var(--black);
  }

  .section-inner { max-width: 1200px; width: 100%; margin: 0 auto; padding: 100px 5%; }

  .section-tag {
    display: inline-block; background: var(--black); color: var(--amber);
    font-family: 'Oswald', sans-serif; font-size: 0.75rem; letter-spacing: 0.15em;
    padding: 0.3rem 1rem; margin-bottom: 1rem; border-radius: 100px;
  }
  .section-title-black { font-size: clamp(2.5rem, 5vw, 4rem); color: var(--black); text-align: center; margin-bottom: 1rem; width: 100%; }
  .section-title-white { font-size: clamp(2.5rem, 5vw, 4rem); color: var(--white); text-align: center; margin-bottom: 1rem; width: 100%; }
  .section-title-amber { font-size: clamp(2.5rem, 5vw, 4rem); color: var(--amber); text-align: center; margin-bottom: 1rem; width: 100%; }
  .section-sub-black { text-align: center; color: rgba(0,0,0,0.65); font-size: 1.1rem; font-weight: 600; margin-bottom: 3rem; width: 100%; }
  .section-sub-white { text-align: center; color: rgba(255,255,255,0.75); font-size: 1.1rem; font-weight: 600; margin-bottom: 3rem; width: 100%; }

  /* ===== MISSION ===== */
  .pull-quote {
    font-family: 'Oswald', sans-serif;
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 700; color: var(--black); line-height: 1.2;
    max-width: 800px; width: 100%; margin: 0 auto 3rem;
    border-left: 8px solid var(--red);
    padding-left: 1.5rem; text-align: left;
  }
  .pull-quote .red { color: var(--red); }

  .mission-grid, .testimonials-grid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem; width: 100%; margin-top: 3rem;
  }
  .mission-card, .testimonial-card {
    background: var(--amber-light); border: 3px solid var(--black);
    border-radius: 20px; padding: 2.5rem;
    box-shadow: 8px 8px 0 var(--black); transition: var(--ease); width: 100%;
  }
  .mission-card:hover, .testimonial-card:hover {
    transform: translateY(-8px); box-shadow: 12px 12px 0 var(--black);
  }.mission-icon {
  width: 56px; height: 56px;
  background: rgba(211,47,47,0.08);
  border: 2px solid rgba(211,47,47,0.15);
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 1.5rem;
  transition: var(--ease);
}
.mission-card:hover .mission-icon {
  background: rgba(211,47,47,0.15);
  border-color: var(--red);
}
  .mission-card h3 { font-size: 1.5rem; color: var(--red); margin-bottom: 0.75rem; }
  .mission-card p { color: var(--black-soft); line-height: 1.7; font-size: 1rem; font-weight: 600; }

  /* ===== PROBLEM ===== */
  .problem-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; width: 100%; }
  .stat-cluster { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; width: 100%; }
  .stat-card {
    background: var(--amber-light); border: 3px solid var(--black);
    border-radius: 16px; padding: 2rem; text-align: center;
    box-shadow: 6px 6px 0 var(--black); transition: var(--ease); width: 100%;
  }
  .stat-card:hover { transform: translate(-3px,-3px); box-shadow: 9px 9px 0 var(--black); }
  .stat-number { font-family: 'Oswald', sans-serif; font-size: 3rem; font-weight: 700; color: white; display: block; line-height: 1; }
  .stat-label { font-size: 0.85rem; color: var(--black); margin-top: 0.5rem; line-height: 1.4; font-weight: 700; }
  .problem-text { width: 100%; }
  .problem-text h2 { font-size: clamp(2rem, 3.5vw, 2.8rem); color: var(--amber); margin-bottom: 1.5rem; }
  .problem-text p { color: rgba(255,255,255,0.85); line-height: 1.9; font-size: 1.1rem; font-weight: 600; margin-bottom: 1rem; }

  /* ===== IMPACT ===== */
  .impact-grid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 2rem; margin-bottom: 4rem; width: 100%;
  }
  .impact-stat {
    background: rgba(0,0,0,0.15); border: 3px solid rgba(0,0,0,0.3);
    border-radius: 20px; padding: 2.5rem; text-align: center;
    box-shadow: 6px 6px 0 rgba(0,0,0,0.25); transition: var(--ease); width: 100%;
  }
  .impact-stat:hover { transform: translate(-3px,-3px); }
  .impact-number { font-family: 'Oswald', sans-serif; font-size: clamp(3rem, 5vw, 4rem); font-weight: 700; color: var(--white); display: block; line-height: 1; }
  .impact-label { font-size: 0.9rem; color: rgba(255,255,255,0.8); margin-top: 0.5rem; font-weight: 700; line-height: 1.4; }
  .logo-strip { overflow: hidden; border-top: 3px solid rgba(255,255,255,0.3); padding-top: 2rem; width: 100%; }
  .logo-strip-track { display: flex; gap: 2rem; animation: scrollLogos 25s linear infinite; width: max-content; }
  
  @keyframes scrollLogos { from { transform: translateX(0); } to { transform: translateX(-50%); } }
  .logo-pill {
    background: rgba(255,255,255,0.15); color: var(--white);
    border: 2px solid rgba(255,255,255,0.4);
    padding: 0.6rem 1.5rem; border-radius: 8px;
    font-family: 'Oswald', sans-serif; font-size: 0.9rem; font-weight: 600;
    letter-spacing: 0.05em; white-space: nowrap;
    box-shadow: 3px 3px 0 rgba(0,0,0,0.2);
  }

  /* ===== TESTIMONIALS ===== */
  .testimonial-card { position: relative; padding: 2.5rem; }
  .big-quote { font-family: 'Oswald', sans-serif; font-size: 5rem; color: var(--red); opacity: 0.25; position: absolute; top: 0.5rem; right: 1.5rem; line-height: 1; }
  .stars { color: var(--red); margin-bottom: 1.5rem; font-size: 1.2rem; letter-spacing: 3px; }
  .testimonial-card blockquote { font-style: italic; color: var(--black); line-height: 1.8; margin-bottom: 2rem; font-size: 1rem; font-weight: 600; }
  .author-row { display: flex; align-items: center; gap: 1rem; }
  .avatar { width: 50px; height: 50px; border-radius: 50%; background: var(--black); color: var(--amber); display: flex; align-items: center; justify-content: center; font-family: 'Oswald', sans-serif; font-weight: 700; font-size: 1rem; flex-shrink: 0; border: 3px solid var(--black); }
  .author-info strong { display: block; color: var(--black); font-size: 1rem; }
  .author-info span { color: var(--red); font-size: 0.85rem; font-weight: 700; }

  /* ===== MANIFESTO ===== */
  .manifesto-list { max-width: 900px; width: 100%; margin: 0 auto; }
  .manifesto-item {
    display: flex; gap: 2.5rem; padding: 2.5rem 0;
    border-bottom: 3px solid var(--amber-dark); align-items: flex-start;
    transition: var(--ease); width: 100%;
  }
  .manifesto-item:hover { transform: translateX(15px); }
  .manifesto-item:last-child { border-bottom: none; }
  .manifesto-num { font-family: 'Oswald', sans-serif; font-size: 4rem; font-weight: 700; color: var(--amber); line-height: 1; flex-shrink: 0; width: 80px; text-shadow: 3px 3px 0 rgba(0,0,0,0.2); }
  .manifesto-content { width: 100%; }
  .manifesto-content h3 { font-size: 1.5rem; color: var(--amber); margin-bottom: 0.5rem; }
  .manifesto-content h3 span { color: var(--white); }
  .manifesto-content p { color: rgba(255,255,255,0.8); line-height: 1.8; font-size: 1rem; font-weight: 600; }

  /* ===== JOIN ===== */
  .join-section .section-inner { text-align: center; }
  .signup-form { display: flex; max-width: 380px; width: 100%; margin: 0 auto 1rem; }
  .signup-form input {
    flex: 1; padding: 0.6rem 1rem;
    background: white; border: 2px solid var(--black); border-right: none;
    color: var(--black); font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.88rem; font-weight: 700;
    outline: none; border-radius: 8px 0 0 8px;
  }
  .signup-form input::placeholder { color: rgba(0,0,0,0.4); }
  .signup-form button {
    background: var(--black); color: var(--amber);
    border: 2px solid var(--black); padding: 0.6rem 1.2rem;
    font-family: 'Oswald', sans-serif; font-size: 0.88rem; font-weight: 700;
    letter-spacing: 0.05em; cursor: pointer; border-radius: 0 8px 8px 0;
    transition: background 0.2s, color 0.2s;
  }
  .signup-form button:hover { background: var(--amber-light); color: var(--black); }
  .signup-form button:disabled { opacity: 0.6; cursor: not-allowed; }
  .signup-form input:disabled { opacity: 0.6; }
  .signup-msg-success {
    font-family: 'Oswald', sans-serif; font-weight: 700;
    font-size: 0.95rem; color: var(--black);
    margin-bottom: 1rem; display: block;
  }
  .signup-msg-error {
    font-family: 'Oswald', sans-serif; font-weight: 700;
    font-size: 0.88rem; color: var(--red-dark);
    margin-bottom: 1rem; display: block;
  }

  /* ===== SOCIALS ===== */
  .ss-socials {
    display: flex; align-items: center; justify-content: center;
    gap: 0.5rem; flex-wrap: wrap; margin-top: 1.5rem; width: 100%;
  }
  .ss-soc-lbl {
    font-weight: 800; font-size: 0.85rem; color: var(--black); margin-right: 0.5rem;
  }
  .ss-soc-btn {
    display: inline-flex; align-items: center; gap: 8px;
    background: transparent; color: black;
    border: 2px solid black;
    padding: 0.5rem 1.1rem; cursor: pointer; border-radius: 6px; margin: 4px;
    font-family: 'Poppins', sans-serif; font-size: 0.8rem; font-weight: 700;
    letter-spacing: 0.00em; transition: transform 0.18s, box-shadow 0.18s;
  }
  .ss-soc-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.2); }
  .ss-soc-btn svg { flex-shrink: 0; }

  /* ===== FOOTER ===== */
  .footer { background: #0A0A0A; padding: 4rem 5%; border-top: 5px solid var(--amber); width: 100%; }
  .footer-inner { max-width: 1200px; width: 100%; margin: 0 auto; }
  .footer-top { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 2rem; margin-bottom: 3rem; width: 100%; }
  .footer-logo-text { font-family: 'Oswald', sans-serif; font-size: 1.8rem; font-weight: 700; color: var(--amber); }
  .footer-logo-text .red { color: var(--red); }
  .footer-tagline { color: rgba(255,255,255,0.4); font-size: 0.85rem; margin-top: 0.5rem; font-weight: 600; }
  .footer-links { display: flex; gap: 2rem; flex-wrap: wrap; }
  .footer-links a { color: rgba(255,255,255,0.5); text-decoration: none; font-size: 0.9rem; font-weight: 600; transition: color 0.2s; }
  .footer-links a:hover { color: var(--amber); }
  .footer-bottom { border-top: 1px solid rgba(255,255,255,0.08); padding-top: 2rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; width: 100%; }
  .footer-copy { color: rgba(255,255,255,0.25); font-size: 0.85rem; }
  .footer-socials { display: flex; gap: 0.75rem; flex-wrap: wrap; }
  .footer-social-icon {
  width: 38px; height: 38px;
  background: rgba(255,255,255,0.08);
  border: 2px solid rgba(255,255,255,0.15); border-radius: 8px;
  display: inline-flex; align-items: center; justify-content: center;
  text-decoration: none; transition: all 0.2s; flex-shrink: 0;
}
.footer-social-icon:hover {
  background: var(--amber-light);
  border-color: var(--amber-light);
  transform: translateY(-2px);
}
.footer-social-icon:hover svg { fill: var(--black); }
  /* ===== REVEAL ANIMATIONS ===== */
  .reveal { opacity: 0; transform: translateY(40px); transition: opacity 0.8s ease-out, transform 0.8s ease-out; width: 100%; }
  .reveal.visible { opacity: 1; transform: translateY(0); }
  .d1 { transition-delay: 0.1s; }
  .d2 { transition-delay: 0.2s; }
  .d3 { transition-delay: 0.3s; }

  /* ===== RESPONSIVE ===== */
  @media (max-width: 900px) {
    .nav-links, .nav-cta { display: none; }
    .hamburger { display: flex; }
    .problem-grid { grid-template-columns: 1fr; }
    .stat-cluster { grid-template-columns: 1fr 1fr; }
    .section-inner { padding: 80px 5%; }
  }
  @media (max-width: 600px) {
    .signup-form { flex-direction: column; }
    .signup-form input { border-right: 2px solid var(--black); border-bottom: none; border-radius: 8px 8px 0 0; }
    .signup-form button { border-radius: 0 0 8px 8px; }
    .pull-quote { font-size: 1.8rem; }
    .hero-title { font-size: 3rem; }
    .section-inner { padding: 60px 1.5rem; }
    .manifesto-item { flex-direction: column; gap: 1rem; }
    .manifesto-num { width: 100%; }
  }
`;

/* ===== HOOKS ===== */
function useScrollReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { el.classList.add("visible"); observer.disconnect(); }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function useCountUp(target, format, suffix, active) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const duration = 1800;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setVal(Math.floor(ease * target));
      if (progress < 1) requestAnimationFrame(step);
      else setVal(target);
    };
    requestAnimationFrame(step);
  }, [active, target]);
  if (format === "short") return val >= 1000 ? `${(val / 1000).toFixed(0)}K${suffix}` : `${val}${suffix}`;
  if (format === "millions") return val >= 1000000 ? `${(val / 1000000).toFixed(1)}M` : val.toLocaleString();
  return `${val}${suffix}`;
}

function StatCard({ target, suffix, format = "", label }) {
  const ref = useRef(null);
  const [active, setActive] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setActive(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const display = useCountUp(target, format, suffix, active);
  return (
    <div className="stat-card" ref={ref}>
      <span className="stat-number">{display}</span>
      <div className="stat-label">{label}</div>
    </div>
  );
}

function ImpactStat({ target, suffix, format = "", label }) {
  const ref = useRef(null);
  const [active, setActive] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setActive(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const display = useCountUp(target, format, suffix, active);
  return (
    <div className="impact-stat" ref={ref}>
      <span className="impact-number">{display}</span>
      <div className="impact-label">{label}</div>
    </div>
  );
}

function RevealSection({ children, className = "", delay = "" }) {
  const ref = useScrollReveal();
  return (
    <div ref={ref} className={`reveal ${delay} ${className}`}>
      {children}
    </div>
  );
}

const handleQuizlenzClick = async () => {
  await supabase.from("quizlenz_clicks").insert([{
    clicked_at: new Date().toISOString(),
    referrer: "homepage_quizlenz_section",
    user_agent: navigator.userAgent,
  }]);
  window.open("https://quizlensai.com", "_blank");
};

const schools = [
  "Aerospace Engineering","Agricultural Engineering","Biomedical Engineering",
  "Chemical Engineering","Civil Engineering","Computer Engineering",
  "Electrical/Electronic Engineering","Geological Engineering","Geomatic Engineering",
  "Industrial Engineering","Materials Engineering","Mechanical Engineering",
  "Metallurgical Engineering","Petroleum Engineering","Petrochemical Engineering",
  "Telecommunication Engineering"
];

/* ===== MAIN COMPONENT ===== */
export default function NKsStudySync() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [heroWords, setHeroWords] = useState([]);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [signupError, setSignupError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = styles;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    setHeroWords([]);
    const words = ["The", "Study", "Revolution", "Starts", "With", "Us"];
    const timers = words.map((w, i) =>
      setTimeout(() => {
        setHeroWords((prev) => {
          if (prev.find(p => p.word === w)) return prev;
          return [...prev, { word: w, red: i === 2 || i === 3 }];
        });
      }, 300 + i * 150)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setDrawerOpen(false);
  };

  const handleSignup = async () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email || !emailRegex.test(email)) {
      setSignupError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    setSignupError("");
    const { error } = await supabase
      .from("email_signups")
      .insert([{ email }]);
    if (error) {
      if (error.code === "23505") {
        setSignupError("This email is already registered!");
      } else {
        setSignupError("Something went wrong. Please try again.");
      }
    } else {
      setSubmitted(true);
      setEmail("");
    }
    setLoading(false);
  };

  return (
    <>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet"></link>

      {/* NAV */}
      <nav className={`nav${scrolled ? " scrolled" : ""}`}>
        <div className="nav-logo" onClick={() => scrollTo("hero")}>
          <div className="logo-bolt">⚡</div>
          <span><span className="logo-nk">Nk's</span> StudySync</span>
        </div>
        <ul className="nav-links">
          {[["mission","Mission"],["problem","Why NK's StudySync"],["impact","Impact"],["voices","Students"],["quizlenz","Quizlenz"],["join","Join"]].map(([id, label]) => (
           
           <li key={id}>
              <a href={`#${id}`} onClick={(e) => { e.preventDefault(); scrollTo(id); }}>{label}</a>
            </li>
          ))}
        </ul>
        <button className="nav-cta" onClick={() => navigate("/contact")}>
          Join Nk's StudySync
        </button>
        <button className="hamburger" onClick={() => setDrawerOpen(true)}>
          <span /><span /><span />
        </button>
      </nav>

      {/* DRAWER */}
      <div className={`drawer-overlay${drawerOpen ? " open" : ""}`} onClick={() => setDrawerOpen(false)} />
      <div className={`mobile-drawer${drawerOpen ? " open" : ""}`}>
        <button className="drawer-close" onClick={() => setDrawerOpen(false)}>✕</button>
        <ul>
          {[["mission","Mission"],["problem","Why StudySync"],["impact","Impact Data"],["voices","Student Voices"],["manifesto","Manifesto"],["join","Join the Movement"]].map(([id, label]) => (
            <li key={id}>
              <a href="#" onClick={(e) => { e.preventDefault(); scrollTo(id); }}>{label}</a>
            </li>
          ))}
        </ul>
      </div>

      {/* HERO */}
      <section className="hero" id="hero">
        <div className="hero-shapes">
          <div className="hero-circle-1" />
          <div className="hero-circle-2" />
          <div className="hero-grid" />
        </div>
        <div className="hero-content">
          <div className="hero-badge">🗳️ THE CAMPAIGN FOR ACADEMIC EXCELLENCE</div>
          <h1 className="hero-title">
            {heroWords.map((w, i) => (
              <span key={i} className={w.red ? "red" : ""}>{w.word} </span>
            ))}
          </h1>
          <p className="hero-sub">
            Nk's StudySync is the unified academic platform students deserve — 
            smarter scheduling, real-time collaboration, AI-powered study tools,
            and a community built for academic excellence.
          </p>
          <div className="hero-btns">
            <button className="btn-primary" onClick={() => scrollTo("join")}>Join the Campaign</button>
            <button className="btn-outline" onClick={() => scrollTo("manifesto")}>See Our Manifesto</button>
          </div>
        </div>
        <div className="scroll-cue">
          <span>SCROLL</span>
          <div className="chevron" />
        </div>
      </section>

      {/* MISSION */}
      <section className="section-amber" id="mission">
        <div className="section-inner">
          <RevealSection>
            <div style={{ textAlign:"center", marginBottom:"1rem" }}>
              <span className="section-tag">OUR MISSION</span>
            </div>
            <blockquote className="pull-quote">
              "Every student deserves tools that match their <span className="red">ambition.</span>"
            </blockquote>
          </RevealSection>
          <div className="mission-grid">
          {[
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>
    ),
    title: "Academic Equity",
    desc: "No student should fall behind because of poor tools. We're levelling the playing field for every learner, regardless of background or institution.",
    delay: "d1"
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: "Real Collaboration",
    desc: "Study groups that actually work. No more scattered chats and missed messages — focused, productive sessions that move the needle.",
    delay: "d2"
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    title: "Extra Tutorial Sessions",
    desc: "Dedicated weekend tutorials led by top-performing peers. Get the targeted help you need on your hardest topics before the week even begins.",
    delay: "d3"
  },
].map((c) => (
              <RevealSection key={c.title} className={c.delay}>
                <div className="mission-card">
                  <div className="mission-icon">{c.icon}</div>
                  <h3>{c.title}</h3>
                  <p>{c.desc}</p>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="section-black" id="problem">
        <div className="section-inner">
          <RevealSection>
            <div style={{ textAlign:"center", marginBottom:"1rem" }}>
              <span className="section-tag">THE PROBLEM</span>
            </div>
            <h2 className="section-title-amber" style={{ marginBottom:"3rem" }}>
              The Academic Crisis <span style={{ color:"#fff" }}>We're Solving</span>
            </h2>
          </RevealSection>
          <div className="problem-grid">
            <RevealSection>
              <div className="stat-cluster">
                <StatCard target={73} suffix="%" label="struggle to find past questions and study materials online" />
                <StatCard target={60} suffix="%" label="feel overwhelmed managing coursework across multiple units at once" />
                <StatCard target={80} suffix="%" label="feel burnt out before the end of semester exams even begin" />
                <StatCard target={12} suffix="%" label="feel lost after lectures and have no one to explain concepts to them" />
              </div>
            </RevealSection>
            <RevealSection className="d2">
              <div className="problem-text">
                <h2>Students Are Being Failed By Their Tools</h2>
                <p>
                  The modern student is not lazy — they're overwhelmed. They juggle calendars,
                  group chats, document platforms, flashcard apps, and note-taking tools that
                  don't talk to each other. The result? Fragmented focus, missed deadlines,
                  and grades that don't reflect real potential.
                </p>
                <p>
                  This isn't a student problem. It's a systemic failure of the tools available to them.{" "}
                  <strong style={{ color:"var(--amber)" }}>Nk's StudySync exists to fix that — once and for all.</strong>
                </p>
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* IMPACT */}
      <section className="section-red" id="impact">
        <div className="section-inner">
          <RevealSection>
            <div style={{ textAlign:"center", marginBottom:"0.5rem" }}>
              <span className="section-tag" style={{ background:"var(--amber)", color:"var(--black)" }}>THE NUMBERS</span>
            </div>
            <h2 className="section-title-white">
              The Numbers <span style={{ color:"var(--amber)" }}>Don't Lie</span>
            </h2>
            <p className="section-sub-white">Real results from real students. No spin, no cherry-picking.</p>
          </RevealSection>
          <div className="impact-grid">
            <ImpactStat target={1000}  suffix="+" format="short"    label="Students Already Using NK's StudySync" />
            <ImpactStat target={89}   suffix="%" format=""         label="Report Better Grades Within 4 Weeks" />
            <ImpactStat target={76}   suffix=""  format="millions" label="Study Sessions Completed" />
            <ImpactStat target={85}  suffix="%" format=""         label="Would Recommend to a Classmate" />
          </div>
          <RevealSection>
            <div className="logo-strip">
              <div className="logo-strip-track">
                {[...schools, ...schools].map((s, i) => (
                  <div key={i} className="logo-pill">{s}</div>
                ))}
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* VOICES */}
      <section className="section-amber" id="voices">
        <div className="section-inner">
          <RevealSection>
            <div style={{ textAlign:"center", marginBottom:"0.5rem" }}>
              <span className="section-tag">TESTIMONIALS</span>
            </div>
            <h2 className="section-title-black">
              Real Students. <span style={{ color:"var(--red)" }}>Real Results.</span>
            </h2>
            <p className="section-sub-black">
              Don't take our word for it — hear from the students already in the movement.
            </p>
          </RevealSection>
          <div className="testimonials-grid">
            {[
              { initials:"JK", name:"Jordan K.",  school:"Level 300 · Geomatic Engineering",   quote:"I used to pull all-nighters before every exam and still blank out in the hall. StudySync spread my revision across three weeks. I walked into my Fluid Mechanics paper actually feeling ready.", delay:"d1" },
              { initials:"MS", name:"Michael S.", school:"First Year · Materials Engineering", quote:"Thermodynamics almost ended my engineering dream. I was failing every quiz until NK's weekend tutorials broke it down in a way no lecturer ever did. Passed with a B+ in end of sem", delay:"d2" },
              { initials:"KO", name:"Kojo O.",   school:"Level 200 · Electrical Engineering", quote:"I used to leave Circuit Theory lectures and immediately forget everything that was said. The pace was too fast and I was too afraid to ask questions. NK's peer tutors went at my speed. Finally passed", delay:"d3" },
            ].map((t) => (
              <RevealSection key={t.name} className={t.delay}>
                <div className="testimonial-card">
                  <div className="big-quote">"</div>
                  <div className="stars">★★★★★</div>
                  <blockquote>"{t.quote}"</blockquote>
                  <div className="author-row">
                    <div className="avatar">{t.initials}</div>
                    <div className="author-info">
                      <strong>{t.name}</strong>
                      <span>{t.school}</span>
                    </div>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* MANIFESTO */}
      <section className="section-black" id="manifesto">
        <div className="section-inner">
          <RevealSection>
            <div style={{ textAlign:"center", marginBottom:"0.5rem" }}>
              <span className="section-tag">OUR PLATFORM</span>
            </div>
            <h2 className="section-title-amber" style={{ marginBottom:"3rem" }}>
              Our Five-Point <span style={{ color:"#fff" }}>Academic Manifesto</span>
            </h2>
          </RevealSection>
          <div className="manifesto-list">
        {[
          { n:"01", heading:"Lectures Are Not Enough —",          sub:"And We Are Filling The Gap",    desc:"A 75-minute lecture moving at full pace cannot reach every student. NK's StudySync exists in the space between the lecture hall and the examination hall — and that space is where we do our best work.", delay:"d1" },
          { n:"02", heading:"Confusion Is Not Failure —",          sub:"It Is Just The Starting Point", desc:"Feeling lost after a lecture does not mean you are not smart enough. It means you need a different explanation. We provide that explanation — without judgement, without rushing, without giving up on you.", delay:"d2" },
          { n:"03", heading:"Resources Should Be Free —",          sub:"And Easy To Find",              desc:"Students should not have to beg seniors on WhatsApp for past questions the night before an exam. We organise, verify, and share every resource our community needs completely free of charge.", delay:"d3" },
          { n:"04", heading:"Group Work Should Actually Work —",   sub:"We Make That Happen",           desc:"We structure study groups so they produce results instead of wasted evenings. Focused agendas, peer accountability, and shared goals turn group sessions into real academic progress.", delay:"d2" },
          { n:"05", heading:"No One Studies Alone —",              sub:"Not On Our Watch",              desc:"The loneliest moment in engineering is sitting with a concept you cannot crack and having no one to call. We make sure that moment does not exist for any student in our community.", delay:"d3" },
        ].map((m) => (
          <RevealSection key={m.n} className={m.delay}>
            <div className="manifesto-item">
              <div className="manifesto-num">{m.n}</div>
              <div className="manifesto-content">
                <h3>
                  <span style={{ color:"var(--amber)" }}>{m.heading}</span> {m.sub}
                </h3>
                <p>{m.desc}</p>
              </div>
            </div>
          </RevealSection>
        ))}
      </div>
        </div>
      </section>

      {/* QUIZLENZ */}
<section className="section-black" id="quizlenz" style={{ borderTop: "4px solid var(--amber)", borderBottom: "4px solid var(--amber)" }}>
  <div className="section-inner" style={{ padding: "100px 5%" }}>

    {/* Header */}
    <RevealSection>
      <div style={{ textAlign: "center", marginBottom: "0.75rem" }}>
        <span className="section-tag" style={{ background: "var(--amber)", color: "var(--black)", fontFamily: "'Oswald', sans-serif" }}>
          POWERED BY AI
        </span>
      </div>
      <h2 className="section-title-amber" style={{ marginBottom: "0.75rem" }}>
        Meet <span style={{ color: "#fff" }}>Quizlenz —</span>
      </h2>
      <h2 className="section-title-white" style={{ marginTop: 0, marginBottom: "1rem", fontSize: "clamp(1.5rem, 3vw, 2.4rem)" }}>
        Your Personal AI Study Partner
      </h2>
      <p className="section-sub-white" style={{ maxWidth: "780px", margin: "0 auto 3.5rem" }}>
        Upload any lecture note, PDF, or past question — and Quizlenz transforms it into 
        interactive quizzes, smart summaries, and deep-dive Q&amp;A sessions. 
        Think of it as NotebookLM, built specifically for the way engineering students actually study.
      </p>
    </RevealSection>

    {/* Feature Cards Grid */}
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: "1.5rem",
      marginBottom: "4rem",
      width: "100%"
    }}>
      {[
        {
          icon: (
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--amber)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
          ),
          label: "UPLOAD",
          title: "Drop Any Material",
          desc: "Lecture slides, PDF textbooks, scanned past questions, handwritten notes — Quizlenz reads it all. No reformatting, no copy-pasting. Just upload and go.",
        },
        {
          icon: (
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--amber)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          ),
          label: "ASK",
          title: "Ask It Anything",
          desc: "\"Explain Thevenin's theorem from slide 14 like I'm in Form 3.\" \"What are the five most likely exam questions from this chapter?\" Quizlenz answers from your own material.",
        },
        {
          icon: (
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--amber)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 11 12 14 22 4"/>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
            </svg>
          ),
          label: "QUIZ",
          title: "Auto-Generated Quizzes",
          desc: "Quizlenz builds custom MCQs, fill-in-the-blank, and theory questions directly from your notes. Not generic internet questions — questions built from what your lecturer actually taught.",
        },
        
      ].map((card, i) => (
        <RevealSection key={card.title} className={`d${i + 1}`}>
          <div style={{
            background: "rgba(255,255,255,0.04)",
            border: "2px solid rgba(245,163,0,0.25)",
            borderRadius: "20px",
            padding: "2.2rem",
            height: "100%",
            transition: "all 0.4s cubic-bezier(0.23, 1, 0.32, 1)",
            cursor: "default",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.border = "2px solid var(--amber)";
            e.currentTarget.style.background = "rgba(245,163,0,0.07)";
            e.currentTarget.style.transform = "translateY(-6px)";
            e.currentTarget.style.boxShadow = "0 16px 40px rgba(245,163,0,0.15)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.border = "2px solid rgba(245,163,0,0.25)";
            e.currentTarget.style.background = "rgba(255,255,255,0.04)";
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              background: "rgba(245,163,0,0.12)", border: "1.5px solid rgba(245,163,0,0.3)",
              borderRadius: "8px", padding: "0.35rem 0.8rem",
              marginBottom: "1.2rem",
            }}>
              {card.icon}
              <span style={{
                fontFamily: "'Oswald', sans-serif", fontSize: "0.7rem",
                fontWeight: 700, letterSpacing: "0.15em", color: "var(--amber)",
              }}>{card.label}</span>
            </div>
            <h3 style={{
              fontFamily: "'Oswald', sans-serif", fontSize: "1.35rem",
              color: "#fff", marginBottom: "0.75rem",
            }}>{card.title}</h3>
            <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.8, fontSize: "0.95rem", fontWeight: 600 }}>
              {card.desc}
            </p>
          </div>
        </RevealSection>
      ))}
    </div>

    {/* Comparison Block */}
    <RevealSection className="d2">
      <div style={{
        background: "rgba(245,163,0,0.06)",
        border: "2px solid rgba(245,163,0,0.2)",
        borderRadius: "24px",
        padding: "3rem",
        maxWidth: "860px",
        margin: "0 auto 4rem",
        width: "100%",
      }}>
        <p style={{
          fontFamily: "'Oswald', sans-serif", fontSize: "0.75rem",
          letterSpacing: "0.18em", color: "var(--amber)", marginBottom: "1.2rem",
          textTransform: "uppercase",
        }}>How It Stacks Up</p>
        <h3 style={{
          fontFamily: "'Oswald', sans-serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
          color: "#fff", marginBottom: "2rem", lineHeight: 1.2,
        }}>
          NotebookLM is powerful.<br />
          <span style={{ color: "var(--amber)" }}>Quizlenz is built for <em style={{ fontStyle: "normal", color: "var(--red)" }}>your</em> exams.</span>
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          {[
            { label: "NotebookLM", points: ["General purpose AI notebook", "Great for research & podcasts", "No exam-focused quiz mode", "Not optimised for engineering courses"], color: "rgba(255,255,255,0.15)", textColor: "rgba(255,255,255,0.55)", tag: "General Tool" },
            { label: "Quizlenz", points: ["Built for African engineering students", "Auto-generates past-question style quizzes", "Understands your specific course material", "Integrated with NK's StudySync community"], color: "rgba(245,163,0,0.1)", textColor: "rgba(255,255,255,0.85)", tag: "Your Tool", highlight: true },
          ].map((col) => (
            <div key={col.label} style={{
              background: col.color,
              border: col.highlight ? "2px solid rgba(245,163,0,0.4)" : "2px solid rgba(255,255,255,0.08)",
              borderRadius: "16px",
              padding: "1.5rem",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem" }}>
                <span style={{
                  fontFamily: "'Oswald', sans-serif", fontSize: "1.1rem",
                  color: col.highlight ? "var(--amber)" : "rgba(255,255,255,0.5)", fontWeight: 700,
                }}>{col.label}</span>
                {col.highlight && (
                  <span style={{
                    background: "var(--amber)", color: "var(--black)",
                    fontSize: "0.65rem", fontWeight: 800,
                    letterSpacing: "0.1em", padding: "0.2rem 0.6rem",
                    borderRadius: "100px", fontFamily: "'Oswald', sans-serif",
                  }}>✦ {col.tag}</span>
                )}
              </div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {col.points.map((pt, i) => (
                  <li key={i} style={{
                    display: "flex", alignItems: "flex-start", gap: "0.6rem",
                    color: col.textColor, fontSize: "0.88rem", lineHeight: 1.5, fontWeight: 600,
                  }}>
                    <span style={{ color: col.highlight ? "var(--amber)" : "rgba(255,255,255,0.3)", flexShrink: 0, marginTop: "2px" }}>
                      {col.highlight ? "✓" : "–"}
                    </span>
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </RevealSection>

    {/* CTA */}
    <RevealSection className="d3">
      <div style={{ textAlign: "center" }}>
        <p style={{
          color: "rgba(255,255,255,0.55)", fontSize: "0.95rem",
          fontWeight: 700, marginBottom: "1.5rem", letterSpacing: "0.02em",
        }}>
          Free to use. No account needed to try it.
        </p>
        <button
          onClick={handleQuizlenzClick}
          style={{
            background: "var(--amber)",
            color: "var(--black)",
            border: "3px solid var(--amber)",
            padding: "1rem 2.8rem",
            fontFamily: "'Oswald', sans-serif",
            fontSize: "1.1rem",
            fontWeight: 700,
            letterSpacing: "0.08em",
            cursor: "pointer",
            borderRadius: "10px",
            boxShadow: "6px 6px 0 var(--red)",
            transition: "all 0.3s cubic-bezier(0.23, 1, 0.32, 1)",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.6rem",
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translate(3px,3px)"; e.currentTarget.style.boxShadow = "3px 3px 0 var(--red)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "translate(0,0)"; e.currentTarget.style.boxShadow = "6px 6px 0 var(--red)"; }}
        >
          Try Quizlenz Free →
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
        </button>
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.8rem", marginTop: "1rem", fontWeight: 600 }}>
          Trusted by NK's StudySync students across KNUST engineering departments
        </p>
      </div>
    </RevealSection>

  </div>
</section>

      {/* JOIN */}
      <section className="join-section" id="join">
        <div className="section-inner">
          <RevealSection>
            <div style={{ textAlign:"center", marginBottom:"0.5rem" }}>
              <span className="section-tag" style={{ background:"var(--black)", color:"var(--amber)" }}>JOIN THE MOVEMENT</span>
            </div>
            <h2 className="section-title-black" style={{ marginBottom:"1rem" }}>
              Be Part of the <span style={{ color:"var(--red)" }}>NK's StudySync Movement</span>
            </h2>
            <p className="section-sub-black">
              Sign up to get early access, vote for Nk's StudySync as your institution's official platform,
              and join 500 students changing how we learn.
            </p>
          </RevealSection>

          <RevealSection className="d1">
            {submitted && (
              <span className="signup-msg-success">✅ You're in! Welcome to the movement.</span>
            )}
            {signupError && (
              <span className="signup-msg-error">⚠️ {signupError}</span>
            )}
            {!submitted && (
              <div className="signup-form">
                
                <input
                  type="email"
                  placeholder="Enter your student email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSignup()}
                  disabled={loading}
                />
                <button onClick={() => navigate("/contact")}>
                  Join Now →
                </button>
              </div>
              
            )}

            {/* ADD THIS — Full Registration CTA button */}
           <div style={{ 
  marginTop: "2rem", 
  textAlign: "center", 
  display: "flex", 
  justifyContent: "center", 
  gap: "1.2rem", 
  flexWrap: "wrap" 
}}>
  <button
    className="btn-primary"
    onClick={() => navigate("/contact")}
    style={{ fontSize: "1rem", padding: "0.9rem 2.4rem" }}
  >
    Join Nk's StudySync →
  </button>

</div>


            <div className="ss-socials">
              
              <span className="ss-soc-lbl">Spread the word:</span>

              <button className="ss-soc-btn" onClick={() => window.open('https://x.com/nksstudysync?s=21','_blank')}>
                <span style={{ background:"#000000", borderRadius:"6px", width:"26px", height:"26px", display:"inline-flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.632 5.905-5.632Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </span>
                Twitter
              </button>

              <button className="ss-soc-btn" onClick={() => window.open('https://t.me/NKstudysync','_blank')} >
                <span style={{ background:"#26A5E4", borderRadius:"6px", width:"26px", height:"26px", display:"inline-flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </span>
                Telegram
              </button>

              <button className="ss-soc-btn" onClick={() => window.open('https://whatsapp.com/channel/0029VbBhEgpGE56o9hpRwl3h','_blank')}>
                <span style={{ background:"#25D366", borderRadius:"6px", width:"26px", height:"26px", display:"inline-flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884zm8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                  </svg>
                </span>
                WhatsApp
              </button>

              <button className="ss-soc-btn" onClick={() => window.open('https://www.tiktok.com/@nksstudysync?_r=1&_t=ZS-94YRfL8NmxY','_blank')}>
                <span style={{ background:"#010101", borderRadius:"6px", width:"26px", height:"26px", display:"inline-flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.28 6.28 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
                  </svg>
                </span>
                TikTok
              </button>

              <button className="ss-soc-btn"  onClick={() => window.open("https://youtube.com/@nksstudysync?si=muGnVD2CntcJ5kTT","_blank")}>
                <span style={{ background:"#FF0000", borderRadius:"6px", width:"26px", height:"26px", display:"inline-flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </span>
                YouTube
              </button>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-top">
            <div className="footer-brand">
              <div className="footer-logo-text">
                <span className="red">Nk's</span> StudySync
              </div>
              <div className="footer-tagline">Built by students, for students. Shaping Tomorrow's Engineers Today.</div>
            </div>
            <div className="footer-links">
              {["About Founder","Blog","Privacy Policy","Contact"].map((l) => (
                <a key={l} href="#">{l}</a>
              ))}
            </div>
          </div>
          <div className="footer-bottom">
            <span className="footer-copy">© 2025 Nk's StudySync. All rights reserved.</span>
            <div className="footer-socials">
              <a href="https://youtube.com/@nksstudysync?si=muGnVD2CntcJ5kTT" target="_blank" className="footer-social-icon" aria-label="YouTube">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a href="https://t.me/NKstudysync" className="footer-social-icon"  target="_blank" aria-label="Telegram">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </a>
              <a href="https://www.tiktok.com/@nksstudysync?_r=1&_t=ZS-94YRfL8NmxY" target="_blank" className="footer-social-icon" aria-label="TikTok">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.28 6.28 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
                </svg>
              </a>
              <a href="https://x.com/nksstudysync?s=21" className="footer-social-icon" target="_blank" aria-label="X (Twitter)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.632 5.905-5.632Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://whatsapp.com/channel/0029VbBhEgpGE56o9hpRwl3h" target="_blank" className="footer-social-icon" aria-label="WhatsApp">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884zm8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}