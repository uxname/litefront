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
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  profile?: Maybe<Profile>;
  profileId?: Maybe<Scalars['Int']['output']>;
  sessions?: Maybe<Array<AccountSession>>;
  updatedAt: Scalars['DateTime']['output'];
};

export type AccountCount = {
  __typename?: 'AccountCount';
  sessions: Scalars['Int']['output'];
};

export type AccountCreateManyProfileInput = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  email: Scalars['String']['input'];
  id?: InputMaybe<Scalars['Int']['input']>;
  passwordHash: Scalars['String']['input'];
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type AccountCreateManyProfileInputEnvelope = {
  data: Array<AccountCreateManyProfileInput>;
  skipDuplicates?: InputMaybe<Scalars['Boolean']['input']>;
};

export type AccountCreateOrConnectWithoutProfileInput = {
  create: AccountCreateWithoutProfileInput;
  where: AccountWhereUniqueInput;
};

export type AccountCreateWithoutProfileInput = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  email: Scalars['String']['input'];
  passwordHash: Scalars['String']['input'];
  sessions?: InputMaybe<AccountSessionCreateNestedManyWithoutAccountInput>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type AccountListRelationFilter = {
  every?: InputMaybe<AccountWhereInput>;
  none?: InputMaybe<AccountWhereInput>;
  some?: InputMaybe<AccountWhereInput>;
};

export type AccountRelationFilter = {
  is?: InputMaybe<AccountWhereInput>;
  isNot?: InputMaybe<AccountWhereInput>;
};

export type AccountScalarWhereInput = {
  AND?: InputMaybe<Array<AccountScalarWhereInput>>;
  NOT?: InputMaybe<Array<AccountScalarWhereInput>>;
  OR?: InputMaybe<Array<AccountScalarWhereInput>>;
  createdAt?: InputMaybe<DateTimeFilter>;
  email?: InputMaybe<StringFilter>;
  id?: InputMaybe<IntFilter>;
  passwordHash?: InputMaybe<StringFilter>;
  profileId?: InputMaybe<IntNullableFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

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

export type AccountSessionCreateManyAccountInput = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  expiresAt: Scalars['DateTime']['input'];
  id?: InputMaybe<Scalars['Int']['input']>;
  ipAddr: Scalars['String']['input'];
  token: Scalars['String']['input'];
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  userAgent?: InputMaybe<Scalars['String']['input']>;
};

export type AccountSessionCreateManyAccountInputEnvelope = {
  data: Array<AccountSessionCreateManyAccountInput>;
  skipDuplicates?: InputMaybe<Scalars['Boolean']['input']>;
};

export type AccountSessionCreateNestedManyWithoutAccountInput = {
  connect?: InputMaybe<Array<AccountSessionWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<AccountSessionCreateOrConnectWithoutAccountInput>>;
  create?: InputMaybe<Array<AccountSessionCreateWithoutAccountInput>>;
  createMany?: InputMaybe<AccountSessionCreateManyAccountInputEnvelope>;
};

export type AccountSessionCreateOrConnectWithoutAccountInput = {
  create: AccountSessionCreateWithoutAccountInput;
  where: AccountSessionWhereUniqueInput;
};

export type AccountSessionCreateWithoutAccountInput = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  expiresAt: Scalars['DateTime']['input'];
  ipAddr: Scalars['String']['input'];
  token: Scalars['String']['input'];
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  userAgent?: InputMaybe<Scalars['String']['input']>;
};

export type AccountSessionListRelationFilter = {
  every?: InputMaybe<AccountSessionWhereInput>;
  none?: InputMaybe<AccountSessionWhereInput>;
  some?: InputMaybe<AccountSessionWhereInput>;
};

export type AccountSessionScalarWhereInput = {
  AND?: InputMaybe<Array<AccountSessionScalarWhereInput>>;
  NOT?: InputMaybe<Array<AccountSessionScalarWhereInput>>;
  OR?: InputMaybe<Array<AccountSessionScalarWhereInput>>;
  accountId?: InputMaybe<IntFilter>;
  createdAt?: InputMaybe<DateTimeFilter>;
  expiresAt?: InputMaybe<DateTimeFilter>;
  id?: InputMaybe<IntFilter>;
  ipAddr?: InputMaybe<StringFilter>;
  token?: InputMaybe<StringFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
  userAgent?: InputMaybe<StringNullableFilter>;
};

