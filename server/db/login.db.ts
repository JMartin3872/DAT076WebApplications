import { Model, InferAttributes, InferCreationAttributes, DataTypes } from 'sequelize';
import { conn } from './conn';

export class LoginModel extends Model<InferAttributes<LoginModel>, InferCreationAttributes<LoginModel>> {
    declare username: string;
    declare password: string;
}

// Define the Login model structure.
LoginModel.init(
    {
        username: {
            type: DataTypes.STRING,
            primaryKey:true
        },
        password: {
            type: DataTypes.STRING
        }
    },
    {
        sequelize: conn,
        tableName: "loginTable",
        timestamps: false,

    }
)