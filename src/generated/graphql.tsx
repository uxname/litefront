/* eslint-disable */
import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

/** A single film. */
export type Film = Node & {
  __typename?: 'Film';
  characterConnection?: Maybe<FilmCharactersConnection>;
  /** The ISO 8601 date format of the time that this resource was created. */
  created?: Maybe<Scalars['String']>;
  /** The name of the director of this film. */
  director?: Maybe<Scalars['String']>;
  /** The ISO 8601 date format of the time that this resource was edited. */
  edited?: Maybe<Scalars['String']>;
  /** The episode number of this film. */
  episodeID?: Maybe<Scalars['Int']>;
  /** The ID of an object */
  id: Scalars['ID'];
  /** The opening paragraphs at the beginning of this film. */
  openingCrawl?: Maybe<Scalars['String']>;
  planetConnection?: Maybe<FilmPlanetsConnection>;
  /** The name(s) of the producer(s) of this film. */
  producers?: Maybe<Array<Maybe<Scalars['String']>>>;
  /** The ISO 8601 date format of film release at original creator country. */
  releaseDate?: Maybe<Scalars['String']>;
  speciesConnection?: Maybe<FilmSpeciesConnection>;
  starshipConnection?: Maybe<FilmStarshipsConnection>;
  /** The title of this film. */
  title?: Maybe<Scalars['String']>;
  vehicleConnection?: Maybe<FilmVehiclesConnection>;
};


/** A single film. */
export type FilmCharacterConnectionArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/** A single film. */
export type FilmPlanetConnectionArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/** A single film. */
export type FilmSpeciesConnectionArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/** A single film. */
export type FilmStarshipConnectionArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/** A single film. */
export type FilmVehicleConnectionArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

/** A connection to a list of items. */
export type FilmCharactersConnection = {
  __typename?: 'FilmCharactersConnection';
  /**
   * A list of all of the objects returned in the connection. This is a convenience
   * field provided for quickly exploring the API; rather than querying for
   * "{ edges { node } }" when no edge data is needed, this field can be be used
   * instead. Note that when clients like Relay need to fetch the "cursor" field on
   * the edge to enable efficient pagination, this shortcut cannot be used, and the
   * full "{ edges { node } }" version should be used instead.
   */
  characters?: Maybe<Array<Maybe<Person>>>;
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<FilmCharactersEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /**
   * A count of the total number of objects in this connection, ignoring pagination.
   * This allows a client to fetch the first five objects by passing "5" as the
   * argument to "first", then fetch the total count so it could display "5 of 83",
   * for example.
   */
  totalCount?: Maybe<Scalars['Int']>;
};

/** An edge in a connection. */
export type FilmCharactersEdge = {
  __typename?: 'FilmCharactersEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<Person>;
};

/** A connection to a list of items. */
export type FilmPlanetsConnection = {
  __typename?: 'FilmPlanetsConnection';
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<FilmPlanetsEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /**
   * A list of all of the objects returned in the connection. This is a convenience
   * field provided for quickly exploring the API; rather than querying for
   * "{ edges { node } }" when no edge data is needed, this field can be be used
   * instead. Note that when clients like Relay need to fetch the "cursor" field on
   * the edge to enable efficient pagination, this shortcut cannot be used, and the
   * full "{ edges { node } }" version should be used instead.
   */
  planets?: Maybe<Array<Maybe<Planet>>>;
  /**
   * A count of the total number of objects in this connection, ignoring pagination.
   * This allows a client to fetch the first five objects by passing "5" as the
   * argument to "first", then fetch the total count so it could display "5 of 83",
   * for example.
   */
  totalCount?: Maybe<Scalars['Int']>;
};

/** An edge in a connection. */
export type FilmPlanetsEdge = {
  __typename?: 'FilmPlanetsEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<Planet>;
};

/** A connection to a list of items. */
export type FilmSpeciesConnection = {
  __typename?: 'FilmSpeciesConnection';
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<FilmSpeciesEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /**
   * A list of all of the objects returned in the connection. This is a convenience
   * field provided for quickly exploring the API; rather than querying for
   * "{ edges { node } }" when no edge data is needed, this field can be be used
   * instead. Note that when clients like Relay need to fetch the "cursor" field on
   * the edge to enable efficient pagination, this shortcut cannot be used, and the
   * full "{ edges { node } }" version should be used instead.
   */
  species?: Maybe<Array<Maybe<Species>>>;
  /**
   * A count of the total number of objects in this connection, ignoring pagination.
   * This allows a client to fetch the first five objects by passing "5" as the
   * argument to "first", then fetch the total count so it could display "5 of 83",
   * for example.
   */
  totalCount?: Maybe<Scalars['Int']>;
};

/** An edge in a connection. */
export type FilmSpeciesEdge = {
  __typename?: 'FilmSpeciesEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<Species>;
};

