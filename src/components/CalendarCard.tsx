
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
// import * as React from 'react';
// import Badge from '@mui/material/Badge';
// import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
// import dayjs, { Dayjs } from 'dayjs';


// function ServerDay(props: PickersDayProps & { highlightedDays?: Dayjs[] }) {
//     const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;
//     console.log(highlightedDays)


//     return (
//         <Badge
//             key={props.day.toString()}
//             overlap="circular"
//             badgeContent={isSelected ? '📌' : undefined}
//         >
//             <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
//         </Badge>
//     );
// }

export default function DateCalendarServerRequest() {
    // const [highlightedDays, setHighlightedDays] = React.useState([1, 2, 15]);

    // const highlighteddates = [
    //     dayjs('2025-03-05'),
    //     dayjs('2025-03-15'),
    //     dayjs('2025-03-10'),
    // ];

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
            // slots={{
            //     day: ServerDay,
            // }}
            // slotProps={{
            //     day: {
            //         highlighteddates,
            //     } as any,
            // }}
            />
        </LocalizationProvider>
    );
}