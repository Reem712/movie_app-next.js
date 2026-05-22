import { authClient } from './api';
import { User } from '@/types';

interface LoginPayload {
  username: string;
  password: string;
}

export const loginUser = async (payload: LoginPayload): Promise<User> => {
  const { data } = await authClient.post('/auth/login', {
    username:      payload.username,
    password:      payload.password,
    expiresInMins: 60,
  });

  return {
    id:        data.id,
    username:  data.username,
    email:     data.email,
    firstName: data.firstName,
    lastName:  data.lastName,
    image:     data.image,
    token:     data.token,
  };
};