/** A connection to a list of items. */
export type FilmStarshipsConnection = {
  __typename?: 'FilmStarshipsConnection';
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<FilmStarshipsEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /**
   * A list of all of the objects returned in the connection. This is a convenience
   * field provided for quickly exploring the API; rather than querying for
   * "{ edges { node } }" when no edge data is needed, this field can be be used
   * instead. Note that when clients like Relay need to fetch the "cursor" field on
   * the edge to enable efficient pagination, this shortcut cannot be used, and the
   * full "{ edges { node } }" version should be used instead.
   */
  starships?: Maybe<Array<Maybe<Starship>>>;
  /**
   * A count of the total number of objects in this connection, ignoring pagination.
   * This allows a client to fetch the first five objects by passing "5" as the
   * argument to "first", then fetch the total count so it could display "5 of 83",
   * for example.
   */
  totalCount?: Maybe<Scalars['Int']>;
};

/** An edge in a connection. */
export type FilmStarshipsEdge = {
  __typename?: 'FilmStarshipsEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<Starship>;
};

/** A connection to a list of items. */
export type FilmVehiclesConnection = {
  __typename?: 'FilmVehiclesConnection';
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<FilmVehiclesEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /**
   * A count of the total number of objects in this connection, ignoring pagination.
   * This allows a client to fetch the first five objects by passing "5" as the
   * argument to "first", then fetch the total count so it could display "5 of 83",
   * for example.
   */
  totalCount?: Maybe<Scalars['Int']>;
  /**
   * A list of all of the objects returned in the connection. This is a convenience
   * field provided for quickly exploring the API; rather than querying for
   * "{ edges { node } }" when no edge data is needed, this field can be be used
   * instead. Note that when clients like Relay need to fetch the "cursor" field on
   * the edge to enable efficient pagination, this shortcut cannot be used, and the
   * full "{ edges { node } }" version should be used instead.
   */
  vehicles?: Maybe<Array<Maybe<Vehicle>>>;
};

/** An edge in a connection. */
export type FilmVehiclesEdge = {
  __typename?: 'FilmVehiclesEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<Vehicle>;
};

/** A connection to a list of items. */
export type FilmsConnection = {
  __typename?: 'FilmsConnection';
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<FilmsEdge>>>;
  /**
   * A list of all of the objects returned in the connection. This is a convenience
   * field provided for quickly exploring the API; rather than querying for
   * "{ edges { node } }" when no edge data is needed, this field can be be used
   * instead. Note that when clients like Relay need to fetch the "cursor" field on
   * the edge to enable efficient pagination, this shortcut cannot be used, and the
   * full "{ edges { node } }" version should be used instead.
   */
  films?: Maybe<Array<Maybe<Film>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /**
   * A count of the total number of objects in this connection, ignoring pagination.
   * This allows a client to fetch the first five objects by passing "5" as the
   * argument to "first", then fetch the total count so it could display "5 of 83",
   * for example.
   */
  totalCount?: Maybe<Scalars['Int']>;
};

/** An edge in a connection. */
export type FilmsEdge = {
  __typename?: 'FilmsEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<Film>;
};

/** An object with an ID */
export type Node = {
  /** The id of the object. */
  id: Scalars['ID'];
};

/** Information about pagination in a connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['String']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['String']>;
};

/** A connection to a list of items. */
export type PeopleConnection = {
  __typename?: 'PeopleConnection';
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<PeopleEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /**
   * A list of all of the objects returned in the connection. This is a convenience
   * field provided for quickly exploring the API; rather than querying for
   * "{ edges { node } }" when no edge data is needed, this field can be be used
   * instead. Note that when clients like Relay need to fetch the "cursor" field on
   * the edge to enable efficient pagination, this shortcut cannot be used, and the
   * full "{ edges { node } }" version should be used instead.
   */
  people?: Maybe<Array<Maybe<Person>>>;
  /**
   * A count of the total number of objects in this connection, ignoring pagination.
   * This allows a client to fetch the first five objects by passing "5" as the
   * argument to "first", then fetch the total count so it could display "5 of 83",
   * for example.
   */
  totalCount?: Maybe<Scalars['Int']>;
};

/** An edge in a connection. */
export type PeopleEdge = {
  __typename?: 'PeopleEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<Person>;
};

/** An individual person or character within the Star Wars universe. */
export type Person = Node & {
  __typename?: 'Person';
  /**
   * The birth year of the person, using the in-universe standard of BBY or ABY -
   * Before the Battle of Yavin or After the Battle of Yavin. The Battle of Yavin is
   * a battle that occurs at the end of Star Wars episode IV: A New Hope.
   */
  birthYear?: Maybe<Scalars['String']>;
  /** The ISO 8601 date format of the time that this resource was created. */
  created?: Maybe<Scalars['String']>;
  /** The ISO 8601 date format of the time that this resource was edited. */
  edited?: Maybe<Scalars['String']>;
  /**
   * The eye color of this person. Will be "unknown" if not known or "n/a" if the
   * person does not have an eye.
   */
  eyeColor?: Maybe<Scalars['String']>;
  filmConnection?: Maybe<PersonFilmsConnection>;
  /**
   * The gender of this person. Either "Male", "Female" or "unknown",
   * "n/a" if the person does not have a gender.
   */
  gender?: Maybe<Scalars['String']>;
  /**
   * The hair color of this person. Will be "unknown" if not known or "n/a" if the
   * person does not have hair.
   */
  hairColor?: Maybe<Scalars['String']>;
  /** The height of the person in centimeters. */
  height?: Maybe<Scalars['Int']>;
  /** A planet that this person was born on or inhabits. */
  homeworld?: Maybe<Planet>;
  /** The ID of an object */
  id: Scalars['ID'];
  /** The mass of the person in kilograms. */
  mass?: Maybe<Scalars['Float']>;
  /** The name of this person. */
  name?: Maybe<Scalars['String']>;
  /** The skin color of this person. */
  skinColor?: Maybe<Scalars['String']>;
  /** The species that this person belongs to, or null if unknown. */
  species?: Maybe<Species>;
  starshipConnection?: Maybe<PersonStarshipsConnection>;
  vehicleConnection?: Maybe<PersonVehiclesConnection>;
};


