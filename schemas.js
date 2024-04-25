const BaseJoi = require('joi')
const sanitizeHTML = require('sanitize-html');

const extension = (joi) =>({
    type:'string',
    base: joi.string(),
    messages:{
        'string.escapeHTML' : '{{#label}} must not be include HTML!'
    },
    rules:{
        escapeHTML:{
            validate(value,helpers){
                const clean = sanitizeHTML(value,{
                    allowedTags:[],
                    allowedAttributes:{},
                });
                if(clean !== value) return helpers.error('string.escapeHTML',{ value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension);

module.exports.projectSchema =  Joi.object({
    project: Joi.object({
        title : Joi.string().required().escapeHTML(),
        description : Joi.string().required().escapeHTML(),
        // date : Joi.string().required().escapeHTML(),
        type : Joi.string().required().escapeHTML(),
    }).required(),
});

module.exports.taskSchema = Joi.object({
    task: Joi.object({
        title : Joi.string().required().escapeHTML(),
        description : Joi.string().required().escapeHTML(),
        status : Joi.string().required().escapeHTML(),
        priority : Joi.string().required().escapeHTML(),
        dueDate : Joi.string().required().escapeHTML(),
    }).required()
})