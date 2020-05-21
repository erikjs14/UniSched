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

type QSnap = firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>;
type DocSnap = firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>;
type DocRef = firebase.firestore.DocumentReference<DocData>;
type ColRef = firebase.firestore.CollectionReference<DocData>;
type DocData = firebase.firestore.DocumentData;
type DocDataWithId = {data: DocData | undefined, id: string};

/********** FETCHING DATA ***************/

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

export const fetchUser = async (): Promise<models.UserModelWithId> => {
    const docWithId: DocDataWithId = await fetchDocument(user_ref());
    return {
        id: docWithId.id,
    };
}

export const fetchSubjectsShallow = async (): Promise<models.SubjectModelWithId[]> => {
    const data: DocDataWithId[] = await fetchCollection(subjects_ref());
    const subjects: models.SubjectModelWithId[] = [];

    data.forEach(dataWithId => subjects.push({
        id: dataWithId.id,
        color: dataWithId.data?.color,
        name: dataWithId.data?.name,
    }));

    return subjects;
}

export const fetchSubject = async (subjectId: string): Promise<models.SubjectModelWithId> => {
    const docWithId: DocDataWithId = await fetchDocument(subject_ref(subjectId));
    return {
        id: docWithId.id,
        color: docWithId.data?.color,
        name: docWithId.data?.name,
    };
}

export const fetchSubjectDeep = async (subjectId: string): Promise<{
    id: string,
    color: string | undefined,
    name: string | undefined,
    tasks: models.TaskModelWithId[],
    exams: models.ExamModelWithId[],
    events: models.EventModelWithId[],
}> => {
    const [ subject, tasks, exams, events ] = 
        await Promise.all([
            fetchSubject(subjectId),
            fetchTasks(subjectId),
            fetchExams(subjectId),
            fetchEvents(subjectId),
        ]);

    return {
        ...subject,
        tasks,
        exams,
        events
    };
}

export const fetchExams = async (subjectId: string): Promise<models.ExamModelWithId[]> => {
    const data: DocDataWithId[] = await fetchCollection(exams_ref(subjectId));
    const exams: models.ExamModelWithId[] = [];

    data.forEach(dataWithId => exams.push({
        id: dataWithId.id,
        start: dataWithId.data?.start,
        type: dataWithId.data?.type,
    }));

    return exams;
}

export const fetchExam = async (subjectId: string, examId: string): Promise<models.ExamModelWithId> => {
    const docWithId: DocDataWithId = await fetchDocument(exam_ref(subjectId, examId));
    return {
        id: docWithId.id,
        start: docWithId.data?.start,
        type: docWithId.data?.type,
    };
}

export const fetchEvents = async (subjectId: string): Promise<models.EventModelWithId[]> => {
    const data: DocDataWithId[] = await fetchCollection(events_ref(subjectId));
    const events: models.EventModelWithId[] = [];

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

export const fetchEvent = async (subjectId: string, eventId: string): Promise<models.EventModelWithId> => {
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

export const fetchTasks = async (subjectId: string): Promise<models.TaskModelWithId[]> => {
    const data: DocDataWithId[] = await fetchCollection(tasks_ref(subjectId));
    const tasks: models.TaskModelWithId[] = [];

    data.forEach(dataWithId => tasks.push({
        id: dataWithId.id,
        timestamps: dataWithId.data?.timestamps,
        timestampsDone: dataWithId.data?.timestampsDone,
        type: dataWithId.data?.type,
    }));

    return tasks;
}

export const fetchTask = async (subjectId: string, taskId: string): Promise<models.TaskModelWithId> => {
    const docWithId: DocDataWithId = await fetchDocument(task_ref(subjectId, taskId));
    return {
        id: docWithId.id,
        timestamps: docWithId.data?.timestamps,
        timestampsDone: docWithId.data?.timestampsDone,
        type: docWithId.data?.type,
    };
}

/************ WRITING DATA *****************/

const addDoc = async <T extends models.BaseModel>(colRef: ColRef, data: T): Promise<string> => {
    const docRef: DocRef = await colRef.add(data);
    return docRef.id;
}

export const addSubject = async (subject: models.SubjectModel): Promise<string> => {
    return await addDoc(subjects_ref(), subject);
}

export const addTask = async (subjectId: string, task: models.TaskModel): Promise<string> => {
    return await addDoc(tasks_ref(subjectId), task);
}

export const addEvent = async (subjectId: string, event: models.EventModel): Promise<string> => {
    return await addDoc(events_ref(subjectId), event);
}

export const addExam = async (subjectId: string, exam: models.ExamModel): Promise<string> => {
    return await addDoc(exams_ref(subjectId), exam);
}

/************ UPDATING DATA ****************/

const updateDoc = async <T extends models.BaseModel, D extends keyof T>(docRef: DocRef, data: Pick<T, D>): Promise<void> => {
    await docRef.update(data);
}

export const updateSubject = async <D extends keyof models.SubjectModel>(subjectId: string, subject: Pick<models.SubjectModel, D>): Promise<void> => {
    await updateDoc(subject_ref(subjectId), subject);
}

export const updateExam = async <D extends keyof models.ExamModel>(subjectId: string, id: string, exam: Pick<models.ExamModel, D>): Promise<void> => {
    await updateDoc(exam_ref(subjectId, id), exam);
}

export const updateEvent = async <D extends keyof models.EventModel>(subjectId: string, id: string, event: Pick<models.EventModel, D>): Promise<void> => {
    await updateDoc(event_ref(subjectId, id), event);
}

export const updateTask = async <D extends keyof models.TaskModel>(subjectId: string, id: string, task: Pick<models.TaskModel, D>): Promise<void> => {
    await updateDoc(task_ref(subjectId, id), task);
}

/************ DELETING DATA ****************/

const deleteDoc = async (docRef: DocRef): Promise<void> => {
    await docRef.delete();
}

export const deleteSubject = async (subjectId: string): Promise<void> => {
    const [ allTasks, allExams, allEvents ] = 
        await Promise.all([
            fetchTasks(subjectId),
            fetchExams(subjectId),
            fetchEvents(subjectId),
        ]);
    
    const toDelete = async (ref: (subjectId: string, id: string) => DocRef, id: string) => await deleteDoc(ref(subjectId, id));

    // delete all documents in subcollections and subject itself
    await Promise.all([
        allTasks.map(task => toDelete(task_ref, task.id))
            .concat(allExams.map(exam => toDelete(exam_ref, exam.id)))
            .concat(allEvents.map(event => toDelete(event_ref, event.id)))
            .concat(deleteDoc(subject_ref(subjectId)))
    ]);
}

export const deleteTask = async (subjectId: string, id: string): Promise<void> => {
    await deleteDoc(task_ref(subjectId, id));
}

export const deleteExam = async (subjectId: string, id: string): Promise<void> => {
    await deleteDoc(exam_ref(subjectId, id));
}

export const deleteEvent = async (subjectId: string, id: string): Promise<void> => {
    await deleteDoc(event_ref(subjectId, id));
}