/** An individual person or character within the Star Wars universe. */
export type PersonFilmConnectionArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/** An individual person or character within the Star Wars universe. */
export type PersonStarshipConnectionArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/** An individual person or character within the Star Wars universe. */
export type PersonVehicleConnectionArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

/** A connection to a list of items. */
export type PersonFilmsConnection = {
  __typename?: 'PersonFilmsConnection';
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<PersonFilmsEdge>>>;
  /**
   * A list of all of the objects returned in the connection. This is a convenience
   * field provided for quickly exploring the API; rather than querying for
   * "{ edges { node } }" when no edge data is needed, this field can be be used
   * instead. Note that when clients like Relay need to fetch the "cursor" field on
   * the edge to enable efficient pagination, this shortcut cannot be used, and the
   * full "{ edges { node } }" version should be used instead.
   */
  films?: Maybe<Array<Maybe<Film>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /**
   * A count of the total number of objects in this connection, ignoring pagination.
   * This allows a client to fetch the first five objects by passing "5" as the
   * argument to "first", then fetch the total count so it could display "5 of 83",
   * for example.
   */
  totalCount?: Maybe<Scalars['Int']>;
};

/** An edge in a connection. */
export type PersonFilmsEdge = {
  __typename?: 'PersonFilmsEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<Film>;
};

/** A connection to a list of items. */
export type PersonStarshipsConnection = {
  __typename?: 'PersonStarshipsConnection';
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<PersonStarshipsEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /**
   * A list of all of the objects returned in the connection. This is a convenience
   * field provided for quickly exploring the API; rather than querying for
   * "{ edges { node } }" when no edge data is needed, this field can be be used
   * instead. Note that when clients like Relay need to fetch the "cursor" field on
   * the edge to enable efficient pagination, this shortcut cannot be used, and the
   * full "{ edges { node } }" version should be used instead.
   */
  starships?: Maybe<Array<Maybe<Starship>>>;
  /**
   * A count of the total number of objects in this connection, ignoring pagination.
   * This allows a client to fetch the first five objects by passing "5" as the
   * argument to "first", then fetch the total count so it could display "5 of 83",
   * for example.
   */
  totalCount?: Maybe<Scalars['Int']>;
};

/** An edge in a connection. */
export type PersonStarshipsEdge = {
  __typename?: 'PersonStarshipsEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<Starship>;
};

/** A connection to a list of items. */
export type PersonVehiclesConnection = {
  __typename?: 'PersonVehiclesConnection';
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<PersonVehiclesEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /**
   * A count of the total number of objects in this connection, ignoring pagination.
   * This allows a client to fetch the first five objects by passing "5" as the
   * argument to "first", then fetch the total count so it could display "5 of 83",
   * for example.
   */
  totalCount?: Maybe<Scalars['Int']>;
  /**
   * A list of all of the objects returned in the connection. This is a convenience
   * field provided for quickly exploring the API; rather than querying for
   * "{ edges { node } }" when no edge data is needed, this field can be be used
   * instead. Note that when clients like Relay need to fetch the "cursor" field on
   * the edge to enable efficient pagination, this shortcut cannot be used, and the
   * full "{ edges { node } }" version should be used instead.
   */
  vehicles?: Maybe<Array<Maybe<Vehicle>>>;
};

/** An edge in a connection. */
export type PersonVehiclesEdge = {
  __typename?: 'PersonVehiclesEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<Vehicle>;
};

/**
 * A large mass, planet or planetoid in the Star Wars Universe, at the time of
 * 0 ABY.
 */
