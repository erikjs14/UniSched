import firebase from 'firebase/app';
import { db } from './firebase';
import * as models from './model';
import { withUserId } from './model';
import * as fields from './fields';
import { PreferenceId } from '../config/userPreferences';
import { getCurrentTimestamp } from './../util/timeUtil';

const users_ref = db.collection(fields.USER_COL);
const user_ref = () => users_ref.doc(firebase.auth().currentUser?.uid);
const subjects_ref = () => user_ref().collection(fields.SUBJECTS_COL);
const spaces_ref = () => user_ref().collection(fields.SPACES_COL);
const spaces_q_by_name = () => user_ref().collection(fields.SPACES_COL).orderBy('name');
const space_ref = (spaceId: string) => spaces_ref().doc(spaceId);
const subjects_q_by_name = () => user_ref().collection(fields.SUBJECTS_COL).orderBy('name');
const subject_ref = (subjectId: string) => subjects_ref().doc(subjectId);
const exams_ref = (subjectId: string) => subject_ref(subjectId).collection(fields.EXAMS_COL);
const exams_q_by_timestamp = (subjectId: string) => exams_ref(subjectId).orderBy('timeCreated', 'desc');
const exam_ref = (subjectId: string, examId: string) => exams_ref(subjectId).doc(examId);
const events_ref = (subjectId: string) => subject_ref(subjectId).collection(fields.EVENTS_COL);
const events_q_by_timestamp = (subjectId: string) => events_ref(subjectId).orderBy('timeCreated', 'desc');
const event_ref = (subjectId: string, eventId: string) => events_ref(subjectId).doc(eventId);
const tasks_ref = (subjectId: string) => subject_ref(subjectId).collection(fields.TASKS_COL);
const tasks_q_by_timestamp = (subjectId: string) => tasks_ref(subjectId).where('deleted', '==', false).orderBy('timeCreated', 'desc');
const task_ref = (subjectId: string, taskId: string) => tasks_ref(subjectId).doc(taskId);


type QSnap = firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>;
type DocSnap = firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>;
type DocRef = firebase.firestore.DocumentReference<DocData>;
type ColRef = firebase.firestore.CollectionReference<DocData>;
type Query = firebase.firestore.Query<firebase.firestore.DocumentData>;
type DocData = firebase.firestore.DocumentData;
type DocDataWithId = {data: DocData | undefined, id: string};

/********** FETCHING DATA ***************/

const fetchCollection = async (col_ref: ColRef|Query): Promise<DocDataWithId[]> => {
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
        timeCreated: docWithId.data?.timeCreated,
        preferences: docWithId.data?.preferences,
    };
}

export const fetchSpaces = async (): Promise<models.SpaceModelWithId[]> => {
    const data: DocDataWithId[] = await fetchCollection(spaces_q_by_name());
    const spaces: models.SpaceModelWithId[] = [];

    data.forEach(dataWithId => spaces.push({
        id: dataWithId.id,
        timeCreated: dataWithId.data?.timeCreated,
        name: dataWithId.data?.name,
    }));

    return spaces;
}

export const fetchSubjectsShallow = async (): Promise<models.SubjectModelWithId[]> => {
    const data: DocDataWithId[] = await fetchCollection(subjects_q_by_name());
    const subjects: models.SubjectModelWithId[] = [];

    data.forEach(dataWithId => subjects.push({
        id: dataWithId.id,
        color: dataWithId.data?.color,
        name: dataWithId.data?.name,
        spaceId: dataWithId.data?.spaceId ? dataWithId.data?.spaceId : 'mainSpace',
        excludeTasksFromAll: dataWithId.data?.excludeTasksFromAll ? dataWithId.data?.excludeTasksFromAll : false,
        additionalInfo: dataWithId.data?.additionalInfo ? dataWithId.data?.additionalInfo : "",
        timeCreated: dataWithId.data?.timeCreated,
    }));

    return subjects;
}

export const fetchSubject = async (subjectId: string): Promise<models.SubjectModelWithId> => {
    const docWithId: DocDataWithId = await fetchDocument(subject_ref(subjectId));
    return {
        id: docWithId.id,
        color: docWithId.data?.color,
        name: docWithId.data?.name,
        spaceId: docWithId.data?.spaceId ? docWithId.data?.spaceId : 'mainSpace',
        excludeTasksFromAll: docWithId.data?.excludeTasksFromAll ? docWithId.data?.excludeTasksFromAll : false,
        additionalInfo: docWithId.data?.additionalInfo ? docWithId.data?.additionalInfo : false,
        timeCreated: docWithId.data?.timeCreated,
    };
}

