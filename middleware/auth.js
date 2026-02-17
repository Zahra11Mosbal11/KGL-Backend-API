// check if logged in and check user role
const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'You must log in first' });
  }
  next();
};

// check if logged in and check if user is manager
const requireManager = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'You must log in first' });
  }
  
  if (req.session.user.role !== 'manager') {
    return res.status(403).json({ error: 'This process is for the manager only' });
  }
  next();
};

// check if logged in and check if user is sales agent
const requireSalesAgent = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'You must log in first' });
  }
  
  if (req.session.user.role !== 'sales_agent') {
    return res.status(403).json({ error: 'This process is for the sales agent only.' });
  }
  next();
};

module.exports = {
  requireAuth,
  requireManager,
  requireSalesAgent
};