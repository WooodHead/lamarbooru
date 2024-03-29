<script lang="ts">
    import { page } from '$app/stores';
    import { toast } from '@zerodevx/svelte-toast';
    import { file } from '../../stores/file';
    import { hostname } from '../../stores/general';
    import { callAPI } from '../../utils/api';

    const ratingArr = ['explicit', 'questionable', 'safe'];
    let rating = $file.rating;
    let sourceUrls = $file.sources;

    let tagArr = [];
    for (const i in $file.tags) {
        if ($file.tags[i].namespace == 'tag') {
            tagArr.push($file.tags[i].tag);
        } else {
            tagArr.push(`${ $file.tags[i].namespace }:${ $file.tags[i].tag }`);
        }
    }

    let urlArr = [];
    for (const i in sourceUrls) {
        urlArr.push(sourceUrls[i].url);
    }

    // sort tagArr:
    // tags starting with "creator:" first
    // then tags starting with "series:"
    // then tags starting with "character:"
    // then tags starting with "meta:"
    // then remainder alphabetically
    tagArr = tagArr.sort((a, b) => {
        if (a.startsWith('creator:') && !b.startsWith('creator:')) {
            return -1;
        } else if (!a.startsWith('creator:') && b.startsWith('creator:')) {
            return 1;
        } else if (a.startsWith('series:') && !b.startsWith('series:')) {
            return -1;
        } else if (!a.startsWith('series:') && b.startsWith('series:')) {
            return 1;
        } else if (a.startsWith('character:') && !b.startsWith('character:')) {
            return -1;
        } else if (!a.startsWith('character:') && b.startsWith('character:')) {
            return 1;
        } else if (a.startsWith('meta:') && !b.startsWith('meta:')) {
            return -1;
        } else if (!a.startsWith('meta:') && b.startsWith('meta:')) {
            return 1;
        } else {
            return a.localeCompare(b);
        }
    });

    let joinedTags = tagArr.join('\n');
    let joinSourceUrls = urlArr.join('\n');

    // send the file to the server
    async function saveFile(e) {
        e.preventDefault();
        let tags = (<HTMLInputElement>document.getElementById('tags')).value.split('\n');
        let sources = (<HTMLInputElement>document.getElementById('sources')).value.split('\n');

        const body = JSON.stringify({
            tags: tags,
            source: sources,
            rating: rating,
        });

        await callAPI({
            host: $hostname, endpoint: `/api/file/${ $page.params.id }`, method: 'PUT', body: body,
            callback: async (res) => {
                if (!res.ok) return toast.push(`Error ${ res.statusText }`, {
                    theme: {
                        '--toastBackground': '#F56565',
                        '--toastBarBackground': '#C53030'
                    }
                });

                $file = await res.json();
                toast.push('File updated', {
                    theme: {
                        '--toastBackground': '#48BB78',
                        '--toastBarBackground': '#2F855A'
                    }
                });

                return res.status;
            },
        });
    }
</script>

<form class="pb-2 lg:grid lg:grid-cols-2 space-y-4">
    <div class="col-span-2">
        <p class="text-xl font-bold">Edit Image</p>
    </div>
    <div class="w-5/6">
        <p class="pb-2"><span class="font-bold">Note</span>: Tags should be seperated by a new line</p>
        <textarea class="w-full text-slate-400 bg-slate-800 px-3 py-2 rounded-md h-64" id="tags"
                  spellcheck="false">{joinedTags}</textarea>
    </div>

    <div class="w-5/6">
        <div class="pb-4">
            <p class="pb-2 font-bold">Source</p>
            <p class="pb-2"><span class="font-bold">Note</span>: Sources should be seperated by a new line</p>
            <textarea class="w-full text-slate-400 bg-slate-800 px-3 py-2 rounded-md h-28" id="sources"
                      spellcheck="false">{joinSourceUrls}</textarea>
        </div>

        <div class="pb-4">
            <p class="font-bold">Rating</p>
            <div class="flex place-content-evenly">
                <label for="explicit">
                    <input bind:group={rating} id="explicit" name="rating" type="radio" value={"explicit"}>
                    Explicit
                </label>
                <label for="explicit">
                    <input bind:group={rating} id="questionable" name="rating" type="radio" value={"questionable"}>
                    Questionable
                </label>
                <label for="explicit">
                    <input bind:group={rating} id="safe" name="rating" type="radio" value={"safe"}>
                    Safe
                </label>
            </div>
        </div>
        <div class="bottom-0 left-0">
            <button class="rounded-md font-semibold px-3 py-2 text-sm bg-sky-500 text-white shadow-sm w-48"
                    on:click={saveFile}>Update
            </button>
        </div>
    </div>
    <br/>
</form>
