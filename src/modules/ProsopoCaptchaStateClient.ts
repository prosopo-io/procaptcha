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
import { ICaptchaStateReducer, TCaptchaSubmitResult } from "../types/client";
import { CaptchaSolution, CaptchaSolutionResponse, GetCaptchaResponse } from "../types/api";
import { TransactionResponse } from "../types/contract";

import { ProsopoCaptchaClient } from "./ProsopoCaptchaClient";
import { convertCaptchaToCaptchaSolution } from "@prosopo/contract";


export class ProsopoCaptchaStateClient {

    public context: ProsopoCaptchaClient;
    public manager: ICaptchaStateReducer;

    constructor(context: ProsopoCaptchaClient, manager: ICaptchaStateReducer) {
        this.context = context;
        this.manager = manager;
    }

    public async onLoadCaptcha() {
        let captchaChallenge: GetCaptchaResponse | Error | undefined;

        try {
            captchaChallenge = await this.context.getCaptchaApi()!.getCaptchaChallenge();
        } catch (err) {
            captchaChallenge = err as Error;
        }

        if (this.context.callbacks?.onLoadCaptcha) {
            this.context.callbacks.onLoadCaptcha(captchaChallenge);
        }

        if (captchaChallenge instanceof Error) {
            captchaChallenge = undefined;
        }

        this.manager.update({ captchaChallenge, captchaIndex: 0 });
    }

    public onCancel() {
        if (this.context.callbacks?.onCancel) {
            this.context.callbacks.onCancel();
        }
        this.dismissCaptcha();
    }

    public async onSubmit() {
        const { captchaChallenge, captchaIndex, captchaSolution } = this.manager.state;

        const nextCaptchaIndex = captchaIndex + 1;

        if (nextCaptchaIndex < captchaChallenge!.captchas.length) {
            captchaSolution[nextCaptchaIndex] = [];
            this.manager.update({ captchaIndex: nextCaptchaIndex, captchaSolution });

            return;
        }

        const signer = this.context.getExtension().getExtension().signer;

        const currentCaptcha = captchaChallenge!.captchas[captchaIndex];
        const { datasetId } = currentCaptcha.captcha; // TODO arbitrary datasetId? Could datasetId be moved up next to requestHash?

        const solutions = this.parseSolution(captchaChallenge!, captchaSolution);

        let submitResult: TCaptchaSubmitResult | Error;

        try {
            submitResult = await this.context.getCaptchaApi()!.submitCaptchaSolution(signer, captchaChallenge!.requestHash, datasetId!, solutions);
        } catch (err) {
            submitResult = err as Error;
        }

        if (this.context.callbacks?.onSubmit) {
            this.context.callbacks.onSubmit(submitResult, this.manager.state);
        }

        this.manager.update({ captchaSolution: [] });

        if (submitResult instanceof Error) {
            // TODO onFail?
            return;
        }

        await this.onSolved(submitResult);
    }

    // TODO check for solved captchas.
    public async onSolved(submitResult: TCaptchaSubmitResult) {
        let isHuman: boolean | undefined;
        try {
            isHuman = await this.context.getContract()?.dappOperatorIsHumanUser(this.context.solutionThreshold);
        }   catch (err) {
            // TODO
        }
        this.dismissCaptcha();
        if (this.context.callbacks?.onSolved) {
            this.context.callbacks.onSolved(submitResult, isHuman);
        }
    }

    public onChange(index: number) {
        const { captchaIndex, captchaSolution } = this.manager.state;

        let currentSolution: number[] = captchaSolution[captchaIndex] || [];
        currentSolution = currentSolution.includes(index) ? currentSolution.filter(item => item !== index) : [...currentSolution, index];

        captchaSolution[captchaIndex] = currentSolution;

        if (this.context.callbacks?.onChange) {
            this.context.callbacks.onChange(captchaSolution, captchaIndex);
        }

        this.manager.update({ captchaSolution });
    }

    public dismissCaptcha() {
        this.manager.update({ captchaChallenge: undefined });
    }

    // TODO move to ProsopoContract/ProviderApi/Model?
    public parseSolution(captchaChallenge: GetCaptchaResponse, captchaSolution: number[][]): CaptchaSolution[] {
        const parsedSolution: CaptchaSolution[] = [];

        for (const [index, challenge] of captchaChallenge!.captchas.entries()) {
            const solution = captchaSolution[index] || [];
            challenge.captcha.solution = solution;
            parsedSolution[index] = convertCaptchaToCaptchaSolution(challenge.captcha);
        }

        console.log("CAPTCHA SOLUTIONS", parsedSolution);

        return parsedSolution;
    }

}

export default ProsopoCaptchaStateClient;
