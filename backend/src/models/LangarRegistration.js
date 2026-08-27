import mongoose from 'mongoose';


const langarRegistrationSchema =
    new mongoose.Schema(
        {

            /* =====================================
               USER
            ====================================== */

            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
                index: true
            },


            /* =====================================
               BOOKING NUMBER
            ====================================== */

            reference: {
                type: String,
                required: true,
                unique: true,
                index: true
            },


            /* =====================================
               PERSON
            ====================================== */

            fullName: {
                type: String,
                required: true,
                trim: true,
                maxlength: 100
            },


            phone: {
                type: String,
                required: true,
                trim: true,
                maxlength: 30
            },


            whatsapp: {
                type: String,
                trim: true,
                maxlength: 30
            },


            /* =====================================
               PEOPLE
            ====================================== */

            people: {
                type: Number,
                required: true,
                min: 1,
                max: 100
            },


            /* =====================================
               DATE
            ====================================== */

            date: {
                type: String,
                required: true,
                match: /^\d{4}-\d{2}-\d{2}$/
            },

            time: {
                type: String,
                enum: ['1:30 PM', '7:00 PM']
            },


            /* =====================================
               BOOKING TYPE
            ====================================== */

            bookingType: {
                type: String,
                required: true,
                enum: [
                    'individual',
                    'family',
                    'group'
                ]
            },


            organization: {
                type: String,
                trim: true,
                maxlength: 160
            },


            specialRequirement: {
                type: String,
                trim: true,
                maxlength: 600
            },


            /* =====================================
               STATUS
            ====================================== */

            status: {
                type: String,

                enum: [
                    'confirmed',
                    'waitlisted',
                    'cancelled'
                ],

                default: 'confirmed'
            },


            /* =====================================
               CHECK-IN
            ====================================== */

            checkedIn: {
                type: Boolean,
                default: false
            },


            checkedInAt: Date

        },

        {
            timestamps: true
        }
    );


langarRegistrationSchema.index({
    date: 1,
    status: 1,
    createdAt: 1
});


langarRegistrationSchema.index({
    user: 1,
    createdAt: -1
});


export default mongoose.model(
    'LangarRegistration',
    langarRegistrationSchema
);
