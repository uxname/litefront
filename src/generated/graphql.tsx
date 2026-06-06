/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** User authorization roles */
export type ProfileRole =
  | 'ADMIN'
  | 'USER';

/** Input fields for updating a user profile */
export type ProfileUpdateInput = {
  /** New avatar image URL */
  avatarUrl?: string | null | undefined;
  /** New short biography */
  bio?: string | null | undefined;
  /** New public display name */
  displayName?: string | null | undefined;
};

export type UpdateProfileMutationVariables = Exact<{
  input: ProfileUpdateInput;
}>;


export type UpdateProfileMutation = { updateProfile: { id: number, avatarUrl: string | null, displayName: string | null, bio: string | null, updatedAt: unknown } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { me: { id: number, roles: Array<ProfileRole> | null, avatarUrl: string | null, displayName: string | null, bio: string | null, createdAt: unknown, updatedAt: unknown } };


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