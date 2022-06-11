import { writable } from 'svelte/store';

export type Run = {
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
    finishedAt: Date,
}

export type Subscription = {
    id: number,
    createDate: Date,
    updateDate: Date,
    site: string,
    tags: string[],
    tagBlacklist: string[],
    limit: number,
    status: string,
    interval: string,
    nextRun: Date,
    runs: Run[],
    _count: {
        runs: number
    }
}

export type Log = {
    id: string,
    subscriptionRunId: number,
    url: string,
    status: string,
    createDate: Date,
    updateDate: Date
}

export const subscription = writable({} as Subscription);