export const fetchSubjectDeep = async (subjectId: string): Promise<models.DeepSubjectModel> => {
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
    const data: DocDataWithId[] = await fetchCollection(exams_q_by_timestamp(subjectId));
    const exams: models.ExamModelWithId[] = [];

    data.forEach(dataWithId => exams.push({
        id: dataWithId.id,
        subjectId,
        start: dataWithId.data?.start,
        type: dataWithId.data?.type,
        timeCreated: dataWithId.data?.timeCreated,
        additionalInfo: dataWithId.data?.additionalInfo || null,
        grade: dataWithId.data?.grade || null,
        gradeWeight: dataWithId.data?.gradeWeight || 1,
    }));

    return exams;
}

export const fetchExam = async (subjectId: string, examId: string): Promise<models.ExamModelWithId> => {
    const docWithId: DocDataWithId = await fetchDocument(exam_ref(subjectId, examId));
    return {
        id: docWithId.id,
        subjectId,
        start: docWithId.data?.start,
        type: docWithId.data?.type,
        timeCreated: docWithId.data?.timeCreated,
        additionalInfo: docWithId.data?.additionalInfo || null,
        grade: docWithId.data?.grade || null,
        gradeWeight: docWithId.data?.gradeWeight || 1,
    };
}

export const fetchEvents = async (subjectId: string): Promise<models.EventModelWithId[]> => {
    const data: DocDataWithId[] = await fetchCollection(events_q_by_timestamp(subjectId));
    const events: models.EventModelWithId[] = [];

    data.forEach(dataWithId => events.push({
        id: dataWithId.id,
        subjectId,
        firstStart: dataWithId.data?.firstStart,
        firstEnd: dataWithId.data?.firstEnd,
        endAt: dataWithId.data?.endAt,
        interval: dataWithId.data?.interval,
        type: dataWithId.data?.type,
        timeCreated: dataWithId.data?.timeCreated,
        exclusions: dataWithId.data?.exclusions || [],
        additionalInfo: dataWithId.data?.additionalInfo || null,
    }));

    return events;
}

export const fetchEvent = async (subjectId: string, eventId: string): Promise<models.EventModelWithId> => {
    const docWithId: DocDataWithId = await fetchDocument(event_ref(subjectId, eventId));
    return {
        id: docWithId.id,
        subjectId,
        firstStart: docWithId.data?.firstStart,
        firstEnd: docWithId.data?.firstEnd,
        endAt: docWithId.data?.endAt,
        interval: docWithId.data?.interval,
        type: docWithId.data?.type,
        timeCreated: docWithId.data?.timeCreated,
        exclusions: docWithId.data?.exclusions || [],
        additionalInfo: docWithId.data?.additionalInfo || null,
    };
}

export const fetchTasks = async (subjectId: string): Promise<models.TaskModelWithId[]> => {
    const data: DocDataWithId[] = await fetchCollection(tasks_q_by_timestamp(subjectId));
    const tasks: models.TaskModelWithId[] = [];

    data.forEach(dataWithId => tasks.push({
        id: dataWithId.id,
        subjectId,
        timestamps: dataWithId.data?.timestamps,
        timestampsDone: dataWithId.data?.timestampsDone,
        tasksTickedAt: dataWithId.data?.tasksTickedAt || new Array(dataWithId.data?.timestampsDone.length || 0).fill({seconds:0,nanoseconds:0}),
        type: dataWithId.data?.type,
        timeCreated: dataWithId.data?.timeCreated,
        star: dataWithId.data?.star ? true : false,
        additionalInfo: dataWithId.data?.additionalInfo || null,
        deleted: dataWithId.data?.deleted,
        exclusions: dataWithId.data?.exclusions || [],
        notifications: dataWithId.data?.notifications || [],
    }));
    
    return tasks;
}

export const fetchTask = async (subjectId: string, taskId: string): Promise<models.TaskModelWithId> => {
    const docWithId: DocDataWithId = await fetchDocument(task_ref(subjectId, taskId));
    return {
        id: docWithId.id,
        subjectId,
        timestamps: docWithId.data?.timestamps,
        timestampsDone: docWithId.data?.timestampsDone,
        tasksTickedAt: docWithId.data?.tasksTickedAt || new Array(docWithId.data?.timestampsDone.length || 0).fill({seconds:0,nanoseconds:0}),
        type: docWithId.data?.type,
        timeCreated: docWithId.data?.timeCreated,
        star: docWithId.data?.star,
        additionalInfo: docWithId.data?.additionalInfo || null,
        deleted: docWithId.data?.deleted,
        exclusions: docWithId.data?.exclusions || [],
        notifications: docWithId.data?.exclusions || [],
    };
}

