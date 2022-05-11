const router = require('express').Router();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const assets = require('../../build/assets.json');
const html = require('../layout/html');
const { authMiddleware, sessionExpiryMiddleware } = require('../middleware/auth');
const apiRouter = require('./api/index');
const healthRouter = require('./health');
const dashboard = require('./dashboard');
const { renderMiddleware, renderResponseMiddleware } = require('../middleware/render');
const { errorMiddleware, initRequest } = require('../middleware/request');
const { protect } = require('../middleware/auth');
const { setCacheControl } = require('../middleware/cacheControl');
const { csrfMiddleware } = require('../middleware/csrf');
const { infoService } = require('../clients');
const logger = require('../libs/logger');
const { flushCachedLists } = require('../services/list');

html.use(assets);

router.use(bodyParser.urlencoded({ extended: true }));
router.use(cookieParser());
router.use(csrfMiddleware);
router.use('/health', healthRouter);
router.use('*', authMiddleware, sessionExpiryMiddleware, initRequest, setCacheControl);
router.use(protect('MANAGEMENT_UI'));
router.use('/api', apiRouter);
router.use('/', dashboard);

router.get('/members/refresh',
    protect('REFRESH_MEMBERS'),
    async (req, res, next) => {
        try {
            await infoService.get('/admin/member/refresh');
            logger(req.requestId).info('REFRESH_MEMBERS', { user: req.user.email });
            res.status(200).send();
        } catch (error) {
            next(error);
        }
    }
);

router.get('/admin/list/flush',
    protect('SYS_ADMIN'),
    (req, res, next) => {
        try {
            logger(req.requestId).info('FLUSH_CACHE', { user: req.user.email });
            flushCachedLists();
            res.status(200).send();
        } catch (error) {
            next(error);
        }
    }
);

router.use('*',
    errorMiddleware,
    renderMiddleware,
    renderResponseMiddleware
);

module.exports = router;
