# **Heavenscopes**

![Heavenscopes logo](/frontend/public/heavenscope-high-resolution-logo-transparent.png)

## **Introduction**
Heavenscopes is a web application designed for enthusiasts of amateur astronomy and astrophotography. It fosters a community of users who want to share their knowledge, images, and experiences of observing the Solar System. The app provides real-time astronomical data to help users locate and observe planets through telescopes or cameras.  

This project was built entirely from scratch as part of a web development course, with the exception of external APIs for astronomical and weather data. The goal is to inspire users to share the wonder of seeing planets through a telescope, just as I have been inspired.  

---

## **Features**
- **User Authentication**: Registration and login system to access all app features.
- **Real-Time Planetary Data**: Integration with the *Visible Planets API* by csymlstd for accurate planetary positions and *OpenWeather API* for weather and geolocation data.
- **Social Interaction**:
  - Share posts containing images and text.
  - Like and comment on posts.
  - Follow other users to create a personalized feed.
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **Dark Observation Mode**: Adjusts text and image brightness for night-time use.
- **Astronomical Tools**:
  - A 2D sky map displaying planetary positions at the current time, +3h, +6h, and +12h.
  - A summary table with detailed planetary information (e.g., constellation, RA, Dec, azimuth, altitude).
  - Current weather conditions for observing.
- **User-Customizable Settings**: Change location and elevation to refine observational data.

---

## **Tech Stack**
### **Frontend**:
- React, React Router DOM
- Bootstrap, Material-UI
- Three.js  

### **Backend**:
- Node.js, Express
- MongoDB, Mongoose
- Cloudinary (for media uploads)
- Bcrypt (password hashing)
- JSON Web Tokens (JWT) for authentication

### **Hosting**:
- **Frontend**: Vercel
- **Backend**: Render  

---

## **Setup**
To run this project locally, follow these steps:  

### **Prerequisites**:
- Install [Node.js](https://nodejs.org/).
- Obtain API keys for *OpenWeather*, *MongoDB* and *Cloudinary*.

### **Instructions**:
1. Clone the repository:  
   ```bash
   git clone https://github.com/markisgod92/heavenscopes.git
   ```
2. Navigate to the frontend and backend directories to install dependencies:  
   ```bash
   cd frontend
   npm install
   cd ../backend
   npm install
   ```
3. Fill `.env.sample` in the `frontend` and `backend` directories with your environment variables and remove the `.sample` extension:

4. Start the app:
   - **Backend**:  
     ```bash
     npm run dev
     ```
   - **Frontend**:  
     ```bash
     npm run dev
     ```

---

## **Future Improvements**
- Implementing a notification system for interactions such as new likes, follows, or comments.
- Adding a chat feature for direct communication between users.
- Developing an admin dashboard for monitoring and moderating content.
- Expanding the database and features to include objects beyond the Solar System (e.g., stars, galaxies...alien ships?).
- Usage of cookies for session preservation and local settings.

---

## **Security**
- **Passwords**: Securely hashed using Bcrypt.
- **Authentication**: Managed through JWT tokens, required for all requests to protected routes.
- **Data Storage**: Media uploads handled securely using external storage.

---

## **Acknowledgments**
This project serves as the capstone for a web development course. It has been designed to demonstrate my ability to build and deploy a full-stack web application, integrating modern technologies and external APIs. I am excited to share my passion for astronomy through Heavenscopes and look forward to contributing to professional projects in the future.

---

## **Contact**
For any inquiries about the project, feel free to contact me at [github.com/markisgod92](https://github.com/markisgod92).