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
    try:
        conn = get_db_connection()
        if conn is None:
            return [] if fetch else 0
        
        cursor = conn.cursor()
        if params:
            cursor.execute(query, params)
        else:
            cursor.execute(query)
        
        if fetch:
            result = cursor.fetchall()
            cursor.close()
            conn.close()
            return result
        
        conn.commit()
        rowcount = cursor.rowcount
        lastrowid = cursor.lastrowid
        cursor.close()
        conn.close()
        
        if query.strip().lower().startswith('insert'):
            return lastrowid
        elif query.strip().lower().startswith(('update', 'delete')):
            return rowcount
        else:
            return 0  # For other queries, return 0
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database operation failed: {str(e)}")