export type Planet = Node & {
  __typename?: 'Planet';
  /** The climates of this planet. */
  climates?: Maybe<Array<Maybe<Scalars['String']>>>;
  /** The ISO 8601 date format of the time that this resource was created. */
  created?: Maybe<Scalars['String']>;
  /** The diameter of this planet in kilometers. */
  diameter?: Maybe<Scalars['Int']>;
  /** The ISO 8601 date format of the time that this resource was edited. */
  edited?: Maybe<Scalars['String']>;
  filmConnection?: Maybe<PlanetFilmsConnection>;
  /**
   * A number denoting the gravity of this planet, where "1" is normal or 1 standard
   * G. "2" is twice or 2 standard Gs. "0.5" is half or 0.5 standard Gs.
   */
  gravity?: Maybe<Scalars['String']>;
  /** The ID of an object */
  id: Scalars['ID'];
  /** The name of this planet. */
  name?: Maybe<Scalars['String']>;
  /**
   * The number of standard days it takes for this planet to complete a single orbit
   * of its local star.
   */
  orbitalPeriod?: Maybe<Scalars['Int']>;
  /** The average population of sentient beings inhabiting this planet. */
  population?: Maybe<Scalars['Float']>;
  residentConnection?: Maybe<PlanetResidentsConnection>;
  /**
   * The number of standard hours it takes for this planet to complete a single
   * rotation on its axis.
   */
  rotationPeriod?: Maybe<Scalars['Int']>;
  /**
   * The percentage of the planet surface that is naturally occurring water or bodies
   * of water.
   */
  surfaceWater?: Maybe<Scalars['Float']>;
  /** The terrains of this planet. */
  terrains?: Maybe<Array<Maybe<Scalars['String']>>>;
};


/**
 * A large mass, planet or planetoid in the Star Wars Universe, at the time of
 * 0 ABY.
 */
export type PlanetFilmConnectionArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/**
 * A large mass, planet or planetoid in the Star Wars Universe, at the time of
 * 0 ABY.
 */
export type PlanetResidentConnectionArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

/** A connection to a list of items. */
export type PlanetFilmsConnection = {
  __typename?: 'PlanetFilmsConnection';
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<PlanetFilmsEdge>>>;
  /**
   * A list of all of the objects returned in the connection. This is a convenience
   * field provided for quickly exploring the API; rather than querying for
   * "{ edges { node } }" when no edge data is needed, this field can be be used
   * instead. Note that when clients like Relay need to fetch the "cursor" field on
   * the edge to enable efficient pagination, this shortcut cannot be used, and the
   * full "{ edges { node } }" version should be used instead.
   */
  films?: Maybe<Array<Maybe<Film>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /**
   * A count of the total number of objects in this connection, ignoring pagination.
   * This allows a client to fetch the first five objects by passing "5" as the
   * argument to "first", then fetch the total count so it could display "5 of 83",
   * for example.
   */
  totalCount?: Maybe<Scalars['Int']>;
};

/** An edge in a connection. */
export type PlanetFilmsEdge = {
  __typename?: 'PlanetFilmsEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<Film>;
};

/** A connection to a list of items. */
export type PlanetResidentsConnection = {
  __typename?: 'PlanetResidentsConnection';
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<PlanetResidentsEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /**
   * A list of all of the objects returned in the connection. This is a convenience
   * field provided for quickly exploring the API; rather than querying for
   * "{ edges { node } }" when no edge data is needed, this field can be be used
   * instead. Note that when clients like Relay need to fetch the "cursor" field on
   * the edge to enable efficient pagination, this shortcut cannot be used, and the
   * full "{ edges { node } }" version should be used instead.
   */
  residents?: Maybe<Array<Maybe<Person>>>;
  /**
   * A count of the total number of objects in this connection, ignoring pagination.
   * This allows a client to fetch the first five objects by passing "5" as the
   * argument to "first", then fetch the total count so it could display "5 of 83",
   * for example.
   */
  totalCount?: Maybe<Scalars['Int']>;
};

/** An edge in a connection. */
export type PlanetResidentsEdge = {
  __typename?: 'PlanetResidentsEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<Person>;
};

/** A connection to a list of items. */
export type PlanetsConnection = {
  __typename?: 'PlanetsConnection';
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<PlanetsEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /**
   * A list of all of the objects returned in the connection. This is a convenience
   * field provided for quickly exploring the API; rather than querying for
   * "{ edges { node } }" when no edge data is needed, this field can be be used
   * instead. Note that when clients like Relay need to fetch the "cursor" field on
   * the edge to enable efficient pagination, this shortcut cannot be used, and the
   * full "{ edges { node } }" version should be used instead.
   */
  planets?: Maybe<Array<Maybe<Planet>>>;
  /**
   * A count of the total number of objects in this connection, ignoring pagination.
   * This allows a client to fetch the first five objects by passing "5" as the
   * argument to "first", then fetch the total count so it could display "5 of 83",
   * for example.
   */
  totalCount?: Maybe<Scalars['Int']>;
};

/** An edge in a connection. */
export type PlanetsEdge = {
  __typename?: 'PlanetsEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<Planet>;
};

export type Root = {
  __typename?: 'Root';
  allFilms?: Maybe<FilmsConnection>;
  allPeople?: Maybe<PeopleConnection>;
  allPlanets?: Maybe<PlanetsConnection>;
  allSpecies?: Maybe<SpeciesConnection>;
  allStarships?: Maybe<StarshipsConnection>;
  allVehicles?: Maybe<VehiclesConnection>;
  film?: Maybe<Film>;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  person?: Maybe<Person>;
  planet?: Maybe<Planet>;
  species?: Maybe<Species>;
  starship?: Maybe<Starship>;
  vehicle?: Maybe<Vehicle>;
};


