import Router, {NextFunction, Request, Response} from 'express';

const router = Router();

router.get('/', function (req: Request, res: Response, next: NextFunction) {
    res.send('hello world');
});

export default router;
