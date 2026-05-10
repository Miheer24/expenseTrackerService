import { Router } from 'express';
import { login, register } from '../../services/auth.service';

const authRouter = Router();

authRouter.post('/register', async (req, res) => {
    try {
        const registeredUser = await register(req?.body);
        res.status(201).json(registeredUser)
    } catch (error) {
        res.status(error?.code || 500).send(error?.msg || error?.message);
    }
});

authRouter.post('/login', async (req, res) => {
    try {
        const loggedInUser = await login(req?.body);
        res.status(201).json(loggedInUser)
    } catch (error) {
        console.log(JSON.stringify(error));
        res.status(error?.code || 500).send(error?.msg || error);
    }
});

export default authRouter;