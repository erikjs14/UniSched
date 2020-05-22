import { faWrench, faCheckCircle, faFeather, faCalendarAlt, IconDefinition, faCogs } from '@fortawesome/free-solid-svg-icons';
import { SETTINGS_TYPE, TODO_TYPE, EXAMS_TYPE, SCHEDULE_TYPE, iconType, SETTINGS_ALT } from './globalTypes.d';

export const mapToIcon = (name: iconType): IconDefinition => {
    switch (name) {
        case SETTINGS_TYPE: return faWrench;
        case TODO_TYPE: return faCheckCircle;
        case SCHEDULE_TYPE: return faCalendarAlt;
        case EXAMS_TYPE: return faFeather;
        case SETTINGS_ALT: return faCogs;
        default: return faCheckCircle;
    }
}