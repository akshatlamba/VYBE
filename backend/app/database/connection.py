
import os
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

# Find the .env file in the backend folder
BASE_DIR = Path(__file__).resolve().parents[2]
load_dotenv(BASE_DIR / ".env")

# Read the private database connection string
DATABASE_URL = os.getenv("DATABASE_URL")

# Gracefully fall back to local SQLite if DATABASE_URL is not provided or relative
if not DATABASE_URL or DATABASE_URL.strip() == "":
    db_path = (BASE_DIR / "vybe_dev.db").resolve()
    DATABASE_URL = f"sqlite:///{db_path}"
elif DATABASE_URL.startswith("sqlite:///./"):
    rel_name = DATABASE_URL.replace("sqlite:///./", "")
    db_path = (BASE_DIR / rel_name).resolve()
    DATABASE_URL = f"sqlite:///{db_path}"

# Tell SQLAlchemy to use Psycopg 3 for PostgreSQL
if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace(
        "postgresql://",
        "postgresql+psycopg://",
        1
    )

def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()

# Create the database engine
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False}
    )
else:
    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True
    )
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Function to test the database connection
def test_connection():
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        return result.scalar()
