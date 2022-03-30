import mongoose from 'mongoose'
const Schema = mongoose.Schema

const StandUpSchema = new Schema({
    name: {
        type: String,
        minlength: [4, 'StandUp name too short'],
        required: [true, 'StandUp name not present']
    },
    description: String,
    completionTime: {
        type: Date,
        required: [true, 'CompletionTime must be present']
    },
    questions: {
        type: Object,
        validate: {
            validator: function (input) {
                let questions = input;
                let keys = Object.keys(questions);
                if (keys.length < 1) {
                    return false;
                }

                for(let i = 0; i < keys.length; i++) {
                  if(Object.keys(questions[keys[i]]).length < 2) {
                      return false;
                  }
                  if(questions[keys[i]].title === undefined) {
                      return false;
                  }
                  if(questions[keys[i]].response_type === undefined) {
                      return false;
                  }
                }

                return true;
            
            },
            message: 'A minimum of one question must be present with the form { question_1: {title: "What did you do today", response_type: "String"}, question_2: {title: "How many hours did you work today", response_type: "Number"}}',
        },
        required: [true, 'Questions object not present']
    },
    reminders: {
        staticTime: {type: Boolean, default: false},
        days: {type: Array, default: [1, 2, 3, 4, 5]},
        schedules: [{
            time: {hour: Number, min: Number},
            list: [{
                user_id: Object,
                notification_time: Date,
                _id: false
            }]
        }]
    },
    user_id: String
});

StandUpSchema.index({ "reminders.schedules.list.notification_time": -1 }, {name: 'schedule_NotificationIdx'})
const StandUp = mongoose.model('StandUp', StandUpSchema);
export default StandUp;
