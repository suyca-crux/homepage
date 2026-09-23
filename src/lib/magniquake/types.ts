type IntensityStation = {
  Name: string;
  Code: string;
  Int: string;
};

export type City = {
  Name: string;
  Code: string;
  MaxInt: string;
  IntensityStation?: IntensityStation[];
};

export type Area = {
  Name: string;
  Code: string;
  MaxInt: string;
  City?: City[];
};

export type Pref = {
  Name: string;
  Code: string;
  MaxInt: string;
  Area?: Area[];
};

type Control = {
  Title: string;
  DateTime: string;
  Status: string;
  EditorialOffice: string;
  PublishingOffice: string;
};

export type Head = {
  Title: string;
  ReportDateTime: string;
  TargetDateTime: string;
  EventID: string;
  InfoType: string;
  Serial: string;
  InfoKind: string;
  InfoKindVersion: string;
  Headline: string;
};

export type Body = {
  Earthquake?: Earthquake;
  Intensity: Intensity;
  Comments: Comments;
};

type Earthquake = {
  OriginTime: string;
  ArrivalTime: string;
  Hypocenter: Hypocenter;
  Magnitude: string;
  Magnitude_description: string;
};

type Hypocenter = {
  Name: string;
  Code: string;
  Depth: string;
  Latitude: string;
  Longitude: string;
  Coordinate: string;
};

type Intensity = {
  Observation?: Observation;
};

type Observation = {
  MaxInt: string;
  Pref: Pref[];
};

type Comments = {
  Observation: string;
};

export type Data = {
  Control: Control;
  Head: Head;
  Body: Body;
};
