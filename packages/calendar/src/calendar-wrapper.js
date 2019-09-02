import React from 'react';
import PropTypes from 'prop-types';
import {getWeekOfMonth, startOfMonth} from 'date-fns';
import Calendar from './calendar';
import CalendarDispatch from './utilities/calendar-dispatch-provider';
import useCalendarEvents from './use-calendar-events';
import { getMonth } from 'date-fns/esm';

export default function CalendarWrapper({client, initialView, isViewFixed}) {
  const [
    {calendarData, currentDate, calendarView},
    loading,
    error,
    dispatch
  ] = useCalendarEvents(initialView, client);

  return (
    <CalendarDispatch.Provider value={dispatch}>
      {loading ? (
        <div>loading...</div>
      ) : (
        <Calendar
          calendarView={calendarView}
          calendarData={calendarData}
          isViewFixed={isViewFixed}
          weekNumber={getWeekOfMonth(currentDate)}
          startOfMonth={startOfMonth(currentDate)}
        />
      )}
    </CalendarDispatch.Provider>
  );
}

CalendarWrapper.propTypes = {
  initialView: PropTypes.oneOf(['day', 'week', 'month']).isRequired,
  client: PropTypes.shape({fetchEvents: PropTypes.func.isRequired}).isRequired,
  isViewFixed: PropTypes.bool
};

CalendarWrapper.defaultProps = {
  isViewFixed: false
};
