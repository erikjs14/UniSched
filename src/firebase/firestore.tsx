import firebase from 'firebase/app';
import { db } from './firebase';
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
type DocSnapPromise = Promise<firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>>;

export const fetchUser = (): DocSnapPromise => {
    return user_ref().get();
}

export const fetchSubjectsShallow = (): QSnapPromise => {
    return subjects_ref().get();
}

export const fetchSubject = (subjectId: string): DocSnapPromise => {
    return subject_ref(subjectId).get();
}

export const fetchExams = (subjectId: string): QSnapPromise => {
    return exams_ref(subjectId).get();
}

export const fetchExam = (subjectId: string, examId: string): DocSnapPromise => {
    return exam_ref(subjectId, examId).get();
}

export const fetchEvents = (subjectId: string): QSnapPromise => {
    return events_ref(subjectId).get();
}

export const fetchEvent = (subjectId: string, eventId: string): DocSnapPromise => {
    return event_ref(subjectId, eventId).get();
}

export const fetchTasks = (subjectId: string): QSnapPromise => {
    return tasks_ref(subjectId).get();
}

export const fetchTask = (subjectId: string, taskId: string): DocSnapPromise => {
    return task_ref(subjectId, taskId).get();
}