export type RootAllFilmsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type RootAllPeopleArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type RootAllPlanetsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type RootAllSpeciesArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type RootAllStarshipsArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type RootAllVehiclesArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type RootFilmArgs = {
  filmID?: Maybe<Scalars['ID']>;
  id?: Maybe<Scalars['ID']>;
};


export type RootNodeArgs = {
  id: Scalars['ID'];
};


export type RootPersonArgs = {
  id?: Maybe<Scalars['ID']>;
  personID?: Maybe<Scalars['ID']>;
};


export type RootPlanetArgs = {
  id?: Maybe<Scalars['ID']>;
  planetID?: Maybe<Scalars['ID']>;
};


export type RootSpeciesArgs = {
  id?: Maybe<Scalars['ID']>;
  speciesID?: Maybe<Scalars['ID']>;
};


export type RootStarshipArgs = {
  id?: Maybe<Scalars['ID']>;
  starshipID?: Maybe<Scalars['ID']>;
};


export type RootVehicleArgs = {
  id?: Maybe<Scalars['ID']>;
  vehicleID?: Maybe<Scalars['ID']>;
};

/** A type of person or character within the Star Wars Universe. */
export type Species = Node & {
  __typename?: 'Species';
  /** The average height of this species in centimeters. */
  averageHeight?: Maybe<Scalars['Float']>;
  /** The average lifespan of this species in years, null if unknown. */
  averageLifespan?: Maybe<Scalars['Int']>;
  /** The classification of this species, such as "mammal" or "reptile". */
  classification?: Maybe<Scalars['String']>;
  /** The ISO 8601 date format of the time that this resource was created. */
  created?: Maybe<Scalars['String']>;
  /** The designation of this species, such as "sentient". */
  designation?: Maybe<Scalars['String']>;
  /** The ISO 8601 date format of the time that this resource was edited. */
  edited?: Maybe<Scalars['String']>;
  /**
   * Common eye colors for this species, null if this species does not typically
   * have eyes.
   */
  eyeColors?: Maybe<Array<Maybe<Scalars['String']>>>;
  filmConnection?: Maybe<SpeciesFilmsConnection>;
  /**
   * Common hair colors for this species, null if this species does not typically
   * have hair.
   */
  hairColors?: Maybe<Array<Maybe<Scalars['String']>>>;
  /** A planet that this species originates from. */
  homeworld?: Maybe<Planet>;
  /** The ID of an object */
  id: Scalars['ID'];
  /** The language commonly spoken by this species. */
  language?: Maybe<Scalars['String']>;
  /** The name of this species. */
  name?: Maybe<Scalars['String']>;
  personConnection?: Maybe<SpeciesPeopleConnection>;
  /**
   * Common skin colors for this species, null if this species does not typically
   * have skin.
   */
  skinColors?: Maybe<Array<Maybe<Scalars['String']>>>;
};


/** A type of person or character within the Star Wars Universe. */
export type SpeciesFilmConnectionArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/** A type of person or character within the Star Wars Universe. */
export type SpeciesPersonConnectionArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

/** A connection to a list of items. */
export type SpeciesConnection = {
  __typename?: 'SpeciesConnection';
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<SpeciesEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /**
   * A list of all of the objects returned in the connection. This is a convenience
   * field provided for quickly exploring the API; rather than querying for
   * "{ edges { node } }" when no edge data is needed, this field can be be used
   * instead. Note that when clients like Relay need to fetch the "cursor" field on
   * the edge to enable efficient pagination, this shortcut cannot be used, and the
   * full "{ edges { node } }" version should be used instead.
   */
  species?: Maybe<Array<Maybe<Species>>>;
  /**
   * A count of the total number of objects in this connection, ignoring pagination.
   * This allows a client to fetch the first five objects by passing "5" as the
   * argument to "first", then fetch the total count so it could display "5 of 83",
   * for example.
   */
  totalCount?: Maybe<Scalars['Int']>;
};

/** An edge in a connection. */
export type SpeciesEdge = {
  __typename?: 'SpeciesEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<Species>;
};

/** A connection to a list of items. */
export type SpeciesFilmsConnection = {
  __typename?: 'SpeciesFilmsConnection';
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<SpeciesFilmsEdge>>>;
  /**
   * A list of all of the objects returned in the connection. This is a convenience
   * field provided for quickly exploring the API; rather than querying for
   * "{ edges { node } }" when no edge data is needed, this field can be be used
   * instead. Note that when clients like Relay need to fetch the "cursor" field on
   * the edge to enable efficient pagination, this shortcut cannot be used, and the
   * full "{ edges { node } }" version should be used instead.
   */
  films?: Maybe<Array<Maybe<Film>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /**
   * A count of the total number of objects in this connection, ignoring pagination.
   * This allows a client to fetch the first five objects by passing "5" as the
   * argument to "first", then fetch the total count so it could display "5 of 83",
   * for example.
   */
  totalCount?: Maybe<Scalars['Int']>;
};

/** An edge in a connection. */
export type SpeciesFilmsEdge = {
  __typename?: 'SpeciesFilmsEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<Film>;
};

