import { ExamModelWithId, ExamModel } from "../../../firebase/model";

export interface ExamCardProps {
    data: ExamModelWithId;
    onChange<T>(key: keyof ExamModel, newVal: T | null): void;
    onRemove: Function;
}