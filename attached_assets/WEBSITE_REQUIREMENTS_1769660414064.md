# 🌐 Website Requirements Document: AutoReturn

## 1. Project Overview
**Product Name:** AutoReturn  
**Tagline:** "Your Voice. Your AI. Your Privacy."  
**Type:** Unified Communication Platform (Desktop Application)  
**Core Value:** Privacy-first, local AI automation for Gmail and Slack using Voice Control.

---

## 2. Visual Identity & Branding
The website MUST reflect the premium, tech-forward, and privacy-conscious nature of the application.

*   **Color Palette:**
    *   **Primary (Dark):** `#003135` (Deep Midnight Teal)
    *   **Secondary (Primary Action):** `#0FA4AF` (Vibrant Cyan)
    *   **Accent (Soft):** `#AFDDE5` (Ice Blue)
    *   **Alert/Badge:** `#964734` (Burnt Sienna)
*   **Typography:** Modern Sans-Serif (e.g., **Inter**, **Outfit**, or **Roboto**).
*   **Design Aesthetic:** Sleek, glassmorphic UI elements, dark mode by default, subtle glowing cyan accents, and high-quality iconography.

---

## 3. Website Structure (Sitemap)

### A. Home Page (The "Wow" Page)
*   **Hero Section:** 
    *   High-impact headline: "Your Voice, Your AI, Your Privacy."
    *   Sub-headline: "The unified interface for Gmail & Slack that runs 100% locally."
    *   **Primary CTA:** Direct Download Button (Auto-detects OS: Linux/Windows/Mac).
    *   **Background Effect:** **CRITICAL:** Implement an interactive particle system or "sand/fluid" effect in the background (similar to high-end AI brand aesthetics like Antigravity). Particles should react to mouse movement and scroll, using a library like **Three.js**, **Particle.js**, or **Canvas API**. Use vibrant cyan (`#0FA4AF`) for the particles on a deep teal (`#003135`) background.
    *   Background: Interactive cyan light trails, glassmorphism effects, and soft glowing orbits.
*   **Feature Highlight Grid:**
    1.  **Unified Inbox:** Gmail & Slack in a single, beautiful view.
    2.  **Voice-First Interface:** Hands-free operation with "Hey Auto" wake word.
    3.  **Privacy-First AI:** All processing stays on your machine (Powered by Ollama).
    4.  **Smart Task Extraction:** Automatically find action items in your messages.
    5.  **Draft Generation:** AI-suggested replies that learn your tone.
    6.  **Quiet Hours:** Intelligent notification filtering to protect your focus.
*   **Comparison Section:** A table/graphic showing **AUTOCOM (Local AI)** vs. **Cloud AI Competitors** (Highlighting Privacy, Speed, and Offline capability).

### B. Download Page
*   Card-based layout for different OS:
    *   **Linux:** `.AppImage`, `.deb`, `.rpm`
    *   **Windows:** `.exe` (Installer), `.zip` (Portable)
    *   **macOS:** `.dmg` (Universal)
*   Release notes for the latest version (v1.0.0).

### C. Features & Documentation
*   Detailed breakdown of Voice Commands (Table of common commands).
*   Setup Guide: How to connect Gmail and Slack OAuth securely.
*   Privacy Policy: Explaining why local AI is safer.

---

## 4. Technical Requirements for Website Maker
*   **Framework:** Next.js or Vite (React/Vue) for high performance.
*   **Animations:** Use Framer Motion or GSAP for smooth entrance animations and micro-interactions.
*   **Responsive Design:** Fully optimized for Mobile and Desktop.
*   **SEO:** Optimizing for keywords like "Private AI Assistant", "Unified Inbox", "Local LLM Desktop App".
*   **Performance:** Image optimization, lazy loading, and <1s load time.

---

## 5. Upcoming Ideas (Roadmap for v2.0)
The website should have a "Roadmap" or "Future" section to show project longevity:
1.  **Semantic Context Search:** Search through all history using concepts, not just keywords.
2.  **Cross-Platform Voice Sync:** Control your desktop app from a local network mobile bridge.
3.  **Advanced Tone Matching:** Fine-tune your local model on your own sent messages to sound exactly like you.
4.  **Local Knowledge Base:** Integrate local PDFs and documents into the communication context.

---

## 6. Call to Action (Footer)
*   Final "Download Now" button.
*   Github link (if open source).
*   Mailing list for updates.
*   "Built with Privacy in Mind."

---

*Prepared by: Antigravity AI (Kashan Saeed's FYP Partner)*
