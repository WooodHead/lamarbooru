import { writable } from 'svelte/store';

export type LogFile = {
    id: number,
    createDate: Date,
    updateDate: Date,
    filename: string,
    size: number,
    hash: string,
    trash: boolean,
    deleted: boolean,
    rating: string
}


export type LogEntry = {
    id: string,
    subscriptionRunId: number,
    fileId: number,
    url: string,
    status: string,
    createDate: Date,
    updateDate: Date,
    file?: LogFile
}

export type SubscriptionLog = {
    id: number,
    createDate: Date,
    updateDate: Date,
    site: string,
    tags: string[],
    status: string,
    pageNumber: number,
    downloadedUrlCount: number,
    skippedUrlCount: number,
    failedUrlCount: number,
    finished: boolean,
    finishDate?: Date,
    log: LogEntry[]
}

export const subscriptionLog = writable({} as SubscriptionLog);