export type AccountSessionUpdateManyMutationInput = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  expiresAt?: InputMaybe<Scalars['DateTime']['input']>;
  ipAddr?: InputMaybe<Scalars['String']['input']>;
  token?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  userAgent?: InputMaybe<Scalars['String']['input']>;
};

export type AccountSessionUpdateManyWithWhereWithoutAccountInput = {
  data: AccountSessionUpdateManyMutationInput;
  where: AccountSessionScalarWhereInput;
};

export type AccountSessionUpdateManyWithoutAccountNestedInput = {
  connect?: InputMaybe<Array<AccountSessionWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<AccountSessionCreateOrConnectWithoutAccountInput>>;
  create?: InputMaybe<Array<AccountSessionCreateWithoutAccountInput>>;
  createMany?: InputMaybe<AccountSessionCreateManyAccountInputEnvelope>;
  delete?: InputMaybe<Array<AccountSessionWhereUniqueInput>>;
  deleteMany?: InputMaybe<Array<AccountSessionScalarWhereInput>>;
  disconnect?: InputMaybe<Array<AccountSessionWhereUniqueInput>>;
  set?: InputMaybe<Array<AccountSessionWhereUniqueInput>>;
  update?: InputMaybe<Array<AccountSessionUpdateWithWhereUniqueWithoutAccountInput>>;
  updateMany?: InputMaybe<Array<AccountSessionUpdateManyWithWhereWithoutAccountInput>>;
  upsert?: InputMaybe<Array<AccountSessionUpsertWithWhereUniqueWithoutAccountInput>>;
};

export type AccountSessionUpdateWithWhereUniqueWithoutAccountInput = {
  data: AccountSessionUpdateWithoutAccountInput;
  where: AccountSessionWhereUniqueInput;
};

export type AccountSessionUpdateWithoutAccountInput = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  expiresAt?: InputMaybe<Scalars['DateTime']['input']>;
  ipAddr?: InputMaybe<Scalars['String']['input']>;
  token?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  userAgent?: InputMaybe<Scalars['String']['input']>;
};

export type AccountSessionUpsertWithWhereUniqueWithoutAccountInput = {
  create: AccountSessionCreateWithoutAccountInput;
  update: AccountSessionUpdateWithoutAccountInput;
  where: AccountSessionWhereUniqueInput;
};

export type AccountSessionWhereInput = {
  AND?: InputMaybe<Array<AccountSessionWhereInput>>;
  NOT?: InputMaybe<Array<AccountSessionWhereInput>>;
  OR?: InputMaybe<Array<AccountSessionWhereInput>>;
  account?: InputMaybe<AccountRelationFilter>;
  accountId?: InputMaybe<IntFilter>;
  createdAt?: InputMaybe<DateTimeFilter>;
  expiresAt?: InputMaybe<DateTimeFilter>;
  id?: InputMaybe<IntFilter>;
  ipAddr?: InputMaybe<StringFilter>;
  token?: InputMaybe<StringFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
  userAgent?: InputMaybe<StringNullableFilter>;
};

export type AccountSessionWhereUniqueInput = {
  AND?: InputMaybe<Array<AccountSessionWhereInput>>;
  NOT?: InputMaybe<Array<AccountSessionWhereInput>>;
  OR?: InputMaybe<Array<AccountSessionWhereInput>>;
  account?: InputMaybe<AccountRelationFilter>;
  accountId?: InputMaybe<IntFilter>;
  createdAt?: InputMaybe<DateTimeFilter>;
  expiresAt?: InputMaybe<DateTimeFilter>;
  id?: InputMaybe<Scalars['Int']['input']>;
  ipAddr?: InputMaybe<StringFilter>;
  token?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<DateTimeFilter>;
  userAgent?: InputMaybe<StringNullableFilter>;
};

export enum AccountStatus {
  Active = 'ACTIVE',
  Deleted = 'DELETED',
  Inactive = 'INACTIVE'
}

export type AccountUpdateManyMutationInput = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  passwordHash?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type AccountUpdateManyWithWhereWithoutProfileInput = {
  data: AccountUpdateManyMutationInput;
  where: AccountScalarWhereInput;
};

