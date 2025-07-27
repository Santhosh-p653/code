from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path

# Import database initialization
from .database import init_database, close_database

# Import route modules
from .routes.staff_routes import router as staff_router
from .routes.schedule_routes import router as schedule_router
from .routes.attendance_routes import router as attendance_router
from .routes.template_routes import router as template_router
from .routes.voice_routes import router as voice_router
from .routes.dashboard_routes import router as dashboard_router

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'staff_utility_app')]

# Create the main app without a prefix
app = FastAPI(title="Staff Utility App API", version="1.0.0", description="Voice-Enabled Staff Utility Application for Educational Institutions")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Basic health check endpoint
@api_router.get("/")
async def root():
    return {"message": "Staff Utility App API is running!", "version": "1.0.0"}

@api_router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "Staff Utility App API",
        "version": "1.0.0"
    }

# Include all route modules
api_router.include_router(staff_router)
api_router.include_router(schedule_router)
api_router.include_router(attendance_router)
api_router.include_router(template_router)
api_router.include_router(voice_router)
api_router.include_router(dashboard_router)

# Include the router in the main app
app.include_router(api_router)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_db_client():
    """Initialize database on startup"""
    logger.info("🚀 Starting up Staff Utility App API...")
    try:
        await init_database()
        logger.info("✅ Database initialized successfully")
    except Exception as e:
        logger.error(f"❌ Error initializing database: {e}")
        raise

@app.on_event("shutdown")
async def shutdown_db_client():
    """Close database connection on shutdown"""
    logger.info("🔄 Shutting down Staff Utility App API...")
    try:
        await close_database()
        client.close()
        logger.info("✅ Database connection closed successfully")
    except Exception as e:
        logger.error(f"❌ Error closing database connection: {e}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)