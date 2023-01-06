import {AllFilmsQueryResult} from '../../generated/graphql';

export interface IIndexPage {
    data: AllFilmsQueryResult,
    image: string
}
