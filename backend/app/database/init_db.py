
from app.database.connection import engine
from app.database.models import Base

# Create any tables that do not already exist.
# Existing tables and their records are preserved.
Base.metadata.create_all(bind=engine)

print("SUCCESS: VYBE database tables are ready!")
