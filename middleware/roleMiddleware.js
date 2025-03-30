const checkRole = (role) => {
    return (req, res, next) => {
      const user = req.user; // Assuming you set the authenticated user in req.user
  
      if (!user) {
        return res.status(401).json({ message: 'User not authenticated' });
      }
  
      if (user.role !== role) {
        return res.status(403).json({ message: 'Forbidden: You do not have the required permissions' });
      }
  
      next(); // Continue to the next middleware or route handler
    };
  };
  
  module.exports = checkRole;
  