type IExtractAuth = (auth: {}, ...rest: unknown[]) => void;

const extractAuth = (cb: Function): IExtractAuth => (_auth, ...rest) => {
  cb(...rest);
};

export default extractAuth;
