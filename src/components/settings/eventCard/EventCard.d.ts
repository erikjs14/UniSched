import { EventModelWithId } from "../../../firebase/model";

export interface EventCardProps {
    data: EventModelWithId;
    onChange<T>(key: keyof EventModel, newVal: T | null): void;
    onRemove: Function;
}