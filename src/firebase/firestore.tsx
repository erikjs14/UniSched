import firebase from 'firebase/app';
import { db } from './firebase';
import * as models from './model';
import * as fields from './fields';

const users_ref = db.collection(fields.USER_COL);
const user_ref = () => users_ref.doc(firebase.auth().currentUser?.uid);
const subjects_ref = () => user_ref().collection(fields.SUBJECTS_COL);
const subject_ref = (subjectId: string) => subjects_ref().doc(subjectId);
const exams_ref = (subjectId: string) => subject_ref(subjectId).collection(fields.EXAMS_COL);
const exam_ref = (subjectId: string, examId: string) => exams_ref(subjectId).doc(examId);
const events_ref = (subjectId: string) => subject_ref(subjectId).collection(fields.EVENTS_COL);
const event_ref = (subjectId: string, eventId: string) => events_ref(subjectId).doc(eventId);
const tasks_ref = (subjectId: string) => subject_ref(subjectId).collection(fields.TASKS_COL);
const task_ref = (subjectId: string, taskId: string) => tasks_ref(subjectId).doc(taskId);

type QSnapPromise = Promise<firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>>;
type QSnap = firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>;
type DocSnapPromise = Promise<firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>>;
type DocSnap = firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>;

/********** FETCHING DATA ***************/

type DocData = firebase.firestore.DocumentData;
type DocDataWithId = {data: DocData | undefined, id: string};
type ColRef = firebase.firestore.CollectionReference<DocData>;
const fetchCollection = async (col_ref: ColRef): Promise<DocDataWithId[]> => {
    const qSnap: QSnap  = await col_ref.get();
    const elements: DocDataWithId[] = [];
    qSnap.forEach(docSnap => {
        elements.push({
            data: docSnap.data(),
            id: docSnap.id,
        });
    });

    return elements;
}

type DocRef = firebase.firestore.DocumentReference<DocData>;
const fetchDocument = async (doc_ref: DocRef): Promise<DocDataWithId> => {
    const docSnap: DocSnap = await doc_ref.get();
    if (docSnap.exists) {
        return {
            id: docSnap.id,
            data: docSnap.data(),
        };
    } else {
        throw new Error('Document does not exist!');
    }
}

export const fetchUser = async (): Promise<models.UserModel> => {
    const docWithId: DocDataWithId = await fetchDocument(user_ref());
    return {
        id: docWithId.id,
    };
}

export const fetchSubjectsShallow = async (): Promise<models.SubjectModel[]> => {
    const data: DocDataWithId[] = await fetchCollection(subjects_ref());
    const subjects: models.SubjectModel[] = [];

    data.forEach(dataWithId => subjects.push({
        id: dataWithId.id,
        color: dataWithId.data?.color,
        name: dataWithId.data?.name,
    }));

    return subjects;
}

export const fetchSubject = async (subjectId: string): Promise<models.SubjectModel> => {
    const docWithId: DocDataWithId = await fetchDocument(subject_ref(subjectId));
    return {
        id: docWithId.id,
        color: docWithId.data?.color,
        name: docWithId.data?.name,
    };
}

export const fetchExams = async (subjectId: string): Promise<models.ExamModel[]> => {
    const data: DocDataWithId[] = await fetchCollection(exams_ref(subjectId));
    const exams: models.ExamModel[] = [];

    data.forEach(dataWithId => exams.push({
        id: dataWithId.id,
        start: dataWithId.data?.start,
        type: dataWithId.data?.type,
    }));

    return exams;
}

export const fetchExam = async (subjectId: string, examId: string): Promise<models.ExamModel> => {
    const docWithId: DocDataWithId = await fetchDocument(exam_ref(subjectId, examId));
    return {
        id: docWithId.id,
        start: docWithId.data?.start,
        type: docWithId.data?.type,
    };
}

export const fetchEvents = async (subjectId: string): Promise<models.EventModel[]> => {
    const data: DocDataWithId[] = await fetchCollection(events_ref(subjectId));
    const events: models.EventModel[] = [];

    data.forEach(dataWithId => events.push({
        id: dataWithId.id,
        firstStart: dataWithId.data?.firstStart,
        firstEnd: dataWithId.data?.firstEnd,
        endAt: dataWithId.data?.endAt,
        interval: dataWithId.data?.interval,
        type: dataWithId.data?.type,
    }));

    return events;
}

export const fetchEvent = async (subjectId: string, eventId: string): Promise<models.EventModel> => {
    const docWithId: DocDataWithId = await fetchDocument(event_ref(subjectId, eventId));
    return {
        id: docWithId.id,
        firstStart: docWithId.data?.firstStart,
        firstEnd: docWithId.data?.firstEnd,
        endAt: docWithId.data?.endAt,
        interval: docWithId.data?.interval,
        type: docWithId.data?.type,
    };
}

export const fetchTasks = async (subjectId: string): Promise<models.TaskModel[]> => {
    const data: DocDataWithId[] = await fetchCollection(tasks_ref(subjectId));
    const tasks: models.TaskModel[] = [];

    data.forEach(dataWithId => tasks.push({
        id: dataWithId.id,
        timestamps: dataWithId.data?.timestamps,
        timestampsDone: dataWithId.data?.timestampsDone,
        type: dataWithId.data?.type,
    }));

    return tasks;
}

export const fetchTask = async (subjectId: string, taskId: string): Promise<models.TaskModel> => {
    const docWithId: DocDataWithId = await fetchDocument(task_ref(subjectId, taskId));
    return {
        id: docWithId.id,
        timestamps: docWithId.data?.timestamps,
        timestampsDone: docWithId.data?.timestampsDone,
        type: docWithId.data?.type,
    };
}

/************ WRITING DATA *****************/

