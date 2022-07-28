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
import { InjectedAccountWithMeta, InjectedExtension } from "@polkadot/extension-inject/types";
import { ProsopoCaptchaConfig, GetCaptchaResponse, CaptchaSolutionResponse } from "../types/api";
import { TransactionResponse } from "../types/contract";
import {CaptchaSolution, CaptchaSolutionCommitment} from "@prosopo/contract";
import { Extension } from "../api/Extension";

export type TExtensionAccount = InjectedAccountWithMeta;

export type TCaptchaSubmitResult = [CaptchaSolutionResponse, TransactionResponse, CaptchaSolutionCommitment];

export interface IExtensionInterface {
    checkExtension(): void;
    getExtension(): InjectedExtension;
    getAccounts(): InjectedAccountWithMeta[];
    getAccount(): InjectedAccountWithMeta | undefined;
    setAccount(account: string): void;
    unsetAccount(): void;
    getDefaultAccount(): InjectedAccountWithMeta | undefined;
    setDefaultAccount(): void;
  }

export interface ICaptchaClientEvents {
    onLoad?: (extension: IExtensionInterface, contractAddress: string) => void;
    onAccountChange?: (account?: TExtensionAccount) => void;
}

export interface ICaptchaStateClientEvents {
    onLoadCaptcha?: (captchaChallenge: GetCaptchaResponse | Error) => void;
    onSubmit?: (result: TCaptchaSubmitResult | Error, captchaState: ICaptchaState) => void;
    onChange?: (captchaSolution: number[][], index: number) => void;
    onCancel?: () => void;
    onSolved?: (result: TCaptchaSubmitResult, isHuman?: boolean) => void;
}

export interface CaptchaEventCallbacks extends ICaptchaClientEvents, ICaptchaStateClientEvents { }

export interface ICaptchaContextState {
    config: ProsopoCaptchaConfig;
    contractAddress?: string;
    account?: InjectedAccountWithMeta;
}

export interface ICaptchaContextReducer {
    state: ICaptchaContextState;
    update: (value: Partial<ICaptchaContextState>) => void;
}

export interface ICaptchaState {
    captchaChallenge?: GetCaptchaResponse;
    captchaIndex: number;
    captchaSolution: number[][];
    // captchaSolutions: CaptchaSolution[];
}

export interface ICaptchaStateReducer {
    state: ICaptchaState;
    update: (value: Partial<ICaptchaState>) => void;
}

export interface ICaptchaStatusState {
    info?: string;
    error?: string;
}

export interface ICaptchaStatusReducerAction {
    info?: [string, any] | string;
    error?: [string, any] | string | Error;
}

export interface ICaptchaStatusReducer {
    state: ICaptchaStatusState;
    update: (value: Partial<ICaptchaStatusReducerAction>) => void;
}
