import { JwtPayload } from 'jsonwebtoken';

interface CustomJwtPayload extends JwtPayload {
    exp: number;
}
export default CustomJwtPayload;
