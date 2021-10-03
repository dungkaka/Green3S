import { createAction } from "@redux/createAction";
import { appModalConstantActions } from "@redux/reducers/appModal";

export const closeAllModal = createAction(appModalConstantActions.CLOSE_ALL_MODAL);

export const openIconLoadingOverlay = ({ Icon } = {}) =>
    createAction(appModalConstantActions.OPEN_ICON_LOADING_OVERLAY, { Icon });
export const closeIconLoadingOverlay = createAction(appModalConstantActions.CLOSE_ICON_LOADING_OVERLAY);
