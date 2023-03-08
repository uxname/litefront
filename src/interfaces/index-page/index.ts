import { AllFilmsQuery } from '@/generated/graphql';

export interface IIndexPageProperties {
  data: AllFilmsQuery;
  imageUrl: string;
}
