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
import {AxiosResponse} from "axios";

export class ProsopoApiError extends Error {
  constructor(error: AxiosResponse, context?: string, ...params: any[]) {

    super(`${error.data.message ? error.data.message : error.statusText}`)

    this.name = context && `${ProsopoApiError.name}@${context}` || ProsopoApiError.name;

    // TODO: if env.debug
    console.error('\n********************* ERROR *********************\n');
    console.error(this.cause, this.stack, ...params);
  }
}
