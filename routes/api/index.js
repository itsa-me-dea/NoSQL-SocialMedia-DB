const router = require('express').Router();
const userRoutes = require('./userRoutes');
const thoughtRoutes = require('./thoughtRoutes');
// delete appRoutes
const appRoutes = require('./appRoutes');

router.use('/users', userRoutes);
router.use('/thoughts', thoughtRoutes);
// delete appRoutes
router.use('/apps', appRoutes);

module.exports = router;
