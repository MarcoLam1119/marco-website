from fastapi import HTTPException
from app.models.calendarEventModels import CalendarEventModel
from app.services.sqlDAO import execute_query
from datetime import datetime, time, timedelta

def list_event_logic():
    try:
        query = "SELECT * FROM calendar_event WHERE is_delete = 0 AND is_publish = 1"
        events = execute_query(query, fetch=True)
        event_list = []

        for event in events:
            # Convert timedelta to time if necessary
            start_time = event[7]
            end_time = event[8]

            if isinstance(start_time, timedelta):
                start_time = (datetime.min + start_time).time()
            if isinstance(end_time, timedelta):
                end_time = (datetime.min + end_time).time()

            event_data = CalendarEventModel(
                id=event[0],
                event_name=event[1],
                event_description=event[2],
                color=event[3],
                start_date=event[4],
                end_date=event[5],
                is_full_day=event[6],
                start_time=start_time,
                end_time=end_time,
                is_publish=event[9],
                is_delete=event[10]
            )
            event_list.append(event_data)

        return event_list
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list events: {str(e)}")

def list_event_login_logic():
    try:
        query = "SELECT * FROM calendar_event WHERE is_delete = 0"
        events = execute_query(query, fetch=True)
        event_list = []

        for event in events:
            # Convert timedelta to time if necessary
            start_time = event[6]
            end_time = event[7]

            if isinstance(start_time, timedelta):
                start_time = (datetime.min + start_time).time()
            if isinstance(end_time, timedelta):
                end_time = (datetime.min + end_time).time()

            event_data = CalendarEventModel(
                id=event[0],
                event_name=event[1],
                event_description=event[2],
                color=event[3],
                start_date=event[4],
                end_date=event[5],
                is_full_day=event[6],
                start_time=start_time,
                end_time=end_time,
                is_publish=event[9],
                is_delete=event[10]
            )
            event_list.append(event_data)

        return event_list
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list events: {str(e)}")


def get_event_logic(event_id: int):
    try:
        query = f"SELECT * FROM calendar_event WHERE id = {event_id} AND is_delete = 0"
        event = execute_query(query, fetch=True)
        
        if not event:
            raise HTTPException(status_code=404, detail="Event not found")

        start_time = event[0][7]
        end_time = event[0][8]

        if isinstance(start_time, timedelta):
            start_time = (datetime.min + start_time).time()
        if isinstance(end_time, timedelta):
            end_time = (datetime.min + end_time).time()

        event_data = CalendarEventModel(
            id=event[0][0],
            event_name=event[0][1],
            event_description=event[0][2],
            color=event[0][3],
            start_date=event[0][4],
            end_date=event[0][5],
            is_full_day=event[0][6],
            start_time=start_time,
            end_time=end_time,
            is_publish=event[0][9],
            is_delete=event[0][10]
        )

        return event_data

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve event: {str(e)}")

async def add_event_logic(event_data: CalendarEventModel):
    try:
        query = """
        INSERT INTO calendar_event (event_name, event_description, start_date, end_date, 
                                    is_full_day, start_time, end_time, is_publish, is_delete)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        
        # Convert time to naive time objects
        start_time_naive = event_data.start_time.replace(tzinfo=None) if event_data.start_time else None
        end_time_naive = event_data.end_time.replace(tzinfo=None) if event_data.end_time else None
        
        params = (
            event_data.event_name,
            event_data.event_description,
            event_data.color,
            event_data.start_date,
            event_data.end_date,
            event_data.is_full_day,
            start_time_naive,
            end_time_naive,
            event_data.is_publish,
            event_data.is_delete
        )
        
        print("Executing Query:", query)
        print("With Parameters:", params)
        
        execute_query(query, params)
        
        return event_data
    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to add event: {str(e)}")

async def update_event_logic(event_id: int, event_data: CalendarEventModel):
    try:
        query = """
        UPDATE calendar_event 
        SET event_name = %s, event_description = %s, start_date = %s, end_date = %s, 
            is_full_day = %s, start_time = %s, end_time = %s, is_publish = %s
        WHERE id = %s AND is_delete = 0
        """
        params = (
            event_data.event_name,
            event_data.event_description,
            event_data.color,
            event_data.start_date,
            event_data.end_date,
            event_data.is_full_day,  # Ensure this matches your model
            event_data.start_time,
            event_data.end_time,
            event_data.is_publish,
            event_id  # Ensure this is the ID of the event being updated
        )
        result = execute_query(query, params=params, fetch=False)
        return get_event_logic(event_id)
        if result == 0:
            raise HTTPException(status_code=404, detail="Event not found or already deleted")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update event: {str(e)}")

async def delete_event_logic(event_id: int):
    try:
        query = """
        UPDATE calendar_event 
        SET is_delete = 1 
        WHERE id = %s AND is_delete = 0
        """
        result = execute_query(query, params=(event_id), fetch=False)

        if result == 0:
            raise HTTPException(status_code=404, detail="Event not found or already deleted")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete event: {str(e)}")
    