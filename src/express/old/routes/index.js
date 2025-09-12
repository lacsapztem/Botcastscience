import express from 'express';

//import UserRoutes from './user.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
});

//router.use('/users', UserRoutes);

export default router;
