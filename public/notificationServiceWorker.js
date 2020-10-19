this.addEventListener('activate', async () => {
    console.log('ACTIVATE');
});

const getFormattedDate = d => {
    const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
    const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
    const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
    const ho = new Intl.DateTimeFormat('en', { hour: '2-digit'}).format(d);
    const mi = new Intl.DateTimeFormat('en', { minute: '2-digit'}).format(d);
    return `${da}.${mo}.${ye} at ${ho}:${mi}`;
}
const getTimeTil = (from, to) => {
    const diff = to - from;
    
    if (diff < 60000) {// less than a minute
        return 'Now';
    } else if (diff < 3600000) { // less than one hour
        return 'In ' + ( Math.round(diff/60000) ) + ' minutes';
    } else if (diff < 86400000) { // less than one day
        const h = Math.floor(diff/3600000);
        return 'In ' + ( h ) + ( h > 1 ? ' hours and' : ' hour and ') + ( Math.round((diff-h*3600000)/60000) ) + ' minutes';
    } else if (diff < 2592000000) { // less than a month (30 days)
        const d = Math.floor(diff/86400000);
        const h = Math.round((diff-d*86400000)/3600000);
        return 'In ' + ( d ) + ( d > 1 ? ' days and ' : ' day and ') + ( h ) + ( h > 1 ? ' hours' : ' hour');
    } else if (diff < 31557600000) { // less than a year
        const m = Math.floor(diff/2592000000);
        const d = Math.round((diff - m*2592000000)/86400000);
        return 'In ' + ( m ) + ( m > 1 ? ' months and ' : ' month and ') + ( d ) + ( d > 1 ? ' days' : ' day');
    } else {
        const y = Math.floor(diff/31557600000);
        const m = Math.round((diff - y*31557600000)/2592000000);
        return 'In ' + ( y ) + ( y > 1 ? ' years and ' : ' year and ') + ( m ) + ( m > 1 ? ' months' : ' month');
    }
}
const getOptionsFromEvent = eventData => {

    const nowMs = new Date().getTime();
    return {
        body: getTimeTil(nowMs, eventData.eventTimestamp),
        icon: '/icon.png',
        timestamp: eventData.notificationTimestamp,
        actions: [{action: "openSchedule", title: "Open Schedule", icon: ""}],
    }
}
const getOptionsFromExam = examData => {
    const nowMs = new Date().getTime();
    return {
        body: getTimeTil(nowMs, examData.examTimestamp),
        icon: '/icon.png',
        timestamp: examData.notificationTimestamp,
        actions: [{action: "openExams", title: "Open Exams", icon: ""}],
    }
}
const getOptionsFromTask = taskData => {
    const nowMs = new Date().getTime();
    return {
        body: getTimeTil(nowMs, taskData.taskTimestamp), // TODO test task --> its showing the wrong formatted distance
        icon: '/icon.png',
        timestamp: taskData.notificationTimestamp,
        actions: [{action: "openTasks", title: "Open ToDo", icon: ""}],
    }
}

this.addEventListener('push', (event) => {
    if (event.data) {
        console.log('Push event!! ', event.data.text());
        // this.registration.showNotification('Test title');

        const data = JSON.parse(event.data.text());
        const nowMs = new Date().getTime();
        switch (data.type) {
            case 'event':
                const inFuture = data.eventTimestamp > nowMs;
                if (inFuture) {
                    this.registration.showNotification(
                        data.subject.name + ': ' + data.title,
                        getOptionsFromEvent(data)
                    );
                }
                break;
            case 'exam':
                this.registration.showNotification(
                    data.subject.name + ': EXAM ' + data.title,
                    getOptionsFromExam(data)
                );
                break;
            case 'task':
                this.registration.showNotification(
                    data.subject.name + ': ' + data.title,
                    getOptionsFromTask(data)
                );
                break;
            default: break;
        }
    } else {
        console.log('Push event but no data')
    }
})

this.addEventListener('notificationclick', function(event) {
    let url;
    switch (event.action) {
        case 'openSchedule': 
            url = '/schedule';
            break;
        case 'openExams':
            url = '/exams';
            break;
        case 'openTasks':
            url = '/todo';
            break;
        default: url = null;
    }
    if (url ) {
        event.notification.close(); // Android needs explicit close.
        event.waitUntil(
            clients.matchAll({type: 'window'}).then( windowClients => {
                // Check if there is already a window/tab open with the target URL
                for (var i = 0; i < windowClients.length; i++) {
                    var client = windowClients[i];
                    // If so, just focus it.
                    if (client.url === url && 'focus' in client) {
                        return client.focus();
                    }
                }
                // If not, then open the target URL in a new window/tab.
                if (clients.openWindow) {
                    return clients.openWindow(url);
                }
            })
        );
    }
});