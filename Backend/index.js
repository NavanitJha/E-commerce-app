// index.js

const app = require("./src/app"); 

const PORT = process.env.PORT || 5000;

// Only start the server if this file is executed directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app; // Export for testing
