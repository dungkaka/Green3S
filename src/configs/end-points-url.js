const preUrl = "http://192.168.1.104:5000/api/v1";

export const API_TRUYEN = {
    // auth
    SIGN_UP: () => preUrl + "/signup",
    LOGIN: () => preUrl + "/login",
    LOGIN_SOCIAL: () => preUrl + "/login/social",
    AUTH_PROFILE: () => preUrl + "/auth/me",

    // category
    GET_CATEGORIES: () => preUrl + "/categories",
    GET_STORIES_OF_CATEGORY: (category_id, page = 0, page_size = 20) =>
        preUrl + `/categories/${category_id}?page=${page}&page_size=${page_size}`,

    GET_RANKING: () => preUrl + "/rank",

    // story
    GET_STORIES: (page = 0, page_size = 20) => preUrl + `/stories?page=${page}&page_size=${page_size}`,
    GET_STORY_BY_SLUG: (story_slug) => preUrl + `/stories/${story_slug}`,
    SEARCH_STORY: (key, page = 0, page_size = 20) => preUrl + `/search?key=${key}&page=${page}&page_size=${page_size}`,
    VOTE_STORY: (story_id) => preUrl + `/stories/${story_id}/vote`,
    GET_STORIES_OF_AUTHOR_ID: (author_id, page = 0, page_size = 20) =>
        preUrl + `/stories/author/${author_id}?page=${page}&page_size=${page_size}`,

    GET_AUTH_STORIES: (status, page = 0, page_size = 20) =>
        preUrl + `/author/stories?status=${status}&page=${page}&page_size=${page_size}`,
    GET_AUTH_STORY_BY_ID: (story_id) => preUrl + `/author/stories/${story_id}`,
    CREATE_STORY: () => preUrl + `/stories`,
    UPDATE_STORY: (story_id) => preUrl + `/stories/${story_id}`,
    UPDATE_STATUS_STORY: (story_id, value) => preUrl + `/stories/${story_id}/update-status?value=${value}`,

    // GET_STORIES_BY_ADMIN: (status, modifying_flag, page = 0, page_size = 20) =>
    //     preUrl +
    //     `/admin/stories?${status ? "status=" + status : ""}${
    //         modifying_flag ? "&modifying_flag=" + modifying_flag : ""
    //     }&page=${page}&page_size=${page_size}`,
    GET_STORIES_BY_ADMIN: (status, modifying_flag, page = 0, page_size = 20) =>
        preUrl + `/admin/stories?status=${status}&modifying_flag=${modifying_flag}&page=${page}&page_size=${page_size}`,

    GET_STORIES_RANK: (page = 0, page_size = 20) => preUrl + `/stories/rank?page=${page}&page_size=${page_size}`,
    GET_STORIES_TREND: (page = 0, page_size = 20) => preUrl + `/stories/trend?page=${page}&page_size=${page_size}`,
    GET_NEW_CREATION_STORIES: (page = 0, page_size = 20) =>
        preUrl + `/stories/new-creation?page=${page}&page_size=${page_size}`,
    GET_NEW_CREATION_CHAPTERS: (page = 0, page_size = 20) =>
        preUrl + `/chapters/new-creation?page=${page}&page_size=${page_size}`,

    // chapter
    GET_LIST_CHAPTERS_OF_STORY: (story_id, status, page = 0, page_size = 20) =>
        preUrl + `/stories/${story_id}/chapters?status=${status}&page=${page}&page_size=${page_size}`,
    GET_CHAPTER_BY_SLUG: (chapter_slug) => preUrl + `/chapters/${chapter_slug}`,

    GET_LIST_CHAPTERS_OF_AUTH_STORY: (story_id, status, page = 0, page_size = 20) =>
        preUrl + `/author/stories/${story_id}/chapters?status=${status}&page=${page}&page_size=${page_size}`,

    GET_AUTH_CHAPTER_BY_ID: (story_id, chapter_id) => preUrl + `/author/stories/${story_id}/chapters/${chapter_id}`,
    CREATE_CHAPTER: (story_id) => preUrl + `/stories/${story_id}/chapters`,
    UPDATE_CHAPTER: (story_id, chapter_id) => preUrl + `/stories/${story_id}/chapters/${chapter_id}`,
    UPDATE_STATUS_CHAPTER: (story_id, chapter_id, value) =>
        preUrl + `/stories/${story_id}/chapters/${chapter_id}/update-status?value=${value}`,
    BUY_CHAPTER: (chapter_id) => preUrl + `/chapters/${chapter_id}/actions/buy`,

    GET_CHAPTERS_BY_ADMIN: (status, modifying_flag, page = 0, page_size = 20) =>
        preUrl + `/admin/chapters?status=${status}&modifying_flag=${modifying_flag}&page=${page}&page_size=${page_size}`,

    APPROVE_UPDATED_STORY_BY_ADMIN: (story_id) => preUrl + `/admin/stories/${story_id}/actions/approveUpdatedStory`,
    APPROVE_UPDATE_CHAPTER_BY_ADMIN: (chapter_id) => preUrl + `/admin/chapters/${chapter_id}/actions/approveUpdatedChapter`,

    // bookmark
    GET_BOOKMARK: () => preUrl + `/bookmarks`,
    ADD_BOOKMARK: () => preUrl + `/bookmarks`,
    DELETE_BOOKMARK: (bookmark_id) => preUrl + `/bookmarks/${bookmark_id}`,

    // history
    GET_HISTORIES: () => preUrl + `/histories`,
    ADD_HISTORY: () => preUrl + `/histories`,
    DELETE_HISTORY: (history_id) => preUrl + `/histories/${history_id}`,

    //storyPurchase
    GET_STORY_PURCHASE: () => preUrl + `/story-purchase`,
};