/** A connection to a list of items. */
export type SpeciesPeopleConnection = {
  __typename?: 'SpeciesPeopleConnection';
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<SpeciesPeopleEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /**
   * A list of all of the objects returned in the connection. This is a convenience
   * field provided for quickly exploring the API; rather than querying for
   * "{ edges { node } }" when no edge data is needed, this field can be be used
   * instead. Note that when clients like Relay need to fetch the "cursor" field on
   * the edge to enable efficient pagination, this shortcut cannot be used, and the
   * full "{ edges { node } }" version should be used instead.
   */
  people?: Maybe<Array<Maybe<Person>>>;
  /**
   * A count of the total number of objects in this connection, ignoring pagination.
   * This allows a client to fetch the first five objects by passing "5" as the
   * argument to "first", then fetch the total count so it could display "5 of 83",
   * for example.
   */
  totalCount?: Maybe<Scalars['Int']>;
};

/** An edge in a connection. */
export type SpeciesPeopleEdge = {
  __typename?: 'SpeciesPeopleEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<Person>;
};

/** A single transport craft that has hyperdrive capability. */
export type Starship = Node & {
  __typename?: 'Starship';
  /**
   * The Maximum number of Megalights this starship can travel in a standard hour.
   * A "Megalight" is a standard unit of distance and has never been defined before
   * within the Star Wars universe. This figure is only really useful for measuring
   * the difference in speed of starships. We can assume it is similar to AU, the
   * distance between our Sun (Sol) and Earth.
   */
  MGLT?: Maybe<Scalars['Int']>;
  /** The maximum number of kilograms that this starship can transport. */
  cargoCapacity?: Maybe<Scalars['Float']>;
  /**
   * The maximum length of time that this starship can provide consumables for its
   * entire crew without having to resupply.
   */
  consumables?: Maybe<Scalars['String']>;
  /** The cost of this starship new, in galactic credits. */
  costInCredits?: Maybe<Scalars['Float']>;
  /** The ISO 8601 date format of the time that this resource was created. */
  created?: Maybe<Scalars['String']>;
  /** The number of personnel needed to run or pilot this starship. */
  crew?: Maybe<Scalars['String']>;
  /** The ISO 8601 date format of the time that this resource was edited. */
  edited?: Maybe<Scalars['String']>;
  filmConnection?: Maybe<StarshipFilmsConnection>;
  /** The class of this starships hyperdrive. */
  hyperdriveRating?: Maybe<Scalars['Float']>;
  /** The ID of an object */
  id: Scalars['ID'];
  /** The length of this starship in meters. */
  length?: Maybe<Scalars['Float']>;
  /** The manufacturers of this starship. */
  manufacturers?: Maybe<Array<Maybe<Scalars['String']>>>;
  /**
   * The maximum speed of this starship in atmosphere. null if this starship is
   * incapable of atmosphering flight.
   */
  maxAtmospheringSpeed?: Maybe<Scalars['Int']>;
  /**
   * The model or official name of this starship. Such as "T-65 X-wing" or "DS-1
   * Orbital Battle Station".
   */
  model?: Maybe<Scalars['String']>;
  /** The name of this starship. The common name, such as "Death Star". */
  name?: Maybe<Scalars['String']>;
  /** The number of non-essential people this starship can transport. */
  passengers?: Maybe<Scalars['String']>;
  pilotConnection?: Maybe<StarshipPilotsConnection>;
  /**
   * The class of this starship, such as "Starfighter" or "Deep Space Mobile
   * Battlestation"
   */
  starshipClass?: Maybe<Scalars['String']>;
};


/** A single transport craft that has hyperdrive capability. */
export type StarshipFilmConnectionArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/** A single transport craft that has hyperdrive capability. */
export type StarshipPilotConnectionArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

/** A connection to a list of items. */
export type StarshipFilmsConnection = {
  __typename?: 'StarshipFilmsConnection';
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<StarshipFilmsEdge>>>;
  /**
   * A list of all of the objects returned in the connection. This is a convenience
   * field provided for quickly exploring the API; rather than querying for
   * "{ edges { node } }" when no edge data is needed, this field can be be used
   * instead. Note that when clients like Relay need to fetch the "cursor" field on
   * the edge to enable efficient pagination, this shortcut cannot be used, and the
   * full "{ edges { node } }" version should be used instead.
   */
  films?: Maybe<Array<Maybe<Film>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /**
   * A count of the total number of objects in this connection, ignoring pagination.
   * This allows a client to fetch the first five objects by passing "5" as the
   * argument to "first", then fetch the total count so it could display "5 of 83",
   * for example.
   */
  totalCount?: Maybe<Scalars['Int']>;
};

/** An edge in a connection. */
export type StarshipFilmsEdge = {
  __typename?: 'StarshipFilmsEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<Film>;
};

