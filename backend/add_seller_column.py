import sqlite3
import os

db_path = r"C:\Users\vagee\OneDrive\Desktop\smart-circular-marketplace\backend\data\marketplace.db"

print("📂 DB Path:", db_path)

if not os.path.exists(db_path):
    raise FileNotFoundError("❌ marketplace.db not found")

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Check existing columns
cursor.execute("PRAGMA table_info(itemdb)")
columns = [col[1] for col in cursor.fetchall()]

if "seller_uid" not in columns:
    cursor.execute("ALTER TABLE itemdb ADD COLUMN seller_uid TEXT")
    print("✅ seller_uid column added")
else:
    print("ℹ️ seller_uid column already exists")

conn.commit()
conn.close()
