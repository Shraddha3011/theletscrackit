# Deployment Guide

## Step 1: Database (Neon)

1. Go to [Neon.tech](https://neon.tech) and create account
2. Create a new project "letscrackit"
3. Copy the connection string (format: `postgresql://user:password@host.neon.tech/letscrackit?sslmode=require`)

## Step 2: Backend (Render)

1. Push your backend code to GitHub
2. Go to [Render.com](https://render.com) and sign up
3. Create a new Web Service:
   - Connect your GitHub repository
   - Select the backend folder
   - Build Command: `mvn clean package -DskipTests`
   - Start Command: `java -jar target/*.jar`
   
4. Add Environment Variables:
   - `DB_URL`: Your Neon connection string
   - `DB_USERNAME`: from Neon
   - `DB_PASSWORD`: from Neon
   - `CORS_ORIGINS`: Your Vercel URL (e.g., `https://your-app.vercel.app`)
   - `JWT_SECRET`: Generate a secure random string

5. Your backend will be live at: `https://your-backend-name.onrender.com`

## Step 3: Frontend (Vercel)

1. Push your frontend code to GitHub
2. Go to [Vercel.com](https://vercel.com) and sign up
3. Import your GitHub repository
4. Configure:
   - Framework: Vite
   - Root Directory: `.` (or your frontend folder)
   
5. Add Environment Variables:
   - `VITE_API_URL`: Your Render backend URL (e.g., `https://your-backend-name.onrender.com/api`)

6. Deploy!

## Step 4: Update CORS

After deploying, update your backend's CORS_ORIGINS to include your Vercel URL.

## Important Notes

- Neon free tier: 0.5GB storage, 1 project
- Render free tier: 750 hours/month, spins down after 15 min inactivity
- Vercel free tier: Unlimited frontend bandwidth

## Troubleshooting

### Backend won't start
- Check Neon connection string is correct
- Ensure all environment variables are set

### CORS errors
- Update CORS_ORIGINS in backend to include your Vercel URL

### API calls failing
- Verify VITE_API_URL points to correct Render URL
- Check backend is running and accessible