export const getRouteStatus = (status) => {
    return {
        isCompleted: status === "approved",
        isActive: status === "active",
        isLocked: status === "locked",
    };
};