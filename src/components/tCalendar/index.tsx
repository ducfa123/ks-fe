import React from "react";
import { Box, Typography } from "@mui/material";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import viLocale from "@fullcalendar/core/locales/vi";

export interface TCalendarEvent {
  id: string;
  title: string;
  start: string | Date;
  end?: string | Date;
  allDay?: boolean;
  [key: string]: any;
}

interface CalendarProps {
  events: TCalendarEvent[];
  onMonthChange?: (start: Date, end: Date) => void;
  renderEvent?: (event: any) => React.ReactNode;
}

const TCalendar: React.FC<CalendarProps> = ({
  events,
  onMonthChange,
  renderEvent,
}) => {
  const handleDatesSet = (arg: { start: Date; end: Date }) => {
    onMonthChange?.(arg.start, arg.end);
  };

  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        borderRadius: 2,
        p: 1,
        fontFamily: "'Be Vietnam Pro', sans-serif",
        fontSize: 14,
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
      }}
    >
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale={viLocale}
        events={events}
        height="auto"
        contentHeight="auto"
        dayMaxEventRows={3}
        eventDisplay="block"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth",
        }}
        buttonText={{
          today: "Hôm nay",
          month: "Tháng",
        }}
        dayHeaderClassNames="fc-day-header-custom"
        eventClassNames="fc-event-custom"
        moreLinkText={(count) => `+${count} sự kiện khác`}
        moreLinkClick="popover"
        views={{
          dayGrid: {
            dayMaxEventRows: 3,
          },
          dayGridMonth: {
            dayMaxEventRows: 3,
          },
        }}
        datesSet={handleDatesSet}
        eventContent={(arg) =>
          renderEvent ? (
            renderEvent(arg)
          ) : (
            <Box
              sx={{
                p: 1,
                borderRadius: 1,
                backgroundColor: "white",
                border: "1px solid #93C5FD",
                boxShadow: "0 2px 4px rgba(147, 197, 253, 0.1)",
                transition: "all 0.2s ease",
                "&:hover": {
                  background: "#e6f1fe",
                },
              }}
            >
              <Typography
                sx={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#2563EB",
                  mb: 0.5,
                }}
              >
                {arg.event.title}
              </Typography>
            </Box>
          )
        }
      />
      <style>
        {`
        .fc-day-header-custom {
          font-family: 'Be Vietnam Pro', sans-serif;
          font-size: 14px;
          background-color: #60A5FA;
          color: white !important;
          padding: 12px 0;
          font-weight: 500;
        }
        .fc-event-custom{ border: none !important; }
        .fc-daygrid-day.fc-day-today { background-color: #F0F7FF !important; position: relative; }
        .fc-daygrid-day.fc-day-today::before {
          content: '⭐';
          position: absolute;
          top: 4px;
          left: 4px;
          font-size: 14px;
          color: #60A5FA;
        }
        .fc .fc-toolbar-title {
          font-family: 'Be Vietnam Pro', sans-serif;
          font-size: 18px;
          font-weight: 600;
        }
        .fc .fc-button {
          background-color: #60A5FA;
          border-color: #60A5FA;
          font-family: 'Be Vietnam Pro', sans-serif;
          text-transform: none;
          font-weight: 500;
          padding: 8px 16px;
          transition: all 0.2s ease;
        }
        .fc .fc-button:hover {
          background-color: #3B82F6;
          border-color: #3B82F6;
        }
        .fc .fc-button-primary:not(:disabled).fc-button-active,
        .fc .fc-button-primary:not(:disabled):active {
          background-color: #2563EB;
          border-color: #2563EB;
        }
        .fc-day { background-color: white; }
        .fc-day-other { background-color: #f2f2f2; }
        .fc td, .fc th { border-color: #E2E8F0; }
        .fc-more-popover {
          border: none !important;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1) !important;
          border-radius: 8px !important;
        }
        .fc-more-popover .fc-popover-title {
          background: #60A5FA !important;
          color: white !important;
          padding: 10px !important;
          font-family: 'Be Vietnam Pro', sans-serif !important;
          font-size: 14px !important;
          border-radius: 8px 8px 0 0 !important;
        }
        .fc-more-popover .fc-popover-body { padding: 10px !important; }
        .fc-daygrid-more-link {
          color: #3B82F6 !important;
          font-family: 'Be Vietnam Pro', sans-serif !important;
          font-size: 12px !important;
          font-weight: 500 !important;
          text-decoration: none !important;
          padding: 2px 4px !important;
          margin-top: 2px !important;
        }
        .fc-daygrid-more-link:hover {
          background: #F0F7FF !important;
          border-radius: 4px !important;
        }
        .fc-daygrid-day-bottom { padding: 2px 4px !important; }
      `}
      </style>
    </Box>
  );
};

export default TCalendar;
