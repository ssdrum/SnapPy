import { Session } from "@/app/lib/types";
import { getServerSession } from "next-auth";

export const session = async ({ session, token }: any) => {
  session.user.id = token.id;
  return session;
};

export const getUserSession = async (): Promise<Session> => {
  const authUserSession = await getServerSession({
    callbacks: {
      session,
    },
  });

  // if (!authUserSession) throw new Error('unauthorized')
  return authUserSession?.user;
};
