interface existingProps  {
    subjectId: string;
}
interface newProps {
    new: boolean;
}

export type SubjectSettingsProps = existingProps | newProps;