/** A connection to a list of items. */
export type StarshipPilotsConnection = {
  __typename?: 'StarshipPilotsConnection';
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<StarshipPilotsEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /**
   * A list of all of the objects returned in the connection. This is a convenience
   * field provided for quickly exploring the API; rather than querying for
   * "{ edges { node } }" when no edge data is needed, this field can be be used
   * instead. Note that when clients like Relay need to fetch the "cursor" field on
   * the edge to enable efficient pagination, this shortcut cannot be used, and the
   * full "{ edges { node } }" version should be used instead.
   */
  pilots?: Maybe<Array<Maybe<Person>>>;
  /**
   * A count of the total number of objects in this connection, ignoring pagination.
   * This allows a client to fetch the first five objects by passing "5" as the
   * argument to "first", then fetch the total count so it could display "5 of 83",
   * for example.
   */
  totalCount?: Maybe<Scalars['Int']>;
};

/** An edge in a connection. */
export type StarshipPilotsEdge = {
  __typename?: 'StarshipPilotsEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<Person>;
};

/** A connection to a list of items. */
export type StarshipsConnection = {
  __typename?: 'StarshipsConnection';
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<StarshipsEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /**
   * A list of all of the objects returned in the connection. This is a convenience
   * field provided for quickly exploring the API; rather than querying for
   * "{ edges { node } }" when no edge data is needed, this field can be be used
   * instead. Note that when clients like Relay need to fetch the "cursor" field on
   * the edge to enable efficient pagination, this shortcut cannot be used, and the
   * full "{ edges { node } }" version should be used instead.
   */
  starships?: Maybe<Array<Maybe<Starship>>>;
  /**
   * A count of the total number of objects in this connection, ignoring pagination.
   * This allows a client to fetch the first five objects by passing "5" as the
   * argument to "first", then fetch the total count so it could display "5 of 83",
   * for example.
   */
  totalCount?: Maybe<Scalars['Int']>;
};

/** An edge in a connection. */
export type StarshipsEdge = {
  __typename?: 'StarshipsEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<Starship>;
};

/** A single transport craft that does not have hyperdrive capability */
export type Vehicle = Node & {
  __typename?: 'Vehicle';
  /** The maximum number of kilograms that this vehicle can transport. */
  cargoCapacity?: Maybe<Scalars['Float']>;
  /**
   * The maximum length of time that this vehicle can provide consumables for its
   * entire crew without having to resupply.
   */
  consumables?: Maybe<Scalars['String']>;
  /** The cost of this vehicle new, in Galactic Credits. */
  costInCredits?: Maybe<Scalars['Float']>;
  /** The ISO 8601 date format of the time that this resource was created. */
  created?: Maybe<Scalars['String']>;
  /** The number of personnel needed to run or pilot this vehicle. */
  crew?: Maybe<Scalars['String']>;
  /** The ISO 8601 date format of the time that this resource was edited. */
  edited?: Maybe<Scalars['String']>;
  filmConnection?: Maybe<VehicleFilmsConnection>;
  /** The ID of an object */
  id: Scalars['ID'];
  /** The length of this vehicle in meters. */
  length?: Maybe<Scalars['Float']>;
  /** The manufacturers of this vehicle. */
  manufacturers?: Maybe<Array<Maybe<Scalars['String']>>>;
  /** The maximum speed of this vehicle in atmosphere. */
  maxAtmospheringSpeed?: Maybe<Scalars['Int']>;
  /**
   * The model or official name of this vehicle. Such as "All-Terrain Attack
   * Transport".
   */
  model?: Maybe<Scalars['String']>;
  /**
   * The name of this vehicle. The common name, such as "Sand Crawler" or "Speeder
   * bike".
   */
  name?: Maybe<Scalars['String']>;
  /** The number of non-essential people this vehicle can transport. */
  passengers?: Maybe<Scalars['String']>;
  pilotConnection?: Maybe<VehiclePilotsConnection>;
  /** The class of this vehicle, such as "Wheeled" or "Repulsorcraft". */
  vehicleClass?: Maybe<Scalars['String']>;
};


/** A single transport craft that does not have hyperdrive capability */
export type VehicleFilmConnectionArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


/** A single transport craft that does not have hyperdrive capability */
export type VehiclePilotConnectionArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

/** A connection to a list of items. */
export type VehicleFilmsConnection = {
  __typename?: 'VehicleFilmsConnection';
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<VehicleFilmsEdge>>>;
  /**
   * A list of all of the objects returned in the connection. This is a convenience
   * field provided for quickly exploring the API; rather than querying for
   * "{ edges { node } }" when no edge data is needed, this field can be be used
   * instead. Note that when clients like Relay need to fetch the "cursor" field on
   * the edge to enable efficient pagination, this shortcut cannot be used, and the
   * full "{ edges { node } }" version should be used instead.
   */
  films?: Maybe<Array<Maybe<Film>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /**
   * A count of the total number of objects in this connection, ignoring pagination.
   * This allows a client to fetch the first five objects by passing "5" as the
   * argument to "first", then fetch the total count so it could display "5 of 83",
   * for example.
   */
  totalCount?: Maybe<Scalars['Int']>;
};

/** An edge in a connection. */
export type VehicleFilmsEdge = {
  __typename?: 'VehicleFilmsEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<Film>;
};

