import { resolveStoredRole } from "@/helpers/authStorage";

export const resolveMentorRoleContext = () => {
  const role = resolveStoredRole();
  const isCabangRole = role === "cabang";

  return {
    role,
    isCabangRole,
    mentorRouteBase: isCabangRole ? "/cabang/mentor" : "/perusahaan/mentor",
  };
};
