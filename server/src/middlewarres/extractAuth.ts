type IExtractAuth = (auth: {}, ...rest: unknown[]) => void;

const extractAuth = <T>(cb: (...rest: unknown[]) => T): IExtractAuth => (_auth, ...rest) => {
  cb(...rest);
};

export default extractAuth;
