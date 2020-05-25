import { faWrench, faCheckCircle, faFeather, faCalendarAlt, IconDefinition, faCogs } from '@fortawesome/free-solid-svg-icons';
import { ICON_SETTINGS_TYPE, ICON_TODO_TYPE, ICON_EXAMS_TYPE, ICON_SCHEDULE_TYPE, IconType, ICON_SETTINGS_ALT } from './globalTypes.d';

export const mapToIcon = (name: IconType): IconDefinition => {
    switch (name) {
        case ICON_SETTINGS_TYPE: return faWrench;
        case ICON_TODO_TYPE: return faCheckCircle;
        case ICON_SCHEDULE_TYPE: return faCalendarAlt;
        case ICON_EXAMS_TYPE: return faFeather;
        case ICON_SETTINGS_ALT: return faCogs;
        default: return faCheckCircle;
    }
}