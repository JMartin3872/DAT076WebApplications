import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from 'sequelize';
import { conn } from './conn';

export class DiaryModel extends Model<InferAttributes<DiaryModel>, InferCreationAttributes<DiaryModel>> {
    declare id: CreationOptional<number>;
    declare title: string;
    declare owner: string;

}

// A first version of diaries to be stored in db
// Currently no entries, should be stored in separate table?
DiaryModel.init(
    {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        owner: {
            type: DataTypes.STRING,
            allowNull: false
        }

        // TODO: Think about how to store a diary's entries, separate table???

    },
    {
        sequelize: conn,
        tableName: "diaries",
        timestamps: false,
    }
);