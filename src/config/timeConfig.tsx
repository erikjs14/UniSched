import { registerLocale, setDefaultLocale } from 'react-datepicker';
import { de, enUS } from 'date-fns/locale';
import { DateInput } from '@fullcalendar/core/datelib/env';
import { format } from 'date-fns';

registerLocale('de', de);
registerLocale('en', enUS);
const userLang: string = navigator.language || window.navigator.language;
const isGerman = userLang.startsWith('de');
if (isGerman) setDefaultLocale('de');
else setDefaultLocale('en');

export const theDatepickerLocale = isGerman ? 'de' : 'en';

export const TIME_INTERVAL_SELECT = 15;
export const DEFAULT_TIME_HOURS = 9;
export const DEFAULT_TIME_MINUTES = 0;
export const DEFAULT_DURATION = 90;
export const TIME_CAPTION = 'time';

// de formats
export const TIME_FORMAT_DE = 'HH:mm';
export const DATE_FORMAT_SELECT_DE ='dd. MMM yyyy';
export const DATETIME_FORMAT_SELECT_DE ='dd. MMM yyyy,  HH:mm';

// en formats
export const TIME_FORMAT_EN = 'hh:mm aaaa'
export const DATE_FORMAT_SELECT_EN = 'MMMM d, yyyy';
export const DATETIME_FORMAT_SELECT_EN = 'MMMM d, yyyy h:mm aa';

export const DEFAULT_DATE_FORMAT = isGerman ? 'dd.MM.yyyy' : 'MM/dd/yyyy';
export const DEFAULT_TIME_FORMAT = isGerman ? TIME_FORMAT_DE : TIME_FORMAT_EN;
export const DEFAULT_DATETIME_FORMAT = isGerman ? DATETIME_FORMAT_SELECT_DE : DATETIME_FORMAT_SELECT_EN;

export const DATETIMEPICKER_DEFAULT_PROPS = isGerman
    ?
        {
            timeFormat: TIME_FORMAT_DE,
            dateFormat: DATETIME_FORMAT_SELECT_DE,
            timeIntervals: TIME_INTERVAL_SELECT,
            timeCaption: 'time',
            showTimeSelect: true,
            locale: theDatepickerLocale,
        }
    :
        {
            dateFormat: DATETIME_FORMAT_SELECT_EN,
            timeIntervals: TIME_INTERVAL_SELECT,
            timeCaption: 'time',
            showTimeSelect: true,
            locale: theDatepickerLocale,
        };

export const DATEPICKER_DEFAULT_PROPS = isGerman 
    ?
        {
            dateFormat: DATE_FORMAT_SELECT_DE,
            locale: theDatepickerLocale,
        }
    :
        {
            dateFormat: DATE_FORMAT_SELECT_EN,
            locale: theDatepickerLocale
        };

export const CALENDAR_DEFAULT_TIME_FORMAT = isGerman
        ?
            {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
            }
        :
            {
                hour: '2-digit',
                minute: '2-digit',
                meridiem: true,
            };

export const CALENDAR_DEFAULT_COLUMN_HEADER_FORMATTER = isGerman 
    ? (date: DateInput): string => format(new Date(date.valueOf() as number), 'dd.MM.yyyy')
    : undefined;

export const DEFAULT_SCHEDULE_CALENDAR_PROPS = {
    slotLabelFormat: CALENDAR_DEFAULT_TIME_FORMAT,
    eventTimeFormat: CALENDAR_DEFAULT_TIME_FORMAT,
    scrollTime: '09:00:00',
    firstDay: 1,
    views: {
        week: {
            columnHeaderFormat: {
                weekday: 'short'
            },
            // columnHeaderText: CALENDAR_DEFAULT_COLUMN_HEADER_FORMATTER,
        }
    }
};

const now = new Date();
export const nowAtDefault = new Date(now);
nowAtDefault.setHours(DEFAULT_TIME_HOURS);
nowAtDefault.setMinutes(DEFAULT_TIME_MINUTES);