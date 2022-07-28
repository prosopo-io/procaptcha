// Copyright 2021-2022 Prosopo (UK) Ltd.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
// declare module "*.json" {
//   const value: any;
//   export default value;
// }

import { InjectedAccountWithMeta, InjectedExtension } from "@polkadot/extension-inject/types";

// import { SubmittableResult } from "@polkadot/api";
import {Captcha, CaptchaStatus} from "@prosopo/contract";

export interface ProsopoRandomProviderResponse {
  providerId: string,
  blockNumber: string;
  provider: ProposoProvider;
}

export type ProsopoDappOperatorIsHumanUserResponse = boolean

export interface ProposoProvider {
  balance: string;
  captchaDatasetId: string;
  fee: string;
  payee: string; // TODO: enum?
  serviceOrigin: string;
  status: string; // TODO: enum
}

// export interface CaptchaResponseCaptchaItem {
//   captchaId: string;
//   datasetId: string;
//   items: CaptchaImageSchema[];
//   target: string;
//   salt?: string;
//   solution?: number[];
// }

export interface CaptchaImageSchema {
  path: string,
  type: string
}

export interface CaptchaResponseCaptcha {
  captcha: Captcha;
  proof: string[][];
}

export interface GetCaptchaResponse {
  captchas: CaptchaResponseCaptcha[];
  requestHash: string;
}

export interface CaptchaSolution {
  captchaId: string;
  solution: number[];
  salt: string;
}

export interface CaptchaSolutionResponse {
  captchas: CaptchaResponseCaptcha[];
  status: string;
  partialFee: string;
}

export interface ProsopoCaptchaConfig {
  "providerApi.baseURL": string;
  "providerApi.prefix": string;
  "dappAccount": string;
  "dappUrl": string;
  "solutionThreshold": number;
}
