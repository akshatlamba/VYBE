
from app.database.connection import test_connection

try:
    result = test_connection()

    if result == 1:
        print("SUCCESS: VYBE connected to Supabase PostgreSQL!")

except Exception as error:
    print("Database connection failed.")
    print("Check your connection settings and terminal error.")
    raise
