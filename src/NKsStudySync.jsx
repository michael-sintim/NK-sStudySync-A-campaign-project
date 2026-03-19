import { useState, useEffect, useRef } from "react";

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
  /* FIX 1: Added missing semicolon after background value */
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
    max-width: 1400px;
    width: 100%;
    margin: 0 auto;
    padding: 100px 2%;
  }
  .section-red .logo-strip {
    overflow: hidden;
    border-top: 3px solid rgba(255,255,255,0.3);
    padding-top: 2rem;
    width: 100%;
  }
  .section-red .logo-pill {
    background: rgba(255,255,255,0.15);
    color: var(--white);
    border: 2px solid rgba(255,255,255,0.4);
    padding: 0.8rem 2rem;
    font-family: 'Oswald', sans-serif;
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    white-space: nowrap;
    box-shadow: 4px 4px 0 rgba(0,0,0,0.25);
  }
  .section-black {
    width: 100%;
    background: linear-gradient(160deg, #111111 0%, #1a1a1a 100%);
    border-top: 4px solid var(--amber);
    border-bottom: 4px solid var(--amber);
  }
  /* FIX 2: Restored join-section background properly */
  .join-section {
    width: 100%;
    background: #F5A300;
    border-top: 5px solid var(--black);
    border-bottom: 5px solid var(--black);
  }

  .section-inner {
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
    padding: 100px 5%;
  }

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

  .mission-grid, .features-grid, .testimonials-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    width: 100%;
    margin-top: 3rem;
  }
  .mission-card, .feature-card, .testimonial-card {
    background: var(--amber-light);
    border: 3px solid var(--black);
    border-radius: 20px;
    padding: 2.5rem;
    box-shadow: 8px 8px 0 var(--black);
    transition: var(--ease);
    width: 100%;
  }
  .mission-card:hover, .feature-card:hover, .testimonial-card:hover {
    transform: translateY(-8px);
    box-shadow: 12px 12px 0 var(--black);
  }
  .mission-icon, .feature-icon { font-size: 2.5rem; margin-bottom: 1.5rem; display: block; }
  .mission-card h3, .feature-card h3 { font-size: 1.5rem; color: var(--red); margin-bottom: 0.75rem; }
  .mission-card p, .feature-card p { color: var(--black-soft); line-height: 1.7; font-size: 1rem; font-weight: 600; }

  /* ===== PROBLEM ===== */
  .problem-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; width: 100%; }
  .stat-cluster { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; width: 100%; }
  .stat-card {
    background: var(--amber-light); border: 3px solid var(--black);
    border-radius: 16px; padding: 2rem; text-align: center;
    box-shadow: 6px 6px 0 var(--black); transition: var(--ease); width: 100%;
  }
  .stat-card:hover { transform: translate(-3px,-3px); box-shadow: 9px 9px 0 var(--black); }
  .stat-number { font-family: 'Oswald', sans-serif; font-size: 3rem; font-weight: 700; color: var(--white); display: block; line-height: 1; }
  .stat-label { font-size: 0.85rem; color: var(--black); margin-top: 0.5rem; line-height: 1.4; font-weight: 700; }
  .problem-text { width: 100%; }
  .problem-text h2 { font-size: clamp(2rem, 3.5vw, 2.8rem); color: var(--amber); margin-bottom: 1.5rem; }
  .problem-text p { color: rgba(255,255,255,0.85); line-height: 1.9; font-size: 1.1rem; font-weight: 600; margin-bottom: 1rem; }

  /* ===== IMPACT ===== */
  .impact-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
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
  .signup-form { display: flex; max-width: 550px; width: 100%; margin: 0 auto 2rem; }
  .signup-form input {
    flex: 1; padding: 1.2rem 1.5rem;
    background: white; border: 3px solid var(--black); border-right: none;
    color: var(--black); font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 1rem; font-weight: 700;
    outline: none; border-radius: 12px 0 0 12px;
  }
  .signup-form button {
    background: var(--black); color: var(--amber);
    border: 3px solid var(--black); padding: 1.2rem 2rem;
    font-family: 'Oswald', sans-serif; font-size: 1rem; font-weight: 700;
    letter-spacing: 0.05em; cursor: pointer; border-radius: 0 12px 12px 0;
    transition: background 0.2s;
    }
    .signup-form button:hover { background: var(--amber); color:black}
    .signup-form input::placeholder { color: rgba(0,0,0,0.4); }

  /* FIX 4: Added missing ss-socials and ss-soc-lbl classes */
  .ss-socials {
    display: flex; align-items: center; justify-content: center;
    gap: 0.5rem; flex-wrap: wrap; margin-top: 1.5rem; width: 100%;
  }
  .ss-soc-lbl {
    font-weight: 800; font-size: 0.85rem; color: var(--black);
    margin-right: 0.5rem;
  }
  .ss-soc-btn {
    display: inline-flex; align-items: center; gap: 8px;
    background: transparent;
    color: black;
    border: 2px solid black;
    padding: 0.5rem 1.1rem; cursor: pointer; border-radius: 6px;
    margin: 4px;
    font-family: 'Oswald', sans-serif; font-size: 0.8rem; font-weight: 700;
    letter-spacing: 0.06em; transition: transform 0.18s, box-shadow 0.18s, border-color 0.18s;
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
  .footer-socials { display: flex; gap: 0.75rem; }
  .footer-social-icon {
    width: 36px; height: 36px;
    background: rgba(255,255,255,0.08);
    border: 2px solid rgba(255,255,255,0.15);
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    color: rgba(255,255,255,0.5);
    font-size: 1rem;
    text-decoration: none;
    transition: all 0.2s;
  }
  .footer-social-icon:hover { background: var(--amber); color: var(--black); border-color: var(--amber); }

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
    .signup-form input { border-right: 3px solid var(--black); border-bottom: none; border-radius: 12px 12px 0 0; }
    .signup-form button { border-radius: 0 0 12px 12px; }
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

/* FIX 3: Corrected useCountUp — format is now properly used in both StatCard and ImpactStat */
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
const schools = [
  "Aerospace Engineering",
  "Agricultural Engineering",
  "Biomedical Engineering",
  "Chemical Engineering",
  "Civil Engineering",
  "Computer Engineering",
  "Electrical/Electronic Engineering",
  "Geological Engineering",
  "Geomatic Engineering",
  "Industrial Engineering",
  "Materials Engineering",
  "Mechanical Engineering",
  "Metallurgical Engineering",
  "Petroleum Engineering",
  "Petrochemical Engineering",
  "Telecommunication Engineering"
];

/* ===== MAIN COMPONENT ===== */
export default function NKsStudySync() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [heroWords, setHeroWords] = useState([]);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = styles;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  
// BROKEN — appends on every render
// FIXED — resets first, prevents duplicates
useEffect(() => {
  setHeroWords([]);
  const words = ["The", "Study", "Revolution", "Starts", "With", "Us"];
  const timers = words.map((w, i) =>
    setTimeout(
      () => setHeroWords((prev) => {
        if (prev.find(p => p.word === w)) return prev; // guard against duplicates
        return [...prev, { word: w, red: i === 2 || i === 3 }];
      }),
      300 + i * 150
    )
  );
  return () => timers.forEach(clearTimeout); // cleanup on unmount
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

  return (
    <>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />

      {/* NAV */}
      <nav className={`nav${scrolled ? " scrolled" : ""}`}>
        <div className="nav-logo" onClick={() => scrollTo("hero")}>
          <div className="logo-bolt">⚡</div>
          <span><span className="logo-nk">Nk's</span> StudySync</span>
        </div>
        <ul className="nav-links">
          {[["mission","Mission"],["problem","Why NK's StudySync"],["features","Features"],["impact","Impact"],["voices","Students"],["join","Join"]].map(([id, label]) => (
            <li key={id}>
              <a href={`#${id}`} onClick={(e) => { e.preventDefault(); scrollTo(id); }}>{label}</a>
            </li>
          ))}
        </ul>
        <button className="nav-cta" onClick={() => scrollTo("join")}>Join Nk's StudySync</button>
        <button className="hamburger" onClick={() => setDrawerOpen(true)}>
          <span /><span /><span />
        </button>
      </nav>

      {/* DRAWER */}
      <div className={`drawer-overlay${drawerOpen ? " open" : ""}`} onClick={() => setDrawerOpen(false)} />
      <div className={`mobile-drawer${drawerOpen ? " open" : ""}`}>
        <button className="drawer-close" onClick={() => setDrawerOpen(false)}>✕</button>
        <ul>
          {[["mission","Mission"],["problem","Why StudySync"],["features","Features"],["impact","Impact Data"],["voices","Student Voices"],["manifesto","Manifesto"],["join","Join the Movement"]].map(([id, label]) => (
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
            <button className="btn-outline" onClick={() => scrollTo("features")}>See How It Works</button>
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
              { icon:"📚", title:"Academic Equity",       desc:"No student should fall behind because of poor tools. We're levelling the playing field for every learner, regardless of background or institution.", delay:"d1" },
              { icon:"🤝", title:"Real Collaboration",    desc:"Study groups that actually work. No more scattered chats and missed messages — focused, productive sessions that move the needle.", delay:"d2" },
              { icon:"🧠", title:"Adaptive Intelligence", desc:"AI that understands how you think, not just what you're studying. Personalised to your pace, your subjects, your goals.", delay:"d3" },
            ].map((c) => (
              <RevealSection key={c.title} className={c.delay}>
                <div className="mission-card">
                  <span className="mission-icon">{c.icon}</span>
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
                <StatCard target={73} suffix="%" label="of students report disorganised study habits" />
                <StatCard target={60} suffix="%" label="miss deadlines due to poor scheduling" />
                <StatCard target={80} suffix="%" label="use 5+ disconnected apps to study" />
                <StatCard target={12} suffix="%" label="feel their study tools are actually effective" />
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

      {/* FEATURES */}
      <section className="section-amber-deep" id="features">
        <div className="section-inner">
          <RevealSection>
            <div style={{ textAlign:"center", marginBottom:"0.5rem" }}>
              <span className="section-tag">THE SOLUTION</span>
            </div>
            <h2 className="section-title-black">
              One Platform. <span style={{ color:"var(--red)" }}>Total Academic Control.</span>
            </h2>
            <p className="section-sub-black">
              Everything you need to study smarter — built into a single, seamless experience.
            </p>
          </RevealSection>
          <div className="features-grid">
            {[
              { icon:"🗓️", title:"Smart Study Scheduler",  desc:"AI builds your weekly study plan around your deadlines, energy patterns, and subject weighting. Never scramble before an exam again.", delay:"d1" },
              { icon:"👥", title:"Real-Time Study Rooms",   desc:"Live collaboration with screen sharing, shared whiteboards, and Pomodoro timers — productive sessions, every single time.", delay:"d2" },
              { icon:"📊", title:"Progress Dashboard",      desc:"Visual performance tracking across all subjects. See your gaps, celebrate your wins, and stay on track to your goals.", delay:"d3" },
              { icon:"🤖", title:"AI Tutor Integration",    desc:"Ask questions, get instant contextual answers. The AI tutor understands your curriculum and adapts to your learning style.", delay:"d1" },
              { icon:"📁", title:"Resource Hub",            desc:"Centralised notes, past papers, and study materials — organised by subject, topic, and year level. Always one click away.", delay:"d2" },
              { icon:"🔔", title:"Smart Reminders",         desc:"Adaptive nudges that know when you need a push vs. when you need a break. Study sustainably, not frantically.", delay:"d3" },
            ].map((f) => (
              <RevealSection key={f.title} className={f.delay}>
                <div className="feature-card">
                  <span className="feature-icon">{f.icon}</span>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              </RevealSection>
            ))}
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
            <ImpactStat target={300}   suffix="+" format="short"   label="Students Already Using NK's StudySync" />
            <ImpactStat target={89}      suffix="%" format=""        label="Report Better Grades Within 4 Weeks" />
            <ImpactStat target={80} suffix=""  format="millions" label="Study Sessions Completed" />
            <ImpactStat target={100}      suffix="%" format=""        label="Would Recommend to a Classmate" />
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
              { initials:"JK", name:"Jordan K.", school:"Level 300 · Geomatic Engineering", quote:"The study rooms are incredible. My group went from scattered WhatsApp chats to focused, productive sessions. Our group assignment marks went up across the board.", delay:"d2" },
              { initials:"MS", name:"Michael S.", school:"First Year · Materials Engineering", quote:"The study rooms are incredible. My group went from scattered WhatsApp chats to focused, productive sessions. Our group assignment marks went up across the board.", delay:"d2" },
              { initials:"PM", name:"Priya M.",  school:"Level 200 · Electrical Engineering",     quote:"The AI tutor actually explains things in a way that makes sense for how I think. It's like having a personal tutor available at 2am before an exam.", delay:"d3" },
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
              { n:"01", heading:"Equal Access —",               sub:"Free Tier For All",           desc:"Every student deserves access to the core tools they need to succeed. No paywalls on essential features. No student left behind because they can't afford a premium plan.", delay:"d1" },
              { n:"02", heading:"Student Privacy First —",      sub:"Zero Data Selling",           desc:"We will never sell your data to advertisers. Full GDPR and Privacy Act compliance. Your academic life is yours — we're just here to help you manage it.", delay:"d2" },
              { n:"03", heading:"Teacher Integration —",        sub:"Built With Educators",        desc:"StudySync is co-designed with teachers, tutors, and academic staff. It fits into existing school infrastructure, not against it.", delay:"d3" },
              { n:"04", heading:"Continuous Innovation —",      sub:"Monthly Updates",             desc:"We ship new features every month, driven entirely by student feedback. The product roadmap is voted on by the community. You decide what we build next.", delay:"d2" },
              { n:"05", heading:"Community Over Competition —", sub:"Collaborative Not Cutthroat", desc:"Academic success shouldn't be a zero-sum game. StudySync is designed to lift every student up — not to pit you against your classmates.", delay:"d3" },
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
            <div className="signup-form">
              <input type="email" placeholder="Enter your student email..." />
              <button>Join Now →</button>
            </div><div className="ss-socials">
  <span className="ss-soc-lbl">Spread the word:</span>

  {/* X / Twitter — #000000 */}
  <button className="ss-soc-btn">
    <span style={{ background:"#000000", borderRadius:"6px", width:"26px", height:"26px", display:"inline-flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.632 5.905-5.632Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    </span>
    Twitter
  </button>

  {/* Instagram — gradient */}
  <button className="ss-soc-btn">
    <span style={{ background:"linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)", borderRadius:"6px", width:"26px", height:"26px", display:"inline-flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
      </svg>
    </span>
    Instagram
  </button>

  {/* WhatsApp — #25D366 */}
  <button className="ss-soc-btn">
    <span style={{ background:"#25D366", borderRadius:"6px", width:"26px", height:"26px", display:"inline-flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884zm8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
      </svg>
    </span>
    WhatsApp
  </button>

  {/* TikTok — #010101 */}
  <button className="ss-soc-btn">
    <span style={{ background:"#010101", borderRadius:"6px", width:"26px", height:"26px", display:"inline-flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.28 6.28 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
      </svg>
    </span>
    TikTok
  </button>

  {/* YouTube — #FF0000 */}
  <button className="ss-soc-btn">
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
              {["About","Features","Blog","Privacy Policy","Contact"].map((l) => (
                <a key={l} href="#">{l}</a>
              ))}
            </div>
          </div>
          <div className="footer-bottom">
            <span className="footer-copy">© 2025 Nk's StudySync. All rights reserved.</span>
            <div className="footer-socials">
              <a href="#" className="footer-social-icon" aria-label="YouTube">
                <i className="fab fa-youtube"></i>
              </a>
              <a href="#" className="footer-social-icon" aria-label="Telegram">
                <i className="fab fa-telegram-plane"></i>
              </a>
              <a href="#" className="footer-social-icon" aria-label="TikTok">
                <i className="fab fa-tiktok"></i>
              </a>
              <a href="#" className="footer-social-icon" aria-label="X (Twitter)">
                <i className="fab fa-x-twitter"></i>
              </a>
              <a href="#" className="footer-social-icon" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}