/** A connection to a list of items. */
export type VehiclePilotsConnection = {
  __typename?: 'VehiclePilotsConnection';
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<VehiclePilotsEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /**
   * A list of all of the objects returned in the connection. This is a convenience
   * field provided for quickly exploring the API; rather than querying for
   * "{ edges { node } }" when no edge data is needed, this field can be be used
   * instead. Note that when clients like Relay need to fetch the "cursor" field on
   * the edge to enable efficient pagination, this shortcut cannot be used, and the
   * full "{ edges { node } }" version should be used instead.
   */
  pilots?: Maybe<Array<Maybe<Person>>>;
  /**
   * A count of the total number of objects in this connection, ignoring pagination.
   * This allows a client to fetch the first five objects by passing "5" as the
   * argument to "first", then fetch the total count so it could display "5 of 83",
   * for example.
   */
  totalCount?: Maybe<Scalars['Int']>;
};

/** An edge in a connection. */
export type VehiclePilotsEdge = {
  __typename?: 'VehiclePilotsEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<Person>;
};

/** A connection to a list of items. */
export type VehiclesConnection = {
  __typename?: 'VehiclesConnection';
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<VehiclesEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /**
   * A count of the total number of objects in this connection, ignoring pagination.
   * This allows a client to fetch the first five objects by passing "5" as the
   * argument to "first", then fetch the total count so it could display "5 of 83",
   * for example.
   */
  totalCount?: Maybe<Scalars['Int']>;
  /**
   * A list of all of the objects returned in the connection. This is a convenience
   * field provided for quickly exploring the API; rather than querying for
   * "{ edges { node } }" when no edge data is needed, this field can be be used
   * instead. Note that when clients like Relay need to fetch the "cursor" field on
   * the edge to enable efficient pagination, this shortcut cannot be used, and the
   * full "{ edges { node } }" version should be used instead.
   */
  vehicles?: Maybe<Array<Maybe<Vehicle>>>;
};

/** An edge in a connection. */
export type VehiclesEdge = {
  __typename?: 'VehiclesEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<Vehicle>;
};

export type AllFilmsQueryVariables = Exact<{
  first: Scalars['Int'];
}>;


export type AllFilmsQuery = { __typename?: 'Root', allFilms?: { __typename?: 'FilmsConnection', edges?: Array<{ __typename?: 'FilmsEdge', node?: { __typename?: 'Film', id: string, title?: string | null | undefined } | null | undefined } | null | undefined> | null | undefined } | null | undefined };

export type AllPlanetsQueryVariables = Exact<{
  first: Scalars['Int'];
}>;


export type AllPlanetsQuery = { __typename?: 'Root', allPlanets?: { __typename?: 'PlanetsConnection', edges?: Array<{ __typename?: 'PlanetsEdge', node?: { __typename?: 'Planet', id: string, name?: string | null | undefined } | null | undefined } | null | undefined> | null | undefined } | null | undefined };


export const AllFilmsDocument = gql`
    query AllFilms($first: Int!) {
  allFilms(first: $first) {
    edges {
      node {
        id
        title
      }
    }
  }
}
    `;

/**
 * __useAllFilmsQuery__
 *
 * To run a query within a React component, call `useAllFilmsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllFilmsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAllFilmsQuery({
 *   variables: {
 *      first: // value for 'first'
 *   },
 * });
 */
export function useAllFilmsQuery(baseOptions: Apollo.QueryHookOptions<AllFilmsQuery, AllFilmsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AllFilmsQuery, AllFilmsQueryVariables>(AllFilmsDocument, options);
      }
export function useAllFilmsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AllFilmsQuery, AllFilmsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AllFilmsQuery, AllFilmsQueryVariables>(AllFilmsDocument, options);
        }
export type AllFilmsQueryHookResult = ReturnType<typeof useAllFilmsQuery>;
export type AllFilmsLazyQueryHookResult = ReturnType<typeof useAllFilmsLazyQuery>;
export type AllFilmsQueryResult = Apollo.QueryResult<AllFilmsQuery, AllFilmsQueryVariables>;
export const AllPlanetsDocument = gql`
    query AllPlanets($first: Int!) {
  allPlanets(first: $first) {
    edges {
      node {
        id
        name
      }
    }
  }
}
    `;

/**
 * __useAllPlanetsQuery__
 *
 * To run a query within a React component, call `useAllPlanetsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllPlanetsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAllPlanetsQuery({
 *   variables: {
 *      first: // value for 'first'
 *   },
 * });
 */
export function useAllPlanetsQuery(baseOptions: Apollo.QueryHookOptions<AllPlanetsQuery, AllPlanetsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AllPlanetsQuery, AllPlanetsQueryVariables>(AllPlanetsDocument, options);
      }
export function useAllPlanetsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AllPlanetsQuery, AllPlanetsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AllPlanetsQuery, AllPlanetsQueryVariables>(AllPlanetsDocument, options);
        }
export type AllPlanetsQueryHookResult = ReturnType<typeof useAllPlanetsQuery>;
export type AllPlanetsLazyQueryHookResult = ReturnType<typeof useAllPlanetsLazyQuery>;
export type AllPlanetsQueryResult = Apollo.QueryResult<AllPlanetsQuery, AllPlanetsQueryVariables>;