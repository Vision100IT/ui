import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import {shade, readableColor} from 'polished';
import {format, differenceInHours} from 'date-fns';
import EventWrapper from './components/event-wrapper';

const DayBlock = styled.div({
  display: 'grid',
  gridTemplateColumns: '40px 10px repeat(5, 1fr)',
  gridTemplateRows: 'repeat(38, 15px)',
  gridAutoFlow: 'column dense',
  borderBottom: '1px solid rgba(166, 168, 179, 0.12)',
  height: '570px'
});

const Event = styled.div(
  {
    padding: '2px 3px 0px 2px',
    color: '#fc9b10',
    fontSize: '12px',
    position: 'relative',
    overflow: 'hidden',
    maxWidth: '100%',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    zIndex: '1'
  },
  props => ({
    gridRow: `${props.row} / span ${props.rowspan}`,
    background: props.color || '#fef0db',
    color: `${
      props.color
        ? readableColor(shade(0.2, props.color))
        : readableColor('#fc9b10')
    }`,
    borderLeft: `2px solid ${props.color ? shade(0.2, props.color) : '#fdb44d'}`
  })
);

const HourDisplay = styled.div(
  {
    position: 'relative',
    gridColumn: '1',
    width: '100%',
    textAlign: 'right',
    lineHeight: '58px',
    letterSpacing: '1px',
    fontSize: '14px',
    boxSizing: 'border-box',
    color: '#98a0a6',
    height: '30px',
    pointerEvents: 'none',
    fontVariant: 'small-caps'
  },
  props => ({
    gridRowStart: props.row,
    gridRowEnd: `span ${props.row + 1}`
  })
);
const HourGridline = styled.div(
  {
    position: 'relative',
    gridColumn: '2',
    width: '100vw',
    pointerEvents: 'none',
    borderRight: '1px solid rgba(166, 168, 179, 0.12)',
    borderBottom: '1px solid rgba(166, 168, 179, 0.12)'
  },
  props => ({
    gridRow: props.row
  })
);

const DayNumber = styled.div({
  width: '100%',
  textAlign: 'center',
  letterSpacing: '1px',
  fontSize: '20px',
  color: '#98a0a6',
  gridRow: '1 / 2',
  height: '570px',
  borderLeft: '1px solid rgba(166, 168, 179, 0.12)',
  gridColumn: '1 / span 7',
  fontVariant: 'small-caps'
});

const hours = [
  '6am',
  '7am',
  '8am',
  '9am',
  '10am',
  '11am',
  '12pm',
  '1pm',
  '2pm',
  '3pm',
  '4pm',
  '5pm',
  '6pm',
  '7pm',
  '8pm',
  '9pm',
  '10pm',
  '11pm'
];

const Day = ({calendarData}) => {
  const day = calendarData;
  const date = format(day.date, 'do LLLL');
  return (
    <DayBlock>
      <DayNumber>{date}</DayNumber>
      {day.events.map(event => {
        const startRow =
          parseInt(format(event.start_date, 'H'), 10) * 2 +
          (parseInt(format(event.start_date, 'm'), 10) >= 30 ? 1 : 0);
        if (event.event_length > 1) {
          return;
        }

        return (
          <Event
            key={event.id}
            row={startRow - 9}
            rowspan={differenceInHours(event.end_date, event.start_date) + 2}
            color={event.color}
            role="button"
          >
            <EventWrapper event={event}>{event.name}</EventWrapper>
          </Event>
        );
      })}
      {hours.map((hour, index) => (
        <>
          <HourDisplay row={index * 2 + 1}>{hour}</HourDisplay>
          <HourGridline row={index * 2 + 2} />
        </>
      ))}
    </DayBlock>
  );
};

Day.propTypes = {
  calendarData: PropTypes.object.isRequired
};

export default Day;