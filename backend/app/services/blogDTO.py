from fastapi import HTTPException

from app.services.sqlDAO import execute_query
from datetime import datetime, time, timedelta

def list_blog_logic():
    try:
        query = "SELECT * FROM blog WHERE is_delete = 0;"
        results = execute_query(query, fetch=True)
        blog_list = []

        for blog in results:
            blog_list.append({
                'id':blog[0],
                'blog_content':blog[1],
                'update_time':blog[2],
                'is_delete':blog[3]
            })
        return blog_list
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list events: {str(e)}")

def get_blog_logic(blog_id: int):
    try:
        query = "SELECT * FROM blog WHERE is_delete = 0 AND id = " + blog_id + ";"
        results = execute_query(query, fetch=True)
        blog_list = []

        blog_list.append({
            'id':results[0][0],
            'blog_content':results[0][1],
            'update_time':results[0][2],
            'is_delete':results[0][3]
        })
        return blog_list
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list events: {str(e)}")

async def add_blog_logic(blog_content: str):
    query = """
    INSERT INTO blog (blog_content, update_time, is_delete) 
    VALUES (%s, %s, 0)
    """
    params = (
        blog_content,
        datetime.now(),
    )
    return execute_query(query, params)

def update_blog_logic(blog_id: int, blog_content: str):
    if not blog_content or blog_content.strip() == "":
        raise HTTPException(status_code=400, detail="Blog content cannot be empty")
    
    query = """
    UPDATE blog SET blog_content = %s, update_time = NOW() WHERE id = %s
    """
    params = (
        blog_content,
        blog_id
    )
    try:
        result = execute_query(query, params=params, fetch=False)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error occurred: {str(e)}")
    if result == 0:
        raise HTTPException(status_code=404, detail="Blog not found or already deleted")
    return get_blog_logic(blog_id)

def delete_blog_logic(blog_id: int):
    try:
        query = """
        UPDATE blog 
        SET is_delete = 1 
        WHERE id = %s AND is_delete = 0
        """
        result = execute_query(query, params=(blog_id), fetch=False)

        if result == 0:
            raise HTTPException(status_code=404, detail="Event not found or already deleted")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete event: {str(e)}")