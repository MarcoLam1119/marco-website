from app.services.sqlDAO import execute_query


def add_photo(name, category_id, location_path):
    query = (
        "INSERT INTO photo_location (name, category_id, location_path, upload_date, is_delete) "
        "VALUES (%s, %s, %s, NOW(), %s)"
    )
    return execute_query(query, (name, category_id, location_path, 0))

def list_photos():
    query = "SELECT * FROM photo_location WHERE is_delete = 0"
    return execute_query(query, fetch=True)

def remove_photo(photo_id):
    query = "UPDATE photo_location SET is_delete = 1 WHERE id = %s"
    return execute_query(query, (photo_id,)) > 0