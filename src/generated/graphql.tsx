/* eslint-disable */
import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
  JSON: { input: any; output: any; }
};

export type Account = {
  __typename?: 'Account';
  _count: AccountCount;
  avatarUrl?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  roles?: Maybe<Array<AccountRole>>;
  sessions?: Maybe<Array<AccountSession>>;
  status: AccountStatus;
  updatedAt: Scalars['DateTime']['output'];
};

export type AccountCount = {
  __typename?: 'AccountCount';
  sessions: Scalars['Int']['output'];
};

export enum AccountRole {
  Admin = 'ADMIN',
  User = 'USER'
}

export type AccountSession = {
  __typename?: 'AccountSession';
  account: Account;
  accountId: Scalars['Int']['output'];
  createdAt: Scalars['DateTime']['output'];
  expiresAt: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  ipAddr: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  userAgent?: Maybe<Scalars['String']['output']>;
};

export enum AccountStatus {
  Active = 'ACTIVE',
  Deleted = 'DELETED',
  Inactive = 'INACTIVE'
}

export type AuthResponse = {
  __typename?: 'AuthResponse';
  account: Account;
  token: Scalars['String']['output'];
};

export type GenerateEmailCodeResponse = {
  __typename?: 'GenerateEmailCodeResponse';
  expiresAt: Scalars['DateTime']['output'];
  result: Scalars['Boolean']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  activateAccount: Account;
  changePassword: Account;
  echo: Scalars['String']['output'];
  generateEmailCode: GenerateEmailCodeResponse;
  login: AuthResponse;
  loginAs: AuthResponse;
  logout: Scalars['Boolean']['output'];
  register: AuthResponse;
  resetPassword: Account;
  updateAccount: Account;
};


export type MutationActivateAccountArgs = {
  code: Scalars['String']['input'];
  email: Scalars['String']['input'];
};


export type MutationChangePasswordArgs = {
  newPassword: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationEchoArgs = {
  text: Scalars['String']['input'];
};


export type MutationGenerateEmailCodeArgs = {
  email: Scalars['String']['input'];
};


export type MutationLoginArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationLoginAsArgs = {
  email: Scalars['String']['input'];
};


export type MutationLogoutArgs = {
  sessionIds: Array<Scalars['Float']['input']>;
};


export type MutationRegisterArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationResetPasswordArgs = {
  email: Scalars['String']['input'];
  emailCode: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
};


export type MutationUpdateAccountArgs = {
  input: UpdateAccountInput;
};

export type Query = {
  __typename?: 'Query';
  currentSession: AccountSession;
  debug: Scalars['JSON']['output'];
  echo: Scalars['String']['output'];
  whoami: Account;
};


export type QueryEchoArgs = {
  text: Scalars['String']['input'];
};

export type UpdateAccountInput = {
  avatarUrl: Scalars['String']['input'];
};

export type RegisterMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'AuthResponse', token: string, account: { __typename?: 'Account', id: number, email: string } } };

export type LoginMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'AuthResponse', token: string, account: { __typename?: 'Account', id: number, email: string } } };

export type DebugQueryVariables = Exact<{ [key: string]: never; }>;


export type DebugQuery = { __typename?: 'Query', debug: any };


export const RegisterDocument = gql`
    mutation Register($email: String!, $password: String!) {
  register(email: $email, password: $password) {
    token
    account {
      id
      email
    }
  }
}
    `;
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, options);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const LoginDocument = gql`
    mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token
    account {
      id
      email
    }
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const DebugDocument = gql`
    query Debug {
  debug
}
    `;

/**
 * __useDebugQuery__
 *
 * To run a query within a React component, call `useDebugQuery` and pass it any options that fit your needs.
 * When your component renders, `useDebugQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDebugQuery({
 *   variables: {
 *   },
 * });
 */
export function useDebugQuery(baseOptions?: Apollo.QueryHookOptions<DebugQuery, DebugQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DebugQuery, DebugQueryVariables>(DebugDocument, options);
      }
export function useDebugLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DebugQuery, DebugQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DebugQuery, DebugQueryVariables>(DebugDocument, options);
        }
export type DebugQueryHookResult = ReturnType<typeof useDebugQuery>;
export type DebugLazyQueryHookResult = ReturnType<typeof useDebugLazyQuery>;
export type DebugQueryResult = Apollo.QueryResult<DebugQuery, DebugQueryVariables>;