export type AccountUpdateManyWithoutProfileNestedInput = {
  connect?: InputMaybe<Array<AccountWhereUniqueInput>>;
  connectOrCreate?: InputMaybe<Array<AccountCreateOrConnectWithoutProfileInput>>;
  create?: InputMaybe<Array<AccountCreateWithoutProfileInput>>;
  createMany?: InputMaybe<AccountCreateManyProfileInputEnvelope>;
  delete?: InputMaybe<Array<AccountWhereUniqueInput>>;
  deleteMany?: InputMaybe<Array<AccountScalarWhereInput>>;
  disconnect?: InputMaybe<Array<AccountWhereUniqueInput>>;
  set?: InputMaybe<Array<AccountWhereUniqueInput>>;
  update?: InputMaybe<Array<AccountUpdateWithWhereUniqueWithoutProfileInput>>;
  updateMany?: InputMaybe<Array<AccountUpdateManyWithWhereWithoutProfileInput>>;
  upsert?: InputMaybe<Array<AccountUpsertWithWhereUniqueWithoutProfileInput>>;
};

export type AccountUpdateWithWhereUniqueWithoutProfileInput = {
  data: AccountUpdateWithoutProfileInput;
  where: AccountWhereUniqueInput;
};

export type AccountUpdateWithoutProfileInput = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  passwordHash?: InputMaybe<Scalars['String']['input']>;
  sessions?: InputMaybe<AccountSessionUpdateManyWithoutAccountNestedInput>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type AccountUpsertWithWhereUniqueWithoutProfileInput = {
  create: AccountCreateWithoutProfileInput;
  update: AccountUpdateWithoutProfileInput;
  where: AccountWhereUniqueInput;
};

export type AccountWhereInput = {
  AND?: InputMaybe<Array<AccountWhereInput>>;
  NOT?: InputMaybe<Array<AccountWhereInput>>;
  OR?: InputMaybe<Array<AccountWhereInput>>;
  createdAt?: InputMaybe<DateTimeFilter>;
  email?: InputMaybe<StringFilter>;
  id?: InputMaybe<IntFilter>;
  passwordHash?: InputMaybe<StringFilter>;
  profile?: InputMaybe<ProfileNullableRelationFilter>;
  profileId?: InputMaybe<IntNullableFilter>;
  sessions?: InputMaybe<AccountSessionListRelationFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export type AccountWhereUniqueInput = {
  AND?: InputMaybe<Array<AccountWhereInput>>;
  NOT?: InputMaybe<Array<AccountWhereInput>>;
  OR?: InputMaybe<Array<AccountWhereInput>>;
  createdAt?: InputMaybe<DateTimeFilter>;
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  passwordHash?: InputMaybe<StringFilter>;
  profile?: InputMaybe<ProfileNullableRelationFilter>;
  profileId?: InputMaybe<IntNullableFilter>;
  sessions?: InputMaybe<AccountSessionListRelationFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export type ActivateAccountInput = {
  code: Scalars['String']['input'];
  email: Scalars['String']['input'];
};

export type AuthResponse = {
  __typename?: 'AuthResponse';
  account: Account;
  token: Scalars['String']['output'];
};

export type DateTimeFilter = {
  equals?: InputMaybe<Scalars['DateTime']['input']>;
  gt?: InputMaybe<Scalars['DateTime']['input']>;
  gte?: InputMaybe<Scalars['DateTime']['input']>;
  in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  lt?: InputMaybe<Scalars['DateTime']['input']>;
  lte?: InputMaybe<Scalars['DateTime']['input']>;
  not?: InputMaybe<NestedDateTimeFilter>;
  notIn?: InputMaybe<Array<Scalars['DateTime']['input']>>;
};

export type EmailPasswordInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type EnumAccountStatusFilter = {
  equals?: InputMaybe<AccountStatus>;
  in?: InputMaybe<Array<AccountStatus>>;
  not?: InputMaybe<NestedEnumAccountStatusFilter>;
  notIn?: InputMaybe<Array<AccountStatus>>;
};

export type EnumProfileRoleNullableListFilter = {
  equals?: InputMaybe<Array<ProfileRole>>;
  has?: InputMaybe<ProfileRole>;
  hasEvery?: InputMaybe<Array<ProfileRole>>;
  hasSome?: InputMaybe<Array<ProfileRole>>;
  isEmpty?: InputMaybe<Scalars['Boolean']['input']>;
};

export type GenerateEmailCodeInput = {
  email: Scalars['String']['input'];
};

export type GenerateEmailCodeResponse = {
  __typename?: 'GenerateEmailCodeResponse';
  expiresAt: Scalars['DateTime']['output'];
  result: Scalars['Boolean']['output'];
};

export type IntFilter = {
  equals?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  gte?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lt?: InputMaybe<Scalars['Int']['input']>;
  lte?: InputMaybe<Scalars['Int']['input']>;
  not?: InputMaybe<NestedIntFilter>;
  notIn?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type IntNullableFilter = {
  equals?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  gte?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lt?: InputMaybe<Scalars['Int']['input']>;
  lte?: InputMaybe<Scalars['Int']['input']>;
  not?: InputMaybe<NestedIntNullableFilter>;
  notIn?: InputMaybe<Array<Scalars['Int']['input']>>;
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
  updateProfile: Profile;
};


export type MutationActivateAccountArgs = {
  data: ActivateAccountInput;
};


export type MutationChangePasswordArgs = {
  newPassword: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationEchoArgs = {
  text: Scalars['String']['input'];
};


export type MutationGenerateEmailCodeArgs = {
  data: GenerateEmailCodeInput;
};


export type MutationLoginArgs = {
  data: EmailPasswordInput;
};


export type MutationLoginAsArgs = {
  email: Scalars['String']['input'];
};


export type MutationLogoutArgs = {
  sessionIds: Array<Scalars['Float']['input']>;
};


export type MutationRegisterArgs = {
  data: EmailPasswordInput;
};


export type MutationResetPasswordArgs = {
  data: ResetPasswordInput;
};


export type MutationUpdateProfileArgs = {
  input: ProfileUpdateInput;
};

export type NestedDateTimeFilter = {
  equals?: InputMaybe<Scalars['DateTime']['input']>;
  gt?: InputMaybe<Scalars['DateTime']['input']>;
  gte?: InputMaybe<Scalars['DateTime']['input']>;
  in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  lt?: InputMaybe<Scalars['DateTime']['input']>;
  lte?: InputMaybe<Scalars['DateTime']['input']>;
  not?: InputMaybe<NestedDateTimeFilter>;
  notIn?: InputMaybe<Array<Scalars['DateTime']['input']>>;
};

export type NestedEnumAccountStatusFilter = {
  equals?: InputMaybe<AccountStatus>;
  in?: InputMaybe<Array<AccountStatus>>;
  not?: InputMaybe<NestedEnumAccountStatusFilter>;
  notIn?: InputMaybe<Array<AccountStatus>>;
};

export type NestedIntFilter = {
  equals?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  gte?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lt?: InputMaybe<Scalars['Int']['input']>;
  lte?: InputMaybe<Scalars['Int']['input']>;
  not?: InputMaybe<NestedIntFilter>;
  notIn?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type NestedIntNullableFilter = {
  equals?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  gte?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lt?: InputMaybe<Scalars['Int']['input']>;
  lte?: InputMaybe<Scalars['Int']['input']>;
  not?: InputMaybe<NestedIntNullableFilter>;
  notIn?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type NestedStringFilter = {
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  equals?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  not?: InputMaybe<NestedStringFilter>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type NestedStringNullableFilter = {
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  equals?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  not?: InputMaybe<NestedStringNullableFilter>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type Profile = {
  __typename?: 'Profile';
  _count: ProfileCount;
  accounts?: Maybe<Array<Account>>;
  avatarUrl?: Maybe<Scalars['String']['output']>;
  bio?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  name?: Maybe<Scalars['String']['output']>;
  roles?: Maybe<Array<ProfileRole>>;
  status: AccountStatus;
  updatedAt: Scalars['DateTime']['output'];
};

export type ProfileCount = {
  __typename?: 'ProfileCount';
  accounts: Scalars['Int']['output'];
};

export type ProfileNullableRelationFilter = {
  is?: InputMaybe<ProfileWhereInput>;
  isNot?: InputMaybe<ProfileWhereInput>;
};

export enum ProfileRole {
  Admin = 'ADMIN',
  User = 'USER'
}

export type ProfileUpdateInput = {
  accounts?: InputMaybe<AccountUpdateManyWithoutProfileNestedInput>;
  avatarUrl?: InputMaybe<Scalars['String']['input']>;
  bio?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  roles?: InputMaybe<Array<ProfileRole>>;
  status?: InputMaybe<AccountStatus>;
  updatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type ProfileWhereInput = {
  AND?: InputMaybe<Array<ProfileWhereInput>>;
  NOT?: InputMaybe<Array<ProfileWhereInput>>;
  OR?: InputMaybe<Array<ProfileWhereInput>>;
  accounts?: InputMaybe<AccountListRelationFilter>;
  avatarUrl?: InputMaybe<StringNullableFilter>;
  bio?: InputMaybe<StringNullableFilter>;
  createdAt?: InputMaybe<DateTimeFilter>;
  id?: InputMaybe<IntFilter>;
  name?: InputMaybe<StringNullableFilter>;
  roles?: InputMaybe<EnumProfileRoleNullableListFilter>;
  status?: InputMaybe<EnumAccountStatusFilter>;
  updatedAt?: InputMaybe<DateTimeFilter>;
};

export type Query = {
  __typename?: 'Query';
  currentSession: AccountSession;
  debug: Scalars['JSON']['output'];
  echo: Scalars['String']['output'];
  testTranslation: Scalars['String']['output'];
  whoami: Account;
};


export type QueryEchoArgs = {
  text: Scalars['String']['input'];
};


export type QueryTestTranslationArgs = {
  username: Scalars['String']['input'];
};

export enum QueryMode {
  Default = 'default',
  Insensitive = 'insensitive'
}

export type ResetPasswordInput = {
  email: Scalars['String']['input'];
  emailCode: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
};

export type StringFilter = {
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  equals?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  mode?: InputMaybe<QueryMode>;
  not?: InputMaybe<NestedStringFilter>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type StringNullableFilter = {
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  equals?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  mode?: InputMaybe<QueryMode>;
  not?: InputMaybe<NestedStringNullableFilter>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type LoginMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'AuthResponse', token: string, account: { __typename?: 'Account', id: number, email: string } } };

export type RegisterMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'AuthResponse', token: string, account: { __typename?: 'Account', id: number, email: string } } };

export type DebugQueryVariables = Exact<{ [key: string]: never; }>;


export type DebugQuery = { __typename?: 'Query', debug: any };

export type WhoAmIQueryVariables = Exact<{ [key: string]: never; }>;


export type WhoAmIQuery = { __typename?: 'Query', whoami: { __typename?: 'Account', id: number, email: string, profile?: { __typename?: 'Profile', id: number, avatarUrl?: string | null, name?: string | null, status: AccountStatus } | null } };


export const LoginDocument = gql`
    mutation Login($email: String!, $password: String!) {
  login(data: {email: $email, password: $password}) {
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
export const RegisterDocument = gql`
    mutation Register($email: String!, $password: String!) {
  register(data: {email: $email, password: $password}) {
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
export const WhoAmIDocument = gql`
    query WhoAmI {
  whoami {
    id
    email
    profile {
      id
      avatarUrl
      name
      status
    }
  }
}
    `;

/**
 * __useWhoAmIQuery__
 *
 * To run a query within a React component, call `useWhoAmIQuery` and pass it any options that fit your needs.
 * When your component renders, `useWhoAmIQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWhoAmIQuery({
 *   variables: {
 *   },
 * });
 */
export function useWhoAmIQuery(baseOptions?: Apollo.QueryHookOptions<WhoAmIQuery, WhoAmIQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<WhoAmIQuery, WhoAmIQueryVariables>(WhoAmIDocument, options);
      }
export function useWhoAmILazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<WhoAmIQuery, WhoAmIQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<WhoAmIQuery, WhoAmIQueryVariables>(WhoAmIDocument, options);
        }
export type WhoAmIQueryHookResult = ReturnType<typeof useWhoAmIQuery>;
export type WhoAmILazyQueryHookResult = ReturnType<typeof useWhoAmILazyQuery>;
export type WhoAmIQueryResult = Apollo.QueryResult<WhoAmIQuery, WhoAmIQueryVariables>;