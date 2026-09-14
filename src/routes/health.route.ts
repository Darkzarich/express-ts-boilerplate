import { Router } from 'express';

const router = Router();

// Liveness probe for load balancers and container orchestrators
router.get('/', (req, res) => {
  res.json({ status: 'ok' });
});

export default router;
