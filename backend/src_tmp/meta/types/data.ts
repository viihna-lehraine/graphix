

export interface ConfigurationData {
  jwtExpiration: string;
}

export interface RegexData {
  email: RegExp;
}

export interface Data {
  config: ConfigurationData;
  regex: RegexData;
}
