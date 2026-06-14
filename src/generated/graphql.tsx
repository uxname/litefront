/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** Access role granted to a profile; drives authorization on guarded fields. */
export type ProfileRole =
  /** Full access — may call admin-only queries and mutations. */
  | 'ADMIN'
  /** Standard authenticated user. */
  | 'USER';

/** Fields a user may change on their own profile. Omitted fields are left unchanged. */
export type ProfileUpdateInput = {
  /** New avatar image URL. */
  avatarUrl?: string | null | undefined;
  /** New biography text. */
  bio?: string | null | undefined;
  /** New display name. */
  displayName?: string | null | undefined;
};

export type UpdateProfileMutationVariables = Exact<{
  input: ProfileUpdateInput;
}>;


export type UpdateProfileMutation = { updateProfile: { id: string, avatarUrl: string | null, displayName: string | null, bio: string | null, updatedAt: string } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { me: { id: string, roles: Array<ProfileRole>, avatarUrl: string | null, displayName: string | null, bio: string | null, createdAt: string, updatedAt: string } };


export const UpdateProfileDocument = gql`
    mutation UpdateProfile($input: ProfileUpdateInput!) {
  updateProfile(input: $input) {
    id
    avatarUrl
    displayName
    bio
    updatedAt
  }
}
    `;

export function useUpdateProfileMutation() {
  return Urql.useMutation<UpdateProfileMutation, UpdateProfileMutationVariables>(UpdateProfileDocument);
};
export const MeDocument = gql`
    query Me {
  me {
    id
    roles
    avatarUrl
    displayName
    bio
    createdAt
    updatedAt
  }
}
    `;

export function useMeQuery(options?: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'>) {
  return Urql.useQuery<MeQuery, MeQueryVariables>({ query: MeDocument, ...options });
};