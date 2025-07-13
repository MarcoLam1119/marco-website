import mysql.connector
from mysql.connector import Error
import json

def get_db_connection():
    try:
        with open("app/config.json") as json_file:
            configJSON = json.load(json_file)
        return mysql.connector.connect(**configJSON["DB_CONFIG"])
    except Error as e:
        print(f"Error: {e}")
        return None

def execute_query(query, params=None, fetch=False):
    conn = get_db_connection()
    if conn is None:
        return None if not fetch else []
    
    cursor = conn.cursor()
    cursor.execute(query, params) if params else cursor.execute(query)
    
    if fetch:
        result = cursor.fetchall()
        cursor.close()
        conn.close()
        return result
    
    conn.commit()
    photo_id = cursor.lastrowid
    cursor.close()
    conn.close()
    return photo_id