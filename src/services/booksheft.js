import { API_TRUYEN } from "@config/end-points-url";
import { fetcher, requester } from "@hooks/useAPIFetcher";
import { historyAction } from "@redux/actions/history";
import { store } from "@redux/store";
import { Request } from "@utils/function/axios";
import { delay } from "@utils/function/helps";
import { time } from "@utils/function/time";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useUser } from "./auth";

export const useBookshelf = ({ unListenHistory, triggerValidate = true } = {}) => {
    // triggerValidate: validate when value = true, but just trigger one when value = true.
    const dispatch = useDispatch();
    const { user, loading } = useUser();
    const initialHistory = useRef(store.getState().history);
    const {
        histories,
        error,
        isValidating,
        expired = new Date(),
    } = useSelector((state) => (unListenHistory ? initialHistory.current : state.history));

    useEffect(() => {
        if (!user || time().isBefore(expired) || isValidating || !triggerValidate) return;
        fetchHistories();
    }, [!!user, triggerValidate]);

    const fetchHistories = async () => {
        try {
            if (!user) return;
            dispatch(historyAction.fetchHistoryStart);
            const data = await fetcher(API_TRUYEN.GET_HISTORIES());
            dispatch(historyAction.fetchHistorySuccess({ histories: data.histories }));
        } catch (error) {
            dispatch(historyAction.fetchHistoryFail({ error }));
        }
    };

    const addHistory = async ({ story, chapter }) => {
        try {
            if (!user) return;
            const historyState = store.getState().history;
            historyState.keyStoryWillAdd = chapter.name;

            await delay(5000);
            if (historyState.keyStoryWillAdd != chapter.name) throw new Error("Skip add history!");

            const newHistory = {
                story_id: story._id,
                story_name: story.name,
                story_thumb: story.thumb,
                story_slug: story.slug,
                chapter_id: chapter._id,
                chapter_name: chapter.name,
                chapter_slug: chapter.slug,
                author: story.author.pen_name,
            };

            await requester(() => Request.ServerTruyen.post(API_TRUYEN.ADD_HISTORY(), newHistory))();

            dispatch(historyAction.addHistory({ history: newHistory }));

            return {
                status: true,
            };
        } catch (e) {
            return {
                status: false,
                message: e.message,
            };
        }
    };

    return {
        histories,
        isValidating: loading || isValidating,
        error,
        expired,
        addHistory,
        mutate: fetchHistories,
    };
};
