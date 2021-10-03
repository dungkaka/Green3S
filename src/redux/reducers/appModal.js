export const appModalConstantActions = {
    CLOSE_ALL_MODAL: "CLOSE_ALL_MODAL",
    OPEN_ICON_LOADING_OVERLAY: "OPEN_ICON_LOADING_OVERLAY",
    CLOSE_ICON_LOADING_OVERLAY: "CLOSE_ICON_LOADING_OVERLAY",
};

const initState = {
    iconLoadingOverlay: {
        isOpen: false,
        Icon: null,
    },
    loginModal: {
        isOpen: false,
    },
};

export const appModal = (state = initState, { type, payload }) => {
    switch (type) {
        case appModalConstantActions.OPEN_ICON_LOADING_OVERLAY: {
            return { ...state, iconLoadingOverlay: { Icon: payload.Icon, isOpen: true } };
        }
        case appModalConstantActions.CLOSE_ICON_LOADING_OVERLAY:
            return { ...state, iconLoadingOverlay: initState.iconLoadingOverlay };

        case appModalConstantActions.CLOSE_ALL_MODAL: {
            return initState;
        }

        default:
            return state;
    }
};

export const getIconLoadingOverlay = (state) => state.appModal.iconLoadingOverlay;

export const isOpenAnyModal = (state) => {
    for (let key in state) {
        if (state[key].isOpen == true) return true;
    }
    return false;
};
