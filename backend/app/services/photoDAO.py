import mysql.connector
from mysql.connector import Error

DB_CONFIG = {
    'user': 'root',
    'password': 'password',
    'host': 'localhost',
    'database': 'marco_website'
}

def get_db_connection():
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        return conn
    except Error as e:
        print(f"Error: {e}")
        return None

def add_photo(name, category_id, location_path):
    conn = get_db_connection()
    if conn is None:
        return None
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO photo_location (name, category_id, location_path, upload_date, is_delete) VALUES (%s, %s, %s, NOW(), %s)", 
        (name, category_id, location_path, 0)
    )
    conn.commit()
    photo_id = cursor.lastrowid
    cursor.close()
    conn.close()
    return photo_id

def list_photos():
    conn = get_db_connection()
    if conn is None:
        return []
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM photo_location WHERE is_delete = 0")
    photos = cursor.fetchall()
    cursor.close()
    conn.close()
    return photos if photos else []

def remove_photo(photo_id):
    conn = get_db_connection()
    if conn is None:
        return False
    cursor = conn.cursor()
    cursor.execute("UPDATE photo_location SET is_delete = 1 WHERE id = %s", (photo_id,))
    conn.commit()
    affected_rows = cursor.rowcount
    cursor.close()
    conn.close()
    return affected_rows > 0