import { Request } from 'express';

interface CustomRequest extends Request {
    userId: string
    uniqueCreationId?: string
}

export default CustomRequest;
