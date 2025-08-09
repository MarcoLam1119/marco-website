from fastapi import HTTPException

from app.services.sqlDAO import execute_query
from datetime import datetime, time, timedelta

def list_message_logic():
    try:
        query = "SELECT * FROM message WHERE is_delete = 0;"
        results = execute_query(query, fetch=True)
        message_list = []

        for message in results:
            message_list.append({
                'id':message[0],
                'message_content':message[1],
                'update_time':message[2],
                'is_delete':message[3]
            })
        return message_list
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list events: {str(e)}")

async def get_message_logic(message_id: int):
    query = "SELECT * FROM message WHERE id = %s"
    result = execute_query(query, params=(message_id,), fetch=True)
    if not result:
        raise HTTPException(status_code=404, detail="Message not found")
    return result

async def add_message_logic(message_content: str):
    query = """
    INSERT INTO message (message_content, update_time, is_delete) 
    VALUES (%s, %s, 0)
    """
    params = (
        message_content,
        datetime.now(),
    )
    return execute_query(query, params)

async def update_message_logic(message_id: int, message_content: str):
    if not message_content or message_content.strip() == "":
        raise HTTPException(status_code=400, detail="Message content cannot be empty")
    
    query = """
    UPDATE message SET message_content = %s, update_time = NOW() WHERE id = %s
    """
    params = (message_content, message_id)
    
    try:
        result = execute_query(query, params=params)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error occurred: {str(e)}")
    
    if result == 0:
        raise HTTPException(status_code=404, detail="Message not found or already deleted")
    
    return await get_message_logic(message_id)

async def delete_message_logic(message_id: int):
    query = """
    UPDATE message 
    SET is_delete = 1 
    WHERE id = %s
    """
    
    params = (message_id,)  # Ensure this is a tuple

    try:
        result = execute_query(query, params=params)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error occurred: {str(e)}")
    
    if result == 0:
        raise HTTPException(status_code=404, detail="Message not found or already deleted")
    
    return await get_message_logic(message_id)