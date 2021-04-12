const Joi = require('joi');

function validateUser(user) {
    const userSchema = Joi.object({
        name: Joi.string().min(2).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().pattern(new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/)).message({"string.pattern.base": '*Invalid password requirements 8+ Characters, 1 Capital letter, 1 number'})
    });

    return userSchema.validate(user);
}

module.exports = { validateUser};