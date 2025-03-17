import { getServerSession } from 'next-auth';

// Return type of getUserSession()
export type Session = {
  name: string;
  email: string;
  image?: string;
  id: number;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const session = async ({ session, token }: any) => {
  session.user.id = token.id;
  session.image = token.picture;
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
