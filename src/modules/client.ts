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

import { ICaptchaContextState, ICaptchaState, ICaptchaStatusState, ICaptchaStatusReducerAction } from '../types';


export const captchaContextReducer = (state: ICaptchaContextState, action: Partial<ICaptchaContextState>) => {
    return { ...state, ...action };
}

export const captchaStateReducer = (state: ICaptchaState, action: Partial<ICaptchaState>): ICaptchaState => {
    return { ...state, ...action };
}

export const captchaStatusReducer = (state: ICaptchaStatusState, action: ICaptchaStatusReducerAction): ICaptchaStatusState => {
    const logger = { info: console.log, error: console.error };
    for (const key in action) {
        logger[key](action[key]);
        let status = Array.isArray(action[key]) ? action[key][1] : action[key];
        if (status instanceof Error) {
            status = status.message;
        }
        return { [key]: String(status) };
    }
    return state;
}
