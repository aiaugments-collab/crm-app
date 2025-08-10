# Twenty CRM - One-Click Coolify Deployment

This repository is pre-configured for **instant deployment** on Coolify with external databases (Neon PostgreSQL + Upstash Redis).

## 🚀 One-Click Deployment Steps

### 1. Fork This Repository
- Fork this repository to your GitHub account
- All configuration files are already included

### 2. Import to Coolify
1. **Login to your Coolify dashboard**
2. **Create New Project** → Name it "Twenty CRM"
3. **New Resource** → **Application**
4. **Source**: Choose "Public Repository" 
5. **Repository URL**: `https://github.com/YOUR-USERNAME/twenty` (your fork)
6. **Branch**: `main`

### 3. Configure Build Settings
- **Build Pack**: Docker Compose
- **Docker Compose Location**: `docker-compose.coolify.yml`
- **Base Directory**: `/` (root)

### 4. Set Domain
- **Domain**: `twenty.yourdomain.com` (or whatever you prefer)
- **Port**: `3000`

### 5. Deploy!
- Click **Deploy**
- Wait 3-5 minutes for first build
- Access your app at your domain

## ✅ What's Pre-Configured

**Databases:**
- ✅ Neon PostgreSQL connection
- ✅ Upstash Redis connection
- ✅ SSL/TLS enabled
- ✅ Automatic database initialization

**Application:**
- ✅ Multi-tenancy enabled
- ✅ User signup enabled
- ✅ Strong security secrets
- ✅ Background worker process
- ✅ Health checks configured

**Coolify Integration:**
- ✅ Automatic domain detection
- ✅ SSL certificate generation
- ✅ Container restart policies
- ✅ Volume persistence

## 🎯 Post-Deployment

1. **Visit your domain** → Should show Twenty login page
2. **Create first account** → This becomes your admin account
3. **Create workspace** → Set up your CRM workspace
4. **Start using** → Add contacts, companies, deals!

## 🔧 Database Details

**PostgreSQL (Neon):**
- Host: `ep-ancient-frog-ae6z6i5j-pooler.c-2.us-east-2.aws.neon.tech`
- Database: `neondb`
- SSL: Required
- Free tier: 500MB storage

**Redis (Upstash):**
- Host: `tender-sculpin-33579.upstash.io`
- SSL: Enabled  
- Free tier: 10K requests/day

## 🛠️ Customization (Optional)

If you want to modify anything:

1. **Edit `docker-compose.coolify.yml`** for container settings
2. **Edit `coolify.env`** for environment variables
3. **Push changes** to your fork
4. **Redeploy** in Coolify

## 🔒 Security Notes

- All secrets are randomly generated 32+ character strings
- Database connections use SSL/TLS
- No sensitive data stored in containers
- External databases handle backup/security

## 📞 Support

If deployment fails:
1. Check Coolify build logs
2. Verify domain DNS settings
3. Ensure external databases are accessible
4. Contact support with error logs

---

**That's it! Your Twenty CRM should be running with zero manual configuration needed.**