/************ WRITING DATA *****************/

const addDoc = async <T extends models.BaseModel>(colRef: ColRef, data: T): Promise<string> => {
    const docRef: DocRef = await colRef.add(data);
    return docRef.id;
}

export const addUser = async (user: models.UserModel): Promise<void> => {
    return await user_ref().set(user, {merge: true});
}

export const addDefaultSpace = async (): Promise<models.SpaceModelWithId> => {
    const defaultSpaceId = 'mainSpace';
    const defaultSpace = {
        timeCreated: getCurrentTimestamp(),
        name: 'General',
    };
    await space_ref(defaultSpaceId).set({
        timeCreated: getCurrentTimestamp(),
        name: 'General',
    });
    return {
        id: defaultSpaceId,
        ...defaultSpace,
    };
}

export const addSpace = async (space: models.SpaceModel): Promise<string> => {
    return await addDoc(spaces_ref(), space);
}

export const addSubject = async (subject: models.SubjectModel): Promise<string> => {
    return await addDoc(subjects_ref(), subject);
}

export const addTask = async (subjectId: string, task: models.TaskModel): Promise<string> => {
    return await addDoc(tasks_ref(subjectId), withUserId(task));
}

export const addEvent = async (subjectId: string, event: models.EventModel): Promise<string> => {
    return await addDoc(events_ref(subjectId), withUserId(event));
}

export const addExam = async (subjectId: string, exam: models.ExamModel): Promise<string> => {
    return await addDoc(exams_ref(subjectId), withUserId(exam));
}

/************ UPDATING DATA ****************/

const updateDoc = async <T extends models.BaseModel, D extends keyof T>(docRef: DocRef, data: Pick<T, D>): Promise<void> => {
    await docRef.update(data);
}

export const updateSubject = async <D extends keyof models.SubjectModel>(subjectId: string, subject: Pick<models.SubjectModel, D>): Promise<void> => {
    await updateDoc(subject_ref(subjectId), subject);
}

export const updateSpace = async <D extends keyof models.SpaceModel>(spaceId: string, space: Pick<models.SpaceModel, D>): Promise<void> => {
    await updateDoc(space_ref(spaceId), space);
}

export const updatePreference = async (id: PreferenceId, value: any): Promise<void> => {
    const fullId = `preferences.${id}`;
    await user_ref().update({
        [fullId]: value,
    })
}

export const saveSubscription = async (sub: PushSubscriptionJSON): Promise<void> => {
    // await user_ref().set(
    //     { subscriptions: firebase.firestore.FieldValue.arrayUnion(sub)},
    //     { merge: true },
    // );
    const unid = localStorage.getItem('unisched_id');
    if (unid) {
        await user_ref().collection('subscriptions').doc(unid).set(sub);
    } else {
        await user_ref().collection('subscriptions').add(sub);
    }
}

export const updateUser = async <D extends keyof models.UserModel>(data: Pick<models.UserModel, D>): Promise<void> => {
    await updateDoc(user_ref(), data);
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

export const saveTaskChecked = async (subjectId: string, id: string, timestamp: models.Timestamp, tickedAt: models.Timestamp): Promise<void> => {
    await task_ref(subjectId, id).update({
        timestampsDone: firebase.firestore.FieldValue.arrayUnion(timestamp),
        tasksTickedAt: firebase.firestore.FieldValue.arrayUnion(tickedAt),
    });
}

export const saveTaskUnchecked = async (subjectId: string, id: string, timestamp: models.Timestamp, taskTickedAt: models.Timestamp): Promise<void> => {
    await task_ref(subjectId, id).update({
        timestampsDone: firebase.firestore.FieldValue.arrayRemove(timestamp),
        tasksTickedAt: firebase.firestore.FieldValue.arrayRemove(taskTickedAt),
    });
}

/************ DELETING DATA ****************/

const deleteDoc = async (docRef: DocRef): Promise<void> => {
    await docRef.delete();
}

export const deleteSpace = async (spaceId: string, subjectIds: string[]): Promise<void> => {
    await Promise.all(
        subjectIds.map(id => deleteSubject(id))
            .concat([deleteDoc(space_ref(spaceId))])
    );
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