declare module "*.json" {
    const value: any;
    export default value;
  }


interface ProsopoRandomProviderResponse {
  blockNumber: string;
  provider: ProposoProvider;
}
interface ProposoProvider {
  balance: string;
  captchaDatasetId: string;
  fee: string;
  payee: string; // TODO: enum?
  serviceOrigin: string;
  status: string; // TODO: enum
}


interface CaptchaSet {
  captchaId: string;
  datasetId: string;
  // TODO items: {path, type}[];
}

interface ProsopoCaptcha {
  captcha: CaptchaSet;
  proof: string[][];
}

interface ProsopoCaptchaResponse {
  captchas: ProsopoCaptcha[];
  requestHash: string;
}
