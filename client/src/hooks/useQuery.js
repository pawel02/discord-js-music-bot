import { useLocation } from "react-router-dom";
import React from "react";

export const useQuery = (param) => {
    const { search } = useLocation();

    return React.useMemo(() => new URLSearchParams(search), [search]);
}