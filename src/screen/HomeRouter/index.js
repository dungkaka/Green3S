import React, { useEffect } from "react";
import TabNavigation from "./navigation";
import { useListenResponseNotification } from "@services/notification";

const HomeRouter = () => {
    useListenResponseNotification();

    return <TabNavigation />;
};

export default HomeRouter;
