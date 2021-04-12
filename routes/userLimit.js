
const User = require('../models/User')

// Limit the amount of users able to register to 5 just af authenticationd demo don't need to save the data
module.exports = function() {
    User.aggregate([
        {$sort: {createdAt: 1}},
      ]).then((res) => {
        console.log(res.length)
        if(res.length > 5) {
          User.deleteOne({_id :res[0]._id})
          .catch((err) => console.log(err))
        }
